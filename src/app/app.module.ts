import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentesModule } from './components/component.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrModule, ToastrService } from 'ngx-toastr';
//import { EnvironmentProviders } from '@angular/core';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ComponentesModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,

    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right', // Posição da notificação
      timeOut: 3000, // Tempo de exibição (em milissegundos)
      closeButton: true, // Mostrar botão de fechar
      progressBar: true, // Mostrar barra de progresso
      preventDuplicates: true, // Prevenir duplicatas
      enableHtml: true, // Permitir HTML na mensagem
      toastClass: 'ngx-toastr', // Classe CSS personalizada para o toastr
      tapToDismiss: true, // Fechar ao clicar
      newestOnTop: true, // Exibir as mais novas no topo
      maxOpened: 5, // Máximo de notificações abertas ao mesmo tempo
      autoDismiss: true, // Fechar automaticamente
      easeTime: 300, // Tempo de animação
      disableTimeOut: false, // Desabilitar tempo limite
      extendedTimeOut: 1000, // Tempo de exibição estendido (em milissegundos)
      resetTimeoutOnDuplicate: false, // Resetar tempo limite ao duplicar
      iconClasses: {
        error: 'toast-error', // Classe de ícone para notificações de erro
        info: 'toast-info', // Classe de ícone para notificações de informação
        success: 'toast-success', // Classe de ícone para notificações de sucesso
        warning: 'toast-warning' // Classe de ícone para notificações de aviso
      },
      messageClass: 'toast-message', // Classe CSS para a mensagem
      titleClass: 'toast-title', // Classe CSS para o título
      //positionClass: 'toast-bottom-right', // Classe CSS para a posição da notificação
    })
  ],
  providers: [ToastrService],
  bootstrap: [AppComponent]
})
export class AppModule { }
