import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroceryItemIconDialog } from './grocery-item-icon.dialog';

describe('GroceryItemIconDialog', () => {
  let component: GroceryItemIconDialog;
  let fixture: ComponentFixture<GroceryItemIconDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroceryItemIconDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(GroceryItemIconDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
