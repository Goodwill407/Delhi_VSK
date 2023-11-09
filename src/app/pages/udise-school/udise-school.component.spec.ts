import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UdiseSchoolComponent } from './udise-school.component';

describe('UdiseSchoolComponent', () => {
  let component: UdiseSchoolComponent;
  let fixture: ComponentFixture<UdiseSchoolComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UdiseSchoolComponent]
    });
    fixture = TestBed.createComponent(UdiseSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
