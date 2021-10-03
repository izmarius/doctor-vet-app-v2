import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FOOTER_COMPONENT, FOOTER_ERROR_MSG, INPUT_LABELS_TXT, INPUT_REGEX_TEXTS} from "../../../shared-data/Constants";
import {MessagesService} from "../../../services/messages/messages.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  contactForm!: FormGroup;
  errorMessage!: string;
  formText: any;

  constructor(private messageService: MessagesService) {
  }

  ngOnInit(): void {
    this.formText = FOOTER_COMPONENT;
    this.formText.labels = INPUT_LABELS_TXT;
    this.initContactForm();
  }

  initContactForm(): void {
    this.contactForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(INPUT_REGEX_TEXTS.email)]),
      message: new FormControl('', [Validators.required, Validators.maxLength(250), Validators.minLength(5)]),
    });
  }

  onFormSubmit(errorElement: HTMLLIElement): void {
    if (!this.contactForm.valid) {
      this.errorMessage = FOOTER_ERROR_MSG;
      errorElement.classList.remove('hide');
      return;
    }

    if (!errorElement.classList.contains('hide')) {
      errorElement.classList.add('hide');
    }

    this.messageService.sendMessage({
      message: this.contactForm.controls.message.value,
      email: this.contactForm.controls.email.value
    });
  }
}
