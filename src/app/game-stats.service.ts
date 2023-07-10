import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GameStatsService {

  constructor() { }
  private totalIncome: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  private storedStats: BehaviorSubject<number> = new BehaviorSubject<any>(0);
  private money: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private totalLPS: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private volumeMultiplier: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  private volumeBaseBonus: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private volumeLPSBonus: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private potUpgrade: BehaviorSubject<number> = new BehaviorSubject<number>(0);


  getTotalIncome(): Observable<number> {
    return this.totalIncome.asObservable();
  }

  setTotalIncome(value: number): void {
    this.totalIncome.next(value);
  }
  getstoredStats(): Observable<any> {
    return this.storedStats.asObservable();
  }

  setstoredStats(value: any): void {
    this.storedStats.next(value);
  }



  getMoney() {
    return this.money.asObservable();
  }

  setMoney(money: number) {
    this.money.next(money);
  }

  getTotalLPS() {
    return this.totalLPS.asObservable();
  }

  setTotalLPS(totalLPS: number) {
    this.totalLPS.next(totalLPS);
  }

  getVolumeMultiplier() {
    return this.volumeMultiplier.asObservable();
  }

  setVolumeMultiplier(volumeMultiplier: number) {
    this.volumeMultiplier.next(volumeMultiplier);
  }

  getvolumeBaseBonus() {
    return this.volumeBaseBonus.asObservable();
  }

  setvolumeBaseBonus(volumeBaseBonus: number) {
    this.volumeBaseBonus.next(volumeBaseBonus);
  }

  getvolumeLPSBonus() {
    return this.volumeLPSBonus.asObservable();
  }

  setvolumeLPSBonus(volumeLPSBonus: number) {
    this.volumeLPSBonus.next(volumeLPSBonus);
  }

  getPotUpgrade() {
    return this.potUpgrade.asObservable();
  }

  setPotUpgrade(potUpgrade: number) {
    this.potUpgrade.next(potUpgrade);
  }




}
