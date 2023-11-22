import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';

const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'content', loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule) },
  { path: 'content', loadChildren: () => import('./school/school.module').then(m => m.SchoolModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
