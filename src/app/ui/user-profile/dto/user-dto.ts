import {IAnimalUserInfo} from "../../dto/animal-util-info";

export interface IUserDTO {
  animals: IAnimalUserInfo[];
  id?: string;
  city: string;
  email: string;
  name: string;
  phone: string;
  photo: string;
}

export class UserDTO {
  private city: string;
  private email: string;
  private name: string;
  private phone: string;
  private photo: string;

  getUserCity(): string {
    return this.city;
  }

  setUserCity(value: string): UserDTO {
    this.city = value;
    return this;
  }

  getUserEmail(): string {
    return this.email;
  }

  setUserEmail(value: string): UserDTO {
    this.email = value;
    return this;
  }

  getUserName(): string {
    return this.name;
  }

  setUserName(value: string): UserDTO {
    this.name = value;
    return this;
  }

  getUserPhone(): string {
    return this.phone;
  }

  setUserPhone(value: string): UserDTO {
    this.phone = value;
    return this;
  }

  getUserPhoto(): string {
    return this.photo;
  }

  setUserPhoto(value: string): UserDTO {
    this.photo = value;
    return this;
  }
}
