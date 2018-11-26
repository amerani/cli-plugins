const parse = require("./parsePlugins");
const fs = require("fs-jetpack");
const path = require("path");

async function resolvePlugins (args) {
  if(!args) throw new Error("Plugins cannot be resolved");

  let { prefix, plugins = [], file } = args;
  if(plugins.length > 0) {
    plugins = parse(plugins);
  }
  
  if(file) {
    const rcPath = path.resolve(process.cwd(), file);
    if(await fs.existsAsync(rcPath)) {
      const rc = await fs.readAsync(rcPath);
      const contents = JSON.parse(rc);
      if(contents.prefix) prefix = contents.prefix;
      plugins = plugins.concat(parse(contents.plugins));
    }
  }
  
  const pluginMap = {};
  for(let i = 0; i < plugins.length; i++){
      const plugin = plugins[i];
      const path = await resolvePath(plugin[0], prefix);
      const pluginModule = require(path);
      const options = plugin[1];
      pluginMap[plugin[0]] = {
          path,
          module: pluginModule,
          options,
          async run(...args) {
            return await pluginModule(options, ...args);
          }
      }
  }
  const names = Object.keys(pluginMap);
  return names.map(name => ({ name, ...pluginMap[name] }));
}

async function resolvePath(plugin, prefix) {
  //check if plugin exists locally
  const local = path.resolve(process.cwd(), plugin);
  if(await fs.existsAsync(`${local}.js`) || 
     await fs.existsAsync(local)) 
  {
      return local.toString();
  }
  
  //apply prefix
  const moduleName = prefix ? `${prefix}-${plugin}` : plugin;
  
  //scan all node_modules with module.paths
  const nodeModulesPaths = module.paths;

  for(let i = 0; i < nodeModulesPaths.length; i++) {
    const nmPath = path.resolve(nodeModulesPaths[i], moduleName);
    if(await fs.existsAsync(nmPath)) {
      return nmPath.toString();
    }
  }

  //defaults to where the cli command is run
  //most likely where rc file exists
  return path.resolve(process.cwd(), "node_modules", moduleName);
}

module.exports = resolvePlugins;