import { MapsComponent } from './../maps/maps.component';
import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {IZoneTag} from './zonetag';


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable()
export class DashboardService {

    constructor(private _http:HttpClient) {}

     getZoneTagTs(lastTs:number) { 
         
         console.log("service : "+lastTs);    
        return this._http
        .get<IZoneTag[]>('http://localhost:4200/zonetagts?ts='+lastTs)
        .map(result =>result);
     }

     
}