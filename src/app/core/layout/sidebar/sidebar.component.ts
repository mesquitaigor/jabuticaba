import { Component, inject } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { SidebarService } from './sidebar.service';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'jbt-sidebar',
  imports: [DrawerModule, MenuModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  public readonly sidebarService = inject(SidebarService);
  public readonly items: MenuItem[] = [
    { label: 'New', icon: 'pi pi-plus' },
    { label: 'Search', icon: 'pi pi-search' },
  ];
}
