import { Injectable } from '@angular/core';
import { NAVIGATION_ITEMS } from './navigation-items.cont';
import { NavigationItem } from './navigation.types';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly navigationList = NAVIGATION_ITEMS;
  public getNavigationItems(): readonly NavigationItem[] {
    return this.navigationList;
  }
}
