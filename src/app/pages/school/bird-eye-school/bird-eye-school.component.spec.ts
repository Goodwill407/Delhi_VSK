import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BirdEyeSchoolComponent } from './bird-eye-school.component';

describe('BirdEyeSchoolComponent', () => {
  let component: BirdEyeSchoolComponent;
  let fixture: ComponentFixture<BirdEyeSchoolComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BirdEyeSchoolComponent]
    });
    fixture = TestBed.createComponent(BirdEyeSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
