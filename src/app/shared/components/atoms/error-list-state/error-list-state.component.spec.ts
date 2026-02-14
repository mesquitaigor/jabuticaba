import { ComponentFixture, TestBed } from '@angular/core/testing';

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
});
