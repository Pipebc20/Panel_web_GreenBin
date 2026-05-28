import { Injectable } from '@angular/core';
import { Observable, of, interval, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Dispositivo, Clasificacion, MetricasDia,
  MetricasGenerales, FrameClasificacion,
  CategoriaResiduo, CATEGORIAS
} from './models';

// ─────────────────────────────────────────────────────────────────────────────
// GreenBinService
//
// En producción, reemplaza los métodos mock por llamadas HttpClient:
//   this.http.get<Clasificacion[]>(`${API_URL}/clasificaciones`)
//
// El método streamClasificador() debería conectarse al WebSocket de FastAPI:
//   new WebSocket(`ws://${HOST}/ws/clasificador`)
// ─────────────────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class GreenBinService {

  // ── Datos mock de dispositivos ──────────────────────────────────────────────
  private _dispositivos: Dispositivo[] = [
    {
      id: 'gb-01',
      nombre: 'GreenBin-01',
      ubicacion: 'Cafetería — Piso 1',
      estado: 'online',
      clasificacionesHoy: 112,
      confianzaPromedio: 0.86,
      ip: '192.168.1.101',
      modelo: 'resnet18',
      umbral: 0.70
    },
    {
      id: 'gb-02',
      nombre: 'GreenBin-02',
      ubicacion: 'Biblioteca — Piso 2',
      estado: 'online',
      clasificacionesHoy: 89,
      confianzaPromedio: 0.82,
      ip: '192.168.1.102',
      modelo: 'resnet18',
      umbral: 0.70
    },
    {
      id: 'gb-03',
      nombre: 'GreenBin-03',
      ubicacion: 'Bloque administrativo',
      estado: 'online',
      clasificacionesHoy: 46,
      confianzaPromedio: 0.79,
      ip: '192.168.1.103',
      modelo: 'fewshot',
      umbral: 0.55
    }
  ];

  private _dispositivosSubject = new BehaviorSubject<Dispositivo[]>(this._dispositivos);

  // ── Métodos de dispositivos ─────────────────────────────────────────────────
  getDispositivos(): Observable<Dispositivo[]> {
    return this._dispositivosSubject.asObservable();
  }

  agregarDispositivo(d: Omit<Dispositivo, 'id' | 'clasificacionesHoy' | 'confianzaPromedio'>): void {
    const nuevo: Dispositivo = {
      ...d,
      id: `gb-0${this._dispositivos.length + 1}`,
      clasificacionesHoy: 0,
      confianzaPromedio: 0
    };
    this._dispositivos = [...this._dispositivos, nuevo];
    this._dispositivosSubject.next(this._dispositivos);
  }

  // ── Métricas generales ──────────────────────────────────────────────────────
  getMetricas(): Observable<MetricasGenerales> {
    return of({
      clasificacionesHoy: 247,
      variacionVsAyer: 12,
      confianzaPromedio: 0.84,
      dispositivosActivos: 3,
      dispositivosTotal: 3,
      prediccionesDudosas: 18,
      pctDudosas: 7
    });
  }

  // ── Historial semanal ───────────────────────────────────────────────────────
  getHistorialSemanal(): Observable<MetricasDia[]> {
    const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const totales = [182, 210, 195, 230, 247, 140, 88];
    return of(dias.map((fecha, i) => ({
      fecha,
      total: totales[i],
      organico: Math.round(totales[i] * 0.38),
      aprovechable: Math.round(totales[i] * 0.45),
      noAprovechable: Math.round(totales[i] * 0.17)
    })));
  }

  // ── Últimas clasificaciones ─────────────────────────────────────────────────
  getUltimasClasificaciones(limit = 8): Observable<Clasificacion[]> {
    const cats: CategoriaResiduo[] = ['organico', 'aprovechable', 'no_aprovechable'];
    const hoy = new Date();
    const logs: Clasificacion[] = Array.from({ length: limit }, (_, i) => {
      const cat = cats[i % 3];
      const conf = 0.62 + Math.random() * 0.35;
      const t = new Date(hoy.getTime() - i * 4 * 60000);
      return {
        id: `log-${i}`,
        timestamp: t,
        dispositivoId: `gb-0${(i % 3) + 1}`,
        dispositivoNombre: `GreenBin-0${(i % 3) + 1}`,
        categoria: cat,
        confianza: conf,
        estado: conf >= 0.70 ? 'seguro' : 'dudoso'
      };
    });
    return of(logs);
  }

  // ── Stream del clasificador en tiempo real ──────────────────────────────────
  // Simula frames cada 2.5s; en producción conectar a WebSocket de FastAPI:
  //   const ws = new WebSocket('ws://localhost:8000/ws/clasificador');
  //   return new Observable(obs => {
  //     ws.onmessage = e => obs.next(JSON.parse(e.data));
  //     ws.onerror   = e => obs.error(e);
  //     return () => ws.close();
  //   });
  streamClasificador(): Observable<FrameClasificacion> {
    const cats: CategoriaResiduo[] = ['organico', 'aprovechable', 'no_aprovechable'];
    let idx = 0;
    return interval(2500).pipe(
      map(() => {
        const cat = cats[idx++ % cats.length];
        const conf = 0.60 + Math.random() * 0.38;
        return {
          categoria: cat,
          confianza: conf,
          estado: (conf >= 0.70 ? 'seguro' : 'dudoso') as 'seguro' | 'dudoso',
          timestamp: new Date()
        };
      })
    );
  }
}
