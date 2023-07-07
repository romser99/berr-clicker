import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BeerMultiplierService {
  private beerMultiplier: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  private beerCost: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  private beerRevenue: BehaviorSubject<number> = new BehaviorSubject<number>(1);


  getMultiplier(): Observable<number> {
    return this.beerMultiplier.asObservable();
  }

  setMultiplier(value: number): void {
    this.beerMultiplier.next(value);
  }

  getCost(): Observable<number> {
    return this.beerCost.asObservable();
  }

  setCost(value: number): void {
    this.beerCost.next(value);
  }
  getRevenue(): Observable<number> {
    return this.beerRevenue.asObservable();
  }

  setRevenue(value: number): void {
    this.beerRevenue.next(value);
  }
}
