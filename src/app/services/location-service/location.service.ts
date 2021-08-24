import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private LOCATION_URL = 'https://roloca.coldfuse.io/orase/';

  constructor(private httpClient: HttpClient) {
  }

  getCitiesByCountyCode(countyCode: string) {
    return this.httpClient.get(this.LOCATION_URL + countyCode)
      .pipe(
        take(1),
        map((places: any) => {
          let location = '';
          let locationList: any[] = [];
          places.forEach((place: any) => {
            if (place.comuna) {
              locationList.push(place.nume + `, comuna: ${place.comuna}`);
            } else {
              locationList.push(place.nume);
            }
          });
          return locationList;
        })
      );
  }
}
