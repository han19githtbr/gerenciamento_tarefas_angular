import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent {
  isDark$: Observable<boolean>;

  constructor(private themeService: ThemeService) {
    this.isDark$ = this.themeService.theme$.pipe(map(t => t === 'dark'));
  }

  toggle(): void {
    this.themeService.toggle();
  }
}
