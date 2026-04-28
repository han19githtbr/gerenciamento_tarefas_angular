import { Component } from '@angular/core';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="loading.loading$ | async" class="loading-overlay">
      <div class="spinner"></div>
      <p>Carregando...</p>
    </div>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  constructor(public loading: LoadingService) {}
}
