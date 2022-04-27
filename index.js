// run `node index.js` in the terminal
const Client = require('ssh2-sftp-client');

console.log(`Hello Node.js v${process.versions.node}!`);

const sftp = new Client();

sftp
  .connect({
    host: '192.168.107.164',
    port: 22,
    username: 'root',
    password: '000000',
  })
  .then((res) => {
    console.log('链接成功', res);
  });
