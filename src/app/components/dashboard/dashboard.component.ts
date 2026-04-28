import { Component, OnInit } from '@angular/core';
import { Pessoa } from 'src/app/model/Pessoa.model';
import { AdicionarPessoaComponent } from '../adicionar-pessoa/adicionar-pessoa.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertModalService } from 'src/app/services/alert-modal.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PessoaService } from 'src/app/services/pessoa.service';
import { HttpResponse } from '@angular/common/http';
import { ConfirmacaoDialogComponent } from '../confirmacao-dialog/confirmacao-dialog.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Departamento } from 'src/app/model/Departamento.model';
import { AdicionarDepartamentoComponent } from '../adicionar-departamento/adicionar-departamento.component';
import { AdicionarTarefaComponent } from '../adicionar-tarefa/adicionar-tarefa.component';
import { Tarefa } from 'src/app/model/Tarefa.model';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { TarefaService } from 'src/app/services/tarefa.service';
import { ConfirmacaoDialogDepartmentComponent } from '../confirmacao-dialog-department/confirmacao-dialog-department.component';
import { ConfirmacaoDialogTaskComponent } from '../confirmacao-dialog-task/confirmacao-dialog-task.component';
import { AlocarPessoaTarefaComponent } from '../alocar-pessoa-tarefa/alocar-pessoa-tarefa.component';
import { MatSelectChange } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { DialogPessoaTarefaComponent } from '../dialog-pessoa-tarefa/dialog-pessoa-tarefa.component';
import { DialogFinalizarTarefaComponent } from '../dialog-finalizar-tarefa/dialog-finalizar-tarefa.component';


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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  isCollapsed = false;

  pessoas: Array<Pessoa> = [];

  pessoaSelecionada: Pessoa;

  tarefaSelecionada: Tarefa;

  departamentos: Array<Departamento> = [];

  tarefas: Array<Tarefa> = [];

  pessoasAlocadas: Pessoa[] = [];

  tarefasAlocadas: Tarefa[] = [];

  tarefasPendentes: Tarefa[] = [];

  tarefasEmAndamento: number = 0;

  filtroAlocacoes: 'todas' | 'pendentes' | 'finalizadas' = 'todas';
  tarefasAlocadasFiltradas: Tarefa[] = [];

  pessoaAlocada: Pessoa;
  tarefaAlocada: Tarefa;

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AdicionarPessoaComponent>,
    public dialogRefDepartment: MatDialogRef<AdicionarDepartamentoComponent>,
    //public dialogRefTask: MatDialogRef<AdicionarTarefaComponent>,
    public dialogRefPessoaTarefa: MatDialogRef<DialogPessoaTarefaComponent>,
    //private alertModalService: AlertModalService,
    public sanitizer: DomSanitizer,
    private pessoaService: PessoaService,
    private departamentoService: DepartamentoService,
    private tarefaService: TarefaService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.pessoaService.getAllPessoa().subscribe((data: HttpResponse<Pessoa[]>) => {
      this.pessoas = data.body;
    });
    this.departamentoService.getAllDepartamento().subscribe((data: HttpResponse<Departamento[]>) => {
      this.departamentos = data.body;
    });
    this.tarefaService.getAllTarefa().subscribe((data: HttpResponse<Tarefa[]>) => {
      this.tarefas = data.body;
    });
    this.carregarTarefasPendentes();
    this.carregarTarefasAlocadas();
    this.carregarContagemEmAndamento();
  }


  carregarContagemEmAndamento(): void {
    this.tarefaService.getContagemEmAndamento().subscribe({
      next: (data) => { this.tarefasEmAndamento = data?.total ?? 0; },
      error: () => {}
    });
  }

  carregarTarefasPendentes(): void {
    this.tarefaService.listarTarefasPendentes().subscribe(
      (tarefas: Tarefa[]) => {
        this.tarefasPendentes = tarefas;
      },
      (error: any) => {
        console.error('Erro ao carregar tarefas pendentes:', error);
      }
    );
  }

  selecionarTarefa(event: MatSelectChange) {
    this.tarefaSelecionada = event.value;
  }

  selecionarPessoa(event: MatSelectChange) {
    this.pessoaSelecionada = event.value;
  }

  showSuccess(message: string) {
    this.toastr.success(message, 'Sucesso', getToastOptions());
  }

  showError(message: string) {
    this.toastr.error(message, 'Erro', getToastOptions());
  }

  savePessoa() {
    this.dialogRef = this.dialog.open(AdicionarPessoaComponent, {
      width: "30rem",
      data: {
        title: 'Adicionar Pessoa',
        pessoaButton: 'Create',
      },
    });

    this.dialogRef.afterClosed().subscribe(pessoaSalva => {
      console.log('Modal fechado com dados:', pessoaSalva); // Adicione este log para debug
      if (pessoaSalva) {
        if (this.pessoas) {
          this.pessoas = [...this.pessoas, pessoaSalva];
        } else {
          this.pessoas = [pessoaSalva];
        }

        // Recarrega a lista completa para garantir consistência
        this.pessoaService.getAllPessoa().subscribe((data: HttpResponse<Pessoa[]>) => {
          this.pessoas = data.body;
          this.showSuccess('Pessoa adicionada com sucesso!');
        });
      }
    });
  }


  alterarPessoa(index: number, pessoa: Pessoa){
    const dialogRef = this.dialog.open(AdicionarPessoaComponent, {
        width: '30rem',
        data: {
          title: 'Editar Pessoa',
          id: pessoa.id,
          nome: pessoa.nome,
          ordem_apresentacao: pessoa.ordem_apresentacao,
          pessoaButton: 'Edit',
        }
    });

    dialogRef.afterClosed().subscribe(pessoaAlterada => {
      if (pessoaAlterada) {
        this.pessoas[index] = pessoaAlterada;

        this.pessoas = [...this.pessoas];

        this.showSuccess('Pessoa alterada com sucesso!');
      }
    });
  }

  removerPessoa(index: number, pessoa: Pessoa){
    const dialogRef = this.dialog.open(ConfirmacaoDialogComponent, {
      width: '30rem',
      data: {
        title: 'Deletar Pessoa',
        id: pessoa.id,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'Sim') {
        this.pessoaService.getAllPessoa().subscribe((data: HttpResponse<Pessoa[]>) => {
          this.pessoas = data.body;
        });
      }
    });
  }


  verificarDadosAntesDeAlocar() {
    console.log('=== VERIFICAÇÃO DE DADOS ===');
    console.log('Tarefa selecionada:', this.tarefaSelecionada);
    console.log('Pessoa selecionada:', this.pessoaSelecionada);

    if (!this.tarefaSelecionada || !this.pessoaSelecionada) {
        console.error('❌ Dados incompletos!');
        return false;
    }

    console.log('Tarefa ID:', this.tarefaSelecionada.id);
    console.log('Pessoa ID:', this.pessoaSelecionada.id);
    console.log('Tarefa Departamento:', this.tarefaSelecionada.departamento);
    console.log('Pessoa Departamento:', this.pessoaSelecionada.departamento);

    return true;
  }


  alocarPessoaNaTarefa() {
    console.log('🔍 === ALOCAR PESSOA NA TAREFA ===');

    if (!this.verificarDadosAntesDeAlocar()) {
        this.showError('Dados incompletos para alocação.');
        return;
    }

    // Verificação básica
    if (!this.tarefaSelecionada) {
      this.showError('Selecione uma tarefa.');
      return;
    }

    if (!this.pessoaSelecionada) {
      this.showError('Selecione uma pessoa.');
      return;
    }

    // Logs detalhados
    console.log('📊 DADOS PARA ALOCAÇÃO:');
    console.log('   Tarefa ID:', this.tarefaSelecionada?.id);
    console.log('   Tarefa Título:', this.tarefaSelecionada?.titulo);
    console.log('   Pessoa ID:', this.pessoaSelecionada?.id);
    console.log('   Pessoa Nome:', this.pessoaSelecionada?.nome);

    // Verificar se IDs existem
    if (!this.tarefaSelecionada.id) {
      console.error('❌ ERRO: Tarefa sem ID!');
      console.error('   Tarefa objeto:', this.tarefaSelecionada);
      this.showError('A tarefa selecionada não tem um ID válido.');
      return;
    }

    if (!this.pessoaSelecionada.id) {
      console.error('❌ ERRO: Pessoa sem ID!');
      console.error('   Pessoa objeto:', this.pessoaSelecionada);
      this.showError('A pessoa selecionada não tem um ID válido.');
      return;
    }

    // Verificar departamentos (forma simplificada)
    const tarefaDeptId = this.getDepartamentoIdDaTarefa(this.tarefaSelecionada);
    const pessoaDeptId = this.pessoaSelecionada.departamentoId;

    console.log('🏢 DEPARTAMENTOS:');
    console.log('   Tarefa Dept ID:', tarefaDeptId);
    console.log('   Pessoa Dept ID:', pessoaDeptId);

    if (!tarefaDeptId || !pessoaDeptId) {
      console.error('❌ ERRO: Departamento não identificado');
      this.showError('Não foi possível identificar o departamento.');
      return;
    }

    if (tarefaDeptId !== pessoaDeptId) {
      console.error('❌ ERRO: Departamentos diferentes');
      this.showError('A pessoa não pertence ao mesmo departamento da tarefa.');
      return;
    }

    console.log('✅ Validações passadas!');

    // Abrir diálogo de confirmação
    const dialogRefPessoaTarefa = this.dialog.open(DialogPessoaTarefaComponent, {
      width: '30rem',
      data: {
        title: 'Alocar Pessoa na Tarefa',
        tarefa: {
          id: this.tarefaSelecionada.id,
          titulo: this.tarefaSelecionada.titulo,
          descricao: this.tarefaSelecionada.descricao,
          prazo: this.tarefaSelecionada.prazo,
          ordem_apresentacao: this.tarefaSelecionada.ordem_apresentacao,
          departamentoId: tarefaDeptId,
          pessoaId: this.pessoaSelecionada.id
        },
        nomePessoa: this.pessoaSelecionada.nome,  // ← ADICIONAR
        emailAtual: this.pessoaSelecionada.email || '',
        message: `Deseja alocar "${this.pessoaSelecionada.nome}" na tarefa "${this.tarefaSelecionada.titulo}"?`
      },
    });

    dialogRefPessoaTarefa.afterClosed().subscribe(result => {
        if (result?.result === 'Sim') {
            this.showSuccess(result.mensagem || 'Pessoa alocada com sucesso!');
            this.recarregarTodasAsListas();
            this.tarefaSelecionada = null;
            this.pessoaSelecionada = null;
        } else if (result?.result === 'Erro') {
            this.showError(result.mensagem);
        }
    });
  }


  abrirDialogFinalizarTarefa(tarefa: Tarefa) {
    const dialogRef = this.dialog.open(DialogFinalizarTarefaComponent, {
      width: '35rem',
      data: {
        title: 'Finalizar Tarefa',
        message: `Deseja finalizar a tarefa "${tarefa.titulo}"?`,
        tarefa: tarefa
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Sim') {
        this.finalizarTarefa(tarefa.id);
      }
    });
  }


  finalizarTarefa(tarefaId: number) {
    this.tarefaService.finalizarTarefa(tarefaId).subscribe({
      next: (response: any) => {
        const data = response.body || response;

        if (data && data.success) {
          this.showSuccess('Tarefa finalizada com sucesso!');

          // Atualizar a tarefa na lista local
          const tarefaIndex = this.tarefasAlocadas.findIndex(t => t.id === tarefaId);
          if (tarefaIndex !== -1) {
            this.tarefasAlocadas[tarefaIndex].finalizado = true;
            // Se quiser atualizar também a duração
            if (data.duracao) {
              this.tarefasAlocadas[tarefaIndex].duracao = data.duracao;
            }
          }

          // Também atualizar na lista geral de tarefas
          const tarefaGeralIndex = this.tarefas.findIndex(t => t.id === tarefaId);
          if (tarefaGeralIndex !== -1) {
            this.tarefas[tarefaGeralIndex].finalizado = true;
          }

          // Recarregar listas para garantir consistência
          this.recarregarTodasAsListas();
        } else {
          this.showError(data?.mensagem || 'Erro ao finalizar tarefa');
        }
      },
      error: (error) => {
        console.error('Erro ao finalizar tarefa:', error);
        this.showError('Erro ao finalizar tarefa: ' + (error.error?.mensagem || error.message));
      }
    });
  }


  private getDepartamentoIdDaTarefa(tarefa: Tarefa): number | undefined {
    // Tenta diferentes formas de obter o ID do departamento
    if (!tarefa) return undefined;

    // Caso 1: departamentoId direto
    if (tarefa.departamentoId) {
        return tarefa.departamentoId;
    }

    // Caso 2: departamento como objeto
    if (tarefa.departamento && typeof tarefa.departamento === 'object') {
        return (tarefa.departamento as any).id;
    }

    // Caso 3: departamento como número
    if (typeof tarefa.departamento === 'number') {
        return tarefa.departamento;
    }

    return undefined;
  }


  // Método separado para enviar ao backend
  private enviarAlocacaoParaBackend() {
    this.tarefaService.alocarPessoaNaTarefa(
      this.tarefaSelecionada.id,
      this.pessoaSelecionada.id
    ).subscribe({
      next: (httpResponse: any) => {
        console.log('✅ Resposta do backend:', httpResponse);

        const response = httpResponse.body;

        if (response && response.success) {
          this.showSuccess('Pessoa alocada com sucesso!');

          // Recarregar dados
          this.recarregarTodasAsListas();

          // Limpar seleções
          this.tarefaSelecionada = null;
          this.pessoaSelecionada = null;
        } else {
          this.showError('Falha: ' + (response.mensagem || 'Erro desconhecido'));
        }
      },
      error: (error) => {
        console.error('❌ Erro na requisição:', error);

        if (error.status === 404) {
          this.showError('Pessoa ou tarefa não encontrada no sistema.');
        } else if (error.status === 500) {
          this.showError('Erro interno no servidor.');
        } else {
          this.showError('Erro: ' + (error.message || 'Erro desconhecido'));
        }
      }
    });
  }


  reOrdemList(event: CdkDragDrop<Pessoa[]>){
    moveItemInArray(this.pessoas, event.previousIndex, event.currentIndex);
    this.pessoas.forEach((pessoa, index) => {
      pessoa.ordem_apresentacao = index + 1;
    });
    this.pessoaService.salvarPessoaOrder(this.pessoas).subscribe(response => {
      this.pessoaService.getAllPessoa().subscribe((data: HttpResponse<Pessoa[]>) => {
        this.pessoas = data.body;
      });
    });
  }

  upPeople(index: number){
    if (index > 0) {
      [this.pessoas[index], this.pessoas[index - 1]] = [this.pessoas[index - 1], this.pessoas[index]];
      this.pessoas.forEach((tarefa, i) => {
        tarefa.ordem_apresentacao = i + 1;
      });
      this.pessoaService.salvarPessoaOrder(this.pessoas).subscribe(response => {
        this.pessoaService.getAllPessoa().subscribe((data: HttpResponse<Pessoa[]>) => {
          this.pessoas = data.body;
        });
      });
    }
  }

  downPeople(index: number){
    if (index < this.pessoas.length - 1) {
      [this.pessoas[index], this.pessoas[index + 1]] = [this.pessoas[index + 1], this.pessoas[index]];
      this.pessoas.forEach((pessoa, i) => {
        pessoa.ordem_apresentacao = i + 1;
      });
      this.pessoaService.salvarPessoaOrder(this.pessoas).subscribe(response => {
        this.pessoaService.getAllPessoa().subscribe((data: HttpResponse<Pessoa[]>) => {
          this.pessoas = data.body;
        });
      });
    }
  }

  saveDepartamento(){
    this.dialogRefDepartment = this.dialog.open(AdicionarDepartamentoComponent, {
      width: "30rem",
      data: {
        title: 'Adicionar Departamento',
        departamentoButton: 'Create',
      },
    })
    this.dialogRefDepartment.afterClosed().subscribe(data => {
      if(data){
        this.departamentoService.getAllDepartamento().subscribe((data: HttpResponse<Departamento[]>) => {
          this.departamentos = data.body;
        });
      }
    });
  }

  alterarDepartamento(index: number, departamento: Departamento){
    const dialogRefDepartment = this.dialog.open(AdicionarDepartamentoComponent, {
      width: '30rem',
      data: {
        title: 'Editar Departamento',
        id: departamento.id,
        titulo: departamento.titulo,
        ordem_apresentacao: departamento.ordem_apresentacao,
        departamentoButton: 'Edit',
      }
    });

    dialogRefDepartment.afterClosed().subscribe(result => {
      if (result) {
        this.departamentos[index] = result;
      }
    });
  }

  removerDepartamento(index: number, departamento: Departamento){
    const dialogRefDepartment = this.dialog.open(ConfirmacaoDialogDepartmentComponent, {
      width: '30rem',
      data: {
        title: 'Deletar Departamento',
        id: departamento.id,
        titulo: departamento.titulo,
        ordem_apresentacao: departamento.ordem_apresentacao,
      }
    });

    dialogRefDepartment.afterClosed().subscribe(result => {
      if (result == 'Sim') {
        this.departamentoService.getAllDepartamento().subscribe((data: HttpResponse<Departamento[]>) => {
          this.departamentos = data.body;
        });
      }
    });
  }


  reOrdemListDepartment(event: CdkDragDrop<Departamento[]>){
    moveItemInArray(this.departamentos, event.previousIndex, event.currentIndex);
    this.departamentos.forEach((departamento, index) => {
      departamento.ordem_apresentacao = index + 1;
    });

    this.departamentoService.salvarDepartamentoOrder(this.departamentos).subscribe(response => {
      this.departamentoService.getAllDepartamento().subscribe((data: HttpResponse<Departamento[]>) => {
        this.departamentos = data.body;
      });
    });
  }


  upDepartment(index: number){
    if (index > 0) {
      [this.departamentos[index], this.departamentos[index - 1]] = [this.departamentos[index - 1], this.departamentos[index]];
      this.departamentos.forEach((departamento, i) => {
        departamento.ordem_apresentacao = i + 1;
      });
      this.departamentoService.salvarDepartamentoOrder(this.departamentos).subscribe(response => {
        this.departamentoService.getAllDepartamento().subscribe((data: HttpResponse<Departamento[]>) => {
          this.departamentos = data.body;
        });
      });
    }
  }


  downDepartment(index: number){
    if (index < this.departamentos.length - 1) {
      [this.departamentos[index], this.departamentos[index + 1]] = [this.departamentos[index + 1], this.departamentos[index]];
      this.departamentos.forEach((departamento, i) => {
        departamento.ordem_apresentacao = i + 1;
      });
      this.departamentoService.salvarDepartamentoOrder(this.departamentos).subscribe(response => {
        this.departamentoService.getAllDepartamento().subscribe((data: HttpResponse<Departamento[]>) => {
          this.departamentos = data.body;
        });
      });
   }
  }


  salvarTarefa(){
    // Use uma variável local, não reutilize a variável de instância
    const dialogRefTask = this.dialog.open(AdicionarTarefaComponent, {
      width: "30rem",
      data: {
        title: 'Adicionar Tarefa',
        tarefaButton: 'Create',
      },
    });

    dialogRefTask.afterClosed().subscribe(result => {
      console.log('Diálogo fechado com resultado:', result);

      if(result && result.success){
        // Atualize a lista de tarefas
        this.tarefaService.getAllTarefa().subscribe((data: HttpResponse<Tarefa[]>) => {
          this.tarefas = data.body || [];
          console.log('Tarefas atualizadas após adicionar:', this.tarefas);
          if(this.tarefas && this.tarefas.length > 0){
            this.showSuccess('Tarefa adicionada com sucesso!');
          }
        });
      }
    });
  }


  alterarTarefa(index: number, tarefa: Tarefa){
    const dialogRefTask = this.dialog.open(AdicionarTarefaComponent, {
      width: '30rem',
      data: {
        title: 'Editar Tarefa',
        titulo: tarefa.titulo,
        descricao: tarefa.descricao,
        prazo: tarefa.prazo,
        ordem_apresentacao: tarefa.ordem_apresentacao,
        tarefaButton: 'Edit',
      }
    });

    dialogRefTask.afterClosed().subscribe(result => {
      if (result) {
        this.tarefas[index] = result;
      }
    });
  }


  debugTarefas() {
    console.log('=== DEBUG TAREFAS ===');
    console.log('Número de tarefas:', this.tarefas.length);
    console.log('Tarefas:', this.tarefas);
    console.log('Departamentos:', this.departamentos);

    // Verificar se há problemas com o departamento
    this.tarefas.forEach((tarefa, index) => {
      console.log(`Tarefa ${index + 1}:`, {
        id: tarefa.id,
        titulo: tarefa.titulo,
        departamento: tarefa.departamento,
        departamentoId: tarefa.departamento?.id,
        departamentoTitulo: tarefa.departamento?.titulo
      });
    });
  }


  removerTarefa(index: number, tarefa: Tarefa){
    const dialogRefTask = this.dialog.open(ConfirmacaoDialogTaskComponent, {
      width: '30rem',
      data: {
        title: 'Deletar Tarefa',
        id: tarefa.id,
        ordem_apresentacao: tarefa.ordem_apresentacao,
      }
    });

    dialogRefTask.afterClosed().subscribe(result => {
      if (result == 'Sim') {
        this.tarefaService.getAllTarefa().subscribe((data: HttpResponse<Tarefa[]>) => {
          this.tarefas = data.body;
        });
      }
    });
  }


  // Adicionar este método
  carregarTarefasAlocadas(): void {
    this.tarefaService.getAllTarefa().subscribe((data: HttpResponse<Tarefa[]>) => {
      const todas = data.body || [];
      // Filtra apenas tarefas que possuem pessoa alocada
      this.tarefasAlocadas = todas.filter(t => t.pessoaId != null || t.pessoa != null);

      this.tarefasAlocadas.forEach(t => {
        console.log(`Tarefa: ${t.titulo}, Finalizada: ${t.finalizado}, Status: ${t.finalizado ? 'Concluída' : 'Em andamento'}`);
      });

    });
  }


  recarregarTodasAsListas() {
    console.log('=== RECARREGANDO TODAS AS LISTAS ===');

    // Recarrega tarefas
    this.tarefaService.getAllTarefa().subscribe((data: HttpResponse<Tarefa[]>) => {
      this.tarefas = data.body || [];
      console.log('Tarefas recarregadas:', this.tarefas.length, 'itens');
      console.log('Tarefas:', this.tarefas);
    });

    // Recarrega pessoas
    this.pessoaService.getAllPessoa().subscribe((data: HttpResponse<Pessoa[]>) => {
      this.pessoas = data.body || [];
    });

    // Recarrega departamentos
    this.departamentoService.getAllDepartamento().subscribe((data: HttpResponse<Departamento[]>) => {
      this.departamentos = data.body || [];
    });

    this.carregarTarefasPendentes();
    this.carregarTarefasAlocadas();
    this.carregarContagemEmAndamento();
  }



  // No dashboard.component.ts
  reOrdemListPessoas(event: CdkDragDrop<Pessoa[]>){
    moveItemInArray(this.pessoas, event.previousIndex, event.currentIndex);
    this.pessoas.forEach((pessoa, index) => {
      pessoa.ordem_apresentacao = index + 1;
    });
    this.pessoaService.salvarPessoaOrder(this.pessoas).subscribe(response => {
      this.pessoaService.getAllPessoa().subscribe((data: HttpResponse<Pessoa[]>) => {
        this.pessoas = data.body;
      });
    });
  }

  reOrdemListDepartamentos(event: CdkDragDrop<Departamento[]>){
    moveItemInArray(this.departamentos, event.previousIndex, event.currentIndex);
    this.departamentos.forEach((departamento, index) => {
      departamento.ordem_apresentacao = index + 1;
    });
    this.departamentoService.salvarDepartamentoOrder(this.departamentos).subscribe(response => {
      this.departamentoService.getAllDepartamento().subscribe((data: HttpResponse<Departamento[]>) => {
        this.departamentos = data.body;
      });
    });
  }

  reOrdemListTarefas(event: CdkDragDrop<Tarefa[]>){
    moveItemInArray(this.tarefas, event.previousIndex, event.currentIndex);
    this.tarefas.forEach((tarefa, index) => {
      tarefa.ordem_apresentacao = index + 1;
    });
    this.tarefaService.salvarTarefaOrder(this.tarefas).subscribe(response => {
      this.tarefaService.getAllTarefa().subscribe((data: HttpResponse<Tarefa[]>) => {
        this.tarefas = data.body;
      });
    });
  }


  reOrdemListTask(event: CdkDragDrop<Tarefa[]>){
    moveItemInArray(this.tarefas, event.previousIndex, event.currentIndex);
    this.tarefas.forEach((tarefa, index) => {
      tarefa.ordem_apresentacao = index + 1;
    });
    this.tarefaService.salvarTarefaOrder(this.tarefas).subscribe(response => {
      this.tarefaService.getAllTarefa().subscribe((data: HttpResponse<Tarefa[]>) => {
        this.tarefas = data.body;
      });
    });
  }

  upTask(index: number){
    if (index > 0) {
      [this.tarefas[index], this.tarefas[index - 1]] = [this.tarefas[index - 1], this.tarefas[index]];
      this.tarefas.forEach((tarefa, i) => {
        tarefa.ordem_apresentacao = i + 1;
      });
      this.tarefaService.salvarTarefaOrder(this.tarefas).subscribe(response => {
        this.tarefaService.getAllTarefa().subscribe((data: HttpResponse<Tarefa[]>) => {
          this.tarefas = data.body;
        });
      });
    }
  }

  downTask(index: number){
    if (index < this.tarefas.length - 1) {
      [this.tarefas[index], this.tarefas[index + 1]] = [this.tarefas[index + 1], this.tarefas[index]];
      this.tarefas.forEach((tarefa, i) => {
        tarefa.ordem_apresentacao = i + 1;
      });
      this.tarefaService.salvarTarefaOrder(this.tarefas).subscribe(response => {
        this.tarefaService.getAllTarefa().subscribe((data: HttpResponse<Tarefa[]>) => {
          this.tarefas = data.body;
        });
      });
    }
  }
}
