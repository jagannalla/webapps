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
  public lineChartOptions: any = { 
    responsive: true,
    scales: { 
      xAxes: [{
          gridLines: { display: false }
      }],     
      yAxes: [{
          ticks: {
              min:-1.5,max: 1.5,
              userCallback: function (label, index, labels) {
                  // return label.toFixed(0);
                  if (Math.floor(label) === label) {
                    return label;
                }
              },
          }
      }]
  } 
  };
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

  connection;messages = [];zonedata:any;
  constructor(private _dsServie: DashboardService) {    
    this.displayChart();
    // var date=new Date((1529938919-4*60*60)*1000)
    // console.log(date.getMonth() + '/' + date.getDate() + '/' +  date.getFullYear() + ' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()); //value *1000    
  }

  displayChart(){
    this.connection = this._dsServie.getLiveData().subscribe(
      result => {  
      this.zonedata=JSON.parse(result["data"]);  
      console.log(this.zonedata["zone_name"],this.zonedata["station_no"])
      // if (this.zonedata["zone_name"]=="Z2B" && this.zonedata["station_no"] =='210B') {
        if (this.zonedata["zone_name"]=="Z04" && this.zonedata["station_no"] =='410') {
          var tsDate=new Date(this.zonedata["ts"]*1000)
          this.lineX.push(tsDate.getMonth() + '/' + tsDate.getDate() + '/' +  tsDate.getFullYear() + ' '+tsDate.getHours()+':'+tsDate.getMinutes()+':'+tsDate.getSeconds()); 
          this.lineY.push(this.zonedata["value"]);
          console.log(this.zonedata["zone_name"],this.zonedata["station_no"],this.zonedata["ts"],this.zonedata["value"]) 
          this.lineChart();
      }           
    })
  } 

  lineChart() {    
    // this.islineChart = false;
    // console.log(this.lineX);console.log(this.lineY);
     if (this.lineX.length >10) {
           this.lineX.splice(0,1);this.lineY.splice(0,1);
        } 
    this.lineChartData = [{ data: this.lineY, label: 'Series A', fill: false }];
    this.lineChartLabels = this.lineX;
    this.islineChart = true;
  }

}
