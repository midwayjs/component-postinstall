#!/usr/bin/env node
const argv = process.argv;
(async () => {
  let CMD;
  if(require.extensions['.ts']) {
    CMD = require(`../src/cmd/${argv[2]}`).command;
  } else {
    CMD = require(`../dist/cmd/${argv[2]}`).command;
  }
  await new CMD().run();
})().catch(err => {
  console.error(err);
});