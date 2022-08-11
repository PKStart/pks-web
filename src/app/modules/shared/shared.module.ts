import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
import { ConfirmationDialogComponent } from './components/confirmation-dialog.component'
import { LogoComponent } from './components/logo.component'
import { SnackbarComponent } from './components/snackbar.component'
import { AngularMaterialModule } from './material.module'

@NgModule({
  imports: [
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserAnimationsModule,
    RouterModule,
    HttpClientModule,
  ],
  exports: [
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserAnimationsModule,
    RouterModule,
    HttpClientModule,
    LogoComponent,
    ConfirmationDialogComponent,
    SnackbarComponent,
  ],
  declarations: [LogoComponent, ConfirmationDialogComponent, SnackbarComponent],
  providers: [],
})
export class SharedModule {}
