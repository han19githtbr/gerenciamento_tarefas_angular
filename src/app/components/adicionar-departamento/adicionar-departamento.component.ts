import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { AlertModalService } from 'src/app/services/alert-modal.service';
import { ToastrService } from 'ngx-toastr';
import { Departamento } from 'src/app/model/Departamento.model';

// Definindo a função getToastOptions fora da classe
function getToastOptions() {
  return {
    timeOut: 3000,
    closeButton: true,
    progressBar: true,
    positionClass: 'toast-bottom-right',
    tapToDismiss: true,
    toastClass: 'ngx-toastr',
    titleClass: 'toast-title',
    messageClass: 'toast-message'
  };
}


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
        id: ["", Validators.required]
      });

      this.departamentoService.getAllDepartamento().subscribe((data: any) => {
        this.departamentos = data.body;
        console.log(this.departamentos);
      })
  }


  fecharCadastrarDialog(): void{
    this.dialogRef.close();
  }

  showSuccess(message: string) {
    this.toastr.success(message, 'Sucesso', getToastOptions());
  }

  showError(message: string) {
    this.toastr.error(message, 'Erro', getToastOptions());
  }


  submit(form: any) {
    this.disableBox = true;
    const tituloControl = form.get('titulo');
    if(!tituloControl.value) {
        this.disableBox = false;
        //this.alertModalService.mostrarMensagem("O campo tem que ser preenchido.", this.alertModalService.ERRO);
        this.showError("O campo tem que ser preenchido.");
    } else {
        if(this.departamentoButton == "Create") {

            this.departamentoService.saveDepartamento(this.departamento).subscribe(data => {
                if(data.body.success){
                    this.departamento.id = data.body.id;
                    this.departamento.titulo = data.body.titulo;
                    this.departamento.ordem_apresentacao = data.body.ordem_apresentacao;
                    this.departamento.mensagem = data.body.mensagem;
                    //this.alertModalService.mostrarMensagem(data.body.mensagem, this.alertModalService.SUCESSO);
                    this.showSuccess("O departamento foi salvo com sucesso.");
                    this.dialogRef.close(this.departamento);
                } else{
                    this.disableBox = false;
                    //this.alertModalService.mostrarMensagem(data.body.mensagem, this.alertModalService.ERRO);
                    this.showError("Erro ao salvar o departamento");
                }
            })
        } else {
              const nomeDepartamento = encodeURIComponent(this.oldTitle);

              this.departamentoService.alterarDepartamento(nomeDepartamento, this.departamento).subscribe(data => {
                  if(data.body.success){
                      this.departamento.id = data.body.id;
                      this.departamento.titulo = data.body.titulo;
                      this.departamento.ordem_apresentacao = data.body.ordem_apresentacao;
                      this.departamento.mensagem = data.body.mensagem;
                      //this.alertModalService.mostrarMensagem(data.body.mensagem, this.alertModalService.SUCESSO);
                      this.showSuccess("O departamento foi alterado com sucesso.");
                      this.dialogRef.close(this.departamento);
                  } else{
                      this.disableBox = false;
                      this.showError("Erro ao alterar o departamento");
                      //this.alertModalService.mostrarMensagem(data.body.mensagem, this.alertModalService.ERRO);
                  }
              });


              // Função para remover a pessoa
              /*this.departamentoService.removerDepartamento(this.departamento.id).subscribe(response => {
                if (response.status === 200) {
                  this.showSuccess("O departamento foi removido com sucesso.");
                  this.dialogRef.close(this.departamento);
                } else {
                  this.disableBox = false;
                  this.showError("Erro ao remover o departamento");
                }
              });
            }*/
          }

        }
        }
      }
