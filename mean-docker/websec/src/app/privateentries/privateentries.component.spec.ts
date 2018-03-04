import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateentriesComponent } from './privateentries.component';

describe('PrivateentriesComponent', () => {
  let component: PrivateentriesComponent;
  let fixture: ComponentFixture<PrivateentriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivateentriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateentriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
