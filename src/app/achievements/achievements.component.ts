import { Component } from '@angular/core';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.css']
})
export class AchievementsComponent {

  activeDropdown: string = 'tuto';

  toggleDropdown(category: string): void {
    if (this.activeDropdown === category) {
      this.activeDropdown = '';
    } else {
      this.activeDropdown = category;
    }
  }

  showDropdown(category: string): boolean {
    return this.activeDropdown === category;
  }
}
