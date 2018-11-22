const cliPlugins = require("cli-plugins");

cliPlugins.resolve({
  plugins: ["pluginOne"]
})
.then(plugins => {
  console.log(plugins);
})

