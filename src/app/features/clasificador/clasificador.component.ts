import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, PercentPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { GreenBinService } from '../../core/greenbin.service';
import { FrameClasificacion, CATEGORIAS, CategoriaInfo } from '../../core/models';

@Component({
  selector: 'gb-clasificador',
  standalone: true,
  imports: [CommonModule, PercentPipe],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Clasificador en tiempo real</h1>
        <p class="page-sub">Visualización del módulo de visión artificial — demo simulado</p>
      </div>
      <div class="stream-status" [class.stream-status--active]="activo">
        <span class="status-dot"></span>
        {{ activo ? 'Stream activo' : 'Stream detenido' }}
      </div>
    </div>

    <div class="clasificador-grid">
      <!-- Panel de cámara -->
      <div class="card cam-card">
        <div class="cam-preview" [ngClass]="'cam-bg-' + (frame?.categoria ?? 'idle')">
          <div class="cam-crosshair">
            <div class="crosshair-box" [class.crosshair-ok]="frame?.estado === 'seguro'"
                                       [class.crosshair-warn]="frame?.estado === 'dudoso'">
            </div>
          </div>
          <div class="cam-overlay" *ngIf="!activo">
            <i class="ti ti-camera-off"></i>
            <p>Stream detenido</p>
            <button class="btn-start" (click)="iniciar()">
              <i class="ti ti-player-play"></i> Iniciar stream
            </button>
          </div>
          <div class="cam-badge" *ngIf="frame && activo">
            <i class="ti ti-camera"></i> LIVE
          </div>
        </div>

        <div class="result-panel" *ngIf="frame">
          <div class="result-row">
            <div class="result-categoria" [ngClass]="'result-' + frame.categoria">
              <div class="cat-dot" [style.background]="getCatColor(frame.categoria)"></div>
              {{ getCatLabel(frame.categoria) }}
            </div>
            <div class="result-conf"
                 [class.conf-ok]="frame.estado === 'seguro'"
                 [class.conf-warn]="frame.estado === 'dudoso'">
              {{ frame.confianza | percent:'1.0-0' }}
            </div>
          </div>

          <div class="caneca-recomendada" [ngClass]="'caneca-' + frame.categoria">
            <div class="caneca-dot" [style.background]="getCatColor(frame.categoria)"></div>
            <div>
              <div class="caneca-label">Depositar en:</div>
              <div class="caneca-nombre">{{ getCaneca(frame.categoria) }}</div>
            </div>
            <div class="estado-badge" [class.badge-ok]="frame.estado === 'seguro'"
                                      [class.badge-warn]="frame.estado === 'dudoso'">
              {{ frame.estado === 'seguro' ? 'SEGURO' : 'DUDOSO' }}
            </div>
          </div>

          <div class="conf-bar-wrap">
            <div class="conf-bar-track">
              <div class="conf-bar-fill"
                   [style.width.%]="frame.confianza * 100"
                   [class.fill-ok]="frame.estado === 'seguro'"
                   [class.fill-warn]="frame.estado === 'dudoso'">
              </div>
              <div class="conf-threshold-mark" [style.left.%]="70"></div>
            </div>
            <div class="conf-bar-labels">
              <span>0%</span>
              <span class="threshold-label">umbral 70%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        <div class="cam-controls">
          <button class="btn-ctrl btn-ctrl--stop" *ngIf="activo" (click)="detener()">
            <i class="ti ti-player-stop"></i> Detener
          </button>
          <button class="btn-ctrl btn-ctrl--start" *ngIf="!activo" (click)="iniciar()">
            <i class="ti ti-player-play"></i> Iniciar
          </button>
          <span class="ws-hint">
            <i class="ti ti-info-circle"></i>
            Conectar WebSocket: <code>ws://host:8000/ws/clasificador</code>
          </span>
        </div>
      </div>

      <!-- Panel lateral -->
      <div class="side-panel">
        <!-- Código de colores -->
        <div class="card">
          <div class="card-header">
            <i class="ti ti-palette"></i>
            Código de colores — Res. 2184/2019
          </div>
          <div class="color-codes">
            <div class="color-code-item" *ngFor="let cat of categorias"
                 [class.active]="frame?.categoria === cat.id">
              <div class="color-swatch" [style.background]="cat.color"></div>
              <div class="color-info">
                <div class="color-caneca">{{ cat.caneca }}</div>
                <div class="color-label">{{ cat.label }}</div>
              </div>
              <i class="ti ti-check" *ngIf="frame?.categoria === cat.id"></i>
            </div>
          </div>
        </div>

        <!-- Historial de la sesión -->
        <div class="card">
          <div class="card-header">
            <i class="ti ti-list"></i>
            Historial de sesión
            <span class="history-count">{{ historial.length }}</span>
          </div>
          <div class="history-list">
            <div class="history-item" *ngFor="let h of historial.slice().reverse().slice(0, 6)">
              <div class="h-dot" [style.background]="getCatColor(h.categoria)"></div>
              <div class="h-label">{{ getCatLabel(h.categoria) }}</div>
              <div class="h-conf" [class.h-ok]="h.estado === 'seguro'" [class.h-warn]="h.estado === 'dudoso'">
                {{ h.confianza | percent:'1.0-0' }}
              </div>
            </div>
            <div class="history-empty" *ngIf="historial.length === 0">
              <i class="ti ti-clock"></i> Sin clasificaciones aún
            </div>
          </div>
        </div>

        <!-- Stats de sesión -->
        <div class="card">
          <div class="card-header">
            <i class="ti ti-chart-bar"></i>
            Estadísticas de sesión
          </div>
          <div class="session-stats">
            <div class="ss-row">
              <span class="ss-label">Total clasificados</span>
              <span class="ss-val">{{ historial.length }}</span>
            </div>
            <div class="ss-row">
              <span class="ss-label">Confianza promedio</span>
              <span class="ss-val">{{ confPromedio | percent:'1.0-0' }}</span>
            </div>
            <div class="ss-row">
              <span class="ss-label">Predicciones seguras</span>
              <span class="ss-val" style="color:var(--green)">{{ seguros }}</span>
            </div>
            <div class="ss-row">
              <span class="ss-label">Predicciones dudosas</span>
              <span class="ss-val" style="color:#f57c00">{{ dudosos }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex; align-items: flex-start;
      justify-content: space-between; margin-bottom: 24px; gap: 16px;
    }
    .page-title { font-size: 22px; font-weight: 600; color: var(--text-primary); }
    .page-sub   { font-size: 13px; color: var(--text-muted); margin-top: 2px; }
    .stream-status {
      display: flex; align-items: center; gap: 7px;
      font-size: 12px; padding: 5px 12px; border-radius: 99px;
      border: 1px solid var(--border); color: var(--text-muted);
      white-space: nowrap;
    }
    .stream-status--active { background: var(--green-light); color: var(--green-dark); border-color: var(--green); }
    .status-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
    .stream-status--active .status-dot { animation: pulse 1.5s ease-in-out infinite; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

    .clasificador-grid {
      display: grid; grid-template-columns: 1fr 340px; gap: 16px;
    }
    .card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 14px; padding: 20px; margin-bottom: 14px;
    }
    .cam-card { padding: 0; overflow: hidden; margin-bottom: 0; }
    .card-header {
      display: flex; align-items: center; gap: 8px;
      font-size: 14px; font-weight: 500; color: var(--text-primary); margin-bottom: 14px;
    }
    .card-header i { font-size: 16px; color: var(--text-muted); }

    /* Cámara */
    .cam-preview {
      height: 280px; position: relative;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.4s ease;
    }
    .cam-bg-idle          { background: #1a1a18; }
    .cam-bg-organico      { background: #0a2e1e; }
    .cam-bg-aprovechable  { background: #1a1a18; }
    .cam-bg-no_aprovechable{ background: #1a1a18; }
    .cam-crosshair { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
    .crosshair-box {
      width: 160px; height: 160px; border-radius: 12px;
      border: 2px solid rgba(255,255,255,0.3);
      transition: border-color 0.3s, box-shadow 0.3s;
    }
    .crosshair-ok   { border-color: var(--green); box-shadow: 0 0 20px rgba(29,158,117,0.3); }
    .crosshair-warn { border-color: #f57c00; box-shadow: 0 0 20px rgba(245,124,0,0.3); }
    .cam-overlay {
      position: absolute; inset: 0;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 12px; background: rgba(0,0,0,0.7); color: #fff;
    }
    .cam-overlay i { font-size: 36px; opacity: 0.6; }
    .cam-overlay p { font-size: 14px; opacity: 0.7; }
    .btn-start {
      display: flex; align-items: center; gap: 6px;
      font-size: 13px; padding: 8px 20px; border-radius: 8px;
      background: var(--green); color: #fff; border: none; cursor: pointer; font-weight: 500;
    }
    .cam-badge {
      position: absolute; top: 12px; left: 12px;
      background: rgba(229, 57, 53, 0.9); color: #fff;
      font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 4px;
      display: flex; align-items: center; gap: 5px;
    }
    .cam-badge i { font-size: 10px; }

    /* Resultado */
    .result-panel { padding: 16px 20px; border-top: 1px solid var(--border); }
    .result-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .result-categoria { display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 600; color: var(--text-primary); }
    .cat-dot { width: 12px; height: 12px; border-radius: 50%; }
    .result-conf { font-size: 22px; font-weight: 600; }
    .conf-ok   { color: var(--green); }
    .conf-warn { color: #f57c00; }

    .caneca-recomendada {
      display: flex; align-items: center; gap: 12px; padding: 12px 14px;
      border-radius: 10px; margin-bottom: 12px;
    }
    .caneca-organico        { background: var(--green-light); }
    .caneca-aprovechable    { background: var(--surface-hover); }
    .caneca-no_aprovechable { background: #f1efe8; }
    .caneca-dot { width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0; }
    .caneca-label { font-size: 11px; color: var(--text-muted); }
    .caneca-nombre { font-size: 14px; font-weight: 600; color: var(--text-primary); }
    .estado-badge {
      margin-left: auto; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px;
    }
    .badge-ok   { background: var(--green); color: #fff; }
    .badge-warn { background: #f57c00; color: #fff; }

    .conf-bar-wrap { }
    .conf-bar-track {
      height: 8px; background: var(--surface-hover); border-radius: 99px;
      position: relative; overflow: visible;
    }
    .conf-bar-fill { height: 100%; border-radius: 99px; transition: width 0.4s ease; }
    .fill-ok   { background: var(--green); }
    .fill-warn { background: #f57c00; }
    .conf-threshold-mark {
      position: absolute; top: -3px; width: 2px; height: 14px;
      background: var(--text-muted); border-radius: 1px;
    }
    .conf-bar-labels {
      display: flex; justify-content: space-between; font-size: 10px; color: var(--text-muted); margin-top: 4px;
    }
    .threshold-label { color: var(--text-muted); }

    .cam-controls {
      display: flex; align-items: center; gap: 12px;
      padding: 14px 20px; border-top: 1px solid var(--border);
    }
    .btn-ctrl {
      display: flex; align-items: center; gap: 6px;
      font-size: 13px; padding: 8px 16px; border-radius: 8px;
      border: none; cursor: pointer; font-weight: 500; font-family: inherit;
    }
    .btn-ctrl--start { background: var(--green); color: #fff; }
    .btn-ctrl--stop  { background: var(--surface-hover); color: var(--text-primary); border: 1px solid var(--border); }
    .ws-hint { font-size: 11px; color: var(--text-muted); }
    .ws-hint code { font-family: var(--font-mono, monospace); background: var(--surface-hover); padding: 1px 4px; border-radius: 4px; }

    /* Panel lateral */
    .side-panel .card { border-radius: 12px; }
    .color-codes { display: flex; flex-direction: column; gap: 8px; }
    .color-code-item {
      display: flex; align-items: center; gap: 10px; padding: 10px;
      border-radius: 8px; border: 1px solid var(--border); transition: background 0.2s;
    }
    .color-code-item.active { background: var(--green-light); border-color: var(--green); }
    .color-swatch { width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0; }
    .color-caneca { font-size: 13px; font-weight: 500; color: var(--text-primary); }
    .color-label { font-size: 11px; color: var(--text-muted); }
    .color-code-item .ti-check { margin-left: auto; color: var(--green); font-size: 16px; }

    .history-count {
      margin-left: auto; font-size: 11px; font-weight: 500;
      background: var(--surface-hover); color: var(--text-muted);
      padding: 2px 8px; border-radius: 99px;
    }
    .history-list { display: flex; flex-direction: column; gap: 6px; }
    .history-item { display: flex; align-items: center; gap: 8px; font-size: 12px; }
    .h-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .h-label { flex: 1; color: var(--text-primary); }
    .h-conf { font-weight: 500; }
    .h-ok   { color: var(--green); }
    .h-warn { color: #f57c00; }
    .history-empty { font-size: 12px; color: var(--text-muted); display: flex; align-items: center; gap: 6px; }

    .session-stats { display: flex; flex-direction: column; gap: 0; }
    .ss-row { display: flex; justify-content: space-between; align-items: center; padding: 9px 0; border-bottom: 1px solid var(--border); font-size: 13px; }
    .ss-row:last-child { border-bottom: none; }
    .ss-label { color: var(--text-muted); }
    .ss-val { font-weight: 600; color: var(--text-primary); }

    @media (max-width: 900px) {
      .clasificador-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ClasificadorComponent implements OnInit, OnDestroy {
  frame: FrameClasificacion | null = null;
  historial: FrameClasificacion[] = [];
  activo = false;
  categorias = CATEGORIAS;

  private sub?: Subscription;

  constructor(private svc: GreenBinService) {}

  ngOnInit(): void { this.iniciar(); }
  ngOnDestroy(): void { this.detener(); }

  iniciar(): void {
    this.activo = true;
    this.sub = this.svc.streamClasificador().subscribe(f => {
      this.frame = f;
      this.historial.push(f);
    });
  }

  detener(): void {
    this.activo = false;
    this.sub?.unsubscribe();
  }

  getCatLabel(id: string): string { return CATEGORIAS.find(c => c.id === id)?.label ?? id; }
  getCatColor(id: string): string { return CATEGORIAS.find(c => c.id === id)?.color ?? '#888'; }
  getCaneca(id: string): string   { return CATEGORIAS.find(c => c.id === id)?.caneca ?? ''; }

  get confPromedio(): number {
    if (!this.historial.length) return 0;
    return this.historial.reduce((s, h) => s + h.confianza, 0) / this.historial.length;
  }
  get seguros(): number  { return this.historial.filter(h => h.estado === 'seguro').length; }
  get dudosos(): number  { return this.historial.filter(h => h.estado === 'dudoso').length; }
}
