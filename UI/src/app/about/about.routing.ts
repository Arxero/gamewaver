import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FaqComponent } from './faq.component';
import { TeamComponent } from './team.component';
import { TosComponent } from './tos.component';

export const aboutRoute = 'about';

const routes: Routes = [
  { path: 'faq', component: FaqComponent },
  { path: 'team', component: TeamComponent },
  { path: 'tos', component: TosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutRoutingModule { }
