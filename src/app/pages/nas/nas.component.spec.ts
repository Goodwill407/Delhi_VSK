import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NasComponent } from './nas.component';

describe('NasComponent', () => {
  let component: NasComponent;
  let fixture: ComponentFixture<NasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NasComponent]
    });
    fixture = TestBed.createComponent(NasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
