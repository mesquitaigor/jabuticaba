import { Component, inject } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'jbt-sidebar',
  imports: [DrawerModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  public readonly sidebarService = inject(SidebarService);
}
