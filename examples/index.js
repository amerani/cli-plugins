const cliPlugins = require("cli-plugins");

cliPlugins.resolve({
  file: "./.rc"
})
.then(plugins => {
  console.log(plugins);
})

