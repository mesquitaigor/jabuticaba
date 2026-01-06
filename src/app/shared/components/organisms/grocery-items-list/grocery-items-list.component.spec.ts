import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroceryItemsListComponent } from './grocery-items-list.component';

describe(GroceryItemsListComponent.name, () => {
  let component: GroceryItemsListComponent;
  let fixture: ComponentFixture<GroceryItemsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroceryItemsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GroceryItemsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
