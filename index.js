require("dotenv").config();
const FtpSrv = require('ftp-srv');
const path = require("path").join;
var color = require("cli-color").yellowBright;
const fs = require('fs');

const options = {
    key: fs.readFileSync('server-key.pem'),
    cert: fs.readFileSync('server-cert.pem')
};

const port = 21;
const ftpServer = new FtpSrv({
    url: "ftp://0.0.0.0:" + port,
    anonymous: false,
    tls: options
});

const config = require(path(__dirname, 'account.json'));
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
    console.log(color.yellowBright('Ftp server is starting...'));
});

ftpServer.on('disconnect', ({id, newConnectionCount}) => {
    console.log(color.bgMagenta('ID: ', id, 'Connection count: ', newConnectionCount));
});

ftpServer.on('client-error', ({context, error}) => {
    console.log(color.bgRed(context, error));
});

ftpServer.on('server-error', ({error}) => {
    console.log(color.red(error))
});

ftpServer.on('closing', ({}) => {
    console.log('closing');
});

ftpServer.on('closed', ({}) => {
    console.log('FTP server closed');
});