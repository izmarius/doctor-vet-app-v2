import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, take} from "rxjs/operators";
import {LoaderService} from "../loader/loader.service";

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private LOCATION_URL = 'https://roloca.coldfuse.io/orase/';

  constructor(private httpClient: HttpClient,
              private loaderService: LoaderService) {
  }

  getCitiesByCountyCode(countyCode: string) {
    this.loaderService.show();
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
          this.loaderService.hide();
          return locationList;
        })
      );
  }
}
