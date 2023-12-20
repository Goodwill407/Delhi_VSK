import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherGuestComponent } from './teacher-guest.component';

describe('TeacherGuestComponent', () => {
  let component: TeacherGuestComponent;
  let fixture: ComponentFixture<TeacherGuestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeacherGuestComponent]
    });
    fixture = TestBed.createComponent(TeacherGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
