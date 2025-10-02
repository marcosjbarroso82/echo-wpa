# 🎤 Echo WPA - Grabador de Audio

Una aplicación web moderna para grabar y reproducir audio construida con React y Vite.

## ✨ Características

- 🎙️ **Grabación de audio** en tiempo real
- ▶️ **Reproducción** de grabaciones
- ⏸️ **Controles de pausa** y reinicio
- 📱 **Diseño responsive** y moderno
- 🎨 **Interfaz intuitiva** con animaciones

## 🚀 Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## 📦 Deploy en GitHub Pages

### Configuración inicial

1. **Crear repositorio en GitHub**:
   - Ve a GitHub y crea un nuevo repositorio llamado `echo-wpa`
   - Conecta tu repositorio local con GitHub:
   ```bash
   git remote add origin https://github.com/TU-USUARIO/echo-wpa.git
   ```

2. **Actualizar la URL en package.json**:
   - Reemplaza `TU-USUARIO` en la línea `homepage` del `package.json` con tu nombre de usuario de GitHub

### Deploy automático

```bash
# Hacer deploy a GitHub Pages
npm run deploy
```

Este comando:
- Construye la aplicación (`npm run build`)
- Sube los archivos a la rama `gh-pages`
- Tu aplicación estará disponible en: `https://TU-USUARIO.github.io/echo-wpa`

### Deploy manual

Si prefieres hacer el deploy manualmente:

```bash
# Construir la aplicación
npm run build

# Subir a GitHub Pages
npx gh-pages -d dist
```

## 🔧 Configuración

- **Base URL**: Configurada para GitHub Pages (`/echo-wpa/`)
- **Build**: Optimizado para producción con Vite
- **Compatibilidad**: Funciona en navegadores modernos con soporte para MediaRecorder API

## 📱 Uso

1. Abre la aplicación en tu navegador
2. Permite el acceso al micrófono cuando se solicite
3. Haz clic en "Iniciar Grabación" para comenzar
4. Haz clic en "Detener Grabación" cuando termines
5. Usa los controles para reproducir tu grabación

## 🛠️ Tecnologías

- **React 19** - Framework de UI
- **Vite** - Build tool y dev server
- **MediaRecorder API** - Grabación de audio
- **CSS3** - Estilos modernos con gradientes y animaciones
- **GitHub Pages** - Hosting estático

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
