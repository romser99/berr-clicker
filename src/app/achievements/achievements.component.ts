import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameStatsService } from '../game-stats.service';


@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.css']
})
export class AchievementsComponent implements OnInit, OnDestroy{

  activeDropdown: string = 'tuto';
  allAchievements : any[]= [];
  achievementsRows: any[][] = [];
  storedStats = {
    totalProd : 0,

  };
  screenHeight: number = 0;
  screenWidth: number = 0;
  popupStyle : any;


  ngOnInit(): void {
    this.loadSavedAchievements()
    this.startUnlockedCheck()
    this.screenHeight = window.innerHeight;
    this.checkUnlockedState()
    this.calculateAchievementRows()

  }

  constructor(private http: HttpClient, private gameStatsService : GameStatsService) {
    this.gameStatsService.getstoredStats().subscribe(( storedStats: any) => {
      this.storedStats = storedStats;
    });
    this.calculateAchievementRows()

  }



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

  loadAchievements() {
    this.http.get<any[]>('assets/data/achievements.json').subscribe((data: any) => {

      this.allAchievements = data.map((achievement: any) => {
        return {
          ...achievement,
          unlocked: false,
          showPopup : false
        };
      });
      console.log("ici");
    });
  }


  loadSavedAchievements() {
    const savedAchievements = localStorage.getItem("achievementsData")
    if (savedAchievements) {
      const { achievements } = JSON.parse(savedAchievements);
      console.log(achievements)
      this.allAchievements = achievements

    }
    else {
      this.loadAchievements()
    }
    console.log(this.allAchievements)

  }

  saveData() {
    const achievements = {
      achievements: this.allAchievements}
    localStorage.setItem('achievementsData', JSON.stringify(achievements));
  }

  ngOnDestroy() {
    this.saveData();
  }

  startUnlockedCheck() {
    setInterval(() => {
      this.checkUnlockedState();
    }, 6000);
  }

  checkUnlockedState (){

    this.allAchievements
    .filter((achievement) => !achievement.unlocked)
    .forEach((achievement) => {
      const filter = achievement.filter
      if (filter == "TotProd") {
        if (this.storedStats.totalProd >= achievement.threshold){
          achievement.unlocked = true
        }
      }
    });
    this.calculateAchievementRows()
    console.log(this.allAchievements)

  }

  calculateAchievementRows() {
    const AchievementsPerRow = 6;
    const Achievements = this.allAchievements

    this.achievementsRows = [];
    for (let i = 0; i < Achievements.length; i += AchievementsPerRow) {
      const row = Achievements.slice(i, i + AchievementsPerRow);
      this.achievementsRows.push(row);
    }
  }

  showPopup(event: MouseEvent, object: any) {
    object.showPopup = true;
    
  }


  hidePopup(object: any) {
    object.showPopup = false;
  }

}
