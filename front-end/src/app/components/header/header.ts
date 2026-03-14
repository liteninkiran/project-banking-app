import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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
  imports: [RuxButton, RuxIcon, RuxGlobalStatusBar, RuxClock, DatePipe],
})
export class Header {
  private readonly intervalSeconds = 10;
  private time$ = timer(
    this.getInitialDelay(this.intervalSeconds),
    this.intervalSeconds * 1000,
  ).pipe(map(() => new Date()));

  public currentTime = toSignal(this.time$, { initialValue: new Date() });
  public darkMode = true;
  public icon = nightIcon;

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

  private getInitialDelay(n: number): number {
    const now = new Date();
    const seconds = now.getSeconds();
    const ms = now.getMilliseconds();

    // Find next multiple of n
    const next = Math.ceil((seconds + ms / 1000) / n) * n;

    // It takes about 200ms to do all of this
    const compOffset = 200;

    return next * 1000 - (seconds * 1000 + ms) - compOffset;
  }
}
