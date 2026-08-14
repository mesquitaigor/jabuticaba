import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DrawerModule } from 'primeng/drawer';
import { SidebarComponent } from './core/layout/sidebar/sidebar.component';
import { MessageService } from 'primeng/api';
import { HeaderComponent } from '@layout/header';
import { DialogComponent } from '@layout/dialog';
import { SupabaseService } from '@api/supabase.service';
import AuthService from './core/auth/auth.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ButtonModule,
    FormsModule,
    DrawerModule,
    HeaderComponent,
    SidebarComponent,
    DialogComponent,
  ],
  providers: [MessageService],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly supabaseService = inject(SupabaseService);
  public readonly isAuthenticated = this.authService.isAuthenticated;
  ngOnInit(): void {
    this.supabaseService.init();
  }
}
