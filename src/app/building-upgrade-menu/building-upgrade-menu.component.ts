import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GameStatsService } from '../game-stats.service';
import { take } from 'rxjs/operators';
import { HostListener } from "@angular/core";

interface UpgradeBonuses {
  volumeMultiplier: number;
  volumeLPSBonus: number;
  volumeBaseBonus : number;
  cuveUpgrades: { [key: string]: number };
  potUpgrade : boolean;

}


@Component({
  selector: 'app-building-upgrade-menu',
  templateUrl: './building-upgrade-menu.component.html',
  styleUrls: ['./building-upgrade-menu.component.css']
})
export class BuildingUpgradeMenuComponent implements OnInit, OnDestroy {
  allBuildings: any[] = [];
  allUpgrades: any[] = [];
  totalIncome : number = 0
  currentMoney : number = 0
  totalLPS: number = 0;
  upgradeRows: any[][] = [];
  popupStyle : any
  upgradeBonuses : UpgradeBonuses = {
    volumeMultiplier : 1,
    volumeLPSBonus : 0,
    volumeBaseBonus : 0,
    cuveUpgrades : {
      Pot : 0,
      Cuve : 0,
      Brasserie : 0,
      Puit : 0,
      Nains : 0,
      Autel : 0,
      ADN :0,
      "Hop-Coin" : 0,
      "Eau Lunaire" : 0,



    },
    potUpgrade : false
  }
  screenHeight: number = 0;
  screenWidth: number = 0;



  constructor(private http: HttpClient, private gameStatsService : GameStatsService) {
    this.gameStatsService.getTotalIncome().subscribe(( totalIncome: number) => {
      this.totalIncome = totalIncome;
    });
    this.gameStatsService.getMoney().subscribe((money: number) => {
      this.currentMoney = money;
    });
    this.calculateUpgradeRows()

  }




  ngOnInit() {
    this.loadSavedData();
    this.startAvailabilityCheck();
    this.calculateToTalLPS();
    this.calculateUpgradeRows()
    this.screenHeight = window.innerHeight;
    this.gameStatsService.setVolumeMultiplier(this.upgradeBonuses.volumeMultiplier);
    this.gameStatsService.setvolumeBaseBonus(this.upgradeBonuses.volumeBaseBonus);
    this.gameStatsService.setvolumeLPSBonus(this.upgradeBonuses.volumeLPSBonus);
    const building = this.allBuildings.find((b) => b.name === "Pot")
    this.calculateBuildingLPS(building)

  }


  loadUpgrades() {
    this.http.get<any[]>('assets/data/upgrades.json').subscribe((data: any) => {

      this.allUpgrades = data.map((upgrade: any) => {
        return {
          ...upgrade,
          owned: false,
          available: false,
          showpopup : false
        };
      });
      console.log(this.allUpgrades);
    });
  }

  loadBuildings() {
    this.http.get<any[]>('assets/data/buildings.json').subscribe((data: any) => {

      this.allBuildings = data.map((building: any) => {
        return {
          ...building,
          amount: 0,
          available: false,
          multipliers: [],
          LPS : 0,
          showpopup : false
        };
      });
      console.log(this.allBuildings);
    });

  }

  loadSavedData() {
    const savedData = localStorage.getItem('gameData');
    if (savedData) {
      const { buildings, upgrades, totalLPS, upgradeBonuses } = JSON.parse(savedData);
      this.allBuildings = buildings;
      this.allUpgrades = upgrades;
      this.totalLPS = totalLPS;
      this.upgradeBonuses = upgradeBonuses;

    }
    else {
      this.loadBuildings()
      this.loadUpgrades()
    }

  }

  saveData() {
    const gameData = {
      buildings: this.allBuildings,
      upgrades: this.allUpgrades,
      LPS: this.totalLPS,
      upgradeBonuses: this.upgradeBonuses

    };
    localStorage.setItem('gameData', JSON.stringify(gameData));
  }

  ngOnDestroy() {
    this.saveData();
  }

  startAvailabilityCheck() {
    setInterval(() => {
      this.checkAvailability();
    }, 1000);
  }

  checkAvailability() {
    this.allBuildings.forEach((building) => {
      building.available = building.threshold <= this.totalIncome;
    });

    this.allUpgrades
    .filter((upgrade) => !upgrade.available)
    .forEach((upgrade) => {
      const building = this.allBuildings.find((b) => b.name === upgrade.target);
      if (building && building.amount >= upgrade.threshold) {
        upgrade.available = true;
      }
    });
    this.calculateUpgradeRows()
  }



