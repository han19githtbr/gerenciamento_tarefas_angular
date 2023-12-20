import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Pessoa } from 'src/app/model/Pessoa.model';
import { PessoaService } from 'src/app/services/pessoa.service';
import { AlertModalService } from 'src/app/services/alert-modal.service';
import { Departamento } from 'src/app/model/Departamento.model';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { HttpRequest } from '@angular/common/http';


@Component({
  selector: 'app-adicionar-pessoa',
  templateUrl: './adicionar-pessoa.component.html',
  styleUrls: ['./adicionar-pessoa.component.scss']
})

export class AdicionarPessoaComponent implements OnInit {

  form!: FormGroup;

  title: string = '';

  formDepartment!: FormGroup;

  pessoaButton: string = '';

  oldName: string = '';

  disableBox = false;

  pessoa: Pessoa = new Pessoa()

  departamentos: Departamento[] = [];

  pessoas: Pessoa[] = [];

  constructor(
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<AdicionarPessoaComponent>,
      private alertModalService: AlertModalService,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private pessoaService: PessoaService,
      public departamentoService: DepartamentoService
  ) {
    this.title = data['title'];
    this.pessoaButton = data['pessoaButton'];
    this.pessoa.id = data['id'];
    this.pessoa.nome = data['nome'];
    this.pessoa.ordem_apresentacao = data['ordem_apresentacao'];
    this.oldName = data['nome'];
  }

  ngOnInit() {
      this.form = this.fb.group({
        nome: ["", [Validators.required, Validators.maxLength(255)]],
      });

      this.formDepartment = this.fb.group({
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


  onDepartment() {
    this.pessoa.departamento.id = +this.formDepartment.controls['id'].value;
  }


  submit(form: any) {
    this.disableBox = true;
    const nomeControl = form.get('nome');
    if(!nomeControl.value) {
        this.disableBox = false;
        this.alertModalService.mostrarMensagem("O campo tem que ser preenchido.", this.alertModalService.ERRO);
    } else {
        if(this.pessoaButton == "Create") {

            this.pessoaService.savePessoa(this.pessoa).subscribe(data => {
                if(data.body.success) {
                    this.pessoa.id = data.body.id;
                    this.pessoa.nome = data.body.nome;
                    this.pessoa.departamento.id = data.body.departamento.id;
                    this.pessoa.ordem_apresentacao = data.body.ordem_apresentacao;
                    this.pessoa.mensagem = data.body.mensagem;
                    this.alertModalService.mostrarMensagem(data.body.mensagem, this.alertModalService.SUCESSO);
                    this.dialogRef.close(this.pessoa);
                } else {
                    this.disableBox = false;
                    this.alertModalService.mostrarMensagem(data.body.mensagem, this.alertModalService.ERRO);
                }
            });
        } else {
            const nomePessoa = encodeURIComponent(this.oldName);
            this.pessoaService.alterarPessoa(nomePessoa, this.pessoa).subscribe(data => {
                if(data.body.success){
                    this.pessoa.id = data.body.id;
                    this.pessoa.nome = data.body.nome;
                    this.pessoa.departamento.id = data.body.departamento.id;
                    this.pessoa.ordem_apresentacao = data.body.ordem_apresentacao;
                    this.pessoa.mensagem = data.body.mensagem;
                    this.alertModalService.mostrarMensagem(data.body.mensagem, this.alertModalService.SUCESSO);
                    this.dialogRef.close(this.pessoa);
                } else{
                    this.disableBox = false;
                    this.alertModalService.mostrarMensagem(data.body.mensagem, this.alertModalService.ERRO);
                }
          })
        }
      }
    }
  }
