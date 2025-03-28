export function getImageUrl(path) {
  // Add a timestamp to prevent caching issues
  const timestamp = new Date().getTime();
  return `${path}?t=${timestamp}`;
}

export function getOptimizedImageUrl(path, { width = 800, quality = 75 } = {}) {
  // Add optimization parameters to the URL
  const timestamp = new Date().getTime();
  return `${path}?width=${width}&quality=${quality}&t=${timestamp}`;
}
