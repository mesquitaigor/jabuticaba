import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { GroceryItemService } from './data/entities/grocery-items/grocery-item.service';
import { SupabaseService } from './core/services/api/supabase.service';
import { FormsModule } from '@angular/forms';
import { DrawerModule } from 'primeng/drawer';
import { HeaderComponent } from './core/layout/header/header';
import { SidebarComponent } from './core/layout/sidebar/sidebar.component';

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
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent implements OnInit {
  private readonly groceryItemService: GroceryItemService =
    inject(GroceryItemService);
  private readonly supabaseService = inject(SupabaseService);
  public itemName = '';
  public visibleShoppingDrawer = false;
  ngOnInit(): void {
    this.supabaseService.init();
  }
}
