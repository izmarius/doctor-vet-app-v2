export class AnimalUtilInfo {
  name: string;
  uid: string;

  getName(): string {
    return this.name;
  }

  setName(name: string): AnimalUtilInfo {
    this.name = name;
    return this;
  }

  getUid(): string {
    return this.uid;
  }

  setUid(uid: string): AnimalUtilInfo {
    this.uid = uid;
    return this;
  }
}
