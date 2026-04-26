import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { AlertModalService } from 'src/app/services/alert-modal.service';
import { ToastrService } from 'ngx-toastr';
import { Departamento } from 'src/app/model/Departamento.model';
import { toastOptions } from 'src/app/config/toast.config';

@Component({
  selector: 'app-adicionar-departamento',
  templateUrl: './adicionar-departamento.component.html',
  styleUrls: ['./adicionar-departamento.component.scss']
})
export class AdicionarDepartamentoComponent implements OnInit {

  form!: FormGroup;

  title: string = '';

  oldTitle: string = '';

  departamentoButton: string = '';

  disableBox = false;

  departamento: Departamento = new Departamento();

  departamentos: Departamento[] = [];

  constructor(
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<AdicionarDepartamentoComponent>,
      private alertModalService: AlertModalService,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private departamentoService: DepartamentoService,
      private toastr: ToastrService,
  ) {
      this.title = data['title'];
      this.departamento.id = data['id'];
      this.departamento.titulo = data['titulo'];
      this.departamento.ordem_apresentacao = data['ordem_apresentacao'];
      this.oldTitle = data['titulo'];
      this.departamentoButton = data['departamentoButton'];
  }

  ngOnInit() {
    this.form = this.fb.group({
      titulo: ["", [Validators.required, Validators.maxLength(255)]],

    });

    this.departamentoService.getAllDepartamento().subscribe((data: any) => {
      this.departamentos = data.body;
      console.log(this.departamentos);
    });
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


  submit(form: any) {
    this.disableBox = true;
    const tituloValue = this.departamento.titulo;

    if (!tituloValue || tituloValue.trim() === '') {
        this.disableBox = false;
        this.showError("O campo tem que ser preenchido.");
    } else {
        if (this.departamentoButton == "Create") {
            // Envia apenas o necessário — sem id (que ainda não existe)
            const payload = { titulo: tituloValue.trim() };

            this.departamentoService.saveDepartamento(payload).subscribe(data => {
                if (data.body.success) {
                    this.departamento.id = data.body.id;
                    this.departamento.titulo = data.body.titulo;
                    this.departamento.ordem_apresentacao = data.body.ordem_apresentacao;
                    this.departamento.mensagem = data.body.mensagem;
                    this.showSuccess("O departamento foi salvo com sucesso.");
                    this.dialogRef.close(this.departamento);
                } else {
                    this.disableBox = false;
                    this.showError("Erro ao salvar o departamento: " + (data.body.mensagem || ''));
                }
            }, error => {
                this.disableBox = false;
                this.showError("Erro ao salvar o departamento: " + error.message);
            });
        } else {
            const nomeDepartamento = encodeURIComponent(this.oldTitle);
            const payload = { titulo: tituloValue.trim() };

            this.departamentoService.alterarDepartamento(nomeDepartamento, payload).subscribe(data => {
                if (data.body.success) {
                    this.departamento.id = data.body.id;
                    this.departamento.titulo = data.body.titulo;
                    this.departamento.ordem_apresentacao = data.body.ordem_apresentacao;
                    this.departamento.mensagem = data.body.mensagem;
                    this.showSuccess("O departamento foi alterado com sucesso.");
                    this.dialogRef.close(this.departamento);
                } else {
                    this.disableBox = false;
                    this.showError("Erro ao alterar o departamento: " + (data.body.mensagem || ''));
                }
            }, error => {
                this.disableBox = false;
                this.showError("Erro ao alterar o departamento: " + error.message);
            });
        }
    }
  }
}
