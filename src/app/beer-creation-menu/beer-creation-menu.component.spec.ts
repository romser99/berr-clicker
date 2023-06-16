import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeerCreationMenuComponent } from './beer-creation-menu.component';

describe('BeerCreationMenuComponent', () => {
  let component: BeerCreationMenuComponent;
  let fixture: ComponentFixture<BeerCreationMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BeerCreationMenuComponent]
    });
    fixture = TestBed.createComponent(BeerCreationMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
