import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeographicalComponent } from './geographical.component';

describe('GeographicalComponent', () => {
  let component: GeographicalComponent;
  let fixture: ComponentFixture<GeographicalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeographicalComponent]
    });
    fixture = TestBed.createComponent(GeographicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
