import { Departamento } from "./Departamento.model";
import { Pessoa } from "./Pessoa.model";

export class Tarefa {
  id: number | undefined;
  descricao: string | undefined;
  prazo: Date | undefined;
  departamento: Departamento | undefined;
  departamentoId?: number;
  pessoaId: number;
  duracao: number | undefined;
  finalizado: boolean | undefined;
  pessoa: Pessoa | undefined;
  // Feature 1: lista de todas as pessoas alocadas
  pessoasAlocadas?: { id: number; nome: string; email?: string }[];
  dataCriacao: Date | undefined;
  titulo: any;
  ordem_apresentacao: any;
  mensagem: string;
  success: boolean;
  // Feature 2 & 5: tarefa com prazo vencido
  vencida?: boolean;

  constructor() {
    this.departamento = new Departamento();
  }

  /** Helper: retorna true se o prazo já passou e não foi finalizada */
  get isPrazoVencido(): boolean {
    if (!this.prazo || this.finalizado) return false;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const prazo = new Date(this.prazo);
    prazo.setHours(0, 0, 0, 0);
    return prazo < hoje;
  }
}
