import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'jbt-header',
  imports: [ButtonModule, AvatarModule, DrawerModule],
  templateUrl: './header.html',
})
export class HeaderComponent {
  public readonly menuOpen = signal(false);
  public openMenu(): void {
    this.menuOpen.set(!this.menuOpen());
  }
}
