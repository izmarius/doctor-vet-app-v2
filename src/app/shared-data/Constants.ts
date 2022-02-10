// A
export const APPOINTMENT_CALENDAR_TAG = {
  ANIMAL: 'Animal: ',
  CLIENT: 'Client: ',
  HOUR: 'Ora: ',
  PHONE: 'Tel: ',
}

export const APPOINTMENTFORM_DATA = {
  animalLabel: APPOINTMENT_CALENDAR_TAG.ANIMAL,
  animalNeedsRegistration: 'Pentru a putea face o programare te rugam sa inregistrezi animalul in pagina de "Lista clienti" la userul: ',
  animalSelectDefaultOption: 'Selecteaza un animal',
  cancelBtn: 'Anuleaza',
  dateFormat: 'dd/mm/yyyy',
  dateLabel: 'Selecteaza data',
  formAllFieldsValidMessage: 'Toate campurile trebuie completate!',
  hourLabel: APPOINTMENT_CALENDAR_TAG.HOUR,
  medicLabel: 'Medic',
  medicInputPlaceholder: 'Nume doctor veterinar',
  minuteLabel: 'Minut',
  outOfWorkingOfficeWarning: ['Programul in aceasta zi este pana la: ', '. Te rugam sa te incadrezi in orarul setat.'],
  patientDoesNotExist: 'Nu am gasit nici un user cu acest nume, te rugam sa incerci din nou sau sa creezi un user nou in sectiunea "Creeaza client nou"',
  patientEmailLabel: 'Email',
  patientEmailPlaceholder: 'john@gmail.com',
  patientOnFocusMessage: 'Selecteaza un client din lista',
  patientPhoneLabel: 'Telefon',
  patientPhonePlaceholder: '0743922xxx',
  patientLabel: 'Nume si prenume client',
  quickAppointmentError: 'Programarile rapide se pot face doar cu valorile: 1 zi, 2 saptamani, 1 luna, sau 1 an!',
  SEARCH_BY_PHONE_LABEL: 'Cauta useri dupa numarul de telefon',
  servicesLabel: 'Servicii',
  servicesSelectDefaultOption: 'Selecteaza un serviciu',
  submitBtn: 'Salveaza',
  successAppointment: 'Programarea a fost facut cu succes',
  userNameInputPlaceholder: 'Cauta in lista de pacienti',
  timeValidation: 'Ora si data programarii nu pot fi setate in trecut',
  title: 'Programare noua',
  userDoesNotHaveAnimal: 'Acest user nu are nici un animal inregistrat, insereaza in casuta numele animalului pentru a-l adauga clientului',
  wrongStartDate: 'Zi libera! Selecteaza o zi diferita'
};

export const APPOINTMENT_MESSAGES = {
  APPOINTMENT_DELETION_FAILED: 'Programarea nu a putut fi stearsa',
  APPOINTMENT_DELETION_SUCCESS: 'Programarea a fost stearsa si clientul notificat.',
  APPOINTMENT_IN_PAST_NOT_POSSIBLE: 'Programarea nu poate fi setata in trecut',
};

export const AUTH_LOGIN_FORM_TEXT = {
  isLogin: true,
  btnText: 'Intra in cont',
  emailPlaceholder: APPOINTMENTFORM_DATA.patientEmailPlaceholder,
  forgotPasswordMsg: 'Ai uitat parola?',
  googleBtnTxt: 'Logheaza-te cu Google',
  passwordPlaceholder: 'Parola - minim 6 caractere',
  title: 'Intra in aplicatie',
};

export const AUTH_SIGNUP_FORM_TEXT = {
  address: 'Adresa clinicii - Oras, Strada, Numar',
  createAccountBtn: 'Creeaza cont',
  county: 'Alege judetul',
  emailPlaceholder: APPOINTMENTFORM_DATA.patientEmailPlaceholder,
  emailValidationTxt: 'Retrimite emailul de validare',
  formErrorMessage: 'Te rugam sa verifici ca toate inputurile sunt completate si ca datele sunt corecte.',
  googleBtnTxt: 'Creeaza cont cu Google',
  isLogin: false,
  locality: 'Alege localitatea',
  nameLabel: 'Nume si prenume',
  namePlaceholder: 'Popescu Ion',
  passwordPlaceholder: AUTH_LOGIN_FORM_TEXT.passwordPlaceholder,
  phonePlaceholder: APPOINTMENTFORM_DATA.patientPhonePlaceholder,
  secondStepText: 'Incarca o fotografie cu buletinul si certificatul de doctor.; Asigura-te ca ambele documente sunt in original.; Tine documentele la piept astfel incat sa te putem identifica.',
  secondStepTitle: 'Ne asiguram ca esti doctorul potrivit',
  selectAtLeastOneService: 'Selecteaza cel putin un serviciu',
  step1: 'Urmatorul pas - 1/2 ',
  step2: 'Mergi spre ultimul pas - 2/3',
  step3: 'Creeaza cont - 2/2',
  subtitle: 'Toate campuurile sunt obligatorii',
  thirdStepTitle: 'Selecteaza serviciile pe care le prestezi',
  title: 'Creeaza cont nou'
};

