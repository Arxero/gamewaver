import { Component } from '@angular/core';

export interface ExpansionPanel {
  title: string;
  text: string;
  description?: string;
  isOpen?: boolean;
}

@Component({
  selector: 'gw-faq',
  templateUrl: './faq.component.html',
})
export class FaqComponent {
  faqItems: ExpansionPanel[] = [
    {
      title: 'What is Gamewaver?',
      text: `Gamewaver is a project started by two fellow gamers with the idea to bring the joy of playing together and sharing their gaming experience with their communities.`,
    },
    {
      title: 'Does this website censor people like other social media does?',
      text: `No, we don't, we value our user's opinion whatever it is as long as its within limits of our [terms](./about/tos).`,
    },
    {
      title: 'Is my data protected?',
      text: `Yes, it is. We do our best to keep your information secure.`,
    },
    {
      title: 'How this website makes money?',
      text: `Currently, Gamewaver does not generate any money and will be like that until its popular enough
      for advertisement.`,
    },
    {
      title: 'Who made this website and why?',
      text: `His name is Maverick and the reason is, he wanted to always have friends to play with any game he wants.`
    },
  ];
}
