import { Pessoa } from "./Pessoa.model";
import { Tarefa } from "./Tarefa.model";

export class Departamento {
  id: number | undefined;
  titulo: string | undefined;
  ordem_apresentacao: any;
  mensagem: string;
  success: boolean;
}
