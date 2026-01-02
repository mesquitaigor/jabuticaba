import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { GroceryItemService } from './data/entities/grocery-items/grocery-item.service';
import { SupabaseService } from './core/services/api/supabase.service';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, InputTextModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent implements OnInit {
  private readonly shoppingListItemsService: GroceryItemService =
    inject(GroceryItemService);
  private readonly supabaseService = inject(SupabaseService);
  public itemName = '';
  ngOnInit(): void {
    this.supabaseService.init();
    this.shoppingListItemsService.create('Test Item').subscribe((data) => {
      console.log('Item created:', data);
    });
  }
}
