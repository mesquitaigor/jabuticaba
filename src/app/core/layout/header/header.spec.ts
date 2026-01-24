import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header';
import { SidebarService } from '../sidebar/sidebar.service';
import { By } from '@angular/platform-browser';

describe(HeaderComponent.name, () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let sidebarService: SidebarService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [SidebarService],
    }).compileComponents();
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    sidebarService = TestBed.inject(SidebarService);
  });

  it('deve criar o componente', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('deve chamar sidebarService.sidebarOpen.set(true) ao clicar no botão de menu', () => {
    spyOn(sidebarService.sidebarOpen, 'set');
    fixture.detectChanges();
    const button = fixture.debugElement.query(
      By.css('[data-testid="header-sidebar-button"]'),
    );
    button.triggerEventHandler('click');
    expect(sidebarService.sidebarOpen.set).toHaveBeenCalledOnceWith(true);
  });

  it('deve renderizar o logo', () => {
    fixture.detectChanges();
    const logo = fixture.debugElement.query(
      By.css('[data-testid="header-logo"]'),
    );
    expect(logo).toBeTruthy();
  });

  it('deve renderizar o avatar com label U', () => {
    fixture.detectChanges();
    const avatar = fixture.debugElement.query(
      By.css('[data-testid="header-avatar"]'),
    );
    expect(avatar).toBeTruthy();
    expect(avatar.attributes['label']).toBe('U');
  });
});
