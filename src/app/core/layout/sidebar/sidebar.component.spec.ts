import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { SidebarService } from './sidebar.service';
import { NavigationService } from '../../navigation/navigation.service';
import { By } from '@angular/platform-browser';
import { DrawerModule } from 'primeng/drawer';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { LogoComponent } from '../../../shared/components/atoms/logo/logo.component';
import { RouterModule } from '@angular/router';
import { GroceryListComponent } from '../../../modules/grocery-list/grocery-list.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe(SidebarComponent.name, () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let sidebarService: SidebarService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SidebarComponent,
        DrawerModule,
        MenuModule,
        ButtonModule,
        LogoComponent,
        RouterModule.forRoot([{ path: '', component: GroceryListComponent }]),
      ],
      providers: [SidebarService, NavigationService, provideAnimationsAsync()],
    }).compileComponents();
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    sidebarService = TestBed.inject(SidebarService);
  });

  it('deve criar o componente', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('deve renderizar o logo', () => {
    sidebarService.sidebarOpen.set(true);
    fixture.detectChanges();
    const logo = fixture.debugElement.query(
      By.css('[data-testid="sidebar-logo"]'),
    );
    expect(logo).toBeTruthy();
  });

  it('deve renderizar o menu', () => {
    sidebarService.sidebarOpen.set(true);
    fixture.detectChanges();
    const menu = fixture.debugElement.query(
      By.css('[data-testid="sidebar-menu"]'),
    );
    expect(menu).toBeTruthy();
  });

  it('deve fechar o drawer ao clicar no botão de fechar', () => {
    spyOn(component, 'closeCallback');
    sidebarService.sidebarOpen.set(true);
    fixture.detectChanges();
    const button = fixture.debugElement.query(
      By.css('[data-testid="sidebar-close-button"]'),
    );
    button.triggerEventHandler('click');
    expect(component.closeCallback).toHaveBeenCalled();
  });
});
