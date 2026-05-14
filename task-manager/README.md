# HomeTasks — Ana & Jhon 🏠

Dashboard PWA para gestionar las tareas del hogar, sincronizado en tiempo real vía Supabase.

## Stack
- React 18 + Vite
- Supabase (base de datos + realtime)
- vite-plugin-pwa (instalable en Android/iOS)
- date-fns
- Vercel (deploy)

## Deploy en Vercel

### Opción 1 — Vercel CLI (recomendado)
```bash
npm install
npx vercel --prod
```

### Opción 2 — GitHub + Vercel Dashboard
1. Sube este proyecto a GitHub
2. En vercel.com → New Project → importa el repo
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Deploy ✅

## Instalar como PWA
- **Android**: Abre la URL en Chrome → menú ⋮ → "Instalar app"
- **iOS**: Abre en Safari → compartir → "Agregar a pantalla de inicio"

## Base de datos
Ya está configurada en Supabase (oflpvhcwevfdfovqbkop.supabase.co).
Tablas: `tasks`, `task_completions`, `streaks`

## Features
- ✅ Tareas de hoy con progreso visual
- ✅ Marcar completada con un tap
- ✅ Estado "No puedo" con nota
- ✅ Delegar al otro
- ✅ Notas en cada tarea
- ✅ Rachas de días seguidos 🔥
- ✅ Sincronización en tiempo real
- ✅ PWA instalable
- ✅ 24 tareas precargadas (diarias, semanales, quincenales, mensuales, bimestrales)
