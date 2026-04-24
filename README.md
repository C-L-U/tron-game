# 🟦 TRON_GRID // SYSTEM_INTERFACE

Bienvenido al sistema. Has cruzado el umbral hacia la frontera digital. Este no es solo un repositorio; es un protocolo de ejecución optimizado para la red.

> **LIVE_ACCESS_GRANTED:** > [🌐 ENTRAR EN EL GRID (PREVIEW)](https://trongrid.org)

---

## ⚡ CORE_PROTOCOLS: React + TypeScript + Vite

Este entorno proporciona una configuración mínima para desplegar programas en el Grid con **HMR (Hot Module Replacement)** de velocidad luz y reglas de **ESLint** para mantener la integridad del código.

### 🔌 PLUGINS_INSTALLED
* `@vitejs/plugin-react` // Utilizando el motor de aceleración **Oxc**
* `@vitejs/plugin-react-swc` // Utilizando el compilador **SWC**

---

## 🛠 COMPILADOR_RENAISSANCE

El **React Compiler** ha sido integrado en este sector. 
* **Estado:** ACTIVO.
* **Documentación:** [Manual de Usuario](https://react.dev/learn/react-compiler)

> [!WARNING]
> La activación de este módulo impactará el rendimiento de los ciclos de desarrollo y construcción (build). Procede bajo tu propio riesgo.

---

## 🛰 EXPANDIENDO_CONFIGURACIÓN_ESLINT

Si estás desarrollando una aplicación de grado de producción (Level 2 User), se recomienda actualizar el protocolo para habilitar reglas de tipado estricto:

```js
// system.config.js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Protocolos base...
      tseslint.configs.recommendedTypeChecked,
      // Para un filtrado de errores más riguroso:
      tseslint.configs.strictTypeChecked,
      // Para mantener la estética del código:
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])