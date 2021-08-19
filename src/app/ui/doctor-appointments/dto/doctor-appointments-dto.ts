import {AnimalUtilInfo} from "./animal-util-info";

export interface IDoctorsAppointmentsDTO {
  id: string;
  animalData: AnimalUtilInfo;
  dateTime: string;
  location: string;
  userId: string;
  userName: string;
  services: string;
  userEmail: string;
  phone: string;
  isAppointmentFinished: boolean;
  isConfirmedByDoctor: boolean;
  animalAppointmentId: string;
  timestamp: number;
}

export class DoctorsAppointmentDTO {
  private id: string;
  private animalData: AnimalUtilInfo;
  private dateTime: string;
  private location: string;
  private userId: string;
  private userName: string;
  private services: string;
  private userEmail: string;
  private phone: string;
  private isAppointmentFinished: boolean;
  private isConfirmedByDoctor: boolean;
  private animalAppointmentId: string;
  private timestamp: number;
// todo: getter and setter when to use in typescript
  getId(): string {
    return this.id;
  }

  setId(value: string): DoctorsAppointmentDTO {
    this.id = value;
    return this;
  }

  getAnimal(): AnimalUtilInfo {
    return this.animalData;
  }

  setAnimal(value: AnimalUtilInfo): DoctorsAppointmentDTO {
    this.animalData = value;
    return this;
  }

  getDateTime(): string {
    return this.dateTime;
  }

  setDateTime(value: string): DoctorsAppointmentDTO {
    this.dateTime = value;
    return this;
  }


  setTimestamp(value: number): DoctorsAppointmentDTO {
    this.timestamp = value;
    return this;
  }
  getLocation(): string {
    return this.location;
  }

  setLocation(value: string): DoctorsAppointmentDTO {
    this.location = value;
    return this;
  }

  getUserId(): string {
    return this.userId;
  }

  setUserId(value: string): DoctorsAppointmentDTO {
    this.userId = value;
    return this;
  }

  getUserName(): string {
    return this.userName;
  }

  setUserName(value: string): DoctorsAppointmentDTO {
    this.userName = value;
    return this;
  }

  getServices(): string {
    return this.services;
  }

  setServices(value: string): DoctorsAppointmentDTO {
    this.services = value;
    return this;
  }

  setUserEmail(value: string): DoctorsAppointmentDTO {
    this.userEmail = value;
    return this;
  }

  setPhone(value: string): DoctorsAppointmentDTO {
    this.phone = value;
    return this;
  }

  setIsAppointmentFinished (value: boolean): DoctorsAppointmentDTO {
    this.isAppointmentFinished = value;
    return this;
  }

  setIsConfirmedByDoctor (value: boolean): DoctorsAppointmentDTO {
    this.isConfirmedByDoctor = value;
    return this;
  }

  setAnimalAppointmentId (value: string): DoctorsAppointmentDTO {
    this.animalAppointmentId = value;
    return this;
  }
}
