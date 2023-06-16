import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-beer-creation-menu',
  templateUrl: './beer-creation-menu.component.html',
  styleUrls: ['./beer-creation-menu.component.css']
})
export class BeerCreationMenuComponent implements OnInit {
  malts: any[] = []; // Array to store malts
  hops: any[] = []; // Array to store hops
  miscIngredients: any[] = []; // Array to store miscellaneous ingredients
  selectedIngredient: any = null;
  maxmalt = 2;
  maxhop = 15;
  maxmisc =10;
  currentmalt = 0;
  currenthop = 0;
  currentmisc = 0;

  activeDropdown: string = '';
  beerParameters: any = {
    malts: [],
    hops: [],
    miscIngredients: []
  };
  beerProfile = {
    ABV: 0,
    EBC:0,
    IBU:0,
  };



  constructor(private http: HttpClient) {}



  ngOnInit() {
    this.loadIngredientData();
    this.beerProfile = {
      ABV: 0,
      EBC:0,
      IBU:0,
    }
    const storedBeerProfile = sessionStorage.getItem('beerProfile');
    if (storedBeerProfile) {
      this.beerProfile = JSON.parse(storedBeerProfile);
      console.log(storedBeerProfile)
    }
    const storedParameters = sessionStorage.getItem('beerParameters');
    if (storedParameters) {
      this.beerParameters = JSON.parse(storedParameters);
      console.log(storedParameters)
    }
    const storedCurrentMalt = sessionStorage.getItem('currentMalt');
    if (storedCurrentMalt) {
      this.currentmalt = JSON.parse(storedCurrentMalt);
    }
    const storedCurrentHop = sessionStorage.getItem('currentHop');
    if (storedCurrentHop) {
      this.currenthop = JSON.parse(storedCurrentHop);
    }
    const storedCurrentMisc = sessionStorage.getItem('currentMisc');
    if (storedCurrentMisc) {
      this.currentmalt = JSON.parse(storedCurrentMisc);
    }
  }

  updateIngredientCheckboxes(selectedIngredients: any): void {
    // Loop through the selected malts and update the corresponding ingredient objects
    console.log(this.malts)
    for (const malt of this.malts) {
      const selectedMalt = selectedIngredients.malts.find((selectedMalt: any) => selectedMalt.name === malt.name);
      if (selectedMalt) {
        malt.checked = true;
        malt.quantityPerLiter = selectedMalt.quantityPerLiter;
      } else {
        malt.checked = false;
        malt.quantityPerLiter = 0;
      }
    }

    // Loop through the selected hops and update the corresponding ingredient objects
    for (const hop of this.hops) {
      const selectedHop = selectedIngredients.hops.find((selectedHop: any) => selectedHop.name === hop.name);
      if (selectedHop) {
        hop.checked = true;
        hop.quantityPerLiter = selectedHop.quantityPerLiter;
      } else {
        hop.checked = false;
        hop.quantityPerLiter = 0;
      }
    }

    // Loop through the selected miscIngredients and update the corresponding ingredient objects
    for (const miscIngredient of this.miscIngredients) {
      const selectedMiscIngredient = selectedIngredients.miscIngredients.find(
        (selectedMiscIngredient: any) => selectedMiscIngredient.name === miscIngredient.name
      );
      if (selectedMiscIngredient) {
        miscIngredient.checked = true;
        miscIngredient.quantityPerLiter = selectedMiscIngredient.quantityPerLiter;
      } else {
        miscIngredient.checked = false;
        miscIngredient.quantityPerLiter = 0;
      }
    }
  }


  toggleDropdown(category: string): void {
    if (this.activeDropdown === category) {
      this.activeDropdown = ''; // Close the active dropdown if clicked again
    } else {
      this.activeDropdown = category; // Open the selected dropdown
    }
  }

  showDropdown(category: string): boolean {
    return this.activeDropdown === category;
  }


  loadIngredientData(): void {
    this.http.get<any[]>('assets/data/malts.json').subscribe(data => {
      this.malts = data.map(malt => ({ ...malt, showDescription: false, checked: false }));
      this.updateIngredientCheckboxes(this.beerParameters); // Update checkboxes
    });

    this.http.get<any[]>('assets/data/hops.json').subscribe(data => {
      this.hops = data.map(hop => ({ ...hop, checked: false }));
      this.updateIngredientCheckboxes(this.beerParameters); // Update checkboxes
    });

    this.http.get<any[]>('assets/data/miscIngredients.json').subscribe(data => {
      this.miscIngredients = data.map(ingredient => ({ ...ingredient, checked: false }));
      this.updateIngredientCheckboxes(this.beerParameters); // Update checkboxes
    });
  }

  getIngredientCategory(): string {
    if (this.selectedIngredient && this.selectedIngredient.category) {
      return this.selectedIngredient.category;
    }
    return '';
  }










  setSelectedIngredient(ingredient: any): void {
    this.selectedIngredient = ingredient;
  }



