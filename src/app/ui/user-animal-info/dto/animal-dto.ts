export class AnimalDTO {
  private age: string;
  private birthDay: string;
  private bloodType: string;
  private id: string;
  private name: string;
  private weight: string;

  getId(): string {
    return this.id;
  }

  setId(value: string): AnimalDTO {
    this.id = value;
    return this;
  }

  getAnimalAge(): string {
    return this.age;
  }

  setAnimalAge(value: string): AnimalDTO {
    this.age = value;
    return this;
  }

  getAnimalBirthDay(): string {
    return this.birthDay;
  }

  setAnimalBirthDay(value: string): AnimalDTO {
    this.birthDay = value;
    return this;
  }

  getAnimalBloodType(): string {
    return this.bloodType;
  }

  setAnimalBloodType(value: string): AnimalDTO {
    this.bloodType = value;
    return this;
  }

  getAnimalName(): string {
    return this.name;
  }

  setAnimalName(value: string): AnimalDTO {
    this.name = value;
    return this;
  }

  getAnimalWeight(): string {
    return this.weight;
  }

  setAnimalWeight(value: string): AnimalDTO {
    this.weight = value;
    return this;
  }
}
