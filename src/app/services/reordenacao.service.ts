import { Injectable } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Observable } from 'rxjs';

import { Pessoa } from '../model/Pessoa.model';
import { Departamento } from '../model/Departamento.model';
import { Tarefa } from '../model/Tarefa.model';
import { PessoaService } from './pessoa.service';
import { DepartamentoService } from './departamento.service';
import { TarefaService } from './tarefa.service';

/**
 * Centraliza a lógica de reordenação por drag-and-drop e botões ↑↓.
 *
 * Antes havia 6 métodos quase idênticos espalhados no DashboardComponent
 * (reOrdemList, reOrdemListDepartment, reOrdemListTask, upPeople,
 * downPeople, upDepartment, downDepartment, upTask, downTask...).
 * Agora a lógica genérica fica aqui; o componente apenas passa o array
 * e recebe o array reordenado pronto para atualizar o estado.
 */
@Injectable({ providedIn: 'root' })
export class ReordenacaoService {

  constructor(
    private pessoaService: PessoaService,
    private departamentoService: DepartamentoService,
    private tarefaService: TarefaService
  ) {}

  // ── Pessoas ──────────────────────────────────────────────────────────────

  reordenarPorDrop(
    event: CdkDragDrop<Pessoa[]>,
    lista: Pessoa[]
  ): { lista: Pessoa[]; salvar$: Observable<any> } {
    const nova = [...lista];
    moveItemInArray(nova, event.previousIndex, event.currentIndex);
    return { lista: this._reindexar(nova), salvar$: this.pessoaService.salvarPessoaOrder(nova) };
  }

  moverPessoaAcima(index: number, lista: Pessoa[]): { lista: Pessoa[]; salvar$: Observable<any> } | null {
    if (index <= 0) return null;
    const nova = [...lista];
    [nova[index], nova[index - 1]] = [nova[index - 1], nova[index]];
    return { lista: this._reindexar(nova), salvar$: this.pessoaService.salvarPessoaOrder(nova) };
  }

  moverPessoaAbaixo(index: number, lista: Pessoa[]): { lista: Pessoa[]; salvar$: Observable<any> } | null {
    if (index >= lista.length - 1) return null;
    const nova = [...lista];
    [nova[index], nova[index + 1]] = [nova[index + 1], nova[index]];
    return { lista: this._reindexar(nova), salvar$: this.pessoaService.salvarPessoaOrder(nova) };
  }

  // ── Departamentos ────────────────────────────────────────────────────────

  reordenarDepartamentosPorDrop(
    event: CdkDragDrop<Departamento[]>,
    lista: Departamento[]
  ): { lista: Departamento[]; salvar$: Observable<any> } {
    const nova = [...lista];
    moveItemInArray(nova, event.previousIndex, event.currentIndex);
    return { lista: this._reindexar(nova), salvar$: this.departamentoService.salvarDepartamentoOrder(nova) };
  }

  moverDepartamentoAcima(index: number, lista: Departamento[]): { lista: Departamento[]; salvar$: Observable<any> } | null {
    if (index <= 0) return null;
    const nova = [...lista];
    [nova[index], nova[index - 1]] = [nova[index - 1], nova[index]];
    return { lista: this._reindexar(nova), salvar$: this.departamentoService.salvarDepartamentoOrder(nova) };
  }

  moverDepartamentoAbaixo(index: number, lista: Departamento[]): { lista: Departamento[]; salvar$: Observable<any> } | null {
    if (index >= lista.length - 1) return null;
    const nova = [...lista];
    [nova[index], nova[index + 1]] = [nova[index + 1], nova[index]];
    return { lista: this._reindexar(nova), salvar$: this.departamentoService.salvarDepartamentoOrder(nova) };
  }

  // ── Tarefas ──────────────────────────────────────────────────────────────

  reordenarTarefasPorDrop(
    event: CdkDragDrop<Tarefa[]>,
    lista: Tarefa[]
  ): { lista: Tarefa[]; salvar$: Observable<any> } {
    const nova = [...lista];
    moveItemInArray(nova, event.previousIndex, event.currentIndex);
    return { lista: this._reindexar(nova), salvar$: this.tarefaService.salvarTarefaOrder(nova) };
  }

  moverTarefaAcima(index: number, lista: Tarefa[]): { lista: Tarefa[]; salvar$: Observable<any> } | null {
    if (index <= 0) return null;
    const nova = [...lista];
    [nova[index], nova[index - 1]] = [nova[index - 1], nova[index]];
    return { lista: this._reindexar(nova), salvar$: this.tarefaService.salvarTarefaOrder(nova) };
  }

  moverTarefaAbaixo(index: number, lista: Tarefa[]): { lista: Tarefa[]; salvar$: Observable<any> } | null {
    if (index >= lista.length - 1) return null;
    const nova = [...lista];
    [nova[index], nova[index + 1]] = [nova[index + 1], nova[index]];
    return { lista: this._reindexar(nova), salvar$: this.tarefaService.salvarTarefaOrder(nova) };
  }

  // ── Helper privado ───────────────────────────────────────────────────────

  /** Reatribui `ordem_apresentacao` sequencialmente após qualquer reordenação. */
  private _reindexar<T extends { ordem_apresentacao: any }>(lista: T[]): T[] {
    lista.forEach((item, i) => item.ordem_apresentacao = i + 1);
    return lista;
  }
}
