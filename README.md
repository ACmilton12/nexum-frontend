# Nexum Frontend

Este es el repositorio frontend para el proyecto Nexum, construido con React, Vite y TypeScript. Su objetivo es **crear y gestionar el portafolio profesional en línea de una persona; integrando proyectos, habilidades, experiencia, logros y evidencia digital, con el propósito de fortalecer su marca personal como parte estratégica del currículum vitae**.

## Características

*   **Desarrollo Rápido**: Utiliza Vite para un servidor de desarrollo rápido y Hot Module Replacement (HMR).
*   **Componentes React**: Construido con la biblioteca React para una interfaz de usuario modular y eficiente.
*   **Tipado Estático**: Desarrollado con TypeScript para una mayor robustez y mantenimiento del código.
*   **Gestión de Estado**: Utiliza React Hooks (como `useState`) para la gestión de estado local y puede extenderse con el Context API para estado global.
*   **Estilos**: Implementado con Tailwind CSS para un desarrollo rápido y utilitario, complementado con CSS tradicional para estilos globales (`App.csss`, `index.csss`).

## Tecnologías Utilizadas

*   **React**: Biblioteca de JavaScript para construir interfaces de usuario.
*   **Vite**: Herramienta de construcción de próxima generación para proyectos web.
*   **TypeScript**: Superset de JavaScript que añade tipado estático.
*   **npm/Yarn/pnpm**: Gestor de paquetes.
*   **React Router DOM**: Para la navegación en la aplicación.
*   **Tailwind CSS**: Para estilos utilitarios y responsivos.
*   **Autoprefixer**: Para añadir prefijos de proveedor a CSS.
*   **PostCSS**: Para transformar CSS con plugins de JavaScript.
*   **ESLint**: Para el linting de código.

## Instalación

Para ejecutar este proyecto localmente, sigue estos pasos:

1.  **Clona el repositorio:**
    ```bash
        git clone https://github.com/ACmilton12/nexum-frontend.git
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install react react-dom
    npm install -D typescript vite @types/react @types/react-dom @vitejs/plugin-react
    npm install lucide-react
    npm install -D tailwindcss postcss autoprefixer
    ```

3.  **Configuración de variables de entorno (si aplica):**
    Crea un archivo `.env` en la raíz del proyecto y añade las variables de entorno necesarias.

4.  **Inicia el servidor de desarrollo:**
    ```bash
    npm run dev
    # o yarn dev
    # o pnpm dev
    ```
    Esto iniciará la aplicación en `http://localhost:5173` (o el puerto que Vite asigne).

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

*   `npm run dev`: Inicia el servidor de desarrollo.
*   `npm run build`: Compila la aplicación para producción en la carpeta `dist`.
*   `npm run lint`: Ejecuta ESLint para revisar problemas de código.
*   `npm run preview`: Sirve la compilación de producción localmente.

## Estructura del Proyecto

```
nexum-frontend/
├── public/                  # Archivos estáticos (íconos, etc.)
├── src/
│   ├── assets/              # Imágenes, íconos, etc. (como react.svg, vite.svg, hero.png)
│   ├── components/          # Componentes reutilizables
│   ├── pages/               # Vistas o páginas principales de la aplicación
│   ├── services/            # Lógica para interactuar con APIs
│   ├── utils/               # Funciones de utilidad
│   ├── App.css              # Estilos globales de la aplicación
│   ├── App.tsx              # Componente principal de la aplicación
│   ├── index.css            # Estilos base o globales
│   └── main.tsx             # Punto de entrada de la aplicación
├── .env.example             # Ejemplo de archivo de variables de entorno
├── index.html               # Archivo HTML principal
├── package.json             # Dependencias y scripts del proyecto
├── tsconfig.json            # Configuración de TypeScript
├── vite.config.ts           # Configuración de Vite
└── README.md                # Este archivo
```

## Contribución

¡Las contribuciones son bienvenidas! Si deseas contribuir, por favor:

1.  Haz un checkout del repositorio.
2.  Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3.  Realiza tus cambios y commitea (`git commit -m 'feat: Añade nueva funcionalidad'`).
4.  Sube tus cambios (`git push origin feature/nueva-funcionalidad`).
5.  Abre un Pull Request.
