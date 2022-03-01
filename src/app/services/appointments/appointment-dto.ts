export interface IAppointmentDto {
  id: string,
  dateTime: string,
  userId: string,
  userName: string,
  doctorId: string,
  doctorName: string,
  isHonored: boolean,
  isCanceledByDoctor: boolean,
  isCanceledByUser: boolean,
  isUserCreated: boolean,
  isConfirmedByDoctor: boolean,
  isFinished: boolean,
  isUserNotified: boolean,
  userPhone: string,
  userEmail: string,
  timestamp: number,
  service: string,
  animalData: IAppointmentAnimalData
  location: string
}

interface IAppointmentAnimalData {
  name: string,
  id: string
}
