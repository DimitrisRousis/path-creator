import { Component, OnInit } from '@angular/core';
import { MouseEvent } from '@agm/core';
import { Marker, Polyline, PolyMouseEvent } from '@agm/core/services/google-maps-types';
import { AngularFireDatabase } from 'angularfire2/database';
import { element } from 'protractor';
import { importExpr } from '@angular/compiler/src/output/output_ast';
import { Form } from '@angular/forms';
import { NumberSymbol } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  pageTitle = 'Google Maps Paths';

  zoom: number = 6;
  lat: number = 38.775670;
  lng: number = 22.898826;
  addPolyline: boolean = false;
  showMissionMarkers: boolean = false;
  markers: marker[] = [];
  missionMarkers: missionMarker[] = []; 
  polylines: Array<marker[]> = new Array;
  dbPaths: dbEntry[]= [];

  constructor(private firebase : AngularFireDatabase){}
  
  ngOnInit(): void {
    let paths = this.firebase.list('paths');
    paths.snapshotChanges().subscribe(item=>{
      this.dbPaths = [];
      item.forEach(element=>{
        let y: JSON = element.payload.toJSON() as JSON;
        let a = {
          difficulty: y["difficulty"],
          name: y["name"],
          points: y["points"],
          rating: y["rating"],
          type: y["type"]
        }
        this.dbPaths.push(a);
        if(y.hasOwnProperty("points")){
          for (let key in y["points"]){
            this.markers.push(y["points"][key]);
          }
        }
        this.polylines.push(this.markers);
        this.markers = [];
      });
      console.log(this.dbPaths);
    });
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  mapClicked($event: MouseEvent) {
    console.log($event);
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });
  } 

  pathClicked($event: PolyMouseEvent){
    console.log($event.edge);
    console.log($event.latLng.lat() + " - " + $event.latLng.lng());
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }

  onLocationReceived(position:Position): void{
    this.lat = position.coords.latitude;
    this.lng = position.coords.longitude;
    console.log(position);
  }

  onPolylineEdited(event: Object){
    let message = event;
    let pathName: string = message["pathName"];
    let action: string = message["action"];
    let type: string = message["type"];
    let difficulty: string = message["difficulty"];
    if(action == 'add'){
      if(this.markers.length > 0){
        this.addPolyline = true;
        var pathToAdd = {
          name: pathName,
          points: this.markers,
          type: type,
          difficulty: difficulty,
          rating: 2,
        };
        var databasRef = this.firebase.database.ref('/paths');
        databasRef.push(pathToAdd, 
              ()=>{
                console.log('firebase done');
              });
        this.polylines.push(this.markers);
        this.markers = [];
      }
    }else if (action == 'cancel'){
      this.markers = [];
    }
  }

  onShowPathRequest(missions: Object){
    this.missionMarkers = [];
    this.showMissionMarkers = !this.showMissionMarkers;
    if(this.showMissionMarkers){
      let a : missionMarker[] =  missions as missionMarker[];
      a.forEach(mission=>{
        this.missionMarkers.push(mission);
      });
      console.log(this.missionMarkers);
    }
  }

  calculatePoints(numOfPoints: number, difficulty: string ) : number{
    
    return
  }

  markerIconUrl(){
    return require('../assets/mission_marker.png');
  }

}

interface marker {
	lat: number;
	lng: number;
	label?: string;
	draggable: boolean;
}

interface missionMarker {
  lat: number;
  lng: number;
  label?: string;
  description: string;
  points: number;
}

interface dbEntry {
  difficulty: string,
  name: string,
  points: marker[],
  rating: number,
  type: string
}