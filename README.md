# 🎤 Echo WPA - Grabador de Audio

Una aplicación web moderna para grabar y reproducir audio construida con React y Vite.

## ✨ Características

- 🎙️ **Grabación de audio** en tiempo real
- ▶️ **Reproducción** de grabaciones
- ⏸️ **Controles de pausa** y reinicio
- 📱 **Diseño responsive** y moderno
- 🎨 **Interfaz intuitiva** con animaciones
- 📲 **PWA (Progressive Web App)** - Instalable en dispositivos
- 🔄 **Actualizaciones automáticas** con Service Worker
- 📴 **Funcionalidad offline** básica
- 🚀 **Instalación rápida** desde el navegador

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

### Uso básico
1. Abre la aplicación en tu navegador
2. Permite el acceso al micrófono cuando se solicite
3. Haz clic en "Iniciar Grabación" para comenzar
4. Haz clic en "Detener Grabación" cuando termines
5. Usa los controles para reproducir tu grabación

### Instalación como PWA
1. **En móviles**: Busca el botón "Instalar" en la barra de direcciones o en el menú del navegador
2. **En escritorio**: Aparecerá un banner de instalación automáticamente
3. **Instalación manual**: Ve al menú del navegador → "Instalar Echo WPA"
4. Una vez instalada, la app funcionará como una aplicación nativa

### Características PWA
- **Instalación**: Se puede instalar en cualquier dispositivo
- **Icono personalizado**: Aparece en el escritorio/pantalla de inicio
- **Modo standalone**: Se abre sin la barra del navegador
- **Actualizaciones**: Se actualiza automáticamente cuando hay nuevas versiones
- **Offline**: Funciona básicamente sin conexión a internet

## 🛠️ Tecnologías

- **React 19** - Framework de UI
- **Vite** - Build tool y dev server
- **MediaRecorder API** - Grabación de audio
- **CSS3** - Estilos modernos con gradientes y animaciones
- **PWA** - Progressive Web App con Service Worker
- **Workbox** - Service Worker y caching
- **GitHub Pages** - Hosting estático

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
