import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-toolbar color="primary">
      <img src="assets/favicon.svg" alt="Zod4Vibe Logo" class="app-logo">
      <span>Zod4Vibe</span>
      <div class="spacer"></div>
      <a mat-button routerLink="/home" routerLinkActive="active">
        <mat-icon>home</mat-icon>
        Products
      </a>
      <a mat-button routerLink="/posts" routerLinkActive="active">
        <mat-icon>article</mat-icon>
        Posts
      </a>
    </mat-toolbar>

    <div class="content">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }

    .content {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .active {
      background: rgba(255, 255, 255, 0.1);
    }

    .app-logo {
      width: 32px;
      height: 32px;
      margin-right: 10px;
    }

    mat-toolbar {
      display: flex;
      align-items: center;
    }
  `]
})
export class AppComponent {} 