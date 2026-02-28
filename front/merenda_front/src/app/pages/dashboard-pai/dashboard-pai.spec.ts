import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPai } from './dashboard-pai';

describe('DashboardPai', () => {
  let component: DashboardPai;
  let fixture: ComponentFixture<DashboardPai>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPai],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPai);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
