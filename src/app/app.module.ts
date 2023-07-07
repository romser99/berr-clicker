import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ScientificNotationPipe } from './scientific-notation.pipe';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BeerClickerComponent } from './beer-clicker/beer-clicker.component';
import { BeerCreationMenuComponent } from './beer-creation-menu/beer-creation-menu.component';
import { FormsModule } from '@angular/forms';
import { BuildingUpgradeMenuComponent } from './building-upgrade-menu/building-upgrade-menu.component';
import { AchievementsComponent } from './achievements/achievements.component';

@NgModule({
  declarations: [
    AppComponent,
    BeerClickerComponent,
    BeerCreationMenuComponent,
    ScientificNotationPipe,
    BuildingUpgradeMenuComponent,
    AchievementsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
