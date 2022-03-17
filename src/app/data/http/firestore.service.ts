import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, Query} from '@angular/fire/firestore';
import firebase from 'firebase';
import OrderByDirection = firebase.firestore.OrderByDirection;
import {Observable} from 'rxjs';
import {AngularFirestoreDocument} from "@angular/fire/firestore/document/document";
import {AngularFireAuth} from "@angular/fire/auth";
import WhereFilterOp = firebase.firestore.WhereFilterOp;
import {take} from "rxjs/operators";
import {CollectionReference, QueryFn} from "@angular/fire/firestore/interfaces";

export interface IFirestoreWhereClauseRefs {
  key: string;
  operator: WhereFilterOp;
  value: string | number | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private dbRef: AngularFirestore,
              private afAuth: AngularFireAuth
  ) {
  }

  getAuth() {
    return this.afAuth;
  }

  getDbRef() {
    return this.dbRef.firestore;
  }

  // get
  /**
   * Gets all snapshots of a collection
   */
  getCollection(collection: string): Observable<any> {
    return this.dbRef.collection(collection).snapshotChanges();
  }

  /**
   * Gets document reference by path
   */
  getDocumentRef(docPath: string): AngularFirestoreDocument<any> {
    return this.dbRef.doc(docPath);
  }

  /**
   * Gets document reference of a new created document in a collection
   */
  getDocumentRefByAutogeneratedId(collection: string, docId: string | null): any {
    // @ts-ignore
    return this.dbRef.collection(collection).doc(docId).ref;
  }

  /**
   * Gets all snapshots of a collection that validates where clauses
   * keep the connection to firestore opened through a subscription
   */
  getCollectionByMultipleWhereClausesOpenConnection(collection: string, listOfClauses: IFirestoreWhereClauseRefs[]): Observable<any> {
    return this.getCollectionByMultipleWhereClauses(collection, listOfClauses).stateChanges(['added']);
  }

  /**
   * Gets all snapshots of a collection that validates multiple where clauses
   */
  private getCollectionByMultipleWhereClauses(collection: string, listOfClauses: IFirestoreWhereClauseRefs[]): AngularFirestoreCollection<any> {
    function getCollectionQueryRef(ref: Query) {
      listOfClauses.forEach(clause => {
        ref = ref.where(clause.key, clause.operator, clause.value)
      });
      return ref;
    }

    return this.dbRef.collection(collection, ref => getCollectionQueryRef(ref));
  }

  /**
   * Gets all snapshots of a collection that validates where clauses and closes the connection to firestore
   */
  getCollectionByMultipleWhereClausesClosedConnection(collection: string, listOfClauses: IFirestoreWhereClauseRefs[]): Observable<any> {
    return this.getCollectionByMultipleWhereClauses(collection, listOfClauses).valueChanges();
  }

  /**
   * Gets all documents of a collection
   */
  getAllDocumentsOfCollection(collection: string): Observable<any> {
    return this.dbRef.collection(collection).get();
  }

  /**
   * Gets the last modified data from a collection
   */
  getChangedDocuments(collection: string): Observable<any> {
    return this.dbRef.collection(collection).stateChanges();
  }

  /**
   * Gets value of a collection ordered by a given value
   */
  getCollectionOrdered(collection: string, orderField: string, orderDirection: OrderByDirection = 'asc'): Observable<any> {
    return this.dbRef.collection(collection, ref => ref.orderBy('order', orderDirection).limit(10)).valueChanges();
  }

  /**
   * Gets value of a document by document id from a collection
   */
  getDocById(collection: string, id: string): Observable<any> {
    return this.dbRef.collection(collection).doc(id).valueChanges();
  }

  /**
   * Gets value of a document by document id from a collection
   */
  getNewFirestoreId(): string {
    return this.dbRef.createId();
  }

  /**
   * Gets value of a collection where a match is found
   */
  getCollectionByWhereClause(collection: string, key: string, operator: any, value: string): Observable<any> {
    return this.dbRef.collection(collection, ref => ref.where(key, operator, value)).valueChanges();
  }

  /**
   * Gets value of a collection where a match is found
   */
  getCollectionByWhereClauseSnapshotChanges(collection: string, key: string, operator: any, value: string): Observable<any> {
    return this.dbRef.collection(collection, ref => ref.where(key, operator, value)).snapshotChanges();
  }

  /**
   * Gets value of a collection where a match is found
   */
  getCollectionWhereStringStartsWith(collection: string, key: string, operator: any, operator2: any, value: string): Observable<any> {
    return this.dbRef.collection(collection, ref => ref.where(key, operator, value).where(key, operator2, value + 'uf8ff')).valueChanges();
  }

  // save
  /**
   * Saves a new document into a collection
   */
  saveDocumentByAutoId(collection: string, data: any): Promise<any> {
    return this.dbRef.collection(collection).add(JSON.parse(JSON.stringify(data)));
  }

  /**
   * Saves a new document into a collection with an id generated from application
   */
  saveDocumentWithGeneratedFirestoreId(collection: string, documentId: string, payload: any): any {
    return this.dbRef.collection(collection).doc(documentId).set(payload);
  }

  getDocBySingleWhereClause(collection: string, key: string, value: string, key1: string, value1: string): any {
    return this.dbRef.collection(collection,
      (ref) => ref.where(key, '==', value)
        .where(key1, '==', value1)).get();
  }

  /**
   * Saves a new document into a collection
   */
  saveDocumentWithCustomId(collection: string, data: any = null, documentId: string | undefined): Promise<any> {
    return this.dbRef.collection(collection).doc(documentId).set(JSON.parse(JSON.stringify(data)));
  }

  // update
  /**
   * Updates an existing document with the new field or updates an entire document
   */
  updateDocumentById(collection: string, id: string, data: any): Promise<void> {
    return this.dbRef.collection(collection).doc(id).update(JSON.parse(JSON.stringify(data)));
  }

  // delete
  /**
   * Deletes an existing document by document id
   */
  deleteDocById(collection: string, id: string): Promise<void> {
    return this.dbRef.collection(collection).doc(id).delete();
  }

  deleteWhereClause(collection: string, key1: string, value1: string, key2: string, value2: string): Observable<any> {
    return this.dbRef
      .collection(collection, ref => ref
        .where(key1, '==', value1)
        .where(key2, '==', value2))
      .get();
  }

  deleteWhereClauseWithOneKeyValuePair(collection: string, key1: string, value1: string): Observable<any> {
    return this.dbRef
      .collection(collection, ref => ref
        .where(key1, '==', value1))
      .get();
  }

//  TRANSACTIONS
  /**
   * Get a new instance of a batch transaction
   */
  getNewBatchTransaction() {
    return this.dbRef.firestore.batch();
  }
}
