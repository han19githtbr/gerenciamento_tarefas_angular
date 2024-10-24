import { Component, OnInit } from '@angular/core';
import { TarefaService } from '../../services/tarefa.service';
import { ToastrService } from 'ngx-toastr';
//import { PessoaService } from 'src/app/services/pessoa.service';

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
  selector: 'app-alocar-pessoa-tarefa',
  templateUrl: './alocar-pessoa-tarefa.component.html',
  styleUrls: ['./alocar-pessoa-tarefa.component.css']
})
export class AlocarPessoaTarefaComponent implements OnInit {

  tarefaId: number;
  pessoaId: number;

  constructor(private tarefaService: TarefaService, private toastr: ToastrService) { }

  ngOnInit() {

  }


  showSuccess(message: string) {
    this.toastr.success(message, 'Sucesso', getToastOptions());
  }

  showError(message: string) {
    this.toastr.error(message, 'Erro', getToastOptions());
  }

  alocarPessoaNaTarefa(): void {
    this.tarefaService.alocarPessoaNaTarefa(this.tarefaId, this.pessoaId).subscribe(
      response => {
        if (response.success) {
          this.showSuccess("A pessoa foi alocada com sucesso."); // ou faça qualquer outra coisa com a resposta
        } else {
          this.showError("Erro ao tentar alocar a pessoa na tarefa") // ou trate o erro de acordo com sua necessidade
        }
      },
      error => {
        console.error('Ocorreu um erro:', error);
      }
    );
  }
}
