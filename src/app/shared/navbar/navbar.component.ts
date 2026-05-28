import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'gb-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="navbar-brand">
        <div class="brand-icon">
          <i class="ti ti-leaf"></i>
        </div>
        <div class="brand-text">
          GreenBin <span class="brand-version">v2.0</span>
        </div>
      </div>

      <div class="navbar-links">
        <a routerLink="/dashboard"    routerLinkActive="active" class="nav-link">
          <i class="ti ti-layout-dashboard"></i> Dashboard
        </a>
        <a routerLink="/dispositivos" routerLinkActive="active" class="nav-link">
          <i class="ti ti-device-desktop"></i> Dispositivos
        </a>
        <a routerLink="/clasificador" routerLinkActive="active" class="nav-link">
          <i class="ti ti-camera"></i> Clasificador
        </a>
        <a routerLink="/info"         routerLinkActive="active" class="nav-link">
          <i class="ti ti-info-circle"></i> Información
        </a>
      </div>

      <div class="navbar-status">
        <span class="status-badge">
          <span class="status-dot"></span>
          Sistema activo
        </span>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      height: 58px;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
    }
    .brand-icon {
      width: 34px; height: 34px;
      border-radius: 8px;
      background: var(--green);
      display: flex; align-items: center; justify-content: center;
    }
    .brand-icon i { font-size: 18px; color: #fff; }
    .brand-text {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
    }
    .brand-version {
      font-size: 12px;
      font-weight: 400;
      color: var(--text-muted);
      margin-left: 4px;
    }
    .navbar-links {
      display: flex;
      gap: 2px;
    }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      padding: 6px 14px;
      border-radius: 8px;
      color: var(--text-muted);
      text-decoration: none;
      transition: background 0.15s, color 0.15s;
    }
    .nav-link i { font-size: 15px; }
    .nav-link:hover {
      background: var(--surface-hover);
      color: var(--text-primary);
    }
    .nav-link.active {
      background: var(--surface-hover);
      color: var(--text-primary);
      font-weight: 500;
    }
    .status-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      padding: 4px 10px;
      border-radius: 99px;
      background: var(--green-light);
      color: var(--green-dark);
    }
    .status-dot {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: var(--green);
      animation: pulse 2s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `]
})
export class NavbarComponent {}
