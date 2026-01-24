import { inject, Injectable } from '@angular/core';
import { NAVIGATION_ITEMS } from './navigation-items.cont';
import { NavigationItem } from './navigation.types';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly router = inject(Router);
  private readonly navigationList = NAVIGATION_ITEMS;
  public getNavigationItems(): readonly NavigationItem[] {
    return this.navigationList;
  }
  public getNavigationItemByRoute(): NavigationItem | undefined {
    const activeRoute = this.router.url.replace('/', '');
    return this.navigationList.find((item) => item.route === activeRoute);
  }
}
