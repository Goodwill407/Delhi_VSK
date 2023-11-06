import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CQubeComponent } from './c-qube.component';

describe('CQubeComponent', () => {
  let component: CQubeComponent;
  let fixture: ComponentFixture<CQubeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CQubeComponent]
    });
    fixture = TestBed.createComponent(CQubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
