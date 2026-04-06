/**
 * Strip filesystem paths from Python tracebacks before sending to the API
 * or displaying to learners. Replaces all path references with "script.py".
 */
export function stripPaths(traceback: string): string {
  return traceback
    // File "..." lines in tracebacks: File "/path/to/script.py", line N
    .replace(/File\s+"[^"]*"/g, 'File "script.py"')
    // <exec> placeholder Pyodide uses
    .replace(/<exec>/g, "script.py")
    // Unix absolute paths: /home/user/file.py or /tmp/pyodide_...
    .replace(/\/[^\s"',;)]+\.py/g, "script.py")
    // Windows absolute paths: C:\Users\... or similar
    .replace(/[A-Za-z]:\\[^\s"',;)]+\.py/g, "script.py");
}
