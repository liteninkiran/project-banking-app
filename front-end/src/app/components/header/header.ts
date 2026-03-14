import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RuxButton, RuxClock, RuxGlobalStatusBar, RuxIcon } from '@astrouxds/angular';

const dayIcon = 'brightness-2';
const nightIcon = 'brightness-7';

const lightTheme = 'light-theme';
const darkTheme = 'dark-theme';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
  standalone: true,
  imports: [RuxButton, RuxIcon, RuxGlobalStatusBar, RuxClock, DatePipe],
})
export class Header {
  darkMode = true;
  icon = nightIcon;
  myDate = new Date();

  constructor() {
    if (localStorage.getItem('theme') === lightTheme) {
      this.darkMode = false;
    }

    this.applyClass();
  }

  ngOnInit() {}

  toggleSidenav() {}

  toggleTheme() {
    this.darkMode = !this.darkMode;
    this.icon = this.darkMode ? dayIcon : nightIcon;
    localStorage.setItem('theme', this.darkMode ? darkTheme : lightTheme);
    this.applyClass();
  }

  private applyClass() {
    document.body.classList.toggle(lightTheme, !this.darkMode);
  }
}
