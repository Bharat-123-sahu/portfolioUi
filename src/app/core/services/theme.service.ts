import { Injectable, signal } from '@angular/core';

export type ThemeScope = 'public' | 'admin';
export type ThemeMode = 'light' | 'dark';

export interface PublicThemeSettings {
  siteTitle?: string;
  siteDescription?: string;
  logo?: string;
  favicon?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  readonly publicTheme = signal<ThemeMode>(this.load('public'));
  readonly adminTheme = signal<ThemeMode>(this.load('admin'));
  readonly publicSettings = signal<PublicThemeSettings | null>(null);

  constructor() {
    this.applyTheme('public', this.publicTheme());
    this.applyTheme('admin', this.adminTheme());
  }

  toggle(scope: ThemeScope): ThemeMode {
    const next = this.theme(scope) === 'dark' ? 'light' : 'dark';
    this.setTheme(scope, next);
    return next;
  }

  setTheme(scope: ThemeScope, mode: ThemeMode): void {
    if (scope === 'public') {
      this.publicTheme.set(mode);
    } else {
      this.adminTheme.set(mode);
    }

    localStorage.setItem(this.storageKey(scope), mode);
    this.applyTheme(scope, mode);
  }

  theme(scope: ThemeScope): ThemeMode {
    return scope === 'public' ? this.publicTheme() : this.adminTheme();
  }

  applySettingsColors(settings?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
  } | null): void {
    if (!settings || typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    this.setCssColor(root, '--ion-color-primary', settings.primaryColor);
    this.setCssColor(root, '--lux-cyan', settings.primaryColor);
    this.setCssColor(root, '--lux-violet', settings.secondaryColor);
    this.setCssColor(root, '--lux-lime', settings.accentColor);
  }

  setPublicSettings(settings: PublicThemeSettings | null): void {
    this.publicSettings.set(settings);
    this.applySettingsColors(settings);
  }

  private applyTheme(scope: ThemeScope, mode: ThemeMode): void {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.dataset[`${scope}Theme`] = mode;
  }

  private load(scope: ThemeScope): ThemeMode {
    if (typeof localStorage === 'undefined') {
      return scope === 'admin' ? 'light' : 'dark';
    }

    const stored = localStorage.getItem(this.storageKey(scope));
    return stored === 'light' || stored === 'dark'
      ? stored
      : scope === 'admin' ? 'light' : 'dark';
  }

  private storageKey(scope: ThemeScope): string {
    return `portfolio-${scope}-theme`;
  }

  private setCssColor(root: HTMLElement, variable: string, value?: string): void {
    if (value) {
      root.style.setProperty(variable, value);
    }
  }
}
