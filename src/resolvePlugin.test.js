const resolvePlugin = require("./resolvePlugin");

test('should throw without args', () => {
  return expect(resolvePlugin()).rejects.toThrow();
});

test('should return empty array without args', () => {
  return expect(resolvePlugin({})).resolves.toEqual([]);
});

test('should resolve local fs plugin', async (done) => {
  const plugins = await resolvePlugin({
    plugins: ["../test-fs/resolvePluginOne"]
  })
  expect(plugins).toHaveLength(1);
  expect(plugins[0].name).toBe("../test-fs/resolvePluginOne");
  expect(plugins[0].path).not.toBe(null);
  expect(plugins[0].module).toBeInstanceOf(Function);
  expect(plugins[0].options).not.toBe(null);
  expect(plugins[0].options).toBeInstanceOf(Object);
  done();
});