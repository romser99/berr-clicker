import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BeerMultiplierService } from '../beer-multiplier.service';
import { GameStatsService } from '../game-stats.service';


@Component({
  selector: 'app-beer-creation-menu',
  templateUrl: './beer-creation-menu.component.html',
  styleUrls: ['./beer-creation-menu.component.css']
})
export class BeerCreationMenuComponent implements OnInit {
  malts: any[] = [];
  hops: any[] = [];
  miscIngredients: any[] = [];
  archetypes: any[]=[];
  selectedIngredient: any = null;
  profileMultiplier : number = 1;
  flavorMultiplier : number = 1;
  quality: string = '';
  beerMultiplier : number = 1
  currentMoney = 0


  activeDropdown: string = '';
  beerParameters: any = {
    malts: [],
    hops: [],
    miscIngredients: []
  };
  beerProfile = {
    name:"Your Beer",
    ABV: 0,
    EBC:0,
    IBU:0,
    cost:0,
    revenue : 0,
    flavorProfile: {
      bakyness: 0,
      maltiness: 0,
      roastiness: 0,
      floweriness: 0,
      citrusness: 0,
      herbal: 0,
      sweetness: 0,
      fruityness: 0,
      woodyness: 0
    }

  };
  income: number = 0 ;



  constructor(private http: HttpClient, private beerMultiplierService: BeerMultiplierService,private gameStatsService : GameStatsService) {

    this.gameStatsService.getMoney().subscribe((money: number) => {
      this.currentMoney = money;
    });

  }



  async ngOnInit() {
    this.loadSavedIngredients();
    this.beerProfile = {
      name:"Your Beer",
      ABV: 0,
      EBC:0,
      IBU:0,
      cost:0,
      revenue: 0,
      flavorProfile: {
        bakyness: 0,
        maltiness: 0,
        roastiness: 0,
        floweriness: 0,
        citrusness: 0,
        herbal: 0,
        sweetness: 0,
        fruityness: 0,
        woodyness: 0
      }
    }
    const storedBeerProfile = localStorage.getItem('beerProfile');
    if (storedBeerProfile) {
      this.beerProfile = JSON.parse(storedBeerProfile);


    }
    const storedParameters = localStorage.getItem('beerParameters');
    if (storedParameters) {
      this.beerParameters = JSON.parse(storedParameters);

    }
    try {
      const archetypes = await this.loadArchetypes();

      this.archetypes = archetypes;

      this.calculateBeerProfile();
    } catch (error) {
      console.error('Error loading archetypes:', error);
    }


  }




