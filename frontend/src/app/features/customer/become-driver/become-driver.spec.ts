import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeDriver } from './become-driver';

describe('BecomeDriver', () => {
  let component: BecomeDriver;
  let fixture: ComponentFixture<BecomeDriver>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BecomeDriver],
    }).compileComponents();

    fixture = TestBed.createComponent(BecomeDriver);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
