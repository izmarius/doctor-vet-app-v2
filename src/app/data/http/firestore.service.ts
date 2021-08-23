import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import firebase from 'firebase';
import OrderByDirection = firebase.firestore.OrderByDirection;
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) {
  }

  // get
  /**
   * Gets all snapshots of a collection
   */
  getCollection(collection: string): Observable<any> {
    return this.firestore.collection(collection).snapshotChanges();
  }

  /**
   * Gets all snapshots of a collection that validates where clauses
   */
  getCollectionByMultipleWhereClauses(collection: string, timestamp: any): Observable<any> {
    return this.firestore.collection(collection,
      ref => ref.where('timestamp', '>=', timestamp.today))
      .snapshotChanges()
    //todo add pagination
    // .where('timestamp', '>=', dates.tomorrow)
    // .where('timestamp', '<', dates.nextDayAfterTomorrow);

  }

  /**
   * Gets all snapshots of a collection that validates where clauses
   */
  getCollectionByTimestampAndUserId(collection: string, timestamp: any, field: string, value: string): Observable<any> {
    return this.firestore.collection(collection,
      ref => ref.where('timestamp', '>=', timestamp.today).where(field, '==', value))
      .get()
    //todo add pagination
    // .where('timestamp', '>=', dates.tomorrow)
    // .where('timestamp', '<', dates.nextDayAfterTomorrow);

  }

  /**
   * Gets all documents of a collection
   */
  getAllDocumentsOfCollection(collection: string): Observable<any> {
    return this.firestore.collection(collection).get();
  }

  /**
   * Gets all values from collection
   */
  getCollectionValueChanges(collection: string): Observable<any> {
    return this.firestore.collection(collection).valueChanges();
  }

  /**
   * Gets the last modified data from a collection
   */
  getChangedDocuments(collection: string): Observable<any> {
    return this.firestore.collection(collection).stateChanges();
  }

  /**
   * Gets value of a collection ordered by a given value
   */
  getCollectionOrdered(collection: string, orderField: string, orderDirection: OrderByDirection = 'asc'): Observable<any> {
    return this.firestore.collection(collection, ref => ref.orderBy('order', orderDirection).limit(10)).valueChanges();
  }

  /**
   * Gets value of a document by document id from a collection
   */
  getDocById(collection: string, id: string): Observable<any> {
    return this.firestore.collection(collection).doc(id).valueChanges();
  }

  /**
   * Gets value of a document by document id from a collection
   */
  getNewFirestoreId(): string {
    return this.firestore.createId();
  }

  /**
   * Gets value of a collection where a match is found
   */
  getCollectionByWhereClause(collection: string, key: string, operator: any, value: string): Observable<any> {
    return this.firestore.collection(collection, ref => ref.where(key, operator, value)).valueChanges();
  }

  // save
  /**
   * Saves a new document into a collection
   */
  saveDocumentByAutoId(collection: string, data: any): Promise<any> {
    return this.firestore.collection(collection).add(JSON.parse(JSON.stringify(data)));
  }

  /**
   * Saves a new empty document into a collection
   */
  saveDocumentWithEmptyDoc(collection: string, documentId: string): any {
    return this.firestore.collection(collection).doc(documentId);
  }

  /**
   * Saves a new document into a collection with an id generated from application
   */
  saveDocumentWithGeneratedFirestoreId(collection: string, documentId: string, payload: any): any {
    return this.firestore.collection(collection).doc(documentId).set(payload);
  }

  /**
   * Saves a new document into a collection
   */
  saveDocumentWithCustomId(collection: string, data: any = null, documentId: string | undefined): Promise<any> {
    return this.firestore.collection(collection).doc(documentId).set(JSON.parse(JSON.stringify(data)));
  }

  // update
  /**
   * Updates an existing document with the new field or updates an entire document
   */
  updateDocumentById(collection: string, id: string, data: any): Promise<void> {
    return this.firestore.collection(collection).doc(id).update(JSON.parse(JSON.stringify(data)));
  }

  // delete
  /**
   * Deletes an existing document by document id
   */
  deleteDocById(collection: string, id: string): Promise<void> {
    return this.firestore.collection(collection).doc(id).delete();
  }
}
