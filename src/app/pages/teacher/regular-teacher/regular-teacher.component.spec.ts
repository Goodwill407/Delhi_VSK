import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularTeacherComponent } from './regular-teacher.component';

describe('RegularTeacherComponent', () => {
  let component: RegularTeacherComponent;
  let fixture: ComponentFixture<RegularTeacherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegularTeacherComponent]
    });
    fixture = TestBed.createComponent(RegularTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
