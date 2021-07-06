import { Injectable } from '@angular/core';
import {FirestoreService} from '../../data/http/firestore.service';
import IMessageDTO from "../../data/model-dto/imessage-dto";

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private MESSAGE_COLLECTION = '/messages';
  constructor(private firestoreService: FirestoreService) { }

  sendMessage(messageDTO: IMessageDTO): Promise<void> {
    return this.firestoreService.saveDocumentByAutoId(this.MESSAGE_COLLECTION, messageDTO)
      .then(() => {
        window.alert('Message sent');
      })
      .catch((error: any) => {
        window.alert(error.message);
      });
  }
}
