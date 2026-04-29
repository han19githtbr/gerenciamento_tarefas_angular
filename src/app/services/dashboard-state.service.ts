import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Pessoa } from '../model/Pessoa.model';
import { Departamento } from '../model/Departamento.model';
import { Tarefa } from '../model/Tarefa.model';
import { PessoaService } from './pessoa.service';
import { DepartamentoService } from './departamento.service';
import { TarefaService } from './tarefa.service';

/**
 * Centraliza o estado e o carregamento de dados do Dashboard.
 *
 * Antes, o DashboardComponent fazia 5+ chamadas HTTP soltas no ngOnInit
 * e as repetia em cada ação (salvar, remover, reordenar...).
 *
 * Agora esse serviço é a única fonte da verdade para pessoas, departamentos
 * e tarefas. O componente só chama `carregarTudo()` ou os métodos pontuais
 * e observa os streams públicos para renderizar.
 */
@Injectable({ providedIn: 'root' })
export class DashboardStateService {

  // ── Streams públicos (readonly para os componentes) ──────────────────────

  private _pessoas        = new BehaviorSubject<Pessoa[]>([]);
  private _departamentos  = new BehaviorSubject<Departamento[]>([]);
  private _tarefas        = new BehaviorSubject<Tarefa[]>([]);
  private _tarefasPendentes   = new BehaviorSubject<Tarefa[]>([]);
  private _tarefasAlocadas    = new BehaviorSubject<Tarefa[]>([]);
  private _tarefasEmAndamento = new BehaviorSubject<number>(0);
  private _tarefasVencidas = new BehaviorSubject<number>(0);
  readonly tarefasVencidas$ = this._tarefasVencidas.asObservable();

  readonly pessoas$           = this._pessoas.asObservable();
  readonly departamentos$     = this._departamentos.asObservable();
  readonly tarefas$           = this._tarefas.asObservable();
  readonly tarefasPendentes$  = this._tarefasPendentes.asObservable();
  readonly tarefasAlocadas$   = this._tarefasAlocadas.asObservable();
  readonly tarefasEmAndamento$ = this._tarefasEmAndamento.asObservable();

  // ── Getters de snapshot (úteis para lógica síncrona) ────────────────────

  get pessoas(): Pessoa[]           { return this._pessoas.getValue(); }
  get departamentos(): Departamento[] { return this._departamentos.getValue(); }
  get tarefas(): Tarefa[]           { return this._tarefas.getValue(); }

  constructor(
    private pessoaService: PessoaService,
    private departamentoService: DepartamentoService,
    private tarefaService: TarefaService
  ) {}

  // ── Carregamento ─────────────────────────────────────────────────────────

  /**
   * Dispara todas as requisições em paralelo com forkJoin.
   * Uma única viagem de rede substitui os 5 subscribes soltos que existiam
   * no DashboardComponent.
   */
  carregarTudo(): void {
    forkJoin({
      pessoas:       this.pessoaService.getAllPessoa().pipe(
                      map((r: any) => {
                        const data = r?.body !== undefined ? r.body : r;
                        return Array.isArray(data) ? data : [];
                      })
                    ),
      departamentos: this.departamentoService.getAllDepartamento().pipe(
                      map((r: any) => {
                        const data = r?.body !== undefined ? r.body : r;
                        return Array.isArray(data) ? data : [];
                      })
                    ),
      tarefas:       this.tarefaService.getAllTarefa().pipe(
                      map((r: any) => {
                        const data = r?.body !== undefined ? r.body : r;
                        return Array.isArray(data) ? data : [];
                      })
                    ),
    }).subscribe({
      next: ({ pessoas, departamentos, tarefas }) => {
        this._pessoas.next(pessoas);
        this._departamentos.next(departamentos);
        this._atualizarTarefas(tarefas);
      },
      error: (err) => console.error('Erro ao carregar dados do dashboard:', err)
    });

    this._carregarContagemEmAndamento();
  }