  buyBuilding(building: any) {
    const buildingCost = this.calculateBuildingCost(building);

    if (this.currentMoney >= buildingCost) {
      building.amount++;
      this.gameStatsService.setMoney(this.currentMoney - buildingCost);
      this.calculateBuildingLPS(building)
      this.saveData();
    }
    if (building.name == "Cuve") {
          this.allBuildings.forEach((build)=>{
            this.calculateBuildingLPS(build)
          }
          )
        }


  }

  buyUpgrade(upgrade :any) {
    const upgradeCost = upgrade.baseCost;
    if (this.currentMoney >= upgradeCost) {
      upgrade.owned = true;
      this.gameStatsService.setMoney(this.currentMoney - upgradeCost);
      const building = this.allBuildings.find((b) => b.name === upgrade.target);
      building.multipliers.push(upgrade.multiplier);
      if (upgrade.specialEffect != ""){
        console.log("here")
        this.handleSpecialUpgrade(upgrade)

      }
      this.calculateBuildingLPS(building);
      this.saveData();
      this.calculateUpgradeRows()
    }
  }



  calculateBuildingCost(building: any){
    const buildingCost = building.baseCost*Math.pow(1.15,building.amount)
    return (buildingCost)

  }

  calculateBuildingLPS(building:any){
    let totMultiplier = 1
    building.multipliers.forEach((multiplier : number)=> {
      totMultiplier = totMultiplier*multiplier
    });
    const cuve = this.allBuildings.find((b) => b.name === "Cuve");
    const buildingName : string = building.name
    building.LPS = building.amount*totMultiplier*building.baseLPS*(1+(cuve.amount*this.upgradeBonuses.cuveUpgrades[buildingName]/100))
    this.calculateToTalLPS()
    if (building.name == "Pot" && this.upgradeBonuses.potUpgrade == true){
      this.gameStatsService.setPotUpgrade(building.LPS)
    }
  }

  calculateToTalLPS(){
    let currentLPS = 0
    this.allBuildings.forEach((building) => {
     currentLPS += building.LPS
    });
    this.totalLPS = currentLPS;
    this.gameStatsService.setTotalLPS(this.totalLPS);
  }

  calculateUpgradeRows() {
    const upgradesPerRow = 6;
    const availableUpgrades = this.allUpgrades.filter(upgrade => upgrade.available && !upgrade.owned);
    availableUpgrades.sort((a, b) => a.baseCost - b.baseCost);
    this.upgradeRows = [];
    for (let i = 0; i < availableUpgrades.length; i += upgradesPerRow) {
      const row = availableUpgrades.slice(i, i + upgradesPerRow);
      this.upgradeRows.push(row);
    }
  }

  canPurchaseUpgrade(upgrade: any): boolean {
    return this.currentMoney >= upgrade.baseCost;
  }

  showPopup(event: MouseEvent, object: any) {
    object.showPopup = true;
    const popupHeight = 50;
    const yPosition = event.clientY - popupHeight / 2;
    if (event.clientY <= (this.screenHeight*0.7)){
      this.popupStyle = {
        top: `${yPosition}px`,
        left: '55vw',
      };
    }
    else {
      const newposition = (this.screenHeight*0.7)
      this.popupStyle = {
        top: `${newposition}px`,
        left: '55vw',
      };

    }

  }

  hidePopup(object: any) {
    object.showPopup = false;
  }

  realLPS(building : any) {
    if (building.amount != 0){
      return (building.LPS/building.amount)
    }
    else {
      return (building.baseLPS)
    }


  }

  handleSpecialUpgrade(upgrade: any){
    if (upgrade.specialEffect == "%LPS"){
      this.upgradeBonuses.volumeLPSBonus+= 1
      this.gameStatsService.setvolumeLPSBonus(this.upgradeBonuses.volumeLPSBonus)

    }
    if (upgrade.specialEffect == "volLPC"){
      this.upgradeBonuses.volumeBaseBonus += upgrade.bonus
      this.gameStatsService.setvolumeBaseBonus(this.upgradeBonuses.volumeBaseBonus)

    }
    if(upgrade.specialEffect == "multLPC"){
      this.upgradeBonuses.volumeMultiplier = this.upgradeBonuses.volumeMultiplier*upgrade.bonus
      this.gameStatsService.setVolumeMultiplier(this.upgradeBonuses.volumeMultiplier)
    }
    if(upgrade.specialEffect == "PotLPC"){
      const pot = this.allBuildings.find((b) => b.name === "Pot");
      this.upgradeBonuses.potUpgrade = true;
      console.log(this.upgradeBonuses.potUpgrade)
    }
    if(upgrade.specialEffect == "cuveclass"){
      this.upgradeBonuses.cuveUpgrades[upgrade.target] += 1
    }

  }
}




