import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertModalService } from 'src/app/services/alert-modal.service';
import { Tarefa } from 'src/app/model/Tarefa.model';
import { TarefaService } from 'src/app/services/tarefa.service';
import { ToastrService } from 'ngx-toastr';
import { Departamento } from 'src/app/model/Departamento.model';
import { DepartamentoService } from 'src/app/services/departamento.service';
//import { IaService } from 'src/app/services/ia.service';
import { IaService } from '../../services/ia.service';


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

  // ── Estado da IA ─────────────────────────────────────────────────────────
  iaLoadingDescricao = false;   // spinner do botão "Gerar Descrição"
  iaLoadingPrazo     = false;   // spinner do botão "Sugerir Prazo"
  iaMensagem: string = '';      // feedback inline abaixo dos botões de IA
  // ─────────────────────────────────────────────────────────────────────────

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AdicionarTarefaComponent>,
    private alertModalService: AlertModalService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tarefaService: TarefaService,
    public departamentoService: DepartamentoService,
    private toastr: ToastrService,
    private iaService: IaService   // ← NOVO
  ) {
    this.title = data['title'];
    this.tarefa.id = data['id'];
    this.tarefa.titulo = data['titulo'];
    this.tarefa.descricao = data['descricao'];
    this.tarefa.prazo = data['prazo'];
    this.tarefa.ordem_apresentacao = data['ordem_apresentacao'];
    this.oldTitle = data['titulo'];
    this.tarefaButton = data['tarefaButton'];

    if (!this.tarefa.departamento) {
      this.tarefa.departamento = new Departamento();
      this.tarefa.departamento.id = data['departamentoId'];
    }
  }

  ngOnInit() {
    this.form = this.fb.group({
      titulo:        ['', [Validators.required, Validators.maxLength(255)]],
      descricao:     ['', Validators.required],
      prazo:         ['', [Validators.required, this.dataValida]],
      departamentoId: ['', Validators.required]
    });

    if (this.tarefaButton === 'Edit') {
      this.form.patchValue({
        titulo:    this.tarefa.titulo   || '',
        descricao: this.tarefa.descricao || '',
        prazo: this.tarefa.prazo
          ? new Date(this.tarefa.prazo).toISOString().split('T')[0]
          : ''
      });
    }

    this.departamentoService.getAllDepartamento().subscribe((data: any) => {
      this.departamentos = data.body;
      if (this.tarefa.departamento?.id && this.tarefaButton === 'Edit') {
        this.form.patchValue({ departamentoId: this.tarefa.departamento.id });
        this.onDepartment();
      }
    });

    this.tarefaService.getAllTarefa().subscribe((data: any) => {
      this.tarefas = data.body;
    });
  }

  // ── Feature 3: Gerar descrição ────────────────────────────────────────────

  gerarDescricaoComIA(): void {
    const titulo = this.form.get('titulo')?.value?.trim();
    if (!titulo) {
      this.iaMensagem = '⚠️ Preencha o título antes de gerar a descrição.';
      return;
    }

    this.iaLoadingDescricao = true;
    this.iaMensagem = '';

    this.iaService.gerarDescricao(titulo).subscribe({
      next: (res) => {
        this.form.patchValue({ descricao: res.descricao });
        this.iaMensagem = '✅ Descrição gerada pela IA com sucesso!';
        this.iaLoadingDescricao = false;
      },
      error: () => {
        this.iaMensagem = '❌ Erro ao gerar descrição. Tente novamente.';
        this.iaLoadingDescricao = false;
      }
    });
  }

  // ── Feature 2: Sugerir prazo ─────────────────────────────────────────────

  sugerirPrazoComIA(): void {
    const titulo   = this.form.get('titulo')?.value?.trim();
    const descricao = this.form.get('descricao')?.value?.trim();

    if (!titulo) {
      this.iaMensagem = '⚠️ Preencha o título antes de sugerir o prazo.';
      return;
    }

    this.iaLoadingPrazo = true;
    this.iaMensagem = '';

    this.iaService.sugerirPrazo(titulo, descricao || titulo).subscribe({
      next: (res) => {
        this.form.patchValue({ prazo: res.prazoSugerido });
        this.iaMensagem = `✅ Prazo sugerido pela IA: ${res.diasSugeridos} dias (${this.formatarData(res.prazoSugerido)})`;
        this.iaLoadingPrazo = false;
      },
      error: () => {
        this.iaMensagem = '❌ Erro ao sugerir prazo. Tente novamente.';
        this.iaLoadingPrazo = false;
      }
    });
  }

  private formatarData(iso: string): string {
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  }

  // ─────────────────────────────────────────────────────────────────────────

  fecharCadastrarDialog(): void { this.dialogRef.close(); }

  onDepartment() {
    const deptId = this.form.get('departamentoId')?.value;
    if (deptId) {
      if (!this.tarefa.departamento) this.tarefa.departamento = new Departamento();
      this.tarefa.departamento.id = +deptId;
    }
  }

  showSuccess(message: string) { this.toastr.success(message, 'Sucesso', getToastOptions()); }
  showError(message: string)   { this.toastr.error(message,   'Erro',    getToastOptions()); }

  dataValida(control: FormControl) {
    const inputDate = new Date(control.value);
    if (isNaN(inputDate.getTime())) return { dataInvalida: true };
    return null;
  }

  submit(form: any) {
    this.disableBox = true;

    if (this.form.invalid) {
      this.disableBox = false;
      this.marcarCamposComoMarcados();
      return;
    }

    this.tarefa.titulo    = this.form.get('titulo')?.value;
    this.tarefa.descricao = this.form.get('descricao')?.value;
    this.tarefa.prazo     = this.form.get('prazo')?.value;

    this.onDepartment();

    const deptId = this.form.get('departamentoId')?.value;
    if (!deptId) {
      this.disableBox = false;
      this.showError('Selecione um departamento.');
      return;
    }

    const payload = {
      id:                  this.tarefa.id,
      titulo:              this.tarefa.titulo,
      descricao:           this.tarefa.descricao,
      prazo:               this.tarefa.prazo,
      departamento:        { id: +deptId },
      ordem_apresentacao:  this.tarefa.ordem_apresentacao
    };

    if (this.tarefaButton === 'Create') {
      this.tarefaService.salvarTarefa(payload).subscribe({
        next: (response: any) => {
          if (response.body?.success) {
            this.showSuccess(response.body.mensagem || 'A tarefa foi salva com sucesso.');
            this.dialogRef.close({ success: true, tarefa: response.body });
          } else {
            this.disableBox = false;
            this.showError(response.body?.mensagem || 'Erro ao salvar a tarefa');
          }
        },
        error: () => {
          this.disableBox = false;
          this.showError('Erro de conexão com o servidor. Verifique se o back-end está rodando.');
        }
      });
    } else {
      const nomeTarefa = encodeURIComponent(this.oldTitle);
      this.tarefaService.alterarTarefa(nomeTarefa, payload).subscribe({
        next: (response: any) => {
          if (response.body?.success) {
            this.showSuccess(response.body.mensagem || 'A tarefa foi alterada com sucesso.');
            this.dialogRef.close(response.body);
          } else {
            this.disableBox = false;
            this.showError(response.body?.mensagem || 'Erro ao alterar a tarefa');
          }
        },
        error: () => {
          this.disableBox = false;
          this.showError('Erro de conexão com o servidor.');
        }
      });
    }
  }

  private marcarCamposComoMarcados() {
    Object.keys(this.form.controls).forEach(key => this.form.get(key)?.markAsTouched());
    if (this.form.get('titulo')?.hasError('required'))       this.showError('O título é obrigatório.');
    if (this.form.get('descricao')?.hasError('required'))    this.showError('A descrição é obrigatória.');
    if (this.form.get('prazo')?.hasError('required'))        this.showError('O prazo é obrigatório.');
    if (this.form.get('departamentoId')?.hasError('required')) this.showError('Selecione um departamento.');
  }
}
