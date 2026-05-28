import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Miembro { iniciales: string; nombre: string; rol: string; email: string; color: string; }

@Component({
  selector: 'gb-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Información del sistema</h1>
        <p class="page-sub">GreenBin v2.0 — Fundación Escuela Tecnológica de Neiva</p>
      </div>
    </div>

    <div class="info-grid">
      <!-- Descripción -->
      <div class="card card--wide">
        <div class="card-header"><i class="ti ti-leaf"></i> Acerca de GreenBin</div>
        <p class="description">
          GreenBin es un sistema inteligente de gestión de residuos orientado a mejorar
          la separación en la fuente en entornos universitarios. Emplea visión artificial
          con <strong>ResNet18</strong> y transfer learning para clasificar residuos en
          tres categorías según la <strong>Resolución 2184 de 2019</strong> del Ministerio
          de Ambiente y Desarrollo Sostenible de Colombia.
        </p>
        <div class="tags">
          <span class="tag" *ngFor="let t of tags">{{ t }}</span>
        </div>
      </div>

      <!-- Ficha técnica -->
      <div class="card">
        <div class="card-header"><i class="ti ti-cpu"></i> Ficha técnica</div>
        <div class="spec-list">
          <div class="spec-item" *ngFor="let s of specs">
            <div class="spec-key">{{ s.key }}</div>
            <div class="spec-val" [class.spec-val--code]="s.code">{{ s.val }}</div>
          </div>
        </div>
      </div>

      <!-- Normativa -->
      <div class="card">
        <div class="card-header"><i class="ti ti-scale"></i> Marco normativo</div>
        <div class="norm-block">
          <div class="norm-ref">Resolución 2184 de 2019</div>
          <p class="norm-desc">
            Establece el código de colores para la separación de residuos sólidos en la fuente,
            vigente desde el 1 de enero de 2021.
          </p>
          <div class="color-chips">
            <div class="chip chip-verde">🟢 Verde — Orgánico</div>
            <div class="chip chip-blanca">⬜ Blanca — Aprovechable</div>
            <div class="chip chip-negra">⬛ Negra — No aprovechable</div>
          </div>
        </div>
      </div>

      <!-- Equipo -->
      <div class="card card--wide">
        <div class="card-header"><i class="ti ti-users"></i> Equipo de desarrollo</div>
        <div class="team-grid">
          <div class="team-card" *ngFor="let m of equipo">
            <div class="avatar" [style.background]="m.color + '20'" [style.color]="m.color">
              {{ m.iniciales }}
            </div>
            <div class="team-info">
              <div class="team-name">{{ m.nombre }}</div>
              <div class="team-rol">{{ m.rol }}</div>
              <a class="team-email" [href]="'mailto:' + m.email">{{ m.email }}</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Bibliografía -->
      <div class="card card--wide">
        <div class="card-header"><i class="ti ti-books"></i> Referencias principales</div>
        <div class="refs">
          <div class="ref-item" *ngFor="let r of refs; let i = index">
            <span class="ref-num">[{{ i + 1 }}]</span>
            <span class="ref-text">{{ r }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 24px; }
    .page-title { font-size: 22px; font-weight: 600; color: var(--text-primary); }
    .page-sub   { font-size: 13px; color: var(--text-muted); margin-top: 2px; }

    .info-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
    }
    .card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 14px; padding: 20px;
    }
    .card--wide { grid-column: 1 / -1; }
    .card-header {
      display: flex; align-items: center; gap: 8px;
      font-size: 14px; font-weight: 500; color: var(--text-primary); margin-bottom: 14px;
    }
    .card-header i { font-size: 16px; color: var(--text-muted); }

    .description { font-size: 14px; line-height: 1.7; color: var(--text-primary); margin-bottom: 16px; }
    .description strong { font-weight: 600; color: var(--green-dark); }
    .tags { display: flex; flex-wrap: wrap; gap: 8px; }
    .tag {
      font-size: 11px; padding: 3px 10px; border-radius: 99px;
      background: var(--green-light); color: var(--green-dark); font-weight: 500;
    }

    .spec-list { display: flex; flex-direction: column; gap: 0; }
    .spec-item { display: flex; gap: 12px; padding: 9px 0; border-bottom: 1px solid var(--border); }
    .spec-item:last-child { border-bottom: none; }
    .spec-key { font-size: 12px; color: var(--text-muted); width: 140px; flex-shrink: 0; padding-top: 1px; }
    .spec-val { font-size: 13px; color: var(--text-primary); }
    .spec-val--code { font-family: var(--font-mono, monospace); font-size: 12px; color: var(--green-dark); }

    .norm-ref { font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px; }
    .norm-desc { font-size: 13px; color: var(--text-muted); line-height: 1.6; margin-bottom: 14px; }
    .color-chips { display: flex; flex-direction: column; gap: 8px; }
    .chip { font-size: 13px; padding: 8px 12px; border-radius: 8px; }
    .chip-verde  { background: #e1f5ee; color: #0f6e56; }
    .chip-blanca { background: var(--surface-hover); color: var(--text-muted); border: 1px solid var(--border); }
    .chip-negra  { background: #f1efe8; color: #2c2c2a; }

    .team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
    .team-card { display: flex; align-items: flex-start; gap: 12px; padding: 14px; border-radius: 10px; border: 1px solid var(--border); }
    .avatar {
      width: 42px; height: 42px; border-radius: 10px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; font-weight: 600;
    }
    .team-name { font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 2px; }
    .team-rol  { font-size: 11px; color: var(--text-muted); margin-bottom: 4px; }
    .team-email { font-size: 11px; color: var(--green); text-decoration: none; }
    .team-email:hover { text-decoration: underline; }

    .refs { display: flex; flex-direction: column; gap: 10px; }
    .ref-item { display: flex; gap: 10px; font-size: 13px; line-height: 1.5; }
    .ref-num { font-weight: 600; color: var(--green); flex-shrink: 0; width: 24px; }
    .ref-text { color: var(--text-muted); }

    @media (max-width: 700px) { .info-grid { grid-template-columns: 1fr; } }
  `]
})
export class InfoComponent {
  tags = ['Visión artificial', 'ResNet18', 'Transfer Learning', 'Few-Shot', 'FastAPI', 'Angular', 'Raspberry Pi 4', 'Resolución 2184/2019', 'Python', 'PyTorch'];

  specs = [
    { key: 'Arquitectura',     val: 'ResNet18 pretrained (ImageNet)',      code: false },
    { key: 'Framework',        val: 'PyTorch + TorchVision',               code: false },
    { key: 'Lenguaje',         val: 'Python 3.10+',                        code: true  },
    { key: 'Optimizador',      val: 'Adam (lr=1e-3) + ReduceLROnPlateau',  code: true  },
    { key: 'Umbral confianza', val: '70% (verde=seguro, amarillo=dudoso)', code: false },
    { key: 'Clasificación alt',val: 'Few-Shot — similitud coseno',         code: false },
    { key: 'Entrada',          val: '224×224 px (ROI central 60%)',        code: false },
    { key: 'Hardware objetivo', val: 'Raspberry Pi 4 · 4 GB RAM',          code: false },
    { key: 'Panel web',        val: 'Angular 17 · TypeScript',             code: true  },
    { key: 'Backend API',      val: 'FastAPI + WebSocket',                  code: true  },
  ];

  equipo: Miembro[] = [
    { iniciales: 'JB', nombre: 'Juan Felipe Bahamon Castillo', rol: 'Ingeniería de Software', email: 'juan_bahamonca@fet.edu.co', color: '#1D9E75' },
    { iniciales: 'JR', nombre: 'José Eduar Ramírez Cardona',  rol: 'Ingeniería de Software · Ponente', email: 'jose_ramirezca@fet.edu.co', color: '#1a73e8' },
    { iniciales: 'ST', nombre: 'Santiago Tovar Vargas',        rol: 'Ingeniería de Software', email: 'santiago_tovarva@fet.edu.co', color: '#f57c00' },
    { iniciales: 'VM', nombre: 'Viviana Muñoz Álvarez',        rol: 'Tutora · Ingeniería de Software', email: 'viviana_munozal@fet.edu.co', color: '#8e24aa' },
  ];

  refs = [
    'Wang, Y. et al. (2020). Generalizing from a few examples: A survey on few-shot learning. ACM Computing Surveys, 53(3). https://doi.org/10.1145/3386252',
    'Chaparro Mesa, M. A. & Vargas Forero, H. S. (2022). Prototipo de sistema de clasificación de materiales reciclables. Universidad ECCI.',
    'Gómez, D. L. & Rodríguez, A. K. (2022). Clasificador de residuos sólidos con machine learning. Revista Sennova.',
    'Ministerio de Ambiente y Desarrollo Sostenible (2019). Resolución 2184 — Código de colores para la separación de residuos.',
    'Paszke, A. et al. (2019). PyTorch: An imperative style, high-performance deep learning library. NeurIPS.',
  ];
}
