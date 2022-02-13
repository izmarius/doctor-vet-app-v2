import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ANIMAL_FORM_TEXT} from "../../../shared-data/Constants";
import {DateUtilsService} from "../../../data/utils/date-utils.service";
import {take} from "rxjs/operators";
import {pipe} from "rxjs";

@Component({
  selector: 'app-animal-form',
  templateUrl: './animal-form.component.html',
  styleUrls: ['./animal-form.component.scss']
})
export class AnimalFormComponent implements OnInit {
  animalFormGroup!: FormGroup;
  animalFormText: any;
  @Output() animalPayloadEmitter = new EventEmitter();
  isAnimalOfMasculineSex: boolean = false;
  isAnimalOfFeminineSex: boolean = true;
  isAnimalSterilized = false;
  isErrorDisplayed = false;
  errorMessage = '';
  maxDate = new Date();

  constructor(private dateUtils: DateUtilsService) {
  }

  ngOnInit(): void {
    this.initAnimalForm();
    this.animalFormText = ANIMAL_FORM_TEXT;
    this.setAnimalAge();
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
      birthDay: this.dateUtils.getDateFormat(this.animalFormGroup.controls.birthDay.value),
      weight: this.animalFormGroup.controls.weight.value,
      isAnimalSterilized: this.isAnimalSterilized,
      animalSex: this.isAnimalOfFeminineSex ? this.animalFormText.labels.femaleLabel : this.animalFormText.labels.femaleLabel
    }
    this.animalPayloadEmitter.emit(animalPayload);
  }

  setAnimalAge() {
    this.animalFormGroup.get('birthDay')?.valueChanges
      .pipe(take(1))
      .subscribe((date) => {
        const currentYear = new Date().getFullYear();
        const ageOfAnimal = currentYear - date.getFullYear();
        this.animalFormGroup.get('age')?.setValue(ageOfAnimal);
      })
  }

  toggleAnimalSex(isFeminine: boolean) {
    if (isFeminine) {
      this.isAnimalOfMasculineSex = false;
    } else {
      this.isAnimalOfFeminineSex = false;
    }
  }
}
