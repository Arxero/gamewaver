import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FaqComponent } from './faq/faq.component';
import { TeamComponent } from './team/team.component';
import { TosComponent } from './tos/tos.component';

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
