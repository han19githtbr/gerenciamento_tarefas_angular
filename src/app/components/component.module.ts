import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule, MatDialogRef, MatDialogTitle, MAT_DIALOG_DATA } from '@angular/material/dialog';
 import { MatButtonModule } from '@angular/material/button';
 import { MatMenuModule } from '@angular/material/menu';
 import { MatIconModule } from '@angular/material/icon';
 import { MatRadioModule } from '@angular/material/radio';
 import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatListModule} from '@angular/material/list';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import { AdicionarPessoaComponent } from './adicionar-pessoa/adicionar-pessoa.component';
import { AdicionarDepartamentoComponent } from './adicionar-departamento/adicionar-departamento.component';
import { AdicionarTarefaComponent } from './adicionar-tarefa/adicionar-tarefa.component';
import { AlertModalService } from '../services/alert-modal.service';
import { ConfirmacaoDialogComponent } from './confirmacao-dialog/confirmacao-dialog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FooterComponent } from './footer-component/footer-component.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ConfirmacaoDialogDepartmentComponent } from './confirmacao-dialog-department/confirmacao-dialog-department.component';
import { ConfirmacaoDialogTaskComponent } from './confirmacao-dialog-task/confirmacao-dialog-task.component';

const dialogMock = {
  close: () => { }
};

@NgModule({
  declarations: [
    AdicionarPessoaComponent,
    AdicionarDepartamentoComponent,
    AdicionarTarefaComponent,
    ConfirmacaoDialogComponent,
    ConfirmacaoDialogDepartmentComponent,
    ConfirmacaoDialogTaskComponent,
    /*DashboardPessoaComponent,
    DashboardDepartamentoComponent,
    DashboardTarefaComponent,*/
    FooterComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule, MatTreeModule, MatTooltipModule, MatToolbarModule, MatTabsModule, MatSortModule, MatSnackBarModule,
    BrowserModule, MatSlideToggleModule, MatSliderModule, MatSidenavModule, MatSelectModule, MatProgressSpinnerModule,
    FormsModule, MatProgressBarModule, MatPaginatorModule, MatNativeDateModule, MatRippleModule, MatListModule,
    ReactiveFormsModule, MatGridListModule, MatExpansionModule, MatDividerModule, MatDatepickerModule, MatStepperModule,
    BrowserAnimationsModule, MatChipsModule, MatCheckboxModule, MatCardModule, MatButtonToggleModule, MatBottomSheetModule,
    MatBadgeModule, MatAutocompleteModule,
    RouterModule, DragDropModule,
    MatButtonModule, HttpClientModule, MatSnackBarModule,
    MatMenuModule,
    MatIconModule,
    MatDialogModule,
    MatRadioModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [
    MatDatepickerModule,
    AdicionarPessoaComponent,
    AdicionarDepartamentoComponent,
    AdicionarTarefaComponent,
    ConfirmacaoDialogComponent,
    ConfirmacaoDialogDepartmentComponent,
    ConfirmacaoDialogTaskComponent,
    DashboardComponent,
    /*DashboardPessoaComponent,
    DashboardDepartamentoComponent,
    DashboardTarefaComponent,*/
    FooterComponent
  ],
  providers: [
    {provide: MatDialogTitle, useValue: []},
    { provide: MAT_DIALOG_DATA, useValue: [] },
    { provide: MatDialogRef, useValue: dialogMock },
    AlertModalService,
  ],
  entryComponents: []
})

export class ComponentesModule { }
