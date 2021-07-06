import {NgModule} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  exports: [
    MatDialogModule,
    MatSelectModule
  ]
})

export default class MaterialModule {}
