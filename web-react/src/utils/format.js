// Shared utility functions for formatting

export function formatBytes(bytes) {
  if (bytes === null || bytes === undefined) return 'N/A';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function formatMs(ms) {
  if (ms === null || ms === undefined) return 'N/A';
  return `${ms.toFixed(0)} ms`;
}

export function formatCLS(cls) {
  if (cls === null || cls === undefined) return 'N/A';
  return cls.toFixed(3);
}

export function getFCPClass(value) {
  if (value === null || value === undefined) return 'unknown';
  if (value <= 1800) return 'good';
  if (value <= 3000) return 'needs-improvement';
  return 'poor';
}

export function getLCPClass(value) {
  if (value === null || value === undefined) return 'unknown';
  if (value <= 2500) return 'good';
  if (value <= 4000) return 'needs-improvement';
  return 'poor';
}

export function getCLSClass(value) {
  if (value === null || value === undefined) return 'unknown';
  if (value <= 0.1) return 'good';
  if (value <= 0.25) return 'needs-improvement';
  return 'poor';
}

