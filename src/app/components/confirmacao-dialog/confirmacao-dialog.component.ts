import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Pessoa } from 'src/app/model/Pessoa.model';
import { PessoaService } from 'src/app/services/pessoa.service';
import { AlertModalService } from 'src/app/services/alert-modal.service';
import { Tarefa } from 'src/app/model/Tarefa.model';
import { Departamento } from 'src/app/model/Departamento.model';
import { ToastrService } from 'ngx-toastr';
import { toastOptions } from 'src/app/config/toast.config';


@Component({
    selector: 'app-confirmacao-dialog',
    templateUrl: './confirmacao-dialog.component.html',
    styleUrls: ['./confirmacao-dialog.component.scss']
})
export class ConfirmacaoDialogComponent implements OnInit {

    form!: FormGroup;

    title: string = '';

    disableBox = false;

    tarefa: Tarefa = new Tarefa();

    msg: string = '';

    departamento: Departamento = new Departamento();

    pessoa: Pessoa = new Pessoa();

    constructor(
        private pessoaService: PessoaService,
        public dialogRef: MatDialogRef<ConfirmacaoDialogComponent>,
        private alertModalService: AlertModalService,
        private toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmacaoDialogComponent,
    ) {
        this.title = data['title'];
        this.pessoa.id = data['id'];
        this.pessoa.nome = data['nome'];
        this.pessoa.ordem_apresentacao = data['ordem_apresentacao'];
    }

    ngOnInit() {
    }

    fecharCadastrarDialog(): void{
        this.dialogRef.close();
    }

    showSuccess(message: string) {
      this.toastr.success(message, 'Sucesso', toastOptions);
    }

    showError(message: string) {
      this.toastr.error(message, 'Erro', toastOptions);
    }

    salvar(value: string) {
        if (value == 'Sim') {
            this.pessoaService.removerPessoa(this.pessoa.id).subscribe(
              data => {
                this.showSuccess("A pessoa foi removida com sucesso.");
                this.dialogRef.close(value);
              },
              error => {
                this.showError("Erro ao remover a pessoa");
                this.disableBox = false;
              }
            )
        }else{
            this.dialogRef.close();
        }
    }
}
