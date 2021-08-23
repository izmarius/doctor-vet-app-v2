import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ANIMAL_FORM_TEXT, INPUT_REGEX_TEXTS} from "../../../shared-data/Constants";

@Component({
  selector: 'app-animal-form',
  templateUrl: './animal-form.component.html',
  styleUrls: ['./animal-form.component.css']
})
export class AnimalFormComponent implements OnInit {
  animalFormGroup!: FormGroup;
  @Output() animalPayloadEmitter = new EventEmitter();
  isErrorDisplayed = false;
  errorMessage = '';
  animalFormText: any;
  maxDate = new Date();
  constructor() {
  }

  ngOnInit(): void {
    this.initAnimalForm();
    this.animalFormText = ANIMAL_FORM_TEXT;
  }

  initAnimalForm(): void {
    this.animalFormGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      birthDay: new FormControl('', Validators.required),
      age: new FormControl('', Validators.required),
      weight: new FormControl('', Validators.required),
    });
  }

  onAnimalFormSubmit(): void {
    if (!this.animalFormGroup.valid) {
      this.isErrorDisplayed = true;
      this.errorMessage = this.animalFormText.errorFromValidation;
    }
    this.isErrorDisplayed = false;
    this.errorMessage = '';

    const animalPayload = {
      name: this.animalFormGroup.controls.name.value,
      age: this.animalFormGroup.controls.age.value,
      birthDay: this.animalFormGroup.controls.birthDay.value.toLocaleString().split(',')[0],
      weight: this.animalFormGroup.controls.weight.value,
    }
    this.animalPayloadEmitter.emit(animalPayload);
  }
}
