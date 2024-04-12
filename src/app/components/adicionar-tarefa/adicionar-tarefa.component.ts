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
  }

  ngOnInit() {
      this.form = this.fb.group({
        titulo: ['', [Validators.required, Validators.maxLength(255)]],
        descricao: ['', Validators.required],
        prazo: ['', [Validators.required, this.dataValida]],
      });
      this.formDepartment = this.fb.group({
        id: ["", Validators.required]
      });
      this.tarefaService.getAllTarefa().subscribe((data: any) => {
        this.tarefas = data.body;
        console.log(this.tarefas);
      });
      this.departamentoService.getAllDepartamento().subscribe((data: any) => {
        this.departamentos = data.body;
      });
  }


  fecharCadastrarDialog(): void{
    this.dialogRef.close();
  }

  onDepartment() {
    this.tarefa.departamento.id = +this.formDepartment.controls['id'].value;
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
    const tituloControl = form.get('titulo');
    if(!tituloControl.value){
        this.disableBox = false;
        this.showError("O campo tem que ser preenchido.")
        //this.alertModalService.mostrarMensagem("O campo tem que ser preenchido.", this.alertModalService.ERRO);
    } else {
        if(this.tarefaButton == "Create"){

            this.tarefaService.salvarTarefa(this.tarefa).subscribe(data => {
                if(data.body.success){
                    this.tarefa.id = data.body.id;
                    this.tarefa.departamento.id = data.body.departamento.id;
                    this.tarefa.titulo = data.body.titulo;
                    this.tarefa.descricao = data.body.descricao;
                    this.tarefa.prazo = data.body.prazo;
                    this.tarefa.ordem_apresentacao = data.body.ordem_apresentacao;
                    this.tarefa.mensagem = data.body.mensagem;
                    this.showSuccess("A tarefa foi salva com sucesso.")
                    //this.alertModalService.mostrarMensagem(data.body.mensagem, this.alertModalService.SUCESSO);
                    this.dialogRef.close(this.tarefa);
                } else{
                    this.disableBox = false;
                    //this.alertModalService.mostrarMensagem(data.body.mensagem, this.alertModalService.ERRO);
                    this.showError("Erro ao salvar a tarefa")
                }
            })
          } else {
                const nomeTarefa = encodeURIComponent(this.oldTitle);
                this.tarefaService.alterarTarefa(nomeTarefa, this.tarefa).subscribe(data => {
                  if(data.body.success){
                      this.tarefa.id = data.body.id;
                      this.tarefa.departamento.id = data.body.departamento.id;
                      this.tarefa.titulo = data.body.titulo;
                      this.tarefa.descricao = data.body.descricao;
                      this.tarefa.prazo = data.body.prazo;
                      this.tarefa.ordem_apresentacao = data.body.ordem_apresentacao;
                      this.tarefa.mensagem = data.body.mensagem;
                      //this.alertModalService.mostrarMensagem(data.body.mensagem, this.alertModalService.SUCESSO);
                      this.showSuccess("A tarefa foi alterada com sucesso.")
                      this.dialogRef.close(this.tarefa);
                  } else {
                      this.disableBox = false;
                      //this.alertModalService.mostrarMensagem(data.body.mensagem, this.alertModalService.ERRO);
                      this.showError("Erro ao alterar a tarefa")
                  }
                })
      }
    }
  }
}
