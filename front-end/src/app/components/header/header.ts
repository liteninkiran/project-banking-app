import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RuxButton, RuxClock, RuxGlobalStatusBar, RuxIcon } from '@astrouxds/angular';
import { map, timer } from 'rxjs';

const dayIcon = 'brightness-2';
const nightIcon = 'brightness-7';

const lightTheme = 'light-theme';
const darkTheme = 'dark-theme';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RuxButton, RuxIcon, RuxGlobalStatusBar, RuxClock, DatePipe, AsyncPipe],
})
export class Header {
  darkMode = true;
  icon = nightIcon;
  time$ = timer(this.getInitialDelay(), 60000).pipe(map(() => new Date()));

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

  private getInitialDelay() {
    const now = new Date();
    return (60 - now.getSeconds()) * (1000 - now.getMilliseconds());
  }
}
