import importlib.util
import io
from pathlib import Path
import unittest
import zipfile

spec = importlib.util.spec_from_file_location('guard', Path(__file__).resolve().parents[1] / 'scripts/check_secrets.py')
guard = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guard)


class SecretGuardTests(unittest.TestCase):
    def test_root_key_is_reported_without_the_value(self):
        fake = b'fiq-' + b'D' * 32
        result = '\n'.join(guard.scan(b'line one\n' + fake, 'config.py'))
        self.assertIn('config.py:2: Rootsys key', result)
        self.assertNotIn(fake.decode(), result)

    def test_credential_in_archive_is_detected(self):
        memory = io.BytesIO()
        with zipfile.ZipFile(memory, 'w', zipfile.ZIP_DEFLATED) as archive:
            archive.writestr('config.py', b'fiq-' + b'A' * 32)
        self.assertTrue(any('bundle.zip!config.py' in line for line in guard.scan(memory.getvalue(), 'bundle.zip')))

    def test_placeholder_and_detector_source_do_not_trigger(self):
        self.assertEqual([], guard.scan(b'ROOTSYS_API_KEY=YOUR_API_KEY', 'example.txt'))
        self.assertEqual([], guard.scan(Path(guard.__file__).read_bytes(), 'check_secrets.py'))

    def test_private_key_header_is_detected(self):
        header = b'-----BEGIN ' + b'PRIVATE KEY-----'
        self.assertTrue(guard.scan(header, 'payload.txt'))

    def test_key_in_filename_is_redacted(self):
        filename = 'fiq-' + 'Z' * 32
        self.assertEqual('[REDACTED]', guard.safe_label(filename))

    def test_archive_limit_fails_closed(self):
        memory = io.BytesIO()
        with zipfile.ZipFile(memory, 'w', zipfile.ZIP_DEFLATED) as archive:
            archive.writestr('large.txt', b'A' * 100)
        original = guard.MAX_ARCHIVE
        try:
            guard.MAX_ARCHIVE = 50
            self.assertTrue(any('exceeds scan limit' in line for line in guard.scan(memory.getvalue(), 'large.zip')))
        finally:
            guard.MAX_ARCHIVE = original


if __name__ == '__main__':
    unittest.main()
