const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron')
const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1440,
    height: 900
  })

  // and load the index.html of the app.
  win.loadFile('app/index.html')

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
  createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('request-mainprocess-action', (event, data) => {
  switch (data.action) {
    case 'setting':
      writeSetting(event, data.setting);
      break;
    case 'getEntities':
      makePicklist(event, function (event, setting) {
        fs.readdir(setting.projectPath + '/entities/', (err, entities) => {
          entities.forEach(entity => {
            event.sender.send('mainprocess-response', entity);
          });
        })
      });
      break;

    default:
      break;
  }
});

function writeSetting(event, data) {
  var file = 'app/setting.json';
  console.log(data);
  fs.writeFile(file, JSON.stringify(data), function (err) {
    if (err) return console.log(err);
    win.reload();
    event.sender.send('mainprocess-response', 'done');
  });
}

function makePicklist(event, callback) {
  var file = 'app/setting.json';
  var setting;
  fs.readFile(file, 'utf8', function (err, data) {
    if (err) throw err;
    setting = JSON.parse(data);
    console.log(setting.projectPath);
    callback(event, setting)
  });
}