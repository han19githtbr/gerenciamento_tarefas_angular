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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  isCollapsed = false;

  pessoas: Array<Pessoa> = [];

  departamentos: Array<Departamento> = [];

  tarefas: Array<Tarefa> = [];

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AdicionarPessoaComponent>,
    public dialogRefDepartment: MatDialogRef<AdicionarDepartamentoComponent>,
    public dialogRefTask: MatDialogRef<AdicionarTarefaComponent>,
    private alertModalService: AlertModalService,
    public sanitizer: DomSanitizer,
    private pessoaService: PessoaService,
    private departamentoService: DepartamentoService,
    private tarefaService: TarefaService,
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
  }

  savePessoa(){
    this.dialogRef = this.dialog.open(AdicionarPessoaComponent, {
      width: "30rem",
      data: {
        title: 'Adicionar Pessoa',
        pessoaButton: 'Create',
      },
    })
    this.dialogRef.afterClosed().subscribe(data => {
      if(data){
        this.pessoaService.getAllPessoa().subscribe((data: HttpResponse<Pessoa[]>) => {
          this.pessoas = data.body;
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

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pessoas[index] = result;
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
    this.dialogRefTask = this.dialog.open(AdicionarTarefaComponent, {
      width: "30rem",
      data: {
        title: 'Adicionar Tarefa',
        tarefaButton: 'Create',
      },
    })
    this.dialogRefTask.afterClosed().subscribe(data => {
      if(data){
        this.tarefaService.getAllTarefa().subscribe((data: HttpResponse<Tarefa[]>) => {
          this.tarefas = data.body;
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