  handleCheckboxChange(ingredient: any): void {
    ingredient.checked = !ingredient.checked;

    if (!ingredient.checked){
      ingredient.quantityPerLiter = 0
      this.handleQuantityChange(ingredient,ingredient.quantityPerLiter);
    }

    if (ingredient.checked) {
      ingredient.quantityPerLiter = 0; // Initialize the quantity per liter to 0

      if (ingredient.category === 'malt') {
        this.beerParameters.malts.push(ingredient); // Store the whole ingredient object
      } else if (ingredient.category === 'hop') {
        this.beerParameters.hops.push(ingredient); // Store the whole ingredient object
      } else if (ingredient.category === 'misc') {
        this.beerParameters.miscIngredients.push(ingredient); // Store the whole ingredient object
      }
    } else {
      // Remove ingredient from the respective category array
      if (ingredient.category === 'malt') {
        this.beerParameters.malts = this.beerParameters.malts.filter((malt: any) => malt.name !== ingredient.name);
      } else if (ingredient.category === 'hop') {
        this.beerParameters.hops = this.beerParameters.hops.filter((hop: any) => hop.name !== ingredient.name);
      } else if (ingredient.category === 'misc') {
        this.beerParameters.miscIngredients = this.beerParameters.miscIngredients.filter(
          (miscIngredient: any) => miscIngredient.name !== ingredient.name
        );
      }
    }
    console.log(this.beerParameters);
  }

  handleQuantityChange(ingredient: any, quantityPerLiter: number): void {
    // Find the ingredient in the respective category array
    if (quantityPerLiter < 0) {
      ingredient.quantityPerLiter = 0; // Reset to zero if a negative value is entered
      return;
    }

    if (ingredient.category === 'malt') {
      const malt = this.beerParameters.malts.find((m: any) => m.name === ingredient.name);
      if (malt) {
        const diff = quantityPerLiter - malt.quantityPerLiter;
        if (this.currentmalt + diff > this.maxmalt) {
          quantityPerLiter = this.maxmalt - this.currentmalt;
          this.currentmalt = this.maxmalt;
        } else {
          this.currentmalt += diff;
        }
        malt.quantityPerLiter = quantityPerLiter;
        // Update the quantity per liter
      }
    } else if (ingredient.category === 'hop') {
      const hop = this.beerParameters.hops.find((h: any) => h.name === ingredient.name);
      if (hop) {
        const diff = quantityPerLiter - hop.quantityPerLiter;
        if (this.currenthop + diff > this.maxhop) {
          quantityPerLiter = this.maxhop - this.currenthop;
          this.currenthop = this.maxhop;
        } else {
          this.currenthop += diff;
        }
        hop.quantityPerLiter = quantityPerLiter; // Update the quantity per liter
      }
    } else if (ingredient.category === 'misc') {
      const miscIngredient = this.beerParameters.miscIngredients.find((mi: any) => mi.name === ingredient.name);
      if (miscIngredient) {
        const diff = quantityPerLiter - miscIngredient.quantityPerLiter;
        if (this.currentmisc + diff > this.maxmisc) {
          quantityPerLiter = this.maxmisc - this.currentmisc;
          this.currentmisc = this.maxmisc;
        } else {
          this.currentmisc += diff;
        }
        miscIngredient.quantityPerLiter = quantityPerLiter;
      }
    }
    sessionStorage.setItem('currentMalt', JSON.stringify(this.currentmalt));
    sessionStorage.setItem('currentHop', JSON.stringify(this.currenthop));
    sessionStorage.setItem('currentMisc', JSON.stringify(this.currentmisc));
    console.log(this.beerParameters);
    console.log(this.maxmalt);
    console.log(this.currentmalt);
  }









  calculateBeerProfile(): void {
    let totalABV = 0;
    let totalIBU = 0;
    let totalEBC = 0;
    let totalMass = 0;
    let MCU: number;
    let OG: number;
    let FG: number;
    sessionStorage.setItem('beerParameters', JSON.stringify(this.beerParameters));

    for (const malt of this.beerParameters.malts) {
      MCU = 0;
      MCU += malt.ebc * 2.2046 * malt.quantityPerLiter / (0.264 * 2.5);
      if (MCU >= 25) {
        totalEBC += 1.4922 * (Math.pow(MCU, 0.6859));
      } else {
        totalEBC += MCU;
      }
      totalMass += malt.quantityPerLiter;
    }

    OG = 1 + ((totalMass * 37 * 0.75) / (0.264)) / 1000;
    FG = OG - (OG - 1) * 0.75;
    totalABV = (OG - FG) * 131;

    for (const hop of this.beerParameters.hops) {
      totalIBU += 1.65 * Math.pow(0.000125, 1.06 - 1) * (1 - Math.exp(-0.04 * 10)) * ((hop.alpha / 100) * hop.quantityPerLiter * 1000) / 4.15;
    }

    this.beerProfile.ABV = totalABV;
    this.beerProfile.EBC = totalEBC;
    this.beerProfile.IBU = totalIBU;
    sessionStorage.setItem('beerProfile', JSON.stringify(this.beerProfile));

  }


}






