export function getImageUrl(path) {
  const timestamp = new Date().getTime();
  return `${path}?t=${timestamp}`;
}

export function getOptimizedImageUrl(path, { width = 800, quality = 75 } = {}) {
  const timestamp = new Date().getTime();
  return `${path}?width=${width}&quality=${quality}&t=${timestamp}`;
}
