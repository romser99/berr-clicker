import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BeerClickerComponent } from './beer-clicker/beer-clicker.component';

const routes: Routes = [
  { path: 'beer-clicker', component: BeerClickerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
