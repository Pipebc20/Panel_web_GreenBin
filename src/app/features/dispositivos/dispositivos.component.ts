import { Component, OnInit } from '@angular/core';
import { CommonModule, PercentPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GreenBinService } from '../../core/greenbin.service';
import { Dispositivo, EstadoDispositivo } from '../../core/models';

@Component({
  selector: 'gb-dispositivos',
  standalone: true,
  imports: [CommonModule, FormsModule, PercentPipe],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Dispositivos</h1>
        <p class="page-sub">Gestiona los módulos GreenBin instalados en el campus FET</p>
      </div>
      <button class="btn-primary" (click)="mostrarFormulario = !mostrarFormulario">
        <i class="ti ti-plus"></i>
        {{ mostrarFormulario ? 'Cancelar' : 'Nuevo dispositivo' }}
      </button>
    </div>

    <!-- Formulario de nuevo dispositivo -->
    <div class="card form-card" *ngIf="mostrarFormulario">
      <div class="card-header">
        <i class="ti ti-plus-circle"></i>
        Registrar nuevo dispositivo
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Nombre del dispositivo</label>
          <input [(ngModel)]="nuevoDispositivo.nombre" placeholder="GreenBin-04" />
        </div>
        <div class="form-group">
          <label>Ubicación en el campus</label>
          <input [(ngModel)]="nuevoDispositivo.ubicacion" placeholder="Ej: Aula 201 — Bloque B" />
        </div>
        <div class="form-group">
          <label>Dirección IP</label>
          <input [(ngModel)]="nuevoDispositivo.ip" placeholder="192.168.1.104" />
        </div>
        <div class="form-group">
          <label>Modo de clasificación</label>
          <select [(ngModel)]="nuevoDispositivo.modelo">
            <option value="resnet18">ResNet18 — Transfer Learning</option>
            <option value="fewshot">Few-Shot — Similitud coseno</option>
          </select>
        </div>
        <div class="form-group form-group--full">
          <label>Umbral de confianza: <strong>{{ nuevoDispositivo.umbral | percent }}</strong></label>
          <input type="range" min="0.50" max="0.95" step="0.05"
                 [(ngModel)]="nuevoDispositivo.umbral" />
          <div class="range-hints">
            <span>50% (permisivo)</span>
            <span>95% (estricto)</span>
          </div>
        </div>
      </div>
      <div class="form-actions">
        <button class="btn-secondary" (click)="mostrarFormulario = false">Cancelar</button>
        <button class="btn-primary" (click)="agregar()">
          <i class="ti ti-device-floppy"></i> Registrar dispositivo
        </button>
      </div>
    </div>

    <!-- Lista de dispositivos -->
    <div class="devices-grid">
      <div class="device-card" *ngFor="let d of dispositivos">
        <div class="device-card-header">
          <div class="device-title-row">
            <div class="device-status-dot" [class]="'dot-' + d.estado"></div>
            <h3 class="device-name">{{ d.nombre }}</h3>
          </div>
          <span class="estado-badge" [ngClass]="'badge-' + d.estado">
            {{ estadoLabel(d.estado) }}
          </span>
        </div>

        <div class="device-meta">
          <div class="meta-row">
            <i class="ti ti-map-pin"></i>
            <span>{{ d.ubicacion }}</span>
          </div>
          <div class="meta-row" *ngIf="d.ip">
            <i class="ti ti-network"></i>
            <span class="mono">{{ d.ip }}</span>
          </div>
          <div class="meta-row">
            <i class="ti ti-cpu"></i>
            <span>{{ modeloLabel(d.modelo) }}</span>
          </div>
        </div>

        <div class="device-stats-row">
          <div class="stat-box">
            <div class="stat-label">Hoy</div>
            <div class="stat-val">{{ d.clasificacionesHoy }}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Conf. prom.</div>
            <div class="stat-val">{{ d.confianzaPromedio | percent:'1.0-0' }}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Umbral</div>
            <div class="stat-val">{{ d.umbral | percent }}</div>
          </div>
        </div>

        <div class="conf-track">
          <div class="conf-fill-bar"
               [style.width.%]="d.confianzaPromedio * 100"
               [style.background]="d.confianzaPromedio >= d.umbral ? 'var(--green)' : '#f57c00'">
          </div>
        </div>
      </div>
    </div>

    <!-- Sección de configuración global -->
    <div class="card config-card">
      <div class="card-header">
        <i class="ti ti-settings"></i>
        Configuración del modelo — ResNet18
      </div>
      <div class="config-info">
        <div class="config-item">
          <div class="config-key">Arquitectura base</div>
          <div class="config-val">ResNet18 pretrained (ImageNet)</div>
        </div>
        <div class="config-item">
          <div class="config-key">Data augmentation</div>
          <div class="config-val">ColorJitter · RandomHorizontalFlip · RandomRotation(10°)</div>
        </div>
        <div class="config-item">
          <div class="config-key">Optimizador</div>
          <div class="config-val code">Adam (lr=1e-3) — ReduceLROnPlateau</div>
        </div>
        <div class="config-item">
          <div class="config-key">Split entrenamiento</div>
          <div class="config-val">85% train / 15% validación</div>
        </div>
        <div class="config-item">
          <div class="config-key">Épocas</div>
          <div class="config-val">10 (selección automática por val_loss)</div>
        </div>
        <div class="config-item">
          <div class="config-key">Hardware objetivo</div>
          <div class="config-val">Raspberry Pi 4 · 4 GB RAM</div>
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

    .btn-primary {
      display: flex; align-items: center; gap: 7px;
      font-size: 13px; padding: 9px 18px; border-radius: 9px;
      background: var(--green); color: #fff; border: none; cursor: pointer;
      font-weight: 500; transition: background 0.15s; white-space: nowrap;
    }
    .btn-primary:hover { background: var(--green-dark); }
    .btn-secondary {
      font-size: 13px; padding: 9px 18px; border-radius: 9px;
      background: none; color: var(--text-muted); border: 1px solid var(--border);
      cursor: pointer; transition: background 0.15s;
    }
    .btn-secondary:hover { background: var(--surface-hover); }

    .card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 14px; padding: 20px; margin-bottom: 20px;
    }
    .card-header {
      display: flex; align-items: center; gap: 8px;
      font-size: 14px; font-weight: 500; color: var(--text-primary);
      margin-bottom: 18px;
    }
    .card-header i { font-size: 16px; color: var(--text-muted); }

    /* Formulario */
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group--full { grid-column: 1 / -1; }
    .form-group label { font-size: 12px; font-weight: 500; color: var(--text-muted); }
    .form-group input,
    .form-group select {
      font-size: 13px; padding: 8px 12px; border-radius: 8px;
      border: 1px solid var(--border); background: var(--bg);
      color: var(--text-primary); outline: none; font-family: inherit;
    }
    .form-group input:focus,
    .form-group select:focus { border-color: var(--green); }
    .form-group input[type=range] { padding: 4px 0; border: none; background: none; cursor: pointer; }
    .range-hints { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); }
    .form-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 18px; }

    /* Grid de dispositivos */
    .devices-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 14px; margin-bottom: 20px;
    }
    .device-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 14px; padding: 18px; display: flex; flex-direction: column; gap: 14px;
      transition: box-shadow 0.15s;
    }
    .device-card:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
    .device-card-header { display: flex; align-items: center; justify-content: space-between; }
    .device-title-row { display: flex; align-items: center; gap: 8px; }
    .device-status-dot { width: 9px; height: 9px; border-radius: 50%; }
    .dot-online  { background: var(--green); }
    .dot-offline { background: #e24b4a; }
    .dot-warning { background: #f57c00; }
    .device-name { font-size: 15px; font-weight: 600; color: var(--text-primary); }
    .estado-badge {
      font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 99px;
    }
    .badge-online  { background: var(--green-light); color: var(--green-dark); }
    .badge-offline { background: #fde8e8; color: #a32d2d; }
    .badge-warning { background: #fff3e0; color: #e65100; }
    .device-meta { display: flex; flex-direction: column; gap: 6px; }
    .meta-row { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-muted); }
    .meta-row i { font-size: 13px; }
    .mono { font-family: var(--font-mono, monospace); }
    .device-stats-row { display: flex; gap: 8px; }
    .stat-box {
      flex: 1; background: var(--bg); border: 1px solid var(--border);
      border-radius: 8px; padding: 8px 10px; text-align: center;
    }
    .stat-label { font-size: 10px; color: var(--text-muted); }
    .stat-val { font-size: 16px; font-weight: 600; color: var(--text-primary); }
    .conf-track { height: 4px; background: var(--surface-hover); border-radius: 99px; overflow: hidden; }
    .conf-fill-bar { height: 100%; border-radius: 99px; transition: width 0.5s ease; }

    /* Configuración */
    .config-info { display: flex; flex-direction: column; gap: 0; }
    .config-item {
      display: flex; align-items: flex-start; gap: 12px; padding: 10px 0;
      border-bottom: 1px solid var(--border);
    }
    .config-item:last-child { border-bottom: none; }
    .config-key { font-size: 12px; color: var(--text-muted); width: 180px; flex-shrink: 0; padding-top: 1px; }
    .config-val { font-size: 13px; color: var(--text-primary); }
    .config-val.code { font-family: var(--font-mono, monospace); font-size: 12px; color: var(--green-dark); }

    @media (max-width: 640px) {
      .form-grid { grid-template-columns: 1fr; }
      .page-header { flex-direction: column; align-items: flex-start; }
    }
  `]
})
export class DispositivosComponent implements OnInit {
  dispositivos: Dispositivo[] = [];
  mostrarFormulario = false;

  nuevoDispositivo = {
    nombre: '',
    ubicacion: '',
    ip: '',
    modelo: 'resnet18' as 'resnet18' | 'fewshot',
    estado: 'online' as EstadoDispositivo,
    umbral: 0.70
  };

  constructor(private svc: GreenBinService) {}

  ngOnInit(): void {
    this.svc.getDispositivos().subscribe(d => this.dispositivos = d);
  }

  agregar(): void {
    if (!this.nuevoDispositivo.nombre || !this.nuevoDispositivo.ubicacion) return;
    this.svc.agregarDispositivo(this.nuevoDispositivo);
    this.nuevoDispositivo = { nombre: '', ubicacion: '', ip: '', modelo: 'resnet18', estado: 'online', umbral: 0.70 };
    this.mostrarFormulario = false;
  }

  estadoLabel(e: EstadoDispositivo): string {
    return { online: 'En línea', offline: 'Sin conexión', warning: 'Alerta' }[e];
  }

  modeloLabel(m: string): string {
    return m === 'resnet18' ? 'ResNet18 — Transfer Learning' : 'Few-Shot — Similitud coseno';
  }
}
