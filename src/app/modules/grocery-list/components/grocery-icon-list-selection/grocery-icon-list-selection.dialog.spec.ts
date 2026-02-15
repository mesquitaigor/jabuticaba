import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroceryIconListSelectionDialog } from './grocery-icon-list-selection.dialog';

describe(GroceryIconListSelectionDialog.name, () => {
  let component: GroceryIconListSelectionDialog;
  let fixture: ComponentFixture<GroceryIconListSelectionDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroceryIconListSelectionDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(GroceryIconListSelectionDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
