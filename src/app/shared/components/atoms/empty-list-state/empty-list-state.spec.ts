import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyListStateComponent } from './empty-list-state';

describe(EmptyListStateComponent.name, () => {
  let component: EmptyListStateComponent;
  let fixture: ComponentFixture<EmptyListStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyListStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyListStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
