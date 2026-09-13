# 📋 Tablero Kanban

Panel Kanban para la organización de tareas de desarrolladores web. Proyecto desarrollado como ejercicio de diseño y desarrollo front-end, con persistencia de datos simulada mediante **json-server**.

🔗 **Sitio en producción:** _[https://randombelo.github.io/Tablero_Kanban/]_
📦 **Repositorio:** _[https://github.com/randombelo/Tablero_Kanban]_
**Backend en render:**_[https://tablero-kanbanrandombelo.onrender.com/]_
**Diseño en Sttich:**_[https://stitch.withgoogle.com/projects/18426646002164002808]_

---

## Tabla de contenidos

- [Objetivo del proyecto](#objetivo-del-proyecto)
- [Equipo](#equipo)
- [Páginas del sitio](#páginas-del-sitio)
- [Tecnologías](#tecnologías)
- [Funcionalidades principales](#funcionalidades-principales)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Cómo correr el proyecto en local](#cómo-correr-el-proyecto-en-local)
- [Metodología de trabajo](#metodología-de-trabajo)
- [Aprendizajes y retos](#aprendizajes-y-retos)

---

## Objetivo del proyecto

El objetivo de este proyecto es construir un **tablero Kanban** que permita a los desarrolladores organizar sus tareas de forma visual, moviéndolas entre distintos estados de progreso (por ejemplo, *To do*, *In progress* y *Done*). El trabajo abarcó desde el diseño de la interfaz hasta el desarrollo completo de la aplicación, incluyendo la gestión de datos mediante una API simulada con `json-server`.

## Equipo

**Tablero_Kanban**

Este proyecto fue desarrollado de forma individual. Al ser el único integrante del equipo, asumí los tres roles del proceso:

| Integrante | Rol |
|---|---|
| Abel Marrero Camero | Product Owner |
| Abel Marrero Camero | Scrum Master |
| Abel Marrero Camero | Developer |

## Páginas del sitio

| Página | Archivo | Descripción |
|---|---|---|
| Tablero | `index.html` | Vista principal con las columnas del Kanban y las tarjetas de tareas |
| Modal Crear | `index.html` | Crear nuevas tarjetas |
| Modal Editar | `index.html` | Abarca editar la tarjeta, eliminar la tarjeta y crear y eliminar comentarios |
| Modal Eliminar  | `index.html` | Eliminar tarjetas y comentarios |

## Tecnologías

- **HTML5** semántico
- **CSS3** (responsive, animaciones y transiciones)
- **JavaScript (ES6+)** Vanilla
- **json-server** — API REST simulada para persistir las tareas en `db.json`
- **Git** y **GitHub** (control de versiones y GitHub Projects)
- **GitHub Pages** — despliegue (rama `deployPages`)
- **Render.com** Web para el backend


## Funcionalidades principales

- ✅ Creación, edición y eliminación de tareas.
- ✅ Organización de tareas en columnas por estado (*To do / In progress / Done*).
- ✅ Arrastrar y soltar tarjetas entre columnas (drag & drop).
- ✅ Persistencia de datos mediante `json-server` y `db.json`.
- ✅ Diseño responsive para móvil, tablet y escritorio.
- ✅ Buscador de tarjetas.
- ✅ Creación y eliminación de comentarios.

## Estructura del proyecto

```
Tablero_Kanban/
├── index.html            # Vista principal del tablero
├── src/                  # Estilos y lógica de la aplicación
├── db.json               # Base de datos simulada para json-server
├── package.json          # Scripts y dependencias del proyecto
├── pnpm-lock.yaml         # Lockfile de dependencias
├── .nojekyll              # Evita el procesamiento Jekyll en GitHub Pages
└── README.md
```

## Cómo correr el proyecto en local

Este proyecto usa `json-server` para simular una API REST que persiste los datos del tablero en `db.json`. Hace falta tener **Node.js** instalado.

```bash
# Instalar las dependencias
pnpm install

# Levantar la API simulada (puerto 3000)
pnpm start
```

Con la API corriendo, abre `index.html` en el navegador (o sírvelo con un servidor local si el proyecto hace peticiones `fetch`, por ejemplo con `npx serve` o `python -m http.server 8000`).

## Metodología de trabajo

Aunque el proyecto lo desarrollé en solitario, apliqué una metodología **Scrum/Kanban** apoyándome en las herramientas de GitHub, simulando el flujo de trabajo de un equipo real:

- **Tablero Kanban** (GitHub Projects) con columnas *To do / In progress / Done*, una tarjeta por tarea o funcionalidad.
- **Sprints cortos** con objetivos diarios, autoevaluados al cierre de cada uno.
- Uso de **ramas** (como `deployPages`) y **commits** organizados para separar el desarrollo del despliegue.

## Aprendizajes y retos

- Desempeñar los tres roles (Product Owner, Scrum Master y Developer) ayudó a entender mejor cómo se reparte el trabajo y la responsabilidad en un equipo real.
- Integrar `json-server` como API simulada permitió practicar el consumo de una API REST sin necesidad de un backend completo.
- Implementar el **drag & drop** entre columnas y mantener sincronizado el estado de las tareas con la base de datos simulada.
- Preparar el despliegue en **GitHub Pages** usando una rama dedicada (`deployPages`) y el archivo `.nojekyll`. Usando Render.com para la parte del Backend simulado json-server.
- Organizarme de manera individual y tomar todas las decisiones fue fuente de errores y cuellos de botella.

---

Proyecto realizado con fines educativos.
