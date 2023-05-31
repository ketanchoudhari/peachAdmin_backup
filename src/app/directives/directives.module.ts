import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { NumberOnlyDirective } from './number-only.directive';
import { ExportDataDirective } from './export-data.directive';
import { NumberRangeDirective } from './number-range.directive';
// import { InputRestrictionDirective } from './special-charInput.directive';
import { SortDirective } from './sort.directive';

@NgModule({
  declarations: [NumberRangeDirective, ExportDataDirective, NumberRangeDirective, ],
  imports: [CommonModule],
  exports: [NumberRangeDirective, ExportDataDirective, NumberRangeDirective],
})
export class DirectivesModule {}
