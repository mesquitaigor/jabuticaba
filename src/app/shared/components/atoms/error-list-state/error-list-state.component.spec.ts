import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ErrorListStateComponent } from './error-list-state.component';

describe(ErrorListStateComponent.name, () => {
  let component: ErrorListStateComponent;
  let fixture: ComponentFixture<ErrorListStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorListStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorListStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('quando usuário clica no botão recarregar', () => {
    it('precisa emitir o evento reloadList', () => {
      // Arrange
      const reloadListSpy = jasmine.createSpy('reloadList');
      component.reloadList.subscribe(reloadListSpy);
      fixture.detectChanges();

      // Act
      const reloadButton = fixture.debugElement.query(By.css('p-button'));
      reloadButton.triggerEventHandler('onClick', null);

      // Assert
      expect(reloadListSpy).toHaveBeenCalledTimes(1);
    });
  });
});
