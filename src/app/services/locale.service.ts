import { Injectable } from '@angular/core';

/**
 * LocaleService — gerencia a troca de idioma da aplicação.
 *
 * O Angular i18n compila um bundle por idioma (pt-BR e en).
 * A troca de idioma recarrega a página apontando para o bundle correto.
 *
 * - Rota padrão (/) → PT-BR
 * - Rota /en/       → English
 */
@Injectable({ providedIn: 'root' })
export class LocaleService {

  /** Idioma atual detectado pela URL */
  getCurrentLocale(): 'pt-BR' | 'en' {
    return window.location.pathname.startsWith('/en/') ? 'en' : 'pt-BR';
  }

  /** Alterna para o idioma solicitado recarregando a página */
  switchLocale(locale: 'pt-BR' | 'en'): void {
    const current = this.getCurrentLocale();
    if (current === locale) return;

    if (locale === 'en') {
      window.location.href = '/en/';
    } else {
      // Remove o prefixo /en/ e volta para a raiz pt-BR
      const newPath = window.location.pathname.replace(/^\/en/, '') || '/';
      window.location.href = newPath;
    }
  }

  /** Retorna o rótulo legível do idioma atual */
  getCurrentLocaleLabel(): string {
    return this.getCurrentLocale() === 'en' ? '🇺🇸 English' : '🇧🇷 Português';
  }
}
