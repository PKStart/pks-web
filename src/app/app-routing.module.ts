import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthComponent } from './modules/auth/auth.component'
import { AuthGuard } from './modules/auth/auth.guard'
import { MainComponent } from './modules/main/main.component'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: MainComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    component: AuthComponent,
  },
  {
    path: '**',
    redirectTo: '/',
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
