import { SidebarService } from './sidebar.service';
import { NavigationService } from '../../navigation/navigation.service';
import { TestBed } from '@angular/core/testing';

describe(SidebarService.name, () => {
  let service: SidebarService;
  let navigationService: jasmine.SpyObj<NavigationService>;

  beforeEach(() => {
    navigationService = jasmine.createSpyObj<NavigationService>(
      'NavigationService',
      ['getNavigationItems'],
    );
    TestBed.configureTestingModule({
      providers: [
        SidebarService,
        { provide: NavigationService, useValue: navigationService },
      ],
    });
    service = TestBed.inject(SidebarService);
  });

  it('deve ser criado corretamente', () => {
    // Arrange feito no beforeEach
    // Act & Assert
    expect(service).toBeTruthy();
  });
});
