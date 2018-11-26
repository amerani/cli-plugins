# cli-plugins
a plugin system for building extensible CLIs

## Installation
`npm i cli-plugins`

## Usage
```js
const cliPlugins = require("cli-plugins");

// resolve plugins from file or pass plugins array
const plugins = await cliPlugins.resolve({
  prefix: 'npm-module-prefix',
  file: '.cli-rc',
  plugins: [
    "module-name-without-prefix",
    "../local-file",
    ["with-options", {
      pluginOpt: true
    }]
  ]
});

// run all plugins
await cliPlugins.run(plugins);

//run individually with data
await plugins[0].run(process.argv[0]);
```
*plugin options are automatically passed as second argument*