import { useState, useRef, useEffect, useCallback } from 'react';

export function usePhpRunner() {
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'running' | 'done' | 'error'
  const workerRef = useRef(null);
  const timeoutRef = useRef(null);

  const cleanup = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const runCode = useCallback((code) => {
    cleanup();
    setStatus('running');
    setOutput('');
    setError('');

    try {
      const worker = new Worker(new URL('../php-worker.js', import.meta.url), { type: 'module' });
      workerRef.current = worker;

      timeoutRef.current = setTimeout(() => {
        cleanup();
        setStatus('error');
        setError('Execution timed out after 15 seconds. Check for infinite loops or recursion.');
      }, 15000);

      worker.onmessage = ({ data }) => {
        if (workerRef.current !== worker) return;
        if (data.type === 'running') {
          setStatus('running');
          return;
        }

        setOutput(data.output || '(Execution finished with no output)');
        setError(data.error || '');
        setStatus(data.type === 'error' ? 'error' : 'done');
        cleanup();
      };

      worker.onerror = (err) => {
        if (workerRef.current !== worker) return;
        cleanup();
        setStatus('error');
        setError('Failed to load PHP WebAssembly runtime. Please refresh and try again.');
      };

      worker.postMessage({ code, trace: false });
    } catch (err) {
      setStatus('error');
      setError(String(err.message || err));
      cleanup();
    }
  }, [cleanup]);

  const reset = useCallback(() => {
    cleanup();
    setOutput('');
    setError('');
    setStatus('idle');
  }, [cleanup]);

  return {
    output,
    error,
    status,
    runCode,
    stop: cleanup,
    reset,
  };
}
