export interface IAnimalDoc {
  animalSex: 'F'| 'M' | string,
  age: number,
  birthDay: string,
  bloodType: string,
  id?: string,
  isAnimalSterilized: boolean
  name: string,
  weight: number
}

export interface IAnimalUserInfo {
  animalName: string;
  animalId: string | null;
}
export class AnimalUtilInfo {
  name: string;
  uid: string;

  getName(): string {
    return this.name;
  }

  setName(name: string): AnimalUtilInfo {
    this.name = name;
    return this;
  }

  getUid(): string {
    return this.uid;
  }

  setUid(uid: string): AnimalUtilInfo {
    this.uid = uid;
    return this;
  }
}
