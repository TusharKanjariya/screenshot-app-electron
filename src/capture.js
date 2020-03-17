const electron = require('electron');
const path = require('path');
const fs = require('fs');
const { ipcRenderer: ipc, desktopCapturer, remote } = electron;

const { screen: appScreen } = remote;

function getMainSource(desktopCapturer, screen, done) {
  let options = {
    types: ['screen'],
    thumbnailSize: appScreen.getPrimaryDisplay().workAreaSize
  };
  desktopCapturer
    .getSources(options)
    .then(sources => {
      const isMainSource = s =>
        s.name === 'Entire Screen' ||
        s.name === 'Screen 1' ||
        s.name === 'Entire screen';
      done(sources.filter(isMainSource)[0]);
    })
    .catch(err => {
      return console.log('cannot capture screen:', err);
    });
}

function writeScreenshot(png, filePath) {
  fs.writeFile(filePath, png, err => {
    if (err) return console.log('Failed to Save Image', err);
  });
}

function onCapture(evt, targetPath) {
  getMainSource(desktopCapturer, appScreen, source => {
    console.log(source);
    const png = source.thumbnail.toPNG();
    const filePath = path.join(targetPath, new Date() + '.png');
    writeScreenshot(png, filePath);
  });
}

ipc.on('capture', onCapture);
ipc.send('');
