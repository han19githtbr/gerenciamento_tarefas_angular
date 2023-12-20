import { Departamento } from "./Departamento.model";
import { Pessoa } from "./Pessoa.model";

export class Tarefa {
  id: number | undefined;
  descricao: string | undefined;
  prazo: Date | undefined;
  departamento: Departamento | undefined;
  duracao: number | undefined;
  finalizado: boolean | undefined;
  pessoa: Pessoa | undefined;
  dataCriacao: Date | undefined;
  titulo: any;
  ordem_apresentacao: any;
  mensagem: string;
  success: boolean;
}
