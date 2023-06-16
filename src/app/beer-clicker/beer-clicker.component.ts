import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-beer-clicker',
  templateUrl: './beer-clicker.component.html',
  styleUrls: ['./beer-clicker.component.css']
})
export class BeerClickerComponent implements OnInit {

  ClickMultiplier : number = 1
  pintes : number = 0;


  ngOnInit() {
    //récupération du score
    const storedpintes = localStorage.getItem('pintes');
    if (storedpintes) {
      this.pintes = parseInt(storedpintes, 10);
    }
  }


  compteur() {
    this.pintes += 1*this.ClickMultiplier;
    localStorage.setItem('pintes', this.pintes.toString());

  }


}
