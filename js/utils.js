// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

function getCurrentYear() {
  return new Date().getFullYear();
}

function buildSrcSet(entries) {
  if (!Array.isArray(entries) || entries.length === 0) return '';
  return entries
    .filter(entry => entry && entry.src)
    .map(entry => `${entry.src} ${entry.width || '1x'}`)
    .join(', ');
}

function buildSizes(breakpoints) {
  if (!Array.isArray(breakpoints) || breakpoints.length === 0) return '';
  return breakpoints.map(bp => `(max-width: ${bp.maxWidth}) ${bp.width}`).join(', ') + ` ${breakpoints[breakpoints.length - 1]?.width || '100vw'}`;
}
