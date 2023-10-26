import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NorthDelhiComponent } from './north-delhi.component';

describe('NorthDelhiComponent', () => {
  let component: NorthDelhiComponent;
  let fixture: ComponentFixture<NorthDelhiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NorthDelhiComponent]
    });
    fixture = TestBed.createComponent(NorthDelhiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
