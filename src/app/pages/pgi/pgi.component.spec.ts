import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgiComponent } from './pgi.component';

describe('PgiComponent', () => {
  let component: PgiComponent;
  let fixture: ComponentFixture<PgiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PgiComponent]
    });
    fixture = TestBed.createComponent(PgiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
