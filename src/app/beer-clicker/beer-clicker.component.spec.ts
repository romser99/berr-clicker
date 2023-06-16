import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeerClickerComponent } from './beer-clicker.component';

describe('BeerClickerComponent', () => {
  let component: BeerClickerComponent;
  let fixture: ComponentFixture<BeerClickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BeerClickerComponent]
    });
    fixture = TestBed.createComponent(BeerClickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
