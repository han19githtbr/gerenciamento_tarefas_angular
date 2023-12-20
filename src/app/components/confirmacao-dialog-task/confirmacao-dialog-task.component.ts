import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TarefaService } from 'src/app/services/tarefa.service';
import { Tarefa } from 'src/app/model/Tarefa.model';
import { AlertModalService } from 'src/app/services/alert-modal.service';


@Component({
  selector: 'app-confirmacao-dialog-task',
  templateUrl: './confirmacao-dialog-task.component.html',
  styleUrls: ['./confirmacao-dialog-task.component.css']
})

export class ConfirmacaoDialogTaskComponent implements OnInit {

    form!: FormGroup;

    title: string = '';

    disableBox = false;

    msg: string = '';

    tarefa: Tarefa = new Tarefa();

    constructor(
        private tarefaService: TarefaService,
        public dialogRef: MatDialogRef<ConfirmacaoDialogTaskComponent>,
        private alertModalService: AlertModalService,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmacaoDialogTaskComponent,
    ) {
        this.title = data['title'];
        this.tarefa.id = data['id'];
        this.tarefa.titulo = data['titulo'];
        this.tarefa.descricao = data['descricao'];
        this.tarefa.prazo = data['prazo'];
        this.tarefa.ordem_apresentacao = data['ordem_apresentacao'];
    }

    ngOnInit() {
    }

    fecharCadastrarDialog(): void{
      this.dialogRef.close();
    }

    salvar(value: string) {
        if (value == 'Sim') {
            this.tarefaService.removerTarefa(this.tarefa.id).subscribe(data => {
              this.alertModalService.mostrarMensagem(data.body.mensagem, this.alertModalService.SUCESSO);
              this.dialogRef.close(value);
            })
        } else {
            this.dialogRef.close();
        }
    }
}
