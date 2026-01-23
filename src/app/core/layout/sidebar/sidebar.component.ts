import { Component, inject, OnInit, viewChild } from '@angular/core';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { SidebarService } from './sidebar.service';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { LogoComponent } from '../../../shared/components/atoms/logo/logo.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'jbt-sidebar',
  imports: [DrawerModule, MenuModule, LogoComponent, ButtonModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  public readonly drawerRef = viewChild<Drawer>('drawerRef');
  public readonly sidebarService = inject(SidebarService);
  public items: MenuItem[] = [];
  public ngOnInit(): void {
    this.items = this.sidebarService.getMenuItems();
    this.sidebarService.setCloseOnNavigation();
  }
  public closeCallback(e: Event): void {
    this.drawerRef()?.close(e);
  }
}
