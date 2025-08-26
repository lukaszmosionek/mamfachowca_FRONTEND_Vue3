const FtpDeploy = require("ftp-deploy");
require("dotenv").config();
const fs = require("fs");

const ftpDeploy = new FtpDeploy();

const config = {
  user: process.env.FTP_USERNAME,
  password: process.env.FTP_PASSWORD,
  host: process.env.FTP_HOST,
  port: parseInt(process.env.FTP_PORT, 10) || 21,
  localRoot: __dirname + "/dist",
  // remoteRoot: "/home/serwer2529876/public_html/mamfachowca.mosioneklukasz.pl",
  remoteRoot: "~/public_html/mamfachowca.mosioneklukasz.pl",
  include: ["*", "**/*"],
  deleteRemote: false,
  forcePasv: true,
  log: console.log,
};

// Check .env variables
if (!config.user || !config.password || !config.host) {
  console.error("Missing FTP credentials in .env");
  process.exit(1);
}

// Check dist folder
if (!fs.existsSync(config.localRoot)) {
  console.error("Local folder does not exist:", config.localRoot);
  process.exit(1);
}

console.log("Uploading from:", config.localRoot);
console.log("To remote folder:", config.remoteRoot);
console.log("Using FTP host:", config.host);
console.log("Using FTP port:", config.port);
console.log("Using FTP user:", config.user);

// Event listeners for debugging
ftpDeploy.on("uploading", data => {
  console.log(`Uploading: ${data.filename} (${data.transferredFileCount}/${data.totalFilesCount})`);
});
ftpDeploy.on("uploaded", data => console.log("Uploaded:", data.filename));
ftpDeploy.on("log", data => console.log("Log:", data));

// Start deployment
ftpDeploy.deploy(config)
  .then(res => {
    console.log("Finished:", res);
    console.log("Deploy ended");
  })
  .catch(err => console.error("FTP deploy error:", err));
