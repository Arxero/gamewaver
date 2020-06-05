import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutRoutingModule } from './about.routing';
import { FaqComponent } from './faq/faq.component';
import { TeamComponent } from './team/team.component';
import { TosComponent } from './tos/tos.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [FaqComponent, TeamComponent, TosComponent],
  imports: [
    CommonModule,
    AboutRoutingModule,
    SharedModule
  ]
})
export class AboutModule { }
