module.exports = Object.defineProperties((overrides, ...args) => {
  if ('string' === typeof overrides) return require(overrides, ...args);
  return (path, ...args) => {
    if (overrides[path]) return overrides[path];
    return require(path, ...args);
  };
}, Object.getOwnPropertyDescriptors(require));
