export class DoctorDTO {
  public id: string | undefined;
  public clinicLogo?: string;
  public clinicName?: string;
  public email: string;
  public doctorName: string;
  public location: string;
  public locationGMapsUrl?: string;
  public phoneNumber: string;
  public photoCertificate?: string;
  public schedule?: Map<string, IDaySchedule>;
}

export interface IDaySchedule {
  day: string;
  endTime: string;
  isChecked: boolean;
  isOutOfOffice: boolean;
  startTime: string;
}

