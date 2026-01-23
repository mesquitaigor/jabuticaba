import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { DrawerModule } from 'primeng/drawer';
import { SidebarService } from '../sidebar/sidebar.service';

@Component({
  selector: 'jbt-header',
  imports: [ButtonModule, AvatarModule, DrawerModule],
  templateUrl: './header.html',
})
export class HeaderComponent {
  private readonly sidebarService = inject(SidebarService);
  public openMenu(): void {
    this.sidebarService.sidebarOpen.set(true);
  }
}
