export const resumeDocuments = new Set([
  'resume/computer-engineering-20261022.pdf',
  'resume/resume.pdf',
  'resume/ai-ml-engineer.pdf',
  'resume/software-engineer.pdf',
  'resume/embedded-iot-engineer.pdf'
]);

export function allowedDocumentPath(path) {
  return typeof path === 'string' && (/^certificates\/[\w.-]+\.pdf$/.test(path) || resumeDocuments.has(path));
}
