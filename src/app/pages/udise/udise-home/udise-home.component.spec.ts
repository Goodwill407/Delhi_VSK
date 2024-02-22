import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UdiseHomeComponent } from './udise-home.component';

describe('UdiseHomeComponent', () => {
  let component: UdiseHomeComponent;
  let fixture: ComponentFixture<UdiseHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UdiseHomeComponent]
    });
    fixture = TestBed.createComponent(UdiseHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
