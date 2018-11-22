const cliPlugins = require("cli-plugins");

cliPlugins.resolve({
  file: ".rc"
})
.then(async plugins => {
  await cliPlugins.run(plugins, "hello", "world");
})

