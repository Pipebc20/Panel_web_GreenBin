import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'gb-metric-card',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="metric-card">
      <div class="metric-icon" [ngClass]="iconColorClass">
        <i class="ti" [ngClass]="'ti-' + icon"></i>
      </div>
      <div class="metric-body">
        <div class="metric-label">{{ label }}</div>
        <div class="metric-value">{{ value }}</div>
        <div class="metric-sub" [ngClass]="subColorClass" *ngIf="sub">{{ sub }}</div>
      </div>
    </div>
  `,
  styles: [`
    .metric-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      align-items: flex-start;
      gap: 14px;
      transition: box-shadow 0.15s;
    }
    .metric-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    .metric-icon {
      width: 40px; height: 40px;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .metric-icon i { font-size: 20px; }
    .icon-green { background: var(--green-light); color: var(--green); }
    .icon-blue  { background: #e8f0fe; color: #1a73e8; }
    .icon-warn  { background: #fff3e0; color: #f57c00; }
    .icon-gray  { background: var(--surface-hover); color: var(--text-muted); }
    .metric-body { flex: 1; min-width: 0; }
    .metric-label {
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 4px;
    }
    .metric-value {
      font-size: 26px;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.1;
    }
    .metric-sub {
      font-size: 11px;
      margin-top: 4px;
    }
    .sub-green { color: var(--green); }
    .sub-warn  { color: #f57c00; }
    .sub-muted { color: var(--text-muted); }
  `]
})
export class MetricCardComponent {
  @Input() icon = 'chart-bar';
  @Input() label = '';
  @Input() value = '';
  @Input() sub = '';
  @Input() iconColorClass = 'icon-green';
  @Input() subColorClass = 'sub-green';
}
