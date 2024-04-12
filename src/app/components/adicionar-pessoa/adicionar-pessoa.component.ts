import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Pessoa } from 'src/app/model/Pessoa.model';
import { PessoaService } from 'src/app/services/pessoa.service';
import { Departamento } from 'src/app/model/Departamento.model';
import { DepartamentoService } from 'src/app/services/departamento.service';

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
    private toastr: ToastrService,
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
      //id: ["", Validators.required]
    });

    this.formDepartment = this.fb.group({
      id: ["", Validators.required]
    });

    this.departamentoService.getAllDepartamento().subscribe((data: any) => {
      this.departamentos = data.body;
    });
  }

  fecharCadastrarDialog(): void {
    this.dialogRef.close();
  }

  onDepartment() {
    this.pessoa.departamento.id = +this.formDepartment.controls['id'].value;
  }

  showSuccess(message: string) {
    this.toastr.success(message, 'Sucesso', getToastOptions());
  }

  showError(message: string) {
    this.toastr.error(message, 'Erro', getToastOptions());
  }

  submit(form: any) {
    this.disableBox = true;
    const nomeControl = form.get('nome');
    if(!nomeControl.value) {
        this.disableBox = false;
        this.showError("O campo tem que ser preenchido.");
    } else {
        if(this.pessoaButton == "Create") {

            this.pessoaService.savePessoa(this.pessoa).subscribe(data => {
                if(data.body.success) {
                    this.pessoa.id = data.body.id;
                    this.pessoa.nome = data.body.nome;
                    this.pessoa.departamento.id = data.body.departamento.id;
                    this.pessoa.ordem_apresentacao = data.body.ordem_apresentacao;
                    this.pessoa.mensagem = data.body.mensagem;
                    this.showSuccess("A pessoa foi salva com sucesso.");
                    this.dialogRef.close(this.pessoa);
                } else {
                    this.disableBox = false;
                    this.showError("Erro ao salvar a pessoa");
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
                    this.showSuccess("A pessoa foi salva com sucesso.");
                    this.dialogRef.close(this.pessoa);
                } else{
                    this.disableBox = false;
                    this.showError("Erro ao salvar a pessoa");
                }
          });

          // Função para remover a pessoa
          /*this.pessoaService.removerPessoa(this.pessoa.id).subscribe(response => {
            if (response.status === 200) {
              this.showSuccess("A pessoa foi removida com sucesso.");
              this.dialogRef.close(this.pessoa);
            } else {
              this.disableBox = false;
              this.showError("Erro ao remover a pessoa");
            }
          });*/
        }
      }
    }

  }
