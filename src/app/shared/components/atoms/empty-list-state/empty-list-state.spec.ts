import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyListState } from './empty-list-state';

describe('EmptyListState', () => {
  let component: EmptyListState;
  let fixture: ComponentFixture<EmptyListState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyListState],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyListState);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
