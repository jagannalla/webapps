import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { Observable } from 'rxjs/Rx';
import { IZoneTag } from './zonetag';

import * as Stomp from 'stompjs'
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'dashboard-cmp',
  moduleId: module.id,
  templateUrl: 'dashboard.component.html'
})

export class DashboardComponent {
  public lineX: Array<any> = []; public lineX1: Array<any> = [];//=["2018-06-08 09:43:55", "2018-06-08 09:43:58", "2018-06-08 09:43:58", "2018-06-08 09:43:48", "2018-06-08 09:44:00"];
  public lineY: Array<any> = []; public lineY1: Array<any> = [];//=[0, 0, -1, -1, 0];   
  public lastTs:number=-1;
  public lastTsObj:IZoneTag;
  zoneTag1: IZoneTag[]; 
  zoneTag: IZoneTag[]; 
  // lineChart
  public lineChartData: Array<any> = [];// = [ {data: this.lineY, label: 'Series A',fill: false} ];
  public lineChartLabels: Array<any>;//= this.lineX;
  public lineChartOptions: any = { responsive: true };
  public lineChartColors: Array<any> = [{ borderColor: "#3cba9f" }];
  public lineChartLegend: boolean = false;
  public lineChartType: string = 'line';
  public islineChart: any; //loads the linechart once data is ready
  public totalSlice: any = 0;


  private serverUrl = 'ws://localhost:4200/socket'
  private title = 'WebSockets chat';
  private stompClient;


  greetings: string[] = [];
  showConversation: boolean = false;
  ws: any;
  name: string = 'xxx';
  disabled: boolean;

  constructor(private _dsServie: DashboardService) {
    // this.initializeWebSocketConnection();
    this.getZone();
    Observable.interval(5000).subscribe(x => { 
      this.updateLineChart();
    });

  }
  
  getZone() {
    this._dsServie.getZoneTagTs(this.lastTs)
      .subscribe(
        result => {
          // console.log('getZone success');
          // this.lineX = ["2018-06-08 09:43:55", "2018-06-08 10:05:58", "2018-06-08 11:43:58", "2018-06-08 12:43:48", "2018-06-08 01:44:00"];
          // this.lineY = [-1, -1, 0, 1, 0];
          // this.zoneTag1=result;
          this.zoneTag=result.sort(function(a,b){
            if ( a.ts < b.ts ){
              return -1;
            }else if( a.ts > b.ts ){
                return 1;
            }else{
              return 0;	
            }
          });
          result.forEach(entry =>{                        
              this.lineX.push(entry.ts_gmt); 
              this.lineY.push(entry.value);         
          });
          // to find max timestamp from result
          let maxValue = Math.max.apply(Math,result.map(function(o){return o.ts;}));
          // console.log("last ts: "+this.lastTs); 
          // console.log("max ts: "+maxValue+maxValue.length);      
          // this.lastTsObj = result.filter(function(o) { return o.ts === maxValue; })[0];

          if((this.lastTs==-1 && maxValue!='-Infinity') ||(this.lastTs< maxValue) ){
            console.log("Last ts: "+this.lastTs); 
            console.log("Current ts: "+maxValue); 
            this.lastTs=maxValue;            
            this.lineChart(); // assign zone data to the line chart
          }
          else {
            if(this.lastTs==-1 ){
              this.lastTs=-1; 
            }     
          }
        },
        err => {
          console.log("getZone failed from component");
        },
        () => {
          // console.log('getZone finished');
        });
  }

  updateLineChart() {
    this.lineX.splice(0,2);
    this.lineY.splice(0,2);
    // this.lineX.push("2018-06-08 01:44:00");this.lineY.push(1);
    // this.lineChart();
    this.getZone();
  }

  lineChart() {    
    // this.islineChart = false;
    // console.log(this.lineX);console.log(this.lineY);
    this.lineChartData = [{ data: this.lineY, label: 'Series A', fill: false }];
    this.lineChartLabels = this.lineX;
    this.islineChart = true;
  }

  initializeWebSocketConnection() {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function (frame) {
      console.log(frame);
      that.stompClient.subscribe("/topic", (message) => {
        console.log(message);

      });
    },
      err => {
        console.log(err);
      }
    );
  }
  connect() {
    //connect to stomp where stomp endpoint is exposed
    //let ws = new SockJS(http://localhost:8080/greeting);
    let socket = new WebSocket("ws://localhost:4200/socket");
    this.ws = Stomp.over(socket);
    let that = this;
    this.ws.connect({}, function (frame) {
      that.ws.subscribe("/errors", function (message) {
        alert("Error " + message.body);
        console.log("Error Connect Subscribe:" + message)
      });
      that.ws.subscribe("/topic/reply", function (message) {
        console.log("Connect Subscribe:" + message)
        that.showGreeting(message.body);
      });
      that.disabled = true;
    }, function (error) {
      alert("STOMP error " + error);
    });
  }

  disconnect() {
    if (this.ws != null) {
      this.ws.ws.close();
    }
    this.setConnected(false);
    console.log("Disconnected");
  }

  sendName() {
    var data = JSON.stringify({
      'name': this.name
    })
    this.ws.send("/app/message", {}, data);
  }

  showGreeting(message) {
    console.log("Show Greeting")
    this.showConversation = true;
    this.greetings.push(message)
  }

  setConnected(connected) {
    this.disabled = connected;
    this.showConversation = connected;
    this.greetings = [];
  }
}
