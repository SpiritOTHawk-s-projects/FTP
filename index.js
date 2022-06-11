require("dotenv").config();
const FtpSrv = require('ftp-srv');
const path = require("path");
var color = require("cli-color");

const port=21;
const ftpServer = new FtpSrv({
    url: "ftp://0.0.0.0:" + port,
    anonymous: false
});

const config = require(path.join(__dirname, 'account.json'));
const username1 = config.username;
const password1 = config.password;
const dir = config.dir;

ftpServer.on('login', (data, resolve, reject) => { 
    if(data.username === username1 && data.password === password1){
        return resolve({ root: dir });
    }
    return reject(new errors.GeneralError('Invalid username or password', 401));
});

ftpServer.listen().then(() => { 
    console.log(color.yellowBright('Ftp server is starting...'))
});