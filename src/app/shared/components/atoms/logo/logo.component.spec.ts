import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { DataTestId } from '../../../directives/data-testid';
import { LogoComponent } from './logo.component';
import { DataTestIdHelper } from '../../../../tests/helpers/data-testid.helper.spec';

describe(LogoComponent.name, () => {
  let fixture: ComponentFixture<LogoComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoComponent);
    debugElement = fixture.debugElement;
  });

  describe('quando o componente é renderizado', () => {
    it('precisa renderizar o logo com data-testid correto', () => {
      fixture.detectChanges();

      const logoElement = DataTestIdHelper.query(
        debugElement,
        DataTestId.Sidebar.Logo,
      );

      expect(logoElement).toBeTruthy();
      expect(logoElement?.nativeElement.querySelector('img')).toBeTruthy();
    });

    it('precisa mostrar o título quando showTitle é true', () => {
      fixture.componentRef.setInput('showTitle', true);
      fixture.detectChanges();

      const logoElement = DataTestIdHelper.queryOrFail(
        debugElement,
        DataTestId.Sidebar.Logo,
      );
      const titleElement = logoElement.nativeElement.querySelector('h5');

      expect(titleElement).toBeTruthy();
      expect(titleElement?.textContent).toContain('Jabuticaba');
    });

    it('não precisa mostrar o título quando showTitle é false', () => {
      fixture.componentRef.setInput('showTitle', false);
      fixture.detectChanges();

      const logoElement = DataTestIdHelper.queryOrFail(
        debugElement,
        DataTestId.Sidebar.Logo,
      );
      const titleElement = logoElement.nativeElement.querySelector('h5');

      expect(titleElement).toBeFalsy();
    });
  });
});
