export const INPUT_LABELS_TXT = {
  doctorNameLabel: 'Nume Prenume',
  locationLabel: 'Location',
  locationURLLabel: 'Google Maps URL',
  clinicLabel: 'Clinica',
  emailLabel: 'Email',
  phoneLabel: 'Telefon',
  passwordLabel: 'Parola',
  countyLabel: 'Judet',
  localityLabel: 'Localitate',
  messageLabel: 'Scrie-ne un mesaj:',
};

export const MY_PROFILE = {
  editBtn: 'Editeaza profilul',
  namePlaceholder: 'Ion Popescu',
  emailPlaceholder: 'pausan@gmail.com',
  locationPlaceholder: 'Cluj-Napoca, nr 5, sc 5 app 33',
  locationURLPlaceholder: 'URL se poate copia de pe google maps',
  phonePlaceholder: '0743922xxx',
  clinicPlaceholder: 'Regina Maria',
  errorMessage: ['Campul', 'lipseste sau este incorect'],
  formSuccessMessage: 'Editarea profilului a fost facuta cu succes'
};

export const USER_CARD_TXT = {
  datePlaceholder: 'Data si ora procesarii',
  services: 'Servicii cerute',
  animalName: 'Nume animal',
  buttonValue: 'Vezi detalii programare',
  buttonCancelValue: 'Anuleaza programarea',
  cancelAppointmentSuccess: 'Programarea a fost stearsa si clientul notificat',
  cancelAppointmentError: 'Programarea nu a putut ffi stearsa, te rugam sa incerci din nou',
};

export const CALENDAR_DATA = {
  previousBtn: 'Inapoi',
  nextBtn: 'Inainte',
  todayBtn: 'Prezent',
  monthBtn: 'Luna',
  weekBtn: 'Saptamana',
  dayBtn: 'Zi'
};

export const DOCTORAPPOINTMENT_DATA = {
  newAppointmentBtn: 'Programare noua',
  scheduleBtn: 'Orele de lucru'
};

export const FIREBASE_ERRORS = {
  'auth/user-not-found': 'Nu a fost gasit nici un user inregistrat cu acest cont sau acest cont a fost sters. Te rugam sa-ti creezi un cont nou sau sa ne contactezi',
  'auth/network-request-failed': 'A aparut o problema de conexiune la server. Te rugam sa iti verifici conexiunea la internet.'
}

export const UI_ALERT_MESSAGES = {
  welcome: 'Bine ai venit:D'
}

export const APPOINTMENT_PAGE = {
  noAvailableAppointments: 'Nu aveti alte programari - Adauga o programare noua'
}

export const APPOINTMENTFORM_DATA = {
  title: 'Programare noua',
  medicLabel: 'Medic',
  dateLabel: 'Selecteaza data',
  dateFormat: 'dd/mm/yyyy',
  hourLabel: 'Ora',
  minuteLabel: 'Minut',
  patientLabel: 'Nume si prenume client',
  animalLabel: 'Animal',
  servicesLabel: 'Servicii',
  cancelBtn: 'Anuleaza',
  submitBtn: 'Salveaza',
  medicInputPlaceholder: 'Nume doctor veterinar',
  userNameInputPlaceholder: 'Cauta in lista de pacienti',
  servicesSelectDefaultOption: 'Selecteaza un serviciu',
  animalSelectDefaultOption: 'Cauta un animal sau adauga unul nou',
  formAllFieldsValidMessage: 'Toate campurile trebuie completate!',
  patientOnFocusMessage: 'Selecteaza un client din lista',
  patientPhoneLabel: INPUT_LABELS_TXT.phoneLabel,
  patientPhonePlaceholder: MY_PROFILE.phonePlaceholder,
  patientEmailLabel: INPUT_LABELS_TXT.emailLabel,
  patientEmailPlaceholder: MY_PROFILE.emailPlaceholder,
  timeValidation: 'Ora si data programarii nu pot fi setate in trecut',
  patientDoesNotExist: 'Nu am gasit nici un user cu acest nume, te rugam sa incerci din nou sau sa creezi un user clientului in sectiunea "Creeaza client nou"',
  userDoesNotHaveAnimal: 'Acest user nu are nici un animal inregistrat, insereaza in casuta numele animalului pentru a-l adauga clientului',
  successAppointment: 'Programarea a fost facut cu succes',
  wrongStartDate: 'Zi libera! Selecteaza o zi diferita'
};

export const APPOINTMENT_MESSAGES = {
  APPOINTMENT_IN_PAST_NOT_POSSIBLE: 'Programarea nu poate fi setata in trecut',
};

