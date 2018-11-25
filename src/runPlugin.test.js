const runPlugin = require("./runPlugin");

test('should call run on plugins', () => {
  const plugins = [{run: jest.fn()}]

  const args = [1,2];
  runPlugin(plugins, ...args);
  
  expect(plugins[0].run.mock.calls[0][0]).toBe(args[0]);
  expect(plugins[0].run.mock.calls[0][1]).toBe(args[1]);
})