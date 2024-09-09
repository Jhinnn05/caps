import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildmainComponent } from './childmain.component';

describe('ChildmainComponent', () => {
  let component: ChildmainComponent;
  let fixture: ComponentFixture<ChildmainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChildmainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChildmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
