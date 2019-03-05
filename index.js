const electron = require("electron");
const ffmpeg = require('fluent-ffmpeg');
const cp = require('child_process');
const util = require('util');
const colors = require('colors');

const { app, BrowserWindow, ipcMain }  = electron;

let mainWindow;

app.on("ready", async () => {

    const execPromise = util.promisify(cp.exec);

    let result;
    try {
        result = await execPromise('ffmpeg');
    } catch(err) {
        if(!err.stderr.startsWith("ffmpeg version")) {
            console.log("ERROR:".red);
            console.log("This tool " + "needs".red + " " + "ffmpeg".yellow + " installed and available on your path.");
            console.log("Right now, it cannot find " + "ffmpeg".yellow + ".");
            console.log("This tool will now automatically quit, so that you can head to Google and get this all sorted out.");
            console.log();
            process.exit(1);
        }
    }

    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/index.html`);
});

ipcMain.on('video:submit', (e, path) => {
    ffmpeg.ffprobe(path, (err, metadata) => {
        mainWindow.webContents.send('video:metadata', metadata.format.duration);
    });
});