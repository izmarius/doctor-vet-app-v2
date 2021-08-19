import { Injectable } from '@angular/core';
import {FirestoreService} from '../../data/http/firestore.service';
import IMessageDTO from "../../data/model-dto/imessage-dto";
import {UiErrorInterceptorService} from "../../ui/shared/alert-message/services/ui-error-interceptor.service";
import {FOOTER_COMPONENT, USER_CARD_TXT} from "../../shared-data/Constants";

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private MESSAGE_COLLECTION = '/messages';
  constructor(private firestoreService: FirestoreService,
              private uiAlertInterceptor: UiErrorInterceptorService) { }

  sendMessage(messageDTO: IMessageDTO): Promise<void> {
    return this.firestoreService.saveDocumentByAutoId(this.MESSAGE_COLLECTION, messageDTO)
      .then(() => {
        this.uiAlertInterceptor.setUiError({message: FOOTER_COMPONENT.messageSentSuccessfully, class: 'snackbar-success'});
      })
      .catch((error: any) => {
        this.uiAlertInterceptor.setUiError({message: error.message, class: 'snackbar-success'});
        console.log('Error', error);
      });
  }
}
