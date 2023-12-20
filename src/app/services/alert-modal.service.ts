import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertModalComponent } from '../components/alert-modal/alert-modal.component';

@Injectable()
export class AlertModalService {

  private horizontal: any = 'center';

  private vertical: any = 'top';

  public SUCESSO: string = 'SUCESSO';
  public AVISO: string = 'AVISO';
  public ERRO: string = 'ERRO';

  type: string = '';

  constructor(public snackBar: MatSnackBar) { }

  public mostrarMensagem(mensagem : string, type : string = 'SUCESSO'){

      let panelClassParam = ['sucesso-snackbar'];

      switch (type) {
          case 'SUCESSO' :
              panelClassParam = ['sucesso-snackbar'];
              this.type = 'success';
              break;
          case 'AVISO' :
              panelClassParam = ['aviso-snackbar'];
              this.type = 'warning';
              break;
          case 'ERRO' :
              panelClassParam = ['error-mensagem'];
              this.type = 'danger';
              break;
      }

      this.snackBar.openFromComponent(AlertModalComponent, {
          horizontalPosition: this.horizontal,
          verticalPosition: this.vertical, panelClass: panelClassParam, data: mensagem
      });
  }

}
