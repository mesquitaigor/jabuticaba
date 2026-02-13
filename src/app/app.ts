import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SupabaseService } from './core/services/api/supabase.service';
import { FormsModule } from '@angular/forms';
import { DrawerModule } from 'primeng/drawer';
import { SidebarComponent } from './core/layout/sidebar/sidebar.component';
import { MessageService } from 'primeng/api';
import { DialogComponent } from './core/layout/dialog/dialog.component';
import { HeaderComponent } from '@layout/header';

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
  styleUrl: './app.scss',
})
export class AppComponent implements OnInit {
  private readonly supabaseService = inject(SupabaseService);
  public itemName = '';
  public visibleShoppingDrawer = false;
  ngOnInit(): void {
    this.supabaseService.init();
  }
}
