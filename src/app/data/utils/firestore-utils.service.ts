export function convertSnapshots<T>(snaps: any): any {
  return snaps.map((snap: any) => {
    return {
      id: snap.payload.doc.id,
      ...snap.payload.doc.data()
    } as T;
  });
}
