async function runPlugin(plugins, ...args) {
  for(let i = 0; i < plugins.length; i++) {
    await plugins[i].run(...args);
  }
}

module.exports = runPlugin;