# Hojas de Personaje — D&D 5.5e (2024)

Webapp para gestionar las hojas de personaje de tu grupo de juego. Cada
jugador crea y edita su propia hoja; el DM tiene un panel donde ve a
todo el grupo centralizado en tiempo real. Publicable gratis en
GitHub Pages.

## Stack

- **Frontend:** React + Vite → GitHub Pages
- **Backend:** Firebase (Auth + Firestore) — capa gratuita, tiempo real
- **Datos de reglas:** SRD 5.2.1 de D&D (2024), licencia **CC-BY-4.0**,
  traducidos automáticamente al español con un script propio

### ¿Por qué SRD y no el JSON completo de 5etools?

El repositorio de datos de 5etools incluye contenido con copyright de
Wizards of the Coast que va más allá de lo que la licencia SRD permite
redistribuir. Para poder publicar este proyecto (y sus datos
traducidos) abiertamente en GitHub sin problemas legales, esta app usa
como fuente el **SRD 5.2.1**, liberado oficialmente por WotC bajo
CC-BY-4.0 (podés traducirlo, redistribuirlo y modificarlo, siempre
dando atribución). Cubre clases, especies, trasfondos, +500 hechizos,
objetos mágicos y el bestiario básico — de sobra para hojas de
personaje jugables.

Si más adelante querés sumar contenido de un libro específico que ya
compraste, podés agregarlo manualmalmente a `src/data/en/` respetando
el mismo formato (para uso privado en tu propia mesa, no para
redistribuir públicamente).

## Puesta en marcha

### 1. Cloná e instalá

```bash
npm install
cp .env.example .env.local
```

### 2. Creá un proyecto de Firebase

1. Andá a https://console.firebase.google.com → "Agregar proyecto"
2. Dentro del proyecto: **Authentication** → habilitá el proveedor
   "Google"
3. **Firestore Database** → creá la base (modo producción)
4. **Configuración del proyecto** → "Tus apps" → agregá una app web →
   copiá las claves a tu `.env.local`
5. Subí las reglas de seguridad: pegá el contenido de `firestore.rules`
   en Firestore Database → Reglas → Publicar

### 3. Corré en local

```bash
npm run dev
```

### 4. (Opcional) Traducí más hechizos/objetos

El repo ya trae 3 hechizos de muestra traducidos en
`src/data/es/spells.json` para que la app funcione desde el primer
momento. Para traducir el resto del SRD:

1. Conseguí el SRD 5.2.1 en formato estructurado (por ejemplo desde
   [downfallx/dnd-5e-srd-markdown](https://github.com/downfallx/dnd-5e-srd-markdown)
   o pasando el PDF/markdown oficial por un parser) y convertilo al
   formato `{ name, level, school, description, source }` en
   `src/data/en/spells.json`
2. Conseguí una API key gratis de [DeepL](https://www.deepl.com/pro-api)
   (500.000 caracteres/mes gratis) y ponela en `.env.local`
3. Corré:

   ```bash
   npm run translate
   ```

### 5. Publicá en GitHub Pages

1. Cambiá `base: '/nombre-del-repo/'` en `vite.config.js` por el
   nombre real de tu repositorio
2. En GitHub: **Settings → Pages → Source → GitHub Actions**
3. En **Settings → Secrets and variables → Actions**, cargá las mismas
   6 variables `VITE_FIREBASE_*` de tu `.env.local` como secrets
4. Hacé push a `main` — el workflow `.github/workflows/deploy.yml`
   compila y publica solo

## Cómo se usa

1. El DM entra, inicia sesión, y en "Mi hoja" crea una campaña nueva →
   obtiene un código de invitación
2. Cada jugador inicia sesión y se une con ese código
3. Cada uno completa su hoja (stats, PV, hechizos, inventario) — se
   guarda solo, en tiempo real
4. El DM va a "Panel del DM" y ve el estado de todo el grupo

## Estructura del proyecto

```
src/
  components/     → UI (hoja de personaje, panel DM, selector de hechizos…)
  context/        → Auth y estado de campaña compartidos
  data/en/        → Datos de origen (SRD, inglés)
  data/es/        → Datos traducidos (generados por scripts/translate-data.js)
  firebase.js     → Config e inicialización de Firebase
scripts/
  translate-data.js → Pipeline de traducción automática
firestore.rules  → Reglas de seguridad (quién puede leer/escribir qué)
```

## Próximos pasos sugeridos

- Sumar más datasets (trasfondos, especies, objetos, condiciones) con
  el mismo patrón `en/` → `translate` → `es/`
- Cálculo automático de modificadores, CD de salvación y bonif. de
  competencia a partir del nivel
- Exportar la hoja a PDF
- Editor de fichas de monstruos para el DM (encuentros)
