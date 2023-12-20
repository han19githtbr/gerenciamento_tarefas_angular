import { Departamento } from "./Departamento.model";
import { Tarefa } from "./Tarefa.model";

export class Pessoa {
  id: number | undefined;
  nome: string | undefined;
  departamento: Departamento = new Departamento();
  tarefas: Array<Tarefa> = [];
  ordem_apresentacao: any;
  mensagem: string;
  success: boolean;
}
