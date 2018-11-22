const parse = require("./parsePlugins");
const fs = require("fs-jetpack");
const path = require("path");

async function resolvePlugins ({ prefix, plugins, file }) {
  if(plugins) {
    plugins = parse(plugins);
  } 
  else {
    const rcPath = path.resolve(process.cwd(), file);
    if(!fs.existsAsync(rcPath)) {
      throw new Error(`File not found ${rcPath}`);
    }
    const rc = await fs.readAsync(rcPath);
    const contents = JSON.parse(rc);
    plugins = parse(contents);
  } 
  const pluginMap = {};
  for(let i = 0; i < plugins.length; i++){
      const plugin = plugins[i];
      const path = await resolvePath(plugin[0], prefix);
      pluginMap[plugin[0]] = {
          path,
          module: require(path),
          options: plugin[1]
      }
  }
  const names = Object.keys(pluginMap);
  return names.map(name => ({ name, ...pluginMap[name] }));
}

async function resolvePath(plugin, prefix) {
  const local = path.resolve(process.cwd(), plugin);
  if(await fs.existsAsync(`${local}.js`) || 
     await fs.existsAsync(local)) 
  {
      return local.toString();
  }
  const moduleName = prefix ? `${prefix}-${plugin}` : plugin;
  const nmPath = path.resolve(process.cwd(), "node_modules", moduleName);
  return nmPath;
}

module.exports = resolvePlugins;