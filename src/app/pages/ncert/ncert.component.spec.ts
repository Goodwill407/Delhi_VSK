import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NcertComponent } from './ncert.component';

describe('NcertComponent', () => {
  let component: NcertComponent;
  let fixture: ComponentFixture<NcertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NcertComponent]
    });
    fixture = TestBed.createComponent(NcertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
