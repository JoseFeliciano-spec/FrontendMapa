# ✈️ **SkyConnect Explorer**

Aplicación web moderna desarrollada con **Next.js 14**, diseñada para explorar aeropuertos de todo el mundo a través de la API de **Aviationstack**. Incluye búsqueda avanzada, paginación optimizada, historial persistente y mapas interactivos.

Link de la demo:
Nota: Cambiar entre el tamaño de página. La API_KEY está saturada debido a el uso de free tier en pruebas. Pero desplegado en vercel
```bash
https://frontend-mapa-fp5c.vercel.app/
```

---

# 📌 **Descripción**

**SkyConnect Explorer** permite consultar más de **9.000 aeropuertos** del mundo mediante filtros inteligentes, búsqueda por parámetros y vista detallada, todo con un diseño responsivo, carga rápida y una arquitectura centrada en rendimiento (TBT y LCP reducidos).

Este proyecto fue creado como una prueba técnica orientada a demostrar:

* Buenas prácticas de frontend moderno
* Uso de React y Server Components
* Gestión de estado avanzada
* Integración con API externa
* Diseño UX/UI limpio
* Patrones de arquitectura frontend

---

# ✨ **Características Principales**

## 🔍 Búsqueda Avanzada

* Búsqueda en tiempo real con debounce.
* Filtros por nombre, IATA, ICAO, país y continente.
* Sincronización con la URL (`searchParams`).
* Validación de inputs con Yup.

---

## 📄 Paginación Escalable

* Paginación del lado del servidor usando `offset` y `limit`.
* Selector de tamaño de página: **10, 100, 1000** resultados.
* UI clara con paginación truncada (“…”).
* Persistencia mediante parámetros en la URL.

---

## 📚 Historial Persistente

* Guarda automáticamente los aeropuertos visitados.
* Memoria de hasta 50 elementos.
* Se almacena en `localStorage` usando Zustand.
* Página dedicada: `/history`.

---

## 🗺️ Mapas Interactivos

* Integración con **Leaflet + React Leaflet**.
* Marcador dinámico según latitud / longitud.
* Carga dinámica sin SSR para evitar errores en producción.

---

## 🎨 UI Moderna y Fluida

* Tailwind CSS totalmente personalizado.
* Skeleton loaders para una experiencia más suave.
* Diseño responsive móvil–desktop.
* Componentes propios y reutilizables.

---

# 🧪 **Tests Incluidos**

Este proyecto incluye un set de pruebas automatizadas para validar:

* Renderización de componentes clave.
* Comportamiento de búsqueda.
* Paginación.
* Manejo de errores de la API.
* Renderización de datos en el detalle del aeropuerto.

Framework utilizado:

* **Vitest + React Testing Library**

---

# ⚠️ **Limitaciones (por usar una tier gratuita en la API)**

Debido a que Aviationstack se utiliza en su **plan gratuito**, existen varias limitaciones importantes:

### 🔸 1. Límite de requests

* La tier gratuita solo permite cierta cantidad de solicitudes por hora.
* Si se superan, la API responde con error **429 (Too Many Requests)**.

### 🔸 2. Latencia más alta

* Los servidores free no garantizan un tiempo de respuesta bajo.
* Algunas consultas pueden tardar más.

### 🔸 3. Datos parcialmente actualizados

* La información no siempre está en tiempo real.
* Algunos aeropuertos pueden no traer todos los campos.

### 🔸 4. Sin HTTPS en la API gratuita

* Al usar HTTP, algunos navegadores bloquean requests desde HTTPS (Mixed Content).
* Para evitarlo, se usa un **proxy interno del proyecto** que sí corre con HTTPS.

### 🔸 5. Falta de endpoints premium

* No incluye vuelos en vivo.
* No incluye rutas ni posiciones.
* No incluye información extendida de aeropuertos.

El README detalla esto para que cualquier equipo entienda qué puede y qué no puede hacerse bajo las condiciones actuales.

---

# 🛠️ **Tecnologías utilizadas**

* **Next.js 14** (App Router)
* **TypeScript**
* **React Query**
* **Zustand**
* **Tailwind CSS**
* **Leaflet / React Leaflet**
* **Yup**
* **Vitest + RTL**

---

## ✨ **Fotos**

###  Home
<img width="1910" height="923" alt="image" src="https://github.com/user-attachments/assets/2fec79a6-e760-4056-b6b9-0bc4efc5a33b" />

### Home desplegado skeleton
<img width="1910" height="923" alt="image" src="https://github.com/user-attachments/assets/20cf19ac-50e8-40ee-a984-77664b4f985d" />

### Home desplegado con las Cards
<img width="1910" height="1453" alt="image" src="https://github.com/user-attachments/assets/a0f33bca-f54b-4722-a94e-7101fef1ffcd" />

### Información relevante - General
<img width="1910" height="1453" alt="image" src="https://github.com/user-attachments/assets/bb1dfe17-c249-42df-9cf7-a3e4e561c55a" />

### Información relevante - Mapa
<img width="1910" height="1453" alt="image" src="https://github.com/user-attachments/assets/702af310-faa0-46de-a5fb-0a4debb8da9f" />

### Información relevante - Zona horaria
<img width="1910" height="1453" alt="image" src="https://github.com/user-attachments/assets/c399bf17-69c1-4463-9b83-d4dcb9f28f4b" />

## Información relevante - Estadística
<img width="1910" height="923" alt="image" src="https://github.com/user-attachments/assets/9eddbe1b-9f55-46aa-be32-2829e01c9ab5" />

---


# 📦 **Instalación**

```bash
git clone https://github.com/tu-usuario/skyconnect-explorer.git
cd skyconnect-explorer
npm install
npm run dev
```

---

# 🔧 **Variables de entorno**

Crear archivo:

`./.env.local`

```env
AVIATIONSTACK_KEY=tu_api_key_aqui
```

⚠️ **Nunca expongas una API Key real en el repositorio.**

Si quieres, te genero un `env.example` automático.

---

# 📁 **Estructura del Proyecto**

```
src/
 ├─ app/
 │   ├─ [id]/
 │   │   ├─ page.tsx
 │   ├─ history/page.tsx
 │   ├─ api/
 │   │   └─ airports/route.ts
 ├─ components/
 ├─ hooks/
 ├─ lib/
 ├─ stores/
 ├─ tests/
```

---

# 🚀 **Roadmap**

* Mejorar caching con React Query persistente
* Integración con mapas 3D (CesiumJS)
* Modo offline
* Tema claro/oscuro
* Historial sincronizado en la nube con Firestore
* Integración de vuelos en tiempo real (requiere API premium)

---

# 🤝 **Contribución**

1. Haz un fork
2. Crea una branch: `feature/mi-mejora`
3. Haz commit
4. Abre un Pull Request

---

# 📄 **Licencia**

MIT — Libre para usar y modificar.

---

# 👤 **Autor**

**Jose Feliciano Anaya Simanca**
Desarrollador Full Stack — React / Next.js / Backend con FastAPI – Cloud Run – Firebase.

---

# 🙌 **Agradecimientos**

* Aviationstack (API de aeropuertos)
* Comunidad Next.js
* React Leaflet
* Vercel
