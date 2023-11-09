import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UdiseDataComponent } from './udise-data.component';

describe('UdiseDataComponent', () => {
  let component: UdiseDataComponent;
  let fixture: ComponentFixture<UdiseDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UdiseDataComponent]
    });
    fixture = TestBed.createComponent(UdiseDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
