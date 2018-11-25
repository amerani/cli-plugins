const resolvePlugin = require("./resolvePlugin");
const fs = require("fs-jetpack");

const mockPluginFn = jest.fn();

let options = { log: true };
beforeEach(async (done) => {
  await fs.writeAsync("./pluginOne.js", "module.exports = function() { }");
  await fs.writeAsync(".testrc", {
    plugins: [["pluginOne", options]]
  });
  mockPluginFn.mockClear();
  done();
});

afterEach(async (done) => {
  await fs.removeAsync("./pluginOne.js");
  await fs.removeAsync("./.testrc");
  done();
});

test('should run resolved plugin', async (done) => {
  //ARRANGE: resolved mock plugin
  jest.mock('../pluginOne.js', () => {
    return mockPluginFn;
  });
  const plugins = await resolvePlugin({
    file: ".testrc"
  });

  //ACT
  const args = [1, 2]
  plugins[0].run(...args);

  //ASSERT
  expect(mockPluginFn.mock.calls[0][0]).toEqual(options);
  expect(mockPluginFn.mock.calls[0][1]).toEqual(args[0]);
  expect(mockPluginFn.mock.calls[0][2]).toEqual(args[1]);
  done();
});