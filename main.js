const {app, BrowserWindow, ipcMain, dialog} = require('electron');
var path = require('path');
const fs = require('fs');

let win;
const options = {
    type: 'question',
    buttons: ['Exportar PDF', 'Imprimir', 'Ahora no'],
    defaultId: 0,
    title: 'PDF',
    message: '¿Desea exportar a PDF?',
  };

  const options2 = {
    type: 'info',
    buttons: ['Ok'],
    defaultId: 0,
    message: 'Se ha exportado el PDF',
  };
  const options3 = {
    type: 'question',
    buttons: ['Imprimir', 'Ahora no'],
    defaultId: 0,
    title: 'Imprimir',
    message: '¿Esta listo para imprimir?'
  };
ipcMain.on('var-in', function(event, arg) {
  dialog.showMessageBox(null, options, (response) => {
    if (response === 0) {
      if (!win) {
        dialog.showErrorBox('Error', "Algo ha salido mal!");
        return;
      }
      dialog.showSaveDialog(win, {defaultPath: `${arg[3]}_${arg[2]}_20${arg[1]}__${arg[0]}`, filters: [{name: 'PDF', extensions: ['pdf']}]}, function(file_path) {
        if (file_path) {
          win.webContents.printToPDF({ pageSize: 'Letter', landscape: arg[4],}, function(err, data) {
            if (err) {
              dialog.showErrorBox('Error', err);
              return;
            }
            fs.writeFile(file_path, data, function(err) {
              if (err) {
                dialog.showErrorBox('Error', err);
                return;
              }
              dialog.showMessageBox(null, options2);
             // win = null;
            });
          });
        }
      });
    }
    if (response === 1) {
      if (!win) {
        dialog.showErrorBox('Error', "Algo ha salido mal!");
        return;
      }
      dialog.showMessageBox(null, options3, (response) => {
        if (response === 0) {
          try {
            win.webContents.print({
                silent: false,
                printBackground: true,
            },
            (success, errorType) => {
              if (!success) {
              console.log(errorType);
              /* console.log('Cancelado');
              dialog.showErrorBox('Error', 'Cancelado'); */
              return;
              } else {
                console.log('impreso');
              }
            })
          } catch (error) {
            dialog.showErrorBox('Error', "Algo ha salido mal!");
          }
        }
      });
/*
win.webContents.print(options, (success, errorType) => {
  if (!success) console.log(errorType)
})*/
    }
  });


  /* win.webContents.printToPDF({ pageSize: 'Letter', landscape: false,}, function(err, data) {
    if (err) {
      dialog.showErrorBox('Error', err);
      return;
    }
    fs.writeFile('aaaa.pdf', data, function(err) {
      if (err) {
        dialog.showErrorBox('Error', err);
        return;
      }
     // print_win = null;
    });
  });
  console.log('KOOK');
  console.log(arg); */
});

ipcMain.on('var-in2', function(event, arg) {
  dialog.showMessageBox(null, options, (response) => {
    if (response === 0) {
      if (!win) {
        dialog.showErrorBox('Error', "Algo ha salido mal!");
        return;
      }
      dialog.showSaveDialog(win, {defaultPath: `${arg[5]}_${arg[2]}_${arg[4]}_20${arg[3]}__${arg[1]}` , filters: [{name: 'PDF', extensions: ['pdf']}]}, function(file_path) {
        if (file_path) {
          win.webContents.printToPDF({ pageSize: 'Letter', landscape: arg[6],}, function(err, data) {
            if (err) {
              dialog.showErrorBox('Error', err);
              return;
            }
            fs.writeFile(file_path, data, function(err) {
              if (err) {
                dialog.showErrorBox('Error', err);
                return;
              }
              dialog.showMessageBox(null, options2);
             // win = null;
            });
          });
        }
      });
    }
    if (response === 1) {
      if (!win) {
        dialog.showErrorBox('Error', "Algo ha salido mal!");
        return;
      }
      dialog.showMessageBox(null, options3, (response) => {
        if (response === 0) {
          try {
            win.webContents.print({
                silent: false,
                printBackground: true,
            },
            (success, errorType) => {
              if (!success) {
                console.log(errorType);
                /* console.log('Cancelado');
                dialog.showErrorBox('Error', 'Cancelado'); */
                return;
              } else {
                console.log('impreso');
              }
            })
          } catch (error) {
            dialog.showErrorBox('Error', "Algo ha salido mal!");
          }
        }
      });
    }
  });
});

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    /* width: 800,
    height: 600 */
    webPreferences: {
      nodeIntegration: true
    },
    show: false,
    icon: path.join(__dirname, 'favicon.png')
  });
  win.setMenuBarVisibility(false);
  win.maximize();
  win.show();

  // win.loadFile('./mt/index.html');
  win.loadFile('./mt-v8/index.html');

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});
