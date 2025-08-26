const FtpDeploy = require("ftp-deploy")
require('dotenv').config()

const ftpDeploy = new FtpDeploy()


const config = {
  // user: import.meta.env.FTP_USERNAME,
  // password: import.meta.env.FTP_PASSWORD,
  // host: import.meta.env.FTP_HOST,
  // port: import.meta.env.FTP_PORT,
  user: process.env.FTP_USERNAME,
  password: process.env.FTP_PASSWORD,
  host: process.env.FTP_HOST,
  port: parseInt(process.env.FTP_PORT, 10) || 21, // default 21 if not set
  localRoot: __dirname + "/dist",
  remoteRoot: "/home/serwer2529876/public_html/mamfachowca.mosioneklukasz.pl/test",
  include: ["*", "**/*"],
  deleteRemote: false,  // set true if you want to clean remote folder first
  forcePasv: true,
  log: console.log,   // enables detailed logging
};

console.log("Uploading from:", config.localRoot);
console.log("To remote folder:", config.remoteRoot);
console.log("Using FTP host:", config.host);
console.log("Using FTP port:", config.port);
console.log("Using FTP user:", config.user);

ftpDeploy
  .deploy(config)
  .then(res => console.log("Finished:", res))
  .catch(err => console.error("FTP deploy error:", err));

console.log("Deploy ended");