  loadArchetypes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get('assets/data/archetypes.json').subscribe(
        (archetypes) => {

          resolve(archetypes);
        },
        (error) => {

          reject(error);
        }
      );
    });
  }

  loadSavedIngredients () {
    const savedIngredients = localStorage.getItem('gameIngredients');
    if (savedIngredients) {
      const { malts, hops, miscIngredients } = JSON.parse(savedIngredients);

      this.malts = malts;
      this.hops = hops;
      this.miscIngredients = miscIngredients;

    }
    else {
      this.loadIngredientData()
    }
  }

  saveIngredients(){
    const gameIngredients = {
      malts: this.malts,
      hops: this.hops,
      miscIngredients : this.miscIngredients,

    };
    localStorage.setItem('gameIngredients', JSON.stringify(gameIngredients));
  }


  updateIngredientCheckboxes(selectedIngredients: any): void {

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
    this.saveIngredients();
    localStorage.setItem('beerParameters', JSON.stringify(this.beerParameters));

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


  loadIngredientData(): void {
    this.http.get<any[]>('assets/data/malts.json').subscribe(data => {
      this.malts = data.map(malt => ({ ...malt, showDescription: false, checked: false, purchased : false }));
      this.updateIngredientCheckboxes(this.beerParameters);
    });

    this.http.get<any[]>('assets/data/hops.json').subscribe(data => {
      this.hops = data.map(hop => ({ ...hop, checked: false,purchased : false  }));
      this.updateIngredientCheckboxes(this.beerParameters);
    });

    this.http.get<any[]>('assets/data/miscIngredients.json').subscribe(data => {
      this.miscIngredients = data.map(ingredient => ({ ...ingredient, checked: false,purchased : false  }));
      this.updateIngredientCheckboxes(this.beerParameters);
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

    if (ingredient.checked) {
      ingredient.quantityPerLiter = 0;
      if (ingredient.category === 'malt') {
        this.beerParameters.malts.push(ingredient);
      } else if (ingredient.category === 'hop') {
        this.beerParameters.hops.push(ingredient);
      } else if (ingredient.category === 'misc') {
        this.beerParameters.miscIngredients.push(ingredient);
      }
    } else {
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
    this.saveIngredients();
  }

  handleQuantityChange(ingredient: any, quantityPerLiter: number): void {

    if (quantityPerLiter < 0) {
      ingredient.quantityPerLiter = 0;
      return;
    }

    if (ingredient.category === 'malt') {
      const malt = this.beerParameters.malts.find((m: any) => m.name === ingredient.name);
      if (malt) {
        malt.quantityPerLiter = quantityPerLiter;
      }
    } else if (ingredient.category === 'hop') {
      const hop = this.beerParameters.hops.find((h: any) => h.name === ingredient.name);
      if (hop) {
        hop.quantityPerLiter = quantityPerLiter;
      }
    } else if (ingredient.category === 'misc') {
      const miscIngredient = this.beerParameters.miscIngredients.find((mi: any) => mi.name === ingredient.name);
      if (miscIngredient) {
        miscIngredient.quantityPerLiter = quantityPerLiter;
      }
    };
    this.saveIngredients();
    localStorage.setItem('beerParameters', JSON.stringify(this.beerParameters));

  }









  calculateBeerProfile(): void {

    let totalABV = 0;
    let totalIBU = 0;
    let totalEBC = 0;
    let totalMass = 0;
    let tempFlavorProfile = {
      bakyness: 0,
      maltiness: 0,
      roastiness: 0,
      floweriness: 0,
      citrusness: 0,
      herbal: 0,
      sweetness: 0,
      fruityness: 0,
      woodyness: 0
    }
    let totalCost = 0;
    let MCU: number;

    for (const malt of this.beerParameters.malts) {
      MCU = 0;
      MCU += malt.ebc * 2.2046 * malt.quantityPerLiter / (0.264 * 2.5);
      if (MCU >= 25) {
        totalEBC += 2.784 * (Math.pow(MCU, 0.6859));
      } else {
        totalEBC += MCU;
      }
      totalMass += malt.quantityPerLiter;
      tempFlavorProfile.bakyness+= malt.flavorProfile.bakyness*malt.quantityPerLiter/1.2;
      tempFlavorProfile.maltiness+= malt.flavorProfile.maltiness*malt.quantityPerLiter/1.2;
      tempFlavorProfile.roastiness+= malt.flavorProfile.roastiness*malt.quantityPerLiter/1.2;
      totalCost+= malt.cost*malt.quantityPerLiter;
    }

    totalABV = totalMass/0.048

    for (const hop of this.beerParameters.hops) {
      totalIBU += 1.65 * Math.pow(0.000125, 1.06 - 1) * (1 - Math.exp(-0.04 * 10)) * ((hop.alpha / 100) * hop.quantityPerLiter * 1000) / 4.15;
      tempFlavorProfile.floweriness+= hop.flavorProfile.floweriness*hop.quantityPerLiter*1.5/10;
      tempFlavorProfile.citrusness+= hop.flavorProfile.citrusness*hop.quantityPerLiter*1.5/10;
      tempFlavorProfile.herbal+= hop.flavorProfile.herbal*hop.quantityPerLiter*1.5/10;
      totalCost += hop.cost*hop.quantityPerLiter
      }

    for(const misc of this.beerParameters.miscIngredients){
      tempFlavorProfile.sweetness+= misc.flavorProfile.sweetness*misc.quantityPerLiter*1.5;
      tempFlavorProfile.fruityness+= misc.flavorProfile.fruityness*misc.quantityPerLiter*1.5;
      tempFlavorProfile.woodyness+= misc.flavorProfile.woodyness*misc.quantityPerLiter*1.5;
      totalCost += misc.cost*misc.quantityPerLiter
    }
    this.beerProfile.cost = totalCost
    this.beerProfile.ABV = totalABV;
    this.beerProfile.EBC = totalEBC;
    this.beerProfile.IBU = totalIBU;
    this.beerProfile.flavorProfile = tempFlavorProfile;
    this.beerProfile.name=""

    this.calculateRevenue();

  }
  calculateRevenue(): void {

    if (this.beerProfile.ABV == 0){
      this.beerProfile.ABV = 0.0001;
    }
    if (this.beerProfile.EBC == 0){
      this.beerProfile.EBC = 0.0001;
    }
    if (this.beerProfile.IBU == 0){
      this.beerProfile.IBU = 0.0001;
    }
    if (this.beerProfile.flavorProfile.bakyness == 0){
      this.beerProfile.flavorProfile.bakyness = 0.0001;
    }
    if (this.beerProfile.flavorProfile.maltiness == 0){
      this.beerProfile.flavorProfile.maltiness = 0.0001;
    }
    if (this.beerProfile.flavorProfile.roastiness == 0){
      this.beerProfile.flavorProfile.roastiness = 0.0001;
    }
    if (this.beerProfile.flavorProfile.floweriness == 0){
      this.beerProfile.flavorProfile.floweriness = 0.0001;
    }
    if (this.beerProfile.flavorProfile.citrusness == 0){
      this.beerProfile.flavorProfile.citrusness = 0.0001;
    }
    if (this.beerProfile.flavorProfile.herbal == 0){
      this.beerProfile.flavorProfile.herbal = 0.0001;
    }
    if (this.beerProfile.flavorProfile.sweetness == 0){
      this.beerProfile.flavorProfile.sweetness = 0.0001;
    }
    if (this.beerProfile.flavorProfile.fruityness == 0){
      this.beerProfile.flavorProfile.fruityness = 0.0001;
    }
    if (this.beerProfile.flavorProfile.woodyness == 0){
      this.beerProfile.flavorProfile.woodyness = 0.0001;
    }

    let distanceProfile = 10000;
    let distanceFlavor = 10000;
    let distanceProfileTemp: number;
    let distanceFlavorTemp : number;

    for (const archetype of this.archetypes){

      distanceProfileTemp = Math.sqrt(
        Math.pow((this.beerProfile.ABV-archetype.abv)*(8),2)+
        Math.pow((this.beerProfile.IBU-archetype.ibu),2)+
        Math.pow((this.beerProfile.EBC-archetype.ebc),2)
      );
      distanceFlavorTemp = Math.sqrt(
        Math.pow((this.beerProfile.flavorProfile.bakyness-archetype.flavorProfile.bakyness),2)+
        Math.pow((this.beerProfile.flavorProfile.maltiness-archetype.flavorProfile.maltiness),2)+
        Math.pow((this.beerProfile.flavorProfile.roastiness-archetype.flavorProfile.roastiness),2)+
        Math.pow((this.beerProfile.flavorProfile.floweriness-archetype.flavorProfile.floweriness),2)+
        Math.pow((this.beerProfile.flavorProfile.citrusness-archetype.flavorProfile.citrusness),2)+
        Math.pow((this.beerProfile.flavorProfile.herbal-archetype.flavorProfile.herbal),2)+
        Math.pow((this.beerProfile.flavorProfile.sweetness-archetype.flavorProfile.sweetness),2)+
        Math.pow((this.beerProfile.flavorProfile.fruityness-archetype.flavorProfile.fruityness),2)+
        Math.pow((this.beerProfile.flavorProfile.woodyness-archetype.flavorProfile.woodyness),2)


      );

      if (distanceProfile>distanceProfileTemp){
        distanceProfile = distanceProfileTemp;
        distanceFlavor = distanceFlavorTemp;
        this.beerProfile.name = archetype.name
        this.beerProfile.revenue = archetype.sell


      }
    }
    if (distanceProfile<1){
      this.profileMultiplier = 3;
    }
    else if (distanceProfile<3 && distanceProfile>=1){
      this.profileMultiplier = 2.25;
    }
    else if (distanceProfile<8 && distanceProfile>=3){
      this.profileMultiplier = 1.4;
    }
    else if (distanceProfile<15 && distanceProfile>=8){
      this.profileMultiplier = 1;
    }
    else if (distanceProfile<25 && distanceProfile>=15){
      this.profileMultiplier = 0.6;
    }
    else if (distanceProfile>=25 ){
      this.profileMultiplier = 0.2;
    }

    if(distanceFlavor<1){
      this.flavorMultiplier = 2;
    }
    else if (distanceFlavor<2 && distanceFlavor>=1){
      this.flavorMultiplier= 1.8;
    }
    else if (distanceFlavor<4 && distanceFlavor>=2){
      this.flavorMultiplier=1.6;
    }
    else if (distanceFlavor<8 && distanceFlavor>=4){
      this.flavorMultiplier=1.4;
    }
    else if (distanceFlavor<16 && distanceFlavor>=8){
      this.flavorMultiplier=1.2;
    }
    else if (distanceFlavor>=16){
      this.flavorMultiplier=1;
    }


    this.beerMultiplier = this.flavorMultiplier*this.profileMultiplier
    if (this.beerMultiplier<0.3){
      this.quality = "Horrible ";
    }
    else if (this.beerMultiplier<1){
      this.quality = "Mauvaise ";
    }
    else if (this.beerMultiplier<1.6){
      this.quality = "";
    }
    else if (this.beerMultiplier<3){
      this.quality = "Bonne ";
    }
    else if (this.beerMultiplier<6){
      this.quality = "Excellente ";
    }
    else if (this.beerMultiplier==6){
      this.quality = "Légendaire ";
    }

    this.beerProfile.name = this.quality + this.beerProfile.name;
    this.beerMultiplierService.setMultiplier(this.beerMultiplier);
    this.beerMultiplierService.setCost(this.beerProfile.cost);
    this.beerMultiplierService.setRevenue(this.beerProfile.revenue)
    localStorage.setItem('beerProfile', JSON.stringify(this.beerProfile))
    this.saveIngredients();



  }

  purchaseIngredient(ingredient : any){
    if (ingredient.category){
      const purchaseCost = ingredient.unlockCost
      if (ingredient.category == "malt"){
        if (this.currentMoney >= ingredient.unlockCost){
          ingredient.purchased = true
          this.gameStatsService.setMoney(this.currentMoney - purchaseCost);

        }
      }
      if (ingredient.category == "hop"){
        if (this.currentMoney >= ingredient.unlockCost){
          ingredient.purchased = true
          this.gameStatsService.setMoney(this.currentMoney - purchaseCost);
        }
      }
      if (ingredient.category == "misc"){
        if (this.currentMoney >= ingredient.unlockCost){
          ingredient.purchased = true
          this.gameStatsService.setMoney(this.currentMoney - purchaseCost);
        }
      }
    }
    
    this.saveIngredients();
  }

}
