const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800, // Ancho inicial (se ignorará si la ventana está maximizada)
        height: 600, // Alto inicial (se ignorará si la ventana está maximizada)
        maximized: true, // Abrir la ventana maximizada
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Ruta al archivo preload.js
            contextIsolation: true, // Asegura que el contexto esté aislado
            enableRemoteModule: false, // Desactiva el módulo remoto por seguridad
        },
        icon: path.join(__dirname, 'questy_logo.png'), // Icono de la aplicación
        // icon: path.join(__dirname, 'icon.ico') // Si usas Windows, puedes especificar un icono .ico
    });

    // Quitar la barra de menú
    mainWindow.setMenu(null);

    mainWindow.maximize();

    mainWindow.loadFile('index.html');
    // mainWindow.webContents.openDevTools(); // Abrir herramientas de desarrollo (opcional)
}

// Manejar la solicitud de diálogo desde el renderizador
ipcMain.handle('show-prompt', async (event, message) => {
    const result = await dialog.showMessageBox(mainWindow, {
        type: 'question',
        buttons: ['Aceptar', 'Cancelar'],
        title: 'Añadir Misión',
        message: message,
        defaultId: 0,
        cancelId: 1,
    });

    if (result.response === 0) {
        // Si el usuario hace clic en "Aceptar"
        return 'Misión añadida'; // Puedes personalizar esto para devolver un valor específico
    } else {
        // Si el usuario hace clic en "Cancelar"
        return null;
    }
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});