export class DoctorDTO {
  public id: string | undefined;
  public clinicId?: string;
  public email!: string;
  public doctorName!: string;
  public location!: string;
  public phoneNumber!: string;
  public photoCertificate?: string;
  public schedule?: Map<string, IDaySchedule>;
  public services?: Map<string, string[]>;
  public photo?: string;
  public outOfOfficeDays?: any[];
}

export interface IDaySchedule {
  day: string;
  endTime: string;
  isChecked: boolean;
  startTime: string;
}

