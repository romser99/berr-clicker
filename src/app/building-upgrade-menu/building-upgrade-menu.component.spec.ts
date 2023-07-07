import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingUpgradeMenuComponent } from './building-upgrade-menu.component';

describe('BuildingUpgradeMenuComponent', () => {
  let component: BuildingUpgradeMenuComponent;
  let fixture: ComponentFixture<BuildingUpgradeMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuildingUpgradeMenuComponent]
    });
    fixture = TestBed.createComponent(BuildingUpgradeMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
