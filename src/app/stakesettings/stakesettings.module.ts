import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StakesettingsComponent } from './stakesettings.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'stakesettings',
    component:StakesettingsComponent
  }
  
]

@NgModule({
  declarations: [
    StakesettingsComponent
 ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

  ],
  exports:[RouterModule]

  
})
export class StakesettingsModule { }
