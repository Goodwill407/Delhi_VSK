import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceRangeWiseComponent } from './attendance-range-wise.component';

describe('AttendanceRangeWiseComponent', () => {
  let component: AttendanceRangeWiseComponent;
  let fixture: ComponentFixture<AttendanceRangeWiseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttendanceRangeWiseComponent]
    });
    fixture = TestBed.createComponent(AttendanceRangeWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
