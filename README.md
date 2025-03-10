# Questy_irl

**Questy_irl** es una aplicación desarrollada con [Electron](https://www.electronjs.org/) y es un gestor de tareas (TO-DO List) con tematica de RPG mas concretamente World of Warcraft.

## Características

- **Interfaz de usuario personalizada**: Utiliza `index.html` y `styles.css` para definir la estructura y el estilo de la aplicación.
- **Lógica de negocio**: Implementada en `main.js`, `preload.js` y `renderer.js` para gestionar la funcionalidad de la aplicación.
- **Gestión de dependencias**: Utiliza `package.json` y `package-lock.json` para manejar las dependencias del proyecto.

## Requisitos previos

- [Node.js](https://nodejs.org/) (versión 14 o superior)
- [npm](https://www.npmjs.com/) (generalmente incluido con Node.js)

## Instalación

1. **Clona este repositorio**:

   ```bash
   git clone https://github.com/Nachin7u7/Questy_irl.git
   ```

2. **Navega al directorio del proyecto**:

   ```bash
   cd Questy_irl
   ```

3. **Instala las dependencias**:

   ```bash
   npm install
   ```

## Uso

Para iniciar la aplicación, ejecuta:

```bash
npm npx electron .     
```

Esto iniciará la aplicación de escritorio utilizando Electron.

## Estructura del proyecto

- `index.html`: Archivo principal que define la estructura de la interfaz de usuario.
- `styles.css`: Archivo de estilos que define la apariencia de la aplicación.
- `main.js`: Script principal que controla el ciclo de vida de la aplicación Electron.
- `preload.js`: Script que se ejecuta antes de que la página web sea cargada en el renderizador.
- `renderer.js`: Script que maneja la lógica específica de la interfaz de usuario.
