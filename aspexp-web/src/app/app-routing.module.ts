import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewComponent } from './new/new.component';
import { GroundingComponent } from './grounding/grounding.component';

const routes: Routes = [
  { path: 'homePage', component: NewComponent },
  { path: 'grounding', component: GroundingComponent},
  { path: '', redirectTo: '/homePage', pathMatch: 'full' }
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ]
})
export class AppRoutingModule { }
