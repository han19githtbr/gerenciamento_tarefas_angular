import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertModalService } from 'src/app/services/alert-modal.service';
import { Tarefa } from 'src/app/model/Tarefa.model';
import { TarefaService } from 'src/app/services/tarefa.service';
import { ToastrService } from 'ngx-toastr';
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
  selector: 'app-adicionar-tarefa',
  templateUrl: './adicionar-tarefa.component.html',
  styleUrls: ['./adicionar-tarefa.component.scss']
})
export class AdicionarTarefaComponent implements OnInit {

  form!: FormGroup;

  title: string = '';

  formDepartment!: FormGroup;

  oldTitle: string = '';

  tarefaButton: string = '';

  disableBox = false;

  tarefa: Tarefa = new Tarefa();

  tarefas: Tarefa[] = [];

  departamentos: Departamento[] = [];


  constructor(
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<AdicionarTarefaComponent>,
      private alertModalService: AlertModalService,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private tarefaService: TarefaService,
      public departamentoService: DepartamentoService,
      private toastr: ToastrService,
  ) {
      this.title = data['title'];
      this.tarefa.id = data['id'];
      this.tarefa.titulo = data['titulo'];
      this.tarefa.descricao = data['descricao'];
      this.tarefa.prazo = data['prazo'];
      this.tarefa.ordem_apresentacao = data['ordem_apresentacao'];
      this.oldTitle = data['titulo'];
      this.tarefaButton = data['tarefaButton'];

      if (!this.tarefa.departamento) {
        this.tarefa.departamento = new Departamento();
      }
  }

  ngOnInit() {
      this.form = this.fb.group({
        titulo: ['', [Validators.required, Validators.maxLength(255)]],
        descricao: ['', Validators.required],
        prazo: ['', [Validators.required, this.dataValida]],
        departamentoId: ['', Validators.required]
      });

      // Carrega os departamentos primeiro
      this.departamentoService.getAllDepartamento().subscribe((data: any) => {
        this.departamentos = data.body;

        // Se está editando, configura o departamento selecionado
        if (this.tarefa.departamento?.id && this.tarefaButton === 'Edit') {
          this.form.patchValue({
            departamentoId: this.tarefa.departamento.id
          });
          this.onDepartment(); // Atualiza o departamento
        }

        console.log('Departamentos carregados:', this.departamentos);
      });

      this.tarefaService.getAllTarefa().subscribe((data: any) => {
        this.tarefas = data.body;
      });
  }


  fecharCadastrarDialog(): void{
    this.dialogRef.close();
  }

  onDepartment() {
    // Pega o valor do formulário principal
    const deptId = this.form.get('departamentoId')?.value;

    if (deptId) {
      // Garante que o departamento existe
      if (!this.tarefa.departamento) {
        this.tarefa.departamento = new Departamento();
      }

      // Encontra o departamento completo na lista
      const selectedDept = this.departamentos.find(dept => dept.id === +deptId);
      if (selectedDept) {
        // Atribui o departamento completo à tarefa
        this.tarefa.departamento = selectedDept;
      } else {
        // Se não encontrou na lista, pelo menos define o ID
        this.tarefa.departamento.id = +deptId;
      }

      console.log('Departamento selecionado:', this.tarefa.departamento);
    }
  }

  showSuccess(message: string) {
    this.toastr.success(message, 'Sucesso', getToastOptions());
  }

  showError(message: string) {
    this.toastr.error(message, 'Erro', getToastOptions());
  }


  dataValida(control: FormControl) {
    const inputDate = new Date(control.value);

    if (isNaN(inputDate.getTime())) {
      return { dataInvalida: true };
    }

    return null;
  }


  submit(form: any) {
    this.disableBox = true;

    // Validação do formulário
    if (this.form.invalid) {
      this.disableBox = false;
      this.marcarCamposComoMarcados();
      return;
    }

    // Chama onDepartment para garantir que o departamento está definido
    this.onDepartment();

    // Validação do departamento
    const deptId = this.form.get('departamentoId')?.value;
    if (!deptId) {
        this.disableBox = false;
        this.showError("Selecione um departamento.");
        return;
    }

    // DEBUG: Mostra os dados que serão enviados
    console.log('Dados da tarefa a enviar:', {
      titulo: this.tarefa.titulo,
      descricao: this.tarefa.descricao,
      prazo: this.tarefa.prazo,
      departamento: this.tarefa.departamento,
      departamentoId: deptId
    });

    if(this.tarefaButton == "Create"){
        this.tarefaService.salvarTarefa(this.tarefa).subscribe({
          next: (response: any) => {
            console.log('Resposta do servidor:', response);

            if(response.body?.success){
                this.showSuccess(response.body.mensagem || "A tarefa foi salva com sucesso.");
                this.dialogRef.close({
                  success: true,
                  tarefa: response.body.tarefa || this.tarefa
                });
            } else{
                this.disableBox = false;
                const errorMsg = response.body?.mensagem || 'Erro ao salvar a tarefa';
                this.showError(errorMsg);
            }
          },
          error: (error) => {
            this.disableBox = false;
            console.error('Erro na requisição:', error);
            this.showError('Erro de conexão com o servidor. Verifique se o back-end está rodando.');
          }
        });
    } else {
        const nomeTarefa = encodeURIComponent(this.oldTitle);
        this.tarefaService.alterarTarefa(nomeTarefa, this.tarefa).subscribe({
          next: (response: any) => {
            if(response.body?.success){
                this.showSuccess(response.body.mensagem || "A tarefa foi alterada com sucesso.");
                this.dialogRef.close(response.body);
            } else {
                this.disableBox = false;
                const errorMsg = response.body?.mensagem || 'Erro ao alterar a tarefa';
                this.showError(errorMsg);
            }
          },
          error: (error) => {
            this.disableBox = false;
            console.error('Erro na requisição:', error);
            this.showError('Erro de conexão com o servidor.');
          }
        });
    }
  }


  // Método para marcar todos os campos como tocados (para mostrar erros)
  private marcarCamposComoMarcados() {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });

    if (this.form.get('titulo')?.hasError('required')) {
      this.showError('O título é obrigatório.');
    }
    if (this.form.get('descricao')?.hasError('required')) {
      this.showError('A descrição é obrigatória.');
    }
    if (this.form.get('prazo')?.hasError('required')) {
      this.showError('O prazo é obrigatório.');
    }
    if (this.form.get('departamentoId')?.hasError('required')) {
      this.showError('Selecione um departamento.');
    }
  }
}
