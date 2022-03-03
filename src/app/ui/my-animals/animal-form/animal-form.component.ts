import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ANIMAL_FORM_TEXT} from "../../../shared-data/Constants";
import {DateUtilsService} from "../../../data/utils/date-utils.service";
import {take} from "rxjs/operators";
import {IAnimalDoc} from "../../dto/animal-util-info";

@Component({
  selector: 'app-animal-form',
  templateUrl: './animal-form.component.html',
  styleUrls: ['./animal-form.component.scss']
})
export class AnimalFormComponent implements OnInit {
  @Input() animalFormInputData: any = null;
  isEditButtonActive: boolean = false;
  animalFormGroup!: FormGroup;
  animalFormText: any;
  @Output() animalPayloadEmitter = new EventEmitter<IAnimalDoc>();
  isAnimalOfMasculineSex: boolean = false;
  isAnimalOfFeminineSex: boolean = true;
  isAnimalSterilized = false;
  isSterilizedNotChanged: boolean = true;
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
    let age = '';
    let birthDay: any = '';
    let bloodType = '';
    let name = '';
    let weight = '';
    if (this.animalFormInputData) {
      this.isEditButtonActive = true;
      age = this.animalFormInputData.age;
      birthDay = new Date(this.animalFormInputData.birthDay);
      bloodType = this.animalFormInputData.bloodType;
      name = this.animalFormInputData.name;
      weight = this.animalFormInputData.weight;
      this.isAnimalOfFeminineSex = this.animalFormInputData.isAnimalOfFeminineSex;
      this.isAnimalOfMasculineSex = !this.animalFormInputData.isAnimalOfFeminineSex;
    }

    this.animalFormGroup = new FormGroup({
      age: new FormControl(age, Validators.required),
      birthDay: new FormControl(birthDay, Validators.required),
      bloodType: new FormControl(bloodType, Validators.required),
      name: new FormControl(name, Validators.required),
      weight: new FormControl(weight, Validators.required),
    });
  }

  isSubmitButtonDisabled(): boolean {
    console.log(!this.animalFormGroup.valid && this.isSterilizedNotChanged);
    return !this.animalFormGroup.valid && this.isSterilizedNotChanged;
  }

  onAnimalFormSubmit(): void {
    if (!this.animalFormGroup.valid) {
      this.isErrorDisplayed = true;
      this.errorMessage = this.animalFormText.errorFromValidation;
    }

    if (this.isEditButtonActive) {
      if (this.animalFormInputData.isAnimalSterilized !== this.isAnimalSterilized) {
      } else if (this.animalFormInputData.animalSex === 'F' && !this.isAnimalOfFeminineSex) {
      } else if (!this.animalFormGroup.dirty) {
        return;
      }
    }
    this.isErrorDisplayed = false;
    this.errorMessage = '';

    const animalPayload = {
      name: this.animalFormGroup.controls.name.value,
      age: this.animalFormGroup.controls.age.value,
      birthDay: this.dateUtils.getDateFormat(this.animalFormGroup.controls.birthDay.value),
      bloodType: this.animalFormGroup.controls.bloodType.value,
      weight: this.animalFormGroup.controls.weight.value,
      isAnimalSterilized: this.isAnimalSterilized,
      animalSex: this.isAnimalOfFeminineSex ? this.animalFormText.labels.femaleShortLabel : this.animalFormText.labels.masculineShortLabel
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
