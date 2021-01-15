import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutRoutingModule } from './about.routing';
import { FaqComponent } from './faq.component';
import { TeamComponent } from './team.component';
import { TosComponent } from './tos.component';
import { SharedModule } from '../shared/shared.module';
import { MarkdownModule } from 'ngx-markdown';



@NgModule({
  declarations: [FaqComponent, TeamComponent, TosComponent],
  imports: [
    CommonModule,
    AboutRoutingModule,
    SharedModule,
    MarkdownModule.forChild(),
  ]
})
export class AboutModule { }
