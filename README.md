# GreenBin Panel Web — Angular 17

Panel de administración y monitoreo del sistema inteligente de gestión de residuos GreenBin v2.0.

---

## Requisitos

- Node.js 18+
- Angular CLI 17: `npm install -g @angular/cli`

---

## Instalación y ejecución

```bash
# 1. Instalar dependencias
cd greenbin-angular
npm install

# 2. Servidor de desarrollo (http://localhost:4200)
ng serve

# 3. Build de producción
ng build --configuration production
```

---

## Estructura del proyecto

```
src/app/
├── core/
│   ├── models.ts              # Interfaces y tipos del dominio
│   └── greenbin.service.ts    # Servicio de datos (mock → reemplazar con API real)
│
├── shared/
│   ├── navbar/                # Barra de navegación global
│   └── metric-card/           # Tarjeta de métrica reutilizable
│
├── features/
│   ├── dashboard/             # Vista principal con métricas y logs
│   ├── dispositivos/          # Gestión de hardware Raspberry Pi
│   ├── clasificador/          # Stream en tiempo real + resultados
│   └── info/                  # Información del proyecto y equipo
│
├── app.component.ts           # Shell principal (navbar + router-outlet)
├── app.routes.ts              # Rutas lazy-loaded
└── app.config.ts              # Providers: router, HttpClient, animations
```

---

## Conectar con el backend (FastAPI)

El archivo `greenbin.service.ts` tiene comentarios indicando exactamente dónde reemplazar los datos mock por llamadas reales.

### API REST
```typescript
// En greenbin.service.ts — reemplazar of({...}) por:
return this.http.get<MetricasGenerales>(`${environment.apiUrl}/metricas`);
```

### WebSocket (stream del clasificador)
```typescript
// En greenbin.service.ts — método streamClasificador():
const ws = new WebSocket(`ws://${HOST}/ws/clasificador`);
return new Observable(obs => {
  ws.onmessage = e => obs.next(JSON.parse(e.data) as FrameClasificacion);
  ws.onerror   = e => obs.error(e);
  return () => ws.close();
});
```

### Esquema del mensaje WebSocket esperado:
```json
{
  "categoria": "organico",
  "confianza": 0.87,
  "estado": "seguro",
  "timestamp": "2026-05-28T10:42:00Z"
}
```

---

## Backend FastAPI sugerido

```python
# main.py — FastAPI + WebSocket
from fastapi import FastAPI, WebSocket
from demo_webcam import inferir_frame   # tu módulo Python
import asyncio, json

app = FastAPI()

@app.websocket("/ws/clasificador")
async def ws_clasificador(websocket: WebSocket):
    await websocket.accept()
    while True:
        resultado = inferir_frame()   # llama a tu demo_webcam.py
        await websocket.send_json(resultado)
        await asyncio.sleep(0.5)     # ~2 fps

@app.get("/metricas")
def get_metricas():
    return { "clasificacionesHoy": 247, ... }

@app.get("/clasificaciones")
def get_clasificaciones(limit: int = 10):
    return db.query_ultimas(limit)
```

```bash
pip install fastapi uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

---

## Variables de entorno

Crea `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000',
  wsUrl:  'ws://localhost:8000'
};
```

---

## Tecnologías

| Capa        | Tecnología                  |
|-------------|------------------------------|
| Frontend    | Angular 17 · TypeScript 5.2 |
| Estilos     | SCSS · Variables CSS         |
| Iconos      | Tabler Icons (webfont)       |
| Fuentes     | DM Sans + DM Mono (Google)   |
| Backend     | FastAPI (Python)             |
| IA          | PyTorch · ResNet18           |
| Hardware    | Raspberry Pi 4 · 4 GB RAM    |
| Normativa   | Resolución 2184 de 2019      |

---

## Autores - Semillero FetSociety — FET Neiva, 2026


- Juan Felipe Bahamon Castillo
- José Eduar Ramírez Cardona
- Santiago Tovar Vargas

Tutora: Viviana Muñoz Álvarez

## Repositorio relacionado

Este panel web se conecta al módulo de IA desarrollado por el equipo:

🔗 [GreenBin Vs 2.0 — Módulo IA (Python)](https://github.com/Jose-ramirez-ux/Greenbin-Vs-2.0)

> Contiene `entrenar.py`, `demo_webcam.py`, `fewshot_desde_imagenes.py` y el modelo `greenbin_resnet18.pt`.
