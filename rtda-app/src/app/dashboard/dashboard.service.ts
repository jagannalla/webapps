import { MapsComponent } from './../maps/maps.component';
import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {IZoneTag} from './zonetag';
import * as io from 'socket.io-client';
import { jsonize } from '@ngui/map/dist/services/util';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable()
export class DashboardService {
    private url = 'http://localhost:8091';
    private socket;

    constructor(private _http:HttpClient) {}
    
    getLiveData() {
        let observable = new Observable(observer => {
          this.socket = io(this.url);
          this.socket.on('message', (data) => {    
            observer.next(data);
          });
          return () => {
            this.socket.disconnect();
          }
        })
        return observable;
      }
      
      sendMessage(message) {
        this.socket.emit('add-message', message);
        console.log("MESSAGE SENT");
      }
}