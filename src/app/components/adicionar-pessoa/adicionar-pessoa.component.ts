import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Pessoa } from 'src/app/model/Pessoa.model';
import { PessoaService } from 'src/app/services/pessoa.service';
import { Departamento } from 'src/app/model/Departamento.model';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { AlertModalService } from 'src/app/services/alert-modal.service';

@Component({
  selector: 'app-adicionar-pessoa',
  templateUrl: './adicionar-pessoa.component.html',
  styleUrls: ['./adicionar-pessoa.component.scss']
})
export class AdicionarPessoaComponent implements OnInit {
  form!: FormGroup;

  title: string = '';

  pessoaButton: string = '';

  oldName: string = '';

  disableBox = false;

  pessoa: Pessoa = new Pessoa()

  departamentos: Departamento[] = [];

  pessoas: Pessoa[] = [];


  departamentoSelecionadoId: number | null = null;

  constructor(
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<AdicionarPessoaComponent>,
      private alertModalService: AlertModalService,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private pessoaService: PessoaService,
      public departamentoService: DepartamentoService,
      private toastr: ToastrService
  ) {
    this.title = data['title'];
    this.pessoaButton = data['pessoaButton'];
    this.pessoa.id = data['id'];
    this.pessoa.nome = data['nome'];
    this.pessoa.email = data['email'];
    this.pessoa.ordem_apresentacao = data['ordem_apresentacao'];
    this.oldName = data['nome'];

    if (!this.pessoa.departamento) {
      this.pessoa.departamento = new Departamento();
    }
  }

  ngOnInit() {
    this.form = this.fb.group({
      nome: ["", [Validators.required, Validators.maxLength(255)]],
      departamentoId: [this.data['departamentoId'] || "", Validators.required]
    });

    this.departamentoService.getAllDepartamento().subscribe((data: any) => {
      this.departamentos = data.body;
      const departamentoId = this.data['departamentoId'] || this.pessoa.departamento?.id;
      if (departamentoId) {
        this.form.patchValue({ departamentoId });
        this.setDepartamentoSelecionado(departamentoId);
      }
    });
  }


  fecharCadastrarDialog(): void{
    this.dialogRef.close();
  }

  onDepartment() {
    this.setDepartamentoSelecionado(this.form.controls['departamentoId'].value);
  }

  private setDepartamentoSelecionado(departamentoId: number | string) {
    this.departamentoSelecionadoId = +departamentoId;
    if (!this.pessoa.departamento) {
      this.pessoa.departamento = new Departamento();
    }
    this.pessoa.departamento.id = this.departamentoSelecionadoId;
    this.pessoa.departamentoId = this.departamentoSelecionadoId;
  }



  showSuccess() {
    const mensagem = this.data?.body?.mensagem || 'Operação realizada com sucesso!';

    this.toastr.success(mensagem, 'Sucesso', {
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
      disableTimeOut: false,
      extendedTimeOut: 1000,
      positionClass: 'toast-bottom-right',
      tapToDismiss: true, // Adiciona a opção de clicar para fechar
      toastClass: 'ngx-toastr', // Define a classe CSS personalizada para o toastr
      titleClass: 'toast-title', // Define a classe CSS personalizada para o título
      messageClass: 'toast-message' // Define a classe CSS personalizada para a mensagem
    });
  }

  showError(mensagem?: string) {
    //this.toastr.error('O campo nome é obrigatório.', 'Erro', {
    this.toastr.error(mensagem || 'Erro ao processar a operação.', 'Erro', {
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
      toastClass: 'ngx-toastr',
      disableTimeOut: false,
      extendedTimeOut: 1000,
      positionClass: 'toast-bottom-right',
      tapToDismiss: true, // Adiciona a opção de clicar para fechar
      titleClass: 'toast-title', // Define a classe CSS personalizada para o título
      messageClass: 'toast-message' // Define a classe CSS personalizada para a mensagem
    });
  }


  submit(form: any) {
      this.disableBox = true;
      const nomeControl = form.get('nome');

      if (!nomeControl.value) {
        this.disableBox = false;
        this.showError('O campo nome é obrigatório.');
        return;
      }

      if (form.invalid) {
        this.disableBox = false;
        this.showError('Selecione um departamento.');
        return;
      }

      this.pessoa.nome = nomeControl.value;
      this.setDepartamentoSelecionado(form.get('departamentoId').value);

      if (this.pessoaButton == "Create") {
        this.pessoaService.savePessoa(this.pessoa).subscribe({
          next: (data) => {
            if (data.body && data.body.success) {
              // Prepara o objeto pessoa com os dados retornados
              const pessoaSalva: Pessoa = {
                ...this.pessoa,
                id: data.body.id,
                nome: data.body.nome,
                email: data.body.email,
                departamento: {
                  ...this.pessoa.departamento,
                  id: data.body.departamentoId,
                  titulo: data.body.departamento
                } as Departamento,
                departamentoId: data.body.departamentoId,
                ordem_apresentacao: data.body.ordem_apresentacao,
                mensagem: data.body.mensagem
              };

              // Garante que o departamento está configurado
              if (!pessoaSalva.departamento) {
                pessoaSalva.departamento = new Departamento();
              }
              pessoaSalva.departamento.id = this.departamentoSelecionadoId;

              this.showSuccess();

              // IMPORTANTE: Fecha o modal e retorna a pessoa salva
              this.dialogRef.close(pessoaSalva);
            } else {
              this.disableBox = false;
              this.showError(data.body?.mensagem || 'Erro ao salvar pessoa.');
            }
          },
          error: (error) => {
            this.disableBox = false;
            this.showError('Erro ao salvar pessoa.');
            console.error('Erro ao salvar pessoa:', error);
          }
        });
      } else {
        // Caso de edição - similar ao de criação
        const nomePessoa = encodeURIComponent(this.oldName);
        this.pessoaService.alterarPessoa(nomePessoa, this.pessoa).subscribe({
          next: (data) => {
            if (data.body && data.body.success) {
              const pessoaAlterada: Pessoa = {
                ...this.pessoa,
                id: data.body.id,
                nome: data.body.nome,
                email: data.body.email,
                departamento: {
                  ...this.pessoa.departamento,
                  id: data.body.departamentoId,
                  titulo: data.body.departamento
                } as Departamento,
                departamentoId: data.body.departamentoId,
                ordem_apresentacao: data.body.ordem_apresentacao,
                mensagem: data.body.mensagem
              };

              if (!pessoaAlterada.departamento) {
                pessoaAlterada.departamento = new Departamento();
              }
              pessoaAlterada.departamento.id = this.departamentoSelecionadoId;

              this.showSuccess();

              // Fecha o modal e retorna a pessoa alterada
              this.dialogRef.close(pessoaAlterada);
            } else {
              this.disableBox = false;
              this.showError(data.body?.mensagem || 'Erro ao alterar pessoa.');
            }
          },
          error: (error) => {
            this.disableBox = false;
            this.showError('Erro ao alterar pessoa.');
            console.error('Erro ao alterar pessoa:', error);
          }
        });
      }
    }

  }
