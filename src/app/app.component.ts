import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Angular Lab';
  colorMode = '';

  constructor() {}

  setColorMode(mode: string) {
    this.colorMode = mode;
  }
}
