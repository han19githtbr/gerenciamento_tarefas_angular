import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private _theme = new BehaviorSubject<Theme>(this.getSavedTheme());
  theme$ = this._theme.asObservable();

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.applyTheme(this._theme.value);
  }

  get currentTheme(): Theme {
    return this._theme.value;
  }

  get isDark(): boolean {
    return this._theme.value === 'dark';
  }

  toggle(): void {
    const next: Theme = this._theme.value === 'dark' ? 'light' : 'dark';
    this._theme.next(next);
    this.applyTheme(next);
    localStorage.setItem('taskflow-theme', next);
  }

  private applyTheme(theme: Theme): void {
    const html = document.documentElement;
    if (theme === 'light') {
      this.renderer.setAttribute(html, 'data-theme', 'light');
    } else {
      this.renderer.removeAttribute(html, 'data-theme');
    }
  }

  private getSavedTheme(): Theme {
    return (localStorage.getItem('taskflow-theme') as Theme) || 'dark';
  }
}
