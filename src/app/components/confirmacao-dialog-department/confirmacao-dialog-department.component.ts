import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute} from '@angular/router';
import { FormBuilder, FormGroup} from '@angular/forms';
import { Pessoa } from 'src/app/model/Pessoa.model';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { AlertModalService } from 'src/app/services/alert-modal.service';
import { Departamento } from 'src/app/model/Departamento.model';



@Component({
  selector: 'app-confirmacao-dialog-department',
  templateUrl: './confirmacao-dialog-department.component.html',
  styleUrls: ['./confirmacao-dialog-department.component.css']
})

export class ConfirmacaoDialogDepartmentComponent implements OnInit {

    form!: FormGroup;

    title: string = '';

    disableBox = false;

    msg: string = '';

    departamento: Departamento = new Departamento();

    pessoa: Pessoa = new Pessoa();

    constructor(
        private departamentoService: DepartamentoService,
        public dialogRef: MatDialogRef<ConfirmacaoDialogDepartmentComponent>, private alertModalService: AlertModalService,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmacaoDialogDepartmentComponent,
    ) {
        this.title = data['title'];
        this.departamento.id = data['id'];
        this.departamento.titulo = data['titulo'];
        this.departamento.ordem_apresentacao = data['ordem_apresentacao'];
    }

    ngOnInit() {
    }

    fecharCadastrarDialog(): void{
      this.dialogRef.close();
    }

    salvar(value: string) {
        if (value == 'Sim') {
            this.departamentoService.removerDepartamento(this.departamento.id).subscribe(data => {
              this.alertModalService.mostrarMensagem(data.body.mensagem, this.alertModalService.SUCESSO);
              this.dialogRef.close(value);
            })
        } else {
            this.dialogRef.close();
        }
    }
}
