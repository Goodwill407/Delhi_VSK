import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleWiseDropdownComponent } from './role-wise-dropdown.component';

describe('RoleWiseDropdownComponent', () => {
  let component: RoleWiseDropdownComponent;
  let fixture: ComponentFixture<RoleWiseDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoleWiseDropdownComponent]
    });
    fixture = TestBed.createComponent(RoleWiseDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
