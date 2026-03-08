import { Component } from '@angular/core';
import { RuxButton, RuxIcon } from '@astrouxds/angular';

const dayIcon = 'brightness-2';
const nightIcon = 'brightness-7';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
  standalone: true,
  imports: [RuxButton, RuxIcon],
})
export class Header {
  darkMode = true; // default to dark mode
  icon = nightIcon;

  constructor() {
    // Check saved preference in localStorage
    const saved = localStorage.getItem('theme');

    if (saved === 'light') {
      this.darkMode = false;
    }

    this.applyClass();
  }

  ngOnInit() {}

  toggleTheme() {
    this.darkMode = !this.darkMode;
    this.icon = this.darkMode ? dayIcon : nightIcon;
    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
    this.applyClass();
  }

  private applyClass() {
    document.body.classList.toggle('dark-mode', this.darkMode);
  }
}
