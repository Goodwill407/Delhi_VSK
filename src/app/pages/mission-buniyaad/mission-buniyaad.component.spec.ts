import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionBuniyaadComponent } from './mission-buniyaad.component';

describe('MissionBuniyaadComponent', () => {
  let component: MissionBuniyaadComponent;
  let fixture: ComponentFixture<MissionBuniyaadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MissionBuniyaadComponent]
    });
    fixture = TestBed.createComponent(MissionBuniyaadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
