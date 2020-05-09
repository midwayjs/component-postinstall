import { command } from '../src/cmd/autoconf';
import { join } from 'path';
import { existsSync, readFileSync, remove, copyFile } from 'fs-extra';
import * as assert from 'assert';

function existsAndMatch(file: string, pattern: RegExp) {
  if(existsSync(file)) {
    return pattern.test(readFileSync(file).toString('utf-8'));
  }
  return false;
}

describe('/test/index.test.ts', () => {
  it('test autoconf when file not exist', async () => {
    const baseDir = join(__dirname, './fixtures/autoConf-no-conf');
    assert(!existsSync(join(baseDir, 'src/configuration.ts')));
    const cmd = new command({
      modName: 'test-mode-name',
      baseDir,
    });
    await cmd.run();
    assert(existsAndMatch(join(baseDir, 'src/configuration.ts'), /test-mode-name/));
    await remove(join(baseDir, 'src/configuration.ts'));
  })

  it('test autoconf when import not exist', async () => {
    const baseDir = join(__dirname, './fixtures/autoConf-no-import');
    assert(!existsSync(join(baseDir, 'src/configuration.ts')));
    await copyFile(join(baseDir, 'src/configuration.ts_bak'), join(baseDir, 'src/configuration.ts'));
    const cmd = new command({
      modName: 'test-mode-name',
      baseDir,
    });
    await cmd.run();
    assert(existsAndMatch(join(baseDir, 'src/configuration.ts'), /test-mode-name/));
    await remove(join(baseDir, 'src/configuration.ts'));
  })

  it('test autoconf when configuration has empty object', async () => {
    const baseDir = join(__dirname, './fixtures/autoConf-empty-object');
    assert(!existsSync(join(baseDir, 'src/configuration.ts')));
    await copyFile(join(baseDir, 'src/configuration.ts_bak'), join(baseDir, 'src/configuration.ts'));
    const cmd = new command({
      modName: 'test-mode-name',
      baseDir,
    });
    await cmd.run();
    assert(existsAndMatch(join(baseDir, 'src/configuration.ts'), /test-mode-name/));
    await remove(join(baseDir, 'src/configuration.ts'));
  })

  it('test autoconf when configuration has empty imports', async () => {
    const baseDir = join(__dirname, './fixtures/autoConf-empty-imports');
    assert(!existsSync(join(baseDir, 'src/configuration.ts')));
    await copyFile(join(baseDir, 'src/configuration.ts_bak'), join(baseDir, 'src/configuration.ts'));
    const cmd = new command({
      modName: 'test-mode-name',
      baseDir,
    });
    await cmd.run();
    assert(existsAndMatch(join(baseDir, 'src/configuration.ts'), /test-mode-name/));
    await remove(join(baseDir, 'src/configuration.ts'));
  })

  it('test autoconf when configuration has imports', async () => {
    const baseDir = join(__dirname, './fixtures/autoConf-has-imports');
    assert(!existsSync(join(baseDir, 'src/configuration.ts')));
    await copyFile(join(baseDir, 'src/configuration.ts_bak'), join(baseDir, 'src/configuration.ts'));
    const cmd = new command({
      modName: 'test-mode-name',
      baseDir,
    });
    await cmd.run();
    assert(existsAndMatch(join(baseDir, 'src/configuration.ts'), /test-mode-name/));
    await remove(join(baseDir, 'src/configuration.ts'));
  })

  it('test autoconf when configuration has duplicate imports', async () => {
    const baseDir = join(__dirname, './fixtures/autoConf-duplicate-imports');
    assert(!existsSync(join(baseDir, 'src/configuration.ts')));
    await copyFile(join(baseDir, 'src/configuration.ts_bak'), join(baseDir, 'src/configuration.ts'));
    const cmd = new command({
      modName: 'test-mode-name',
      baseDir,
    });
    await cmd.run();
    assert(existsAndMatch(join(baseDir, 'src/configuration.ts'), /test-mode-name/));
    await remove(join(baseDir, 'src/configuration.ts'));
  })

  it('test autoconf when midway intergration', async () => {
    const baseDir = join(__dirname, './fixtures/autoConf-midway-integration');
    const cmd = new command({
      modName: 'test-mode-name',
      baseDir,
    });
    await cmd.run();
    assert(existsAndMatch(join(baseDir, 'src/apis/configuration.ts'), /test-mode-name/));
    await remove(join(baseDir, 'src/apis/configuration.ts'));
  })
})