export const ANIMAL_FORM_TEXT = {
  buttonText: 'Adauga animal',
  errorFromValidation: AUTH_SIGNUP_FORM_TEXT.formErrorMessage,
  labels: {
    ageLabel: 'Varsta animalului',
    birthDayLabel: 'Zi de nastere',
    weightLabel: 'Greutatea animalului',
    nameLabel: 'Numele animalului'
  },
  placeholders: {
    agePlaceholder: 'Ex: 10 ani',
    birthDayPlaceholder: '10/03/2018',
    namePlaceholder: 'Azorel',
    weightPlaceholder: 'EX: 30 kg',
  }
}

// C
export const CALENDAR_DATA = {
  dayBtn: 'Zi',
  nextBtn: 'Inainte',
  monthBtn: 'Luna',
  previousBtn: 'Inapoi',
  todayBtn: 'Prezent',
  weekBtn: 'Saptamana'
};

// D
export const DOCTOR_CREATES_NEW_USER = {
  animalNameLabel: 'Adauga animal',
  animalNamePlaceholder: 'Nume animal',
  buttonDialog: 'Salveaza user',
  emailLabel: APPOINTMENTFORM_DATA.patientEmailLabel,
  errorMessage: 'Unul din campurile de mai sus nu este completat sau este completat gresit.',
  emailPlaceholder: APPOINTMENTFORM_DATA.patientEmailPlaceholder,
  patientLabel: APPOINTMENTFORM_DATA.patientLabel,
  patientNamePlaceholder: APPOINTMENTFORM_DATA.patientLabel,
  phoneLabel: APPOINTMENTFORM_DATA.patientPhoneLabel,
  phonePlaceholder: APPOINTMENTFORM_DATA.patientPhonePlaceholder,
  titleDialog: 'Adauga user nou'
}

export const DAYS_OF_WEEK = ['Luni-Vineri', 'Sambata', 'Duminica'];

export const DAYS_OF_WEEK_MAP = {
  'monday-friday': 'Luni-Vineri',
  saturday: 'Sambata',
  sunday: 'Duminica'
};

export const DIALOG_UI_ERRORS = {
  noChangeDetected: 'Nu a fost detectata nici o modificare!'
};

export const DOCTORAPPOINTMENT_DATA = {
  newAppointmentBtn: 'Programare noua',
  scheduleBtn: 'Orele de lucru'
};

export const DOCTOR_DEFAULT_SCHEDULE = {
  'monday-friday': {
    day: 'Luni-Vineri',
    dayNumber: 1,
    endTime: '17:00',
    isChecked: true,
    startTime: '09:00'
  },
  saturday: {
    day: 'Sambata',
    dayNumber: 6,
    endTime: '17:00',
    isChecked: false,
    startTime: '09:00'
  },
  sunday: {
    day: 'Duminica',
    dayNumber: 0,
    endTime: '17:00',
    isChecked: false,
    startTime: '09:00'
  }
}

// F
export const FIREBASE_ERRORS: any = {
  'auth/email-already-in-use': 'Acest email este deja inregistrat.Te rugam sa incerci cu un alt email',
  'auth/network-request-failed': 'A aparut o problema de conexiune la server. Te rugam sa iti verifici conexiunea la internet.',
  'auth/user-not-found': 'Nu a fost gasit nici un user inregistrat cu acest cont sau acest cont a fost sters. Te rugam sa-ti creezi un cont nou sau sa ne contactezi',
  'auth/wrong-password': 'Parola este nu este valida',
}

export const FOOTER_COMPONENT = {
  buttonText: 'Trimite mesajul!',
  messageSentSuccessfully: 'Mesajul tau a fost trimis cu succes. In minim 24 de ore vei fi contacta de unul dintre colegii echipei Doctor Vet',
  placeholderEmail: 'popescu1234@gmail.com',
  placeholderMessage: 'Min 5 caractere, max 250 caractere',
};

export const FOOTER_ERROR_MSG = 'Verifica inca o data daca emailul tau este valid sau daca mesajul tau nu e gol sau are mai mult de 250 de caractere.';


export const FREQUENCY_MINUTES_INTERVALS = {
  10: [0, 10, 20, 30, 40, 50],
  15: [0, 15, 30, 45],
  20: [0, 20, 40],
  25: [0, 25, 50],
  30: [0, 30],
  45: [0, 45],
}

// H
export const HEADER_TEXT = {
  buttonText: 'Vezi proiecte',
  subtitle: 'Iti permite sa iti inregistrezi animalele tale in aplicatie, sa creezi notificari pentru vaccinuri, interventii chirurgicale sau programari la medicul veterinar',
  title: 'Datele animalelor tale intr-o singura aplicatie'
};

export const HOMEPAGE_ARTICLE_DATA = {
  subtitle: 'DoctorVett',
  text: 'DcotorVett vine in sprijinul medicilor veterinari si al pecientilor acestora oferindu-le un loc unde sunt integrate o serie de beneficii.',
  title: 'Gestioneaza vizitele la medicul veterinar mult mai eficient'
};

export const HOMEPAGE_ARTICLE_STEPS_DATA = {
  icon: 'icon-magic-wand',
  text: [
    'O singura aplicatie pentru datele animalului tau',
    'Programari realizate online',
    'Alerte prin sms si email, pentru a nu uita cand este urmatoarea programare',
    'Calendar pe zile, saptamanal si lunar cu toate programarile',
    'Posibilitatea de a refuza sau accepta o programare',
    'Efectuarea de programari recurente prin apasarea unui simplu buton'
  ],
  title: 'De ce este DoctorVett mai eficient decat nelipsitul caiet cu programari?\n'
};

export const HOMEPAGE_CARD_TEXT = [{
  photo: '../../../assets/photos/svg.svg',
  text: 'Pentru mai bune tratamente ale animalului tau vei avea acces la istoricul lui medical.',
  title: 'Istoric medical'
}, {
  photo: '../../../assets/photos/svg.svg',
  text: 'O gestionare mai buna a programarilor. Programari online. Programari recurente. Programari realizate mai rapid si mai eficient.',
  title: 'Programari'
}, {
  photo: '../../../assets/photos/svg.svg',
  text: 'Alerte de notificari ale programarilor prin SMS si email.',
  title: 'Notificari'
}
];

export const HOMEPAGE_SECTION_DATA = {
  subTitle: 'Managementul animalelor tale',
  title: 'Tot ce iti ofera aplicatia DoctorVett'
};


// I
export const INPUT_LABELS_TXT = {
  doctorNameLabel: 'Nume Prenume',
  clinicLabel: 'Clinica',
  countyLabel: 'Judet',
  emailLabel: APPOINTMENTFORM_DATA.patientEmailLabel,
  locationLabel: 'Location',
  locationURLLabel: 'Google Maps URL',
  localityLabel: 'Localitate',
  messageLabel: 'Scrie-ne un mesaj:',
  passwordLabel: 'Parola',
  phoneLabel: APPOINTMENTFORM_DATA.patientPhoneLabel,
};

export const INPUT_REGEX_TEXTS = {
  email: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
  phoneNumber: '^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$'
};

// M
export const MY_PROFILE = {
  clinicPlaceholder: 'Regina Maria',
  editBtn: 'Editeaza profilul',
  emailPlaceholder: APPOINTMENTFORM_DATA.patientEmailPlaceholder,
  errorMessage: ['Campul', 'lipseste sau este incorect'],
  formSuccessMessage: 'Editarea profilului a fost facuta cu succes',
  locationPlaceholder: 'Cluj-Napoca, nr 5, sc 5 app 33',
  locationURLPlaceholder: 'URL se poate copia de pe google maps',
  namePlaceholder: AUTH_SIGNUP_FORM_TEXT.namePlaceholder,
  phonePlaceholder: APPOINTMENTFORM_DATA.patientPhonePlaceholder
};

export const MODALS_DATA = {
  CONFIRMATION_MODAL: 'confirmation-modal',
  DOCTOR_APP_MODAL: 'doctor-appointment-dialog'
}

// N
export const NAVBAR_IMG = {
  logo: '../../assets/photos/DoctorVett-logos-removebg.png'
};

export const NAVBAR_TEXT = {
  appointments: 'Programari',
  calendar: 'Calendar',
  clientList: 'Lista clienti',
  createAppointment: 'Adauga programare',
  home: 'Acasa',
  locations: 'Locatii',
  myProfile: 'Profilul meu',
  newAccount: 'Creeaza client nou',
  patient: 'Pacienti',
  schedule: 'Programul meu',
  signIn: AUTH_LOGIN_FORM_TEXT.btnText,
  signOut: 'Iesi din cont',
  signUp: AUTH_SIGNUP_FORM_TEXT.createAccountBtn
};

// S
export const SCHEDULE_HEADER_TEXT = {
  addOutOfOfficeError: 'Concediul nu a putut fi adaugat, te rugam sa incerci din nou',
  addOutOfOfficeSuccess: 'Concediul a fost adaugat',
  buttonOutOfOfficePlaceholder: 'Salveaza concediul',
  cancelOutOfOfficeDaysBtnPlaceholder: 'Anuleaza concediul',
  cancelOutOfOfficeError: 'Concediul nu a putut fi sters, te rugam sa incerci din nou',
  cancelOutOfOfficeSuccess: 'Concediul a fost sters',
  dateFormat: APPOINTMENTFORM_DATA.dateFormat,
  endDateLabel: 'Selecteaza data de sfarsit a concediului',
  endOutOfOfficePeriodPlaceholder: ' si se termina in: ',
  outOfOfficeError: 'Selecteaza o data de start si o data de sfarsit a concediului SAU asigura-te ca data de start nu e mai mare decat data de sfarsit a concediului',
  saveScheduleError: 'Programul nu a putut fi salvat, te rugam sa incerci din nou',
  saveScheduleSuccess: 'Programul de lucru a fost salvat cu succes',
  scheduleButtonText: 'Salveaza programul',
  startDateLabel: 'Selecteaza data de start a concediului',
  startOutOfOfficePeriodPlaceholder: 'Concediul incepe in: ',
  subtitle: 'Orele se vor propaga in calendarul dumneavoastra timp de o luna',
  title: 'Seteaza orele de munca pentru aceasta saptamana',
};

export const SCHEDULE_COMPONENT = {
  DAY_OFF: 'Zi libera',
  ERROR_MSG: 'Asigura-te ca orele de inceput si de sfarsit ale zilei sunt completate corect.'
};

// U
export const UI_ALERTS_CLASSES = {
  SUCCESS: 'snackbar-success',
  ERROR: 'snackbar-error'
}

export const UI_ALERT_MESSAGES = {
  welcome: 'Bine ai venit:D',
}

export const UI_USERS_OF_DOCTOR_MSGS = {
  CREATE_AN_ACCOUNT_FOR_USER: 'Userii fara cont nu au datele animalelor salvate. Pentru a le salva, sterge userul din lista ta si creeaza-i un cont.',
  ERROR_CLIENT_ALREADY_EXISTS: 'Clientul cu acest numar de telefon exista deja si nu poate fi adaugat de doua ori!',
  ERROR_DELETING_CLIENT_FROM_LIST: 'Clientul nu a putut fi sters din lista, te rugam sa incerci din nou!',
  ERROR_GETTING_ANIMAL_DATA: 'Animalul nu a fost gasit sau a aparut o eroare la conexiunea la server.',
  ERROR_GETTING_ANIMAL_MEDICAL_HISTORY: 'Animalul nu are istoric medical sau a aparut o eroare la conexiunea la server.',
  ERROR_GETTING_USERS_DATA: 'Userul nu a fost gasit sau a aparut o eroare la conexiunea la server.',
  ERROR_GETTING_USERS_DOCTORS: 'A aparut o problema de conexiune la server. Te rugam sa incerci din nou!',
  ERROR_SAVING_USERS_DOCTORS: 'A aparut o problema la salvarea acestui client. Te rugam sa incerci din nou!',
  NO_LOGGED_IN_DOCTOR: 'Sesiunea ta a expirat, te rugam sa te loghezi in aplicatie',
}

export const USER_ANIMAL_DIALOG = {
  addDisease: 'Adauga patologie',
  addRecommendation: 'Adauga recomandare',
  animalDiseases: 'Patologii asociate:',
  age: 'Varsta: ',
  birthDay: 'Zi de nastere: ',
  bloodType: 'Tipul de sange: ',
  cancelTxt: 'Cancel',
  editAnimalData: 'Editeaza date animal',
  editInputPlaceholder: 'Max 250 caractere',
  medicalHistory: 'Istoric recomandari:',
  name: 'Nume: ',
  ownersPets: 'Animale: ',
  saveTxt: APPOINTMENTFORM_DATA.submitBtn,
  weight: 'Greutate: '
};

export const USERS_DOCTORS = 'clienti';
export const USER_LOCALSTORAGE = 'user';

export const USER_CARD_TXT = {
  animalName: DOCTOR_CREATES_NEW_USER.animalNamePlaceholder,
  buttonCancelValue: 'Anuleaza programarea',
  buttonValue: 'Vezi detalii programare',
  cancelAppointmentError: 'Programarea nu a putut fi stearsa, te rugam sa incerci din nou.',
  cancelAppointmentSuccess: APPOINTMENT_MESSAGES.APPOINTMENT_DELETION_SUCCESS,
  datePlaceholder: 'Data si ora procesarii',
  services: 'Servicii cerute',
};

export const USER_STATE = {
  emailVerified: 'Pentru a putea folosi aplicatia te rugam sa iti verifici emailul',
  patientNotFound: APPOINTMENTFORM_DATA.patientDoesNotExist,
}

export const USER_SERVICE = {
  addUserError: 'Userul nu a putut fi creat, te rugam sa incerci din nou',
  addUserSuccess: 'Userul a fost creat cu succes',
  deleteUserError: 'Userul nu a putut fi sters, te rugam sa incerci din nou',
  deleteUserSuccess: 'Userul a fost sters cu succes',
  USER_ALREADY_EXISTS: 'Userul este deja inregistrat',
  USER_ALREADY_EXISTS_WITH_EMAIL: 'Userul este deja inregistrat cu acest numar de telefon',
}

export const USERS_DOCTOR_PAGE_CONST = {
  ADD_USER_TO_DOCTOR_LIST_BTN: 'Adauga user in lista',
  DELETE_USER_FROM_LIST_BTN: 'Sterge client din lista ta',
  CLIENT_WITH_ACCOUNT: {
    title: 'Clienti cu cont:',
    buttonText: 'Adauga client cu cont'
  },
  CLIENT_WITHOUT_ACCOUNT: {
    title: 'Clienti fara cont:',
    buttonText: 'Adauga client fara cont'
  },
  REFRESH_LIST_OF_USERS_DOCTORS: 'Reincarca lista de useri',
  SEARCH_BY_NAME_PLACEHOLDER: 'Cauta useri dupa nume',
  SEARCH_BY_PHONE_LABEL: APPOINTMENTFORM_DATA.SEARCH_BY_PHONE_LABEL
}

// Q
export const QUICK_APP_PERIOD = {
  cancelAppointment: USER_CARD_TXT.buttonCancelValue,
  cancelAppointmentSuccess: 'PROGRAMARE ANULATA',
  customAppointment: 'Custom',
  oneDay: '1 zi',
  oneMonth: '1 luna',
  oneYear: '1 an',
  rescheduleTitle: 'Reprogrameaza in : ',
  title: 'Adauga programare peste: ',
  twoWeeks: '2 saptamani'
}

// LOCATION

export const COUNTIES_ABBR = {
  'Bucuresti': 'B',
  'Iasi': 'IS',
  'Prahova': 'PH',
  'Cluj': 'CJ',
  'Constanta': 'CT',
  'Timis': 'TM',
  'Dolj': 'DJ',
  'Suceava': 'SV',
  'Bacau': 'BC',
  'Arges': 'AG',
  'Bihor': 'BH',
  'Mures': 'MS',
  'Brasov': 'BV',
  'Galati': 'GL',
  'Dambovita': 'DB',
  'Maramures': 'MM',
  'Neamt': 'NT',
  'Buzau': 'BZ',
  'Olt': 'OT',
  'Arad': 'AR',
  'Hunedoara': 'HD',
  'Botosani': 'BT',
  'Sibiu': 'SB',
  'Vaslui': 'VS',
  'Ilfov': 'IF',
  'Teleorman': 'TL',
  'Valcea': 'VL',
  'Satu Mare': 'SM',
  'Alba': 'AB',
  'Gorj': 'GJ',
  'Vrancea': 'VR',
  'Braila': 'BR',
  'Harghita': 'HG',
  'Calarasi': 'CL',
  'Caras-Severin': 'CS',
  'Bistrita-Nasaud': 'BN',
  'Giurgiu': 'GU',
  'Ialomita': 'IL',
  'Mehedinti': 'MH',
  'Salaj': 'SJ',
  'Tulcea': 'TL',
  'Covasna': 'CV'
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