export const UI_ALERTS_CLASSES = {
  SUCCESS: 'snackbar-success',
  ERROR: 'snackbar-error'
}

export const USER_ANIMAL_DIALOG = {
  ownersPets: 'Animale: ',
  medicalHistory: 'Istoric recomandari:',
  animalDiseases: 'Patologii asociate:',
  name: 'Nume: ',
  age: 'Varsta: ',
  weight: 'Greutate: ',
  bloodType: 'Tipul de sange: ',
  birthDay: 'Zi de nastere: ',
  addRecommendation: 'Adauga recomandare',
  addDisease: 'Adauga patologie',
  editInputPlaceholder: 'Max 250 caractere'
};

export const USER_SERVICE = {
  addUserSuccess: 'Userul a fost creat cu succes',
  addUserError: 'Userul nu a putut fi creat, te rugam sa incerci din nou',
  deleteUserSuccess: 'Userul a fost sters cu succes',
  deleteUserError: 'Userul nu a putut fi sters, te rugam sa incerci din nou',
  USER_ALREADY_EXISTS: 'Userul este deja inregistrat',
  USER_ALREADY_EXISTS_WITH_EMAIL: 'Userul este deja inregistrat cu acest email',
}

export const DIALOG_UI_ERRORS = {
  noChangeDetected: 'Nu a fost detectata nici o modificare!'
};

export const FOOTER_ERROR_MSG = 'Verifica inca o data daca emailul tau este valid sau daca mesajul tau nu e gol sau are mai mult de 250 de caractere.';

export const FOOTER_COMPONENT = {
  buttonText: 'Trimite mesajul!',
  placeholderMessage: 'Min 5 caractere, max 250 caractere',
  placeholderEmail: 'popescu1234@gmail.com',
  messageSentSuccessfully: 'Mesajul tau a fost trimis cu succes. In minim 24 de ore vei fi contacta de unul dintre colegii echipei Doctor Vet',
};

export const USER_STATE = {
  emailVerified: 'Pentru a putea folosi aplicatia te rugam sa iti verifici emailul',
  patientNotFound: APPOINTMENTFORM_DATA.patientDoesNotExist,
}

export const USER_LOCALSTORAGE = 'user'

export const INPUT_REGEX_TEXTS = {
  email: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
  phoneNumber: '^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$'
};

export const NAVBAR_IMG = {
  logo: '../../assets/photos/DoctorVett-logos-removebg.png'
};

export const NAVBAR_TEXT = {
  locations: 'Locatii',
  appointments: 'Programari',
  createAppointment: 'Adauga programare',
  createAppointmentWithoutUser: 'Programare - user fara cont',
  patient: 'Pacienti',
  calendar: 'Calendar',
  schedule: 'Programul meu',
  signOut: 'Iesi din cont',
  signIn: 'Intra in cont',
  signUp: 'Creeaza cont',
  myProfile: 'Profilul meu',
  home: 'Acasa',
  newAccount: 'Creeaza client nou'
};

export const HEADER_TEXT = {
  title: 'Datele animalelor tale intr-o singura aplicatie',
  subtitle: 'Iti permite sa iti inregistrezi animalele tale in aplicatie, sa creezi notificari pentru vaccinuri, interventii chirurgicale sau programari la medicul veterinar',
  buttonText: 'See projects'
};

export const HOMEPAGE_CARD_TEXT = [{
  photo: '../../../assets/photos/svg.svg',
  title: 'Istoric medical',
  text: 'Pentru mai bune tratamente ale animalului tau vei avea acces la istoricul lui medical.'
}, {
  photo: '../../../assets/photos/svg.svg',
  title: 'Programari',
  text: 'O gestionare mai buna a programarilor. Programari online. Programari recurente. Programari realizate mai rapid si mai eficient.'
} , {
  photo: '../../../assets/photos/svg.svg',
  title: 'Notificari',
  text: 'Alerte de notificari ale programarilor prin SMS si email.'
}
];

export const HOMEPAGE_SECTION_DATA = {
  title: 'Tot ce iti ofera aplicatia DoctorVett',
  subTitle: 'Managementul animalelor tale'
};

export const HOMEPAGE_ARTICLE_DATA = {
  title: 'Gestioneaza vizitele la medicul veterinar mult mai eficient',
  subtitle: 'DoctorVett',
  text: 'DcotorVett vine in sprijinul medicilor veterinari si al pecientilor acestora oferindu-le un loc unde sunt integrate o serie de beneficii.'
};

