import { Component, inject, OnInit, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { GroceryItemService } from './data/entities/grocery-items/grocery-item.service';
import { SupabaseService } from './core/services/api/supabase.service';
import { FormsModule } from '@angular/forms';
import { DrawerModule } from 'primeng/drawer';
import { GroceryItemsListComponent } from './shared/components/organisms/grocery-items-list/grocery-items-list.component';
import GroceryItemModel from './data/entities/grocery-items/grocery-item.model';
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
    GroceryItemsListComponent,
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
  public groceryListElement = viewChild(GroceryItemsListComponent);
  public visibleShoppingDrawer = false;
  ngOnInit(): void {
    this.supabaseService.init();
  }
  public handleCreateNote(): void {
    this.groceryItemService.create(this.itemName).subscribe((data) => {
      const listComponent = this.groceryListElement();
      if (data && listComponent) {
        listComponent.addToList(data);
      }
      this.itemName = '';
    });
  }
  public handleFilterList(list: GroceryItemModel[]): GroceryItemModel[] {
    return list.filter((item) => item.missing);
  }
}
