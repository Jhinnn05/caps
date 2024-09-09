import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcadsmainComponent } from './acadsmain.component';

describe('AcadsmainComponent', () => {
  let component: AcadsmainComponent;
  let fixture: ComponentFixture<AcadsmainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcadsmainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcadsmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
