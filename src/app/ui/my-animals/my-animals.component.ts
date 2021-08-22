import { Component, OnInit } from '@angular/core';
import {UserService} from "../user-profile/services/user.service";
import {USER_LOCALSTORAGE} from "../../shared-data/Constants";

@Component({
  selector: 'app-my-animals',
  templateUrl: './my-animals.component.html',
  styleUrls: ['./my-animals.component.css']
})
export class MyAnimalsComponent implements OnInit {
  isAnimalFormShown = false;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  toggleShowAnimalForm() {
    this.isAnimalFormShown = !this.isAnimalFormShown;
  }

  saveNewAnimal(animalPayload: any): void {
    const user: any = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
    // this.userService.updateUserWithAnimalData()
  }
}
