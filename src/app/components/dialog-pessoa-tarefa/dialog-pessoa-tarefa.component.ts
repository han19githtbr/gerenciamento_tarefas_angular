import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TarefaService } from 'src/app/services/tarefa.service';
import { Tarefa } from 'src/app/model/Tarefa.model';
import { AlertModalService } from 'src/app/services/alert-modal.service';

@Component({
  selector: 'app-dialog-pessoa-tarefa',
  templateUrl: './dialog-pessoa-tarefa.component.html',
  styleUrls: ['./dialog-pessoa-tarefa.component.css']
})

export class DialogPessoaTarefaComponent implements OnInit {
    title: string = '';
    disableBox = false;
    msg: string = '';
    pessoaId: number;
    tarefa: Tarefa = new Tarefa();

    constructor(
        private tarefaService: TarefaService,
        public dialogRefPessoaTarefa: MatDialogRef<DialogPessoaTarefaComponent>,
        private alertModalService: AlertModalService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.title = data.title;
        this.tarefa = data.tarefa;
    }

    ngOnInit() {
      this.pessoaId = this.data.tarefa.pessoaId;
    }

    fecharCadastrarDialog(): void {
      this.dialogRefPessoaTarefa.close();
    }

    salvar(value: string) {
      if (value == 'Sim') {
          this.disableBox = true; // evita duplo clique
          this.tarefaService.alocarPessoaNaTarefa(this.data.tarefa.id, this.pessoaId).subscribe({
              next: (data) => {
                  //this.alertModalService.mostrarMensagem(data.body.mensagem, this.alertModalService.SUCESSO);
                  this.dialogRefPessoaTarefa.close({ result: 'Sim', mensagem: data.body.mensagem });
              },
              error: (err) => {
                  console.error('Erro ao alocar:', err);
                  this.disableBox = false; // reabilita o botão
                  this.dialogRefPessoaTarefa.close({ result: 'Erro', mensagem: 'Erro ao alocar pessoa.' });
              }
          });
      } else {
          this.dialogRefPessoaTarefa.close({ result: 'Não' });
      }
    }
}

