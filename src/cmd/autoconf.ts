import { join } from 'path';
import { readFileSync, existsSync, writeFileSync } from 'fs';

class AutoPluginConfiguration {
  cwd;
  modName;
  baseDir;

  constructor(options) {
    options = options || {};
    this.cwd = options.cwd || process.cwd();
    this.modName = options.modName || this.getPkgJson(this.cwd).name;
    // https://docs.npmjs.com/cli/run-script
    this.baseDir = options.baseDir || process.env.INIT_CWD;
  }

  getConfiguration() {
    const sourceDir = [
      join(this.baseDir, 'src/apis'),
      join(this.baseDir, 'src'),
    ];

    const midwayIntegration = this.getPkgJson(this.baseDir)['midway-integration'];
    if (midwayIntegration && midwayIntegration.tsCodeRoot) {
      sourceDir.unshift(join(this.baseDir, midwayIntegration.tsCodeRoot));
    }

    const configurationPostion = sourceDir.find(dirName => {
      if (existsSync(dirName)) {
        return dirName;
      }
      return false;
    });
    if (!configurationPostion) {
      return false;
    }
    const configurationFile = join(configurationPostion, 'configuration.ts');
    let code = '';
    if (!existsSync(configurationFile)) {
      code = this.writeDefaultCongiguration(configurationFile);
    } else {
      code = readFileSync(configurationFile).toString();
    }

    return {
      configurationFile,
      code,
    };
  }

  getPkgJson(dirPath) {
    const pkgFile = join(dirPath, 'package.json');
    if (!existsSync(pkgFile)) {
      return {};
    }
    return JSON.parse(readFileSync(pkgFile).toString());
  }


  writeDefaultCongiguration(fileName) {
    const code = this.getDefaultCode();
    writeFileSync(fileName, code);
    return code;
  }

  getDefaultCode() {
    return `import { Configuration } from '@midwayjs/decorator';
@Configuration({})
export class ContainerConfiguration {}`;
  }

  async run() {
    if(this.cwd === this.baseDir) return;
    const conf = this.getConfiguration();
    if (!conf) {
      console.error(`[Auto Plugin Configuration] can not find source direction`);
      return;
    }
    const newCode = this.insertModToConf(conf.code);
    writeFileSync(conf.configurationFile, newCode);
  }

  insertModToConf(code) {
    // 如果没有 @Configuration ，那么就进行添加
    if (!/@Configuration/.test(code)) {
      code = this.getDefaultCode();
    }
    // 如果没有imports，那么就进行添加
    if (!/@Configuration\([\s\S]*?imports[\s\S]*?\sclass\s/.test(code)) {
      code = this.addImports(code);
    }
    code = this.addMode(code);
    return code;
  }

  addImports(code) {
    const emptyConfiguration = /@Configuration\(\s*\)/g;
    if (emptyConfiguration.test(code)) {
      code = code.replace(emptyConfiguration, '@Configuration({})');
    }
    return code.replace(/@Configuration\(\{\s*/, `@Configuration({
    imports: [],`)
  }

  addMode(code) {
    const importReg = /imports:\s*\[((?:.|\s)*?)\]/m;
    const imports = importReg.exec(code);
    if (!imports || !imports[0]) {
      return code;
    }
    const importList = imports[1].split(',').map(mod => {
      return mod.replace(/^\s*['"]|['"]\s*/g, '');
    }).filter(v => !!v);
    if (importList.indexOf(this.modName) === -1) {
      importList.push(this.modName);
      code = code.replace(importReg, `imports: ['${importList.join(`', '`)}']`);
    }
    return code;
  }
}

export const command = AutoPluginConfiguration;