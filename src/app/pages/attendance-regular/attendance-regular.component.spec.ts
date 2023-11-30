import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceRegularComponent } from './attendance-regular.component';

describe('AttendanceRegularComponent', () => {
  let component: AttendanceRegularComponent;
  let fixture: ComponentFixture<AttendanceRegularComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttendanceRegularComponent]
    });
    fixture = TestBed.createComponent(AttendanceRegularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