  recarregarTarefas(): void {
    this.tarefaService.getAllTarefa()
      .pipe(map((r: any) => {
        const data = r?.body !== undefined ? r.body : r;
        return Array.isArray(data) ? data : [];
      }))
      .subscribe({
        next: (tarefas) => this._atualizarTarefas(tarefas),
        error: (err) => console.error('Erro ao recarregar tarefas:', err)
      });

    this._carregarContagemEmAndamento();
  }

  recarregarPessoas(): void {
    this.pessoaService.getAllPessoa()
      .pipe(map((r: any) => {
        const data = r?.body !== undefined ? r.body : r;
        return Array.isArray(data) ? data : [];
      }))
      .subscribe({
        next: (pessoas) => this._pessoas.next(pessoas),
        error: (err) => console.error('Erro ao recarregar pessoas:', err)
      });
  }

  recarregarDepartamentos(): void {
    this.departamentoService.getAllDepartamento()
      .pipe(map((r: any) => {
        const data = r?.body !== undefined ? r.body : r;
        return Array.isArray(data) ? data : [];
      }))
      .subscribe({
        next: (depts) => this._departamentos.next(depts),
        error: (err) => console.error('Erro ao recarregar departamentos:', err)
      });
  }

  // ── Mutações locais (evitam um round-trip ao servidor) ───────────────────

  /** Adiciona uma pessoa já retornada pelo backend diretamente ao estado. */
  adicionarPessoa(pessoa: Pessoa): void {
    this._pessoas.next([...this.pessoas, pessoa]);
  }

  /** Substitui uma pessoa na posição correta pelo índice. */
  atualizarPessoa(index: number, pessoa: Pessoa): void {
    const lista = [...this.pessoas];
    lista[index] = pessoa;
    this._pessoas.next(lista);
  }

  /** Atualiza a ordem local das pessoas após drag-and-drop. */
  atualizarOrdemPessoas(pessoas: Pessoa[]): void {
    this._pessoas.next([...pessoas]);
  }

  /** Atualiza a ordem local dos departamentos após drag-and-drop. */
  atualizarOrdemDepartamentos(departamentos: Departamento[]): void {
    this._departamentos.next([...departamentos]);
  }

  /** Atualiza a ordem local das tarefas após drag-and-drop. */
  atualizarOrdemTarefas(tarefas: Tarefa[]): void {
    this._atualizarTarefas([...tarefas]);
  }

  /** Marca uma tarefa como finalizada diretamente no estado, sem novo GET. */
  marcarTarefaFinalizada(tarefaId: number, duracao?: number): void {
    const tarefas = this.tarefas.map(t => {
      if (t.id !== tarefaId) return t;
      // Cria nova instância de Tarefa para preservar os getters da classe
      const atualizada = Object.assign(new Tarefa(), t, {
        finalizado: true,
        duracao: duracao ?? t.duracao
      });
      return atualizada;
    });
    this._atualizarTarefas(tarefas);
  }

  // ── Helpers privados ─────────────────────────────────────────────────────

  /** Deriva tarefas pendentes e alocadas a partir da lista completa. */
  private _atualizarTarefas(tarefas: Tarefa[]): void {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    this._tarefas.next(tarefas);
    this._tarefasPendentes.next(
      tarefas.filter(t => !t.finalizado && !t.pessoaId && !t.pessoa && !(t.pessoasAlocadas?.length))
    );
    this._tarefasAlocadas.next(
      tarefas.filter(t => t.pessoaId != null || t.pessoa != null || (t.pessoasAlocadas && t.pessoasAlocadas.length > 0))
    );

    // Feature 2 & 5: conta vencidas
    const vencidas = tarefas.filter(t => {
      if (!t.prazo || t.finalizado) return false;
      const prazo = new Date(t.prazo);
      prazo.setHours(0, 0, 0, 0);
      return prazo < hoje;
    });
    this._tarefasVencidas.next(vencidas.length);
  }

  private _carregarContagemEmAndamento(): void {
    this.tarefaService.getContagemEmAndamento().subscribe({
      next: (data) => this._tarefasEmAndamento.next(data?.total ?? 0),
      error: () => {}
    });
  }
}
