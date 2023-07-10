import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BeerMultiplierService } from '../beer-multiplier.service';
import { GameStatsService } from '../game-stats.service';
import { interval, Subscription } from 'rxjs';
import { DecimalPipe } from '@angular/common';




@Component({
  selector: 'app-beer-clicker',
  templateUrl: './beer-clicker.component.html',
  styleUrls: ['./beer-clicker.component.css']
})
export class BeerClickerComponent implements OnInit {

  beerMultiplier : number = 1
  money : number = 0;
  cost : number = 0;
  revenue : number = 0
  popups: { text: string, x: number, y: number, fadeOut: boolean }[] = [];
  totalIncome : number = 0;
  totalLPS : number = 0
  autoIncomeEnabled: boolean = false;
  autoIncomeInterval: Subscription | undefined;
  volumeMultiplier : number = 1
  volumeBaseBonus : number = 0
  volumeLPSBonus : number = 0
  potUpgrade : number = 0
  achievementMenu : boolean = true

  storedStats = {
    totalProd: 0

  }




  constructor(private beerMultiplierService: BeerMultiplierService, private gameStatsService: GameStatsService,) {
    this.beerMultiplierService.getMultiplier().subscribe((beerMultiplier: number) => {
      this.beerMultiplier = beerMultiplier;
    });
    this.beerMultiplierService.getCost().subscribe(( cost: number) => {
      this.cost = cost;
    });
    this.beerMultiplierService.getRevenue().subscribe(( revenue: number) => {
      this.revenue = revenue;
    });
    this.gameStatsService.getMoney().subscribe(( money: number) => {
      this.money = money;
    });
    this.gameStatsService.getTotalLPS().subscribe(( totalLPS: number) => {
      this.totalLPS = totalLPS;
    });
    this.gameStatsService.getVolumeMultiplier().subscribe(( volumeMultiplier: number) => {
      this.volumeMultiplier = volumeMultiplier;
    });
    this.gameStatsService.getvolumeBaseBonus().subscribe(( volumeBaseBonus: number) => {
      this.volumeBaseBonus = volumeBaseBonus;
    });
    this.gameStatsService.getvolumeLPSBonus().subscribe(( volumeLPSBonus: number) => {
      this.volumeLPSBonus = volumeLPSBonus;
    });
    this.gameStatsService.getPotUpgrade().subscribe(( potUpgrade: number) => {
      this.potUpgrade = potUpgrade;
    });





  }









  ngOnInit() {
    //récupération du score
    const storedStats = localStorage.getItem('storedStats')
    if (storedStats) {
      this.storedStats = JSON.parse(storedStats)

    }
    const storedmoney = localStorage.getItem('money');
    if (storedmoney) {
      this.money = parseInt(storedmoney, 10);
    }
    const storedtotalIncome = localStorage.getItem('totalIncome');
    if (storedtotalIncome) {
      this.totalIncome = parseInt(storedtotalIncome, 10);
    }

    this.gameStatsService.setstoredStats(this.storedStats)
    this.gameStatsService.setTotalIncome(this.totalIncome);
    this.gameStatsService.setMoney(this.money);


  }



  compteur(event: MouseEvent) {
    const increment =(((1+this.volumeBaseBonus+this.potUpgrade)*this.volumeMultiplier)+(this.volumeLPSBonus*this.totalLPS/100)) * ((this.beerMultiplier * this.revenue) - this.cost);
    this.money += increment;
    this.totalIncome += increment;
    localStorage.setItem('totalIncome', this.totalIncome.toString());
    localStorage.setItem('money', this.money.toString());
    let scientificIncrement
    if (increment>=1000000000){
      scientificIncrement = increment.toExponential(2);
    }
    else {
      scientificIncrement = increment.toFixed(1)
    }
    const popup = { text: `+${scientificIncrement}`, x: event.clientX, y: event.clientY, fadeOut: false };
    this.popups.push(popup);
    this.gameStatsService.setTotalIncome(this.totalIncome);
    this.gameStatsService.setMoney(this.money);

    setTimeout(() => {
      popup.fadeOut = true;
      setTimeout(() => {
        this.popups = this.popups.filter(p => p !== popup);
      }, 900);
    }, 900);

    this.storedStats.totalProd += (1+this.volumeBaseBonus+this.potUpgrade)*this.volumeMultiplier+(this.volumeLPSBonus*this.totalLPS/100)
    this.gameStatsService.setstoredStats(this.storedStats);
    localStorage.setItem('storedStats', JSON.stringify(this.storedStats));

  }




  toggleAutoIncome() {
    if (this.autoIncomeEnabled) {
      this.stopAutoIncome();
    } else {
      this.startAutoIncome();
    }
  }

  startAutoIncome() {
    if (this.autoIncomeInterval) {
      return;
    }

    this.autoIncomeEnabled = true;

    this.autoIncomeInterval = interval(200).subscribe(() => {
      const increment = ((this.beerMultiplier * this.revenue) - this.cost) * this.totalLPS * 0.2
      this.money += increment;
      this.totalIncome += increment;
      localStorage.setItem('money', this.money.toString());
      localStorage.setItem('totalIncome', this.totalIncome.toString());
      this.gameStatsService.setMoney(this.money);
      this.gameStatsService.setTotalIncome(this.totalIncome);
      this.storedStats.totalProd += this.totalLPS * 0.2
      this.gameStatsService.setstoredStats(this.storedStats);
      localStorage.setItem('storedStats', JSON.stringify(this.storedStats));
    });
  }

  stopAutoIncome() {
    this.autoIncomeEnabled = false;
    if (this.autoIncomeInterval) {
      this.autoIncomeInterval.unsubscribe();
      this.autoIncomeInterval = undefined;
    }
  }

  toggleAchievements(){
    this.achievementMenu = !this.achievementMenu
  }

}
