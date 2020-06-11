import { Component, OnInit, Optional } from '@angular/core';
import * as Highcharts from 'highcharts'
import {HttpService} from '../../http.service' 
import {FormControl, Validators} from '@angular/forms';
import * as _ from 'lodash'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


  limit: number = 12;
  xData: string[] = []
  yData: number[] = []
  selectedY: string;
  yAxisNames : any[] = ['close', 'mid']

  apiKey: string = 'Bs_1yjTHb-zZgn8Zi7G-'


  title: string = 'Point Marker Chart'
  apiUrl : string = ''
  apiArray: string[] = []
  selectFormControl = new FormControl('', Validators.required);
  
  Highcharts: typeof Highcharts = Highcharts;

  
  chartOptions : Highcharts.Options = {
    chart: {
      type: "spline",
      events : {
        addSeries : function () {
          console.log('new series added')
        }
      }
    },
    title: {
      text: this.title
    },
    legend : {
      enabled: true
    },
     xAxis:{
        categories:[]
     },
     yAxis: {          
        title:{
           text:"Close"
        } 
     },
     series: [{
      type: 'spline',
       data : []
      
     }]
    
  };

  clearChartOptions = {
    
  }

  

  
  updateChartOptions : Highcharts.Options;
  updateChartFromButton: boolean = false;


  constructor(private _http: HttpService) { }
 


  ngOnInit(): void {
   
  }

  addApiUrl(): void {
    if(this.apiUrl === '' || this.apiUrl == null) return alert('Please enter an API url')
    if(this.apiArray.includes(this.apiUrl)) return alert('This Url is already present')
   
    this.apiArray.push(this.apiUrl);
    this.apiUrl = ' '
    console.log(this.apiArray)
  }

  buildChart(): void {
   

    if(this.apiArray == null) return alert(`No API url's to build`)
   
    Promise.all(this.apiArray.map (url =>
     this._http.getData(url).subscribe( data =>{
       console.log(data)
       const arrayOfData = data.dataset.data
       console.log(arrayOfData[0][1])
       for(let i=0;i< this.limit;i++) { this.xData.push(arrayOfData[i][0])}
       if(this.selectedY == 'mid'){
        for(let i=0;i< this.limit;i++) { this.yData.push(((arrayOfData[i][2]+arrayOfData[i][3])/2))}
       }else{
        for(let i=0;i< this.limit;i++) { this.yData.push(arrayOfData[i][4])}
       }
      
       this.updateChart(data.dataset.dataset_code)
     }))).catch (err => console.log(err))
    
    
  
  }

  updateChart(nameofSeries: string): void {
    this.chartOptions = {
     xAxis:{
        categories: this.xData
     },
     yAxis: {          
        title:{
           text:this.selectedY
        } 
     },
     series: [{
       name: nameofSeries,
       data: this.yData,
       type: 'spline',
       marker : {
         enabled: true
       }
     }]
     
    
   }
  
  }

  clearChart() :void {
    this.chartOptions = {
      series : [{
        name: '',
        data: [],
        type: 'spline'
      }]
    };
  }

}
