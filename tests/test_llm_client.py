import unittest
from unittest.mock import patch, MagicMock
import io
import json
from src.llm_client import query_kimi3

class TestLLMClient(unittest.TestCase):
    @patch("urllib.request.urlopen")
    def test_query_kimi3_success(self, mock_urlopen):
        mock_response = MagicMock()
        mock_response.status = 200
        response_body = json.dumps({
            "choices": [
                {
                    "message": {
                        "content": "Dear Hiring Manager, I am applying for the Network Engineer position..."
                    }
                }
            ]
        }).encode("utf-8")
        mock_response.read.return_value = response_body
        mock_response.__enter__.return_value = mock_response
        mock_urlopen.return_value = mock_response

        messages = [{"role": "user", "content": "Test prompt"}]
        result = query_kimi3(messages)

        self.assertIsNotNone(result)
        self.assertIn("Network Engineer", result)

    @patch("urllib.request.urlopen")
    def test_query_kimi3_failure_fallback(self, mock_urlopen):
        mock_urlopen.side_effect = Exception("Connection timed out")

        messages = [{"role": "user", "content": "Test prompt"}]
        result = query_kimi3(messages)

    @patch("urllib.request.urlopen")
    def test_parallel_model_tasks(self, mock_urlopen):
        import asyncio
        from src.llm_client import ModelExpertise, execute_parallel_model_tasks

        mock_response = MagicMock()
        mock_response.status = 200
        response_body = json.dumps({
            "choices": [{"message": {"content": "Parallel Model Output Response"}}]
        }).encode("utf-8")
        mock_response.read.return_value = response_body
        mock_response.__enter__.return_value = mock_response
        mock_urlopen.return_value = mock_response

        task_specs = {
            "creative_writing": {
                "model": ModelExpertise.CREATIVE_WRITING,
                "messages": [{"role": "user", "content": "Write cover letter"}]
            },
            "deep_reasoning": {
                "model": ModelExpertise.DEEP_REASONING,
                "messages": [{"role": "user", "content": "Analyze fit"}]
            },
            "code_dev": {
                "model": ModelExpertise.CODE_DEV,
                "messages": [{"role": "user", "content": "Format code"}]
            }
        }

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        results = loop.run_until_complete(execute_parallel_model_tasks(task_specs))
        loop.close()

        self.assertIn("creative_writing", results)
        self.assertIn("deep_reasoning", results)
        self.assertIn("code_dev", results)
        self.assertEqual(results["creative_writing"], "Parallel Model Output Response")

if __name__ == "__main__":
    unittest.main()
