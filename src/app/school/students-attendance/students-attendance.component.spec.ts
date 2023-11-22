import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsAttendanceComponent } from './students-attendance.component';

describe('StudentsAttendanceComponent', () => {
  let component: StudentsAttendanceComponent;
  let fixture: ComponentFixture<StudentsAttendanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentsAttendanceComponent]
    });
    fixture = TestBed.createComponent(StudentsAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