export const HOMEPAGE_ARTICLE_STEPS_DATA = {
  title: 'De ce este DoctorVett mai eficient decat nelipsitul caiet cu programari?\n',
  text: [
    'O singura aplicatie pentru datele animalului tau',
    'Programari realizate online',
    'Alerte prin sms si email, pentru a nu uita cand este urmatoarea programare',
    'Calendar pe zile, saptamanal si lunar cu toate programarile',
    'Posibilitatea de a refuza sau accepta o programare',
    'Efectuarea de programari recurente prin apasarea unui simplu buton'
  ],
  icon: 'icon-magic-wand'
};

export const DOCTOR_CREATES_NEW_USER = {
  emailLabel: INPUT_LABELS_TXT.emailLabel,
  phoneLabel: INPUT_LABELS_TXT.phoneLabel,
  animalNameLabel: '(OPTIONAL) Adauga animal - doar daca animalul nu este inregistrat!',
  patientLabel: APPOINTMENTFORM_DATA.patientLabel,
  emailPlaceholder: MY_PROFILE.emailPlaceholder,
  phonePlaceholder: MY_PROFILE.phonePlaceholder,
  patientNamePlaceholder: APPOINTMENTFORM_DATA.patientLabel,
  animalNamePlaceholder: 'Nume animal',
  titleDialog: 'Adauga user nou',
  buttonDialog: 'Salveaza user',
  errorMessage: 'Unul din campurile de mai sus nu este completat sau este completat gresit.'
}

export const AUTH_LOGIN_FORM_TEXT = {
  googleBtnTxt: 'Logheaza-te cu Google',
  title: 'Intra in aplicatie',
  emailPlaceholder: 'john@gmail.com',
  passwordPlaceholder: 'Parola - minim 6 caractere',
  btnText: 'Intra in cont',
  isLogin: true,
  forgotPasswordMsg: 'Ai uitat parola?',
};

export const AUTH_SIGNUP_FORM_TEXT = {
  address: 'Adresa clinicii - Oras, Strada, Numar',
  googleBtnTxt: 'Creeaza cont cu Google',
  title: 'Creeaza cont nou',
  subtitle: 'Toate campuurile sunt obligatorii',
  emailPlaceholder: 'john@gmail.com',
  passwordPlaceholder: 'Parola - minim 6 caractere',
  step1: 'Urmatorul pas - 1/2 ',
  step2: 'Mergi spre ultimul pas - 2/3',
  step3: 'Creeaza cont - 2/2',
  secondStepTitle: 'Ne asiguram ca esti doctorul potrivit',
  secondStepText: 'Incarca o fotografie cu buletinul si certificatul de doctor.; Asigura-te ca ambele documente sunt in original.; Tine documentele la piept astfel incat sa te putem identifica.',
  isLogin: false,
  emailValidationTxt: 'Retrimite emailul de validare',
  phonePlaceholder: '0743934XXX',
  namePlaceholder: 'Popescu Ion',
  nameLabel: 'Nume si prenume',
  county: 'Alege judetul',
  locality: 'Alege localitatea',
  formErrorMessage: 'Te rugam sa verifici ca toate inputurile sunt completate si ca datele sunt corecte.',
  thirdStepTitle: 'Selecteaza serviciile pe care le prestezi',
  selectAtLeastOneService: 'Selecteaza cel putin un serviciu',
  createAccountBtn: 'Creeaza cont'
};

export const ANIMAL_FORM_TEXT = {
  labels: {
    nameLabel: 'Numele animalului',
    weightLabel: 'Greutatea animalului',
    ageLabel: 'Varsta animalului',
    birthDayLabel: 'Zi de nastere'
  },
  placeholders: {
    namePlaceholder: 'Azorel',
    weightPlaceholder: 'EX: 30 kg',
    agePlaceholder: 'Ex: 10 ani',
    birthDayPlaceholder: '10/03/2018',
  },
  buttonText: 'Adauga animal',
  errorFromValidation: AUTH_SIGNUP_FORM_TEXT.formErrorMessage
}

