const parsePlugins = require("./parsePlugins");

test('should throw when input is null', () => {
  expect(() => parsePlugins(null)).toThrow();
});

test('should throw when input is undefined', () => {
  expect(() => parsePlugins()).toThrow();
});

test('should return empty array when plugins is empty', () => {
  const output = parsePlugins([]);
  expect(output).toEqual([]);
})

test('should parse plugin without options', () => {
  const plugins = ["plugin-name"];
  const output = parsePlugins(plugins);
  expect(output).toEqual([["plugin-name", {}]])
});

test('should parse plugin with options', () => {
  const plugins = [["plugin-name", {opt: true}]];
  const output = parsePlugins(plugins);
  expect(output).toEqual([["plugin-name", {opt: true}]])
});

test('should parse plugin with and without options', () => {
  const plugins = ["plugin-wo-opt", ["plugin-w-opt", {opt: true}]];
  const output = parsePlugins(plugins);
  expect(output).toEqual([
    ["plugin-wo-opt", {}],
    ["plugin-w-opt", {opt: true}]
  ])
});

test('should return empty array when all exluded', () => {
  const plugins = ["!remove-me", ["!remove-me-too", {}]]
  const output = parsePlugins(plugins);
  expect(output).toEqual([]);
});

test('should remove exluded plugins', () => {
  const plugins = ["one", ["two", {2:2}], "three", "!three"];
  const output = parsePlugins(plugins);
  expect(output).toEqual([
    ["one", {}],
    ["two", {2:2}]
  ])
});