import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingAndAccountsComponent } from './billing-and-accounts.component';

describe(BillingAndAccountsComponent.name, () => {
  let component: BillingAndAccountsComponent;
  let fixture: ComponentFixture<BillingAndAccountsComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingAndAccountsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BillingAndAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