export const SCHEDULE_HEADER_TEXT = {
  title: 'Seteaza orele de munca pentru aceasta saptamana',
  subtitle: 'Orele se vor propaga in calendarul dumneavoastra timp de o luna',
  scheduleButtonText: 'Salveaza programul',
  startDateLabel: 'Selecteaza data de start a concediului',
  endDateLabel: 'Selecteaza data de sfarsit a concediului',
  dateFormat: APPOINTMENTFORM_DATA.dateFormat,
  buttonOutOfOfficePlaceholder: 'Salveaza concediul',
  outOfOfficeError: 'Selecteaza o data de start si o data de sfarsit a concediului SAU asigura-te ca data de start nu e mai mare decat data de sfarsit a concediului',
  cancelOutOfOfficeDaysBtnPlaceholder: 'Anuleaza concediul',
  startOutOfOfficePeriodPlaceholder: 'Concediul incepe in: ',
  endOutOfOfficePeriodPlaceholder: ' si se termina in: ',
  saveScheduleSuccess: 'Programul de lucru a fost salvat cu succes',
  saveScheduleError: 'Programul nu a putut fi salvat, te rugam sa incerci din nou',
  cancelOutOfOfficeSuccess: 'Concediul a fost sters',
  cancelOutOfOfficeError: 'Concediul nu a putut fi sters, te rugam sa incerci din nou',
  addOutOfOfficeSuccess: 'Concediul a fost adaugat',
  addOutOfOfficeError: 'Concediul nu a putut fi adaugat, te rugam sa incerci din nou',
};

export const DAYS_OF_WEEK = ['Luni-Vineri', 'Sambata', 'Duminica'];

export const DAYS_OF_WEEK_MAP = {
  'monday-friday': 'Luni-Vineri',
  saturday: 'Sambata',
  sunday: 'Duminica'
};

export const FREQUENCY_MINUTES_INTERVALS = {
  10: [0, 10, 20 ,30, 40, 50],
  15: [0, 15, 30 ,45],
  20: [0, 20, 40],
  25: [0, 25, 50],
  30: [0, 30],
  45: [0, 45],
}

export const SCHEDULE_COMPONENT = {
  ERROR_MSG: 'Asigura-te ca orele de inceput si de sfarsit ale zilei sunt completate corect.',
  DAY_OFF: 'Zi libera'
};

export const COUNTIES_ABBR = {
 'Bucuresti': 'B',
 'Iasi':'IS',
 'Prahova': 'PH',
 'Cluj': 'CJ',
 'Constanta': 'CT',
 'Timis': 'TM',
 'Dolj':'DJ',
 'Suceava':'SV',
 'Bacau':'BC',
 'Arges':'AG',
 'Bihor':'BH',
 'Mures':'MS',
 'Brasov':'BV',
 'Galati':'GL',
 'Dambovita':'DB',
 'Maramures':'MM',
 'Neamt':'NT',
 'Buzau':'BZ',
 'Olt':'OT',
 'Arad': 'AR',
 'Hunedoara':'HD',
 'Botosani':'BT',
 'Sibiu':'SB',
 'Vaslui':'VS',
 'Ilfov':'IF',
 'Teleorman':'TL',
 'Valcea':'VL',
 'Satu Mare':'SM',
 'Alba':'AB',
 'Gorj':'GJ',
 'Vrancea':'VR',
 'Braila':'BR',
 'Harghita':'HG',
 'Calarasi':'CL',
 'Caras-Severin':'CS',
 'Bistrita-Nasaud':'BN',
 'Giurgiu':'GU',
 'Ialomita':'IL',
 'Mehedinti':'MH',
 'Salaj':'SJ',
 'Tulcea':'TL',
 'Covasna':'CV'
}

export const COUNTIES = [
  'Bucuresti',
  'Iasi',
  'Prahova',
  'Cluj',
  'Constanta',
  'Timis',
  'Dolj',
  'Suceava',
  'Bacau',
  'Arges',
  'Bihor',
  'Mures',
  'Brasov',
  'Galati',
  'Dambovita',
  'Maramures',
  'Neamt',
  'Buzau',
  'Olt',
  'Arad',
  'Hunedoara',
  'Botosani',
  'Sibiu',
  'Vaslui',
  'Ilfov',
  'Teleorman',
  'Valcea',
  'Satu Mare',
  'Alba',
  'Gorj',
  'Vrancea',
  'Braila',
  'Harghita',
  'Calarasi',
  'Caras-Severin',
  'Bistrita-Nasaud',
  'Giurgiu',
  'Ialomiţa',
  'Mehedinti',
  'Salaj',
  'Tulcea',
  'Covasna'
];

export const DOCTOR_DEFAULT_SCHEDULE = {
  'monday-friday': {
    day: 'Luni-Vineri',
    startTime: '09:00',
    endTime: '17:00',
    isChecked: true,
    dayNumber: 1
  },
  saturday: {
    day: 'Sambata',
    startTime: '09:00',
    endTime: '17:00',
    isChecked: false,
    dayNumber: 6
  },
  sunday: {
    day: 'Duminica',
    startTime: '09:00',
    endTime: '17:00',
    isChecked: false,
    dayNumber: 0
  }
}
