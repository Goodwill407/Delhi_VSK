import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NipunComponent } from './nipun.component';

describe('NipunComponent', () => {
  let component: NipunComponent;
  let fixture: ComponentFixture<NipunComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NipunComponent]
    });
    fixture = TestBed.createComponent(NipunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
