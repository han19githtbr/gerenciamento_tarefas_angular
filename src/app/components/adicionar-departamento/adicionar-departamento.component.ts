import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { AlertModalService } from 'src/app/services/alert-modal.service';
import { Departamento } from 'src/app/model/Departamento.model';

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
      private departamentoService: DepartamentoService
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


  submit(form: any) {
    this.disableBox = true;
    const tituloControl = form.get('titulo');
    if(!tituloControl.value) {
        this.disableBox = false;
        this.alertModalService.mostrarMensagem("O campo tem que ser preenchido.", this.alertModalService.ERRO);
    } else {
        if(this.departamentoButton == "Create") {

            this.departamentoService.saveDepartamento(this.departamento).subscribe(data => {
                if(data.body.success){
                    this.departamento.id = data.body.id;
                    this.departamento.titulo = data.body.titulo;
                    this.departamento.ordem_apresentacao = data.body.ordem_apresentacao;
                    this.departamento.mensagem = data.body.mensagem;
                    this.alertModalService.mostrarMensagem(data.body.mensagem, this.alertModalService.SUCESSO);
                    this.dialogRef.close(this.departamento);
                } else{
                    this.disableBox = false;
                    this.alertModalService.mostrarMensagem(data.body.mensagem, this.alertModalService.ERRO);
                }
            })
        } else {
              const nomeDepartamento = encodeURIComponent(this.oldTitle);

              this.departamentoService.alterarDepartamento(nomeDepartamento, this.departamento).subscribe(data => {
                  if(data.body.success){
                      this.departamento.id = data.body.id;
                      this.departamento.titulo = data.body.titulo;
                      this.departamento.mensagem = data.body.mensagem;
                      this.alertModalService.mostrarMensagem(data.body.mensagem, this.alertModalService.SUCESSO);
                      this.dialogRef.close(this.departamento);
                  } else{
                      this.disableBox = false;
                      this.alertModalService.mostrarMensagem(data.body.mensagem, this.alertModalService.ERRO);
                  }
              })
            }
        }
    }
  }

