import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolAdministrativeComponent } from './school-administrative.component';

describe('SchoolAdministrativeComponent', () => {
  let component: SchoolAdministrativeComponent;
  let fixture: ComponentFixture<SchoolAdministrativeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchoolAdministrativeComponent]
    });
    fixture = TestBed.createComponent(SchoolAdministrativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
