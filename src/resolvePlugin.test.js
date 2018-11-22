const resolvePlugin = require("./resolvePlugin");
const fs = require("fs-jetpack");

test('should throw without args', () => {
  return expect(resolvePlugin()).rejects.toThrow();
});

test('should return empty array without args', () => {
  return expect(resolvePlugin({})).resolves.toEqual([]);
});

test('should resolve local fs plugin', async (done) => {
  await fs.writeAsync("./pluginOne.js", "module.exports = function() { }");
  const plugins = await resolvePlugin({
    plugins: ["pluginOne"]
  })
  expect(plugins).toHaveLength(1);
  expect(plugins[0].name).toBe("pluginOne");
  expect(plugins[0].path).not.toBe(null);
  expect(plugins[0].module).toBeInstanceOf(Function);
  expect(plugins[0].options).not.toBe(null);
  expect(plugins[0].options).toBeInstanceOf(Object);
  await fs.removeAsync("./pluginOne.js");
  done();
});

test('should resolve local fs plugin with config file', async (done) => {
  await fs.writeAsync("./pluginOne.js", "module.exports = function() { }");
  await fs.writeAsync("./.testrc", {
    plugins: ["pluginOne"]
  });
  const plugins = await resolvePlugin({
    file: ".testrc"
  })
  expect(plugins).toHaveLength(1);
  expect(plugins[0].name).toBe("pluginOne");
  expect(plugins[0].path).not.toBe(null);
  expect(plugins[0].module).toBeInstanceOf(Function);
  expect(plugins[0].options).not.toBe(null);
  expect(plugins[0].options).toBeInstanceOf(Object);
  await fs.removeAsync("./pluginOne.js");
  await fs.removeAsync("./.testrc");
  done();
});

test('should throw when config file not found', () => {
  return expect(resolvePlugin({
    file: ".testrc"
  })).rejects.toThrow();
})