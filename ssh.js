const Client = require('ssh2-sftp-client');

const helper = require('./helper');
const config = [
  {
    name: '开发环境',
    enviroment: 'development',
    ssh: {
      host: '192.168.0.0',
      port: 22,
      username: 'root',
      password: '123',
    },
    romotePath: '/root/dev', // 远程地址
    localPath: './dist', // 本地地址
  },
  {
    name: '测试环境',
    enviroment: 'preview',
    ssh: {
      host: '192.168.0.0',
      port: 22,
      username: 'root',
      password: '123',
    },
    romotePath: '/root/pre', // 远程地址
    localPath: './dist', // 本地地址
  },
  {
    name: '生产环境',
    enviroment: 'production',
    ssh: {
      host: '192.168.0.0',
      port: 22,
      username: 'root',
      password: '123',
    },
    romotePath: '/root/prod', // 远程地址
    localPath: './dist', // 本地地址
  },
];

function connect(config) {
  const sftp = new Client();
  return sftp
    .connect(config.ssh)
    .then(() => {
      console.log(`正在部署 ${config.name}`);
      return sftp.uploadDir(config.localPath, config.romotePath);
    })
    .finally(() => {
      sftp.end();
    });
}

async function main() {
  const ps = [];
  const table = [];
  const SELECT_CONFIG = (await helper(config)).value; // 所选部署项目的配置信息
  for (let config of SELECT_CONFIG) {
    table.push({
      enviroment: config.enviroment,
      status: 'OK',
    });
    ps.push(() => connect(config));
  }

  const p = Promise.resolve();
  ps.reduce((p, c) => {
    return p.then(c);
  }, p)
    .then(() => {
      console.log('success completed');
      console.table(table);
    })
    .catch((err) => {
      console.log(err, '出了点问题，快去看看吧~~');
    });
}

main();
