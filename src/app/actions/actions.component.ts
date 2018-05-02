import { Component, Output, EventEmitter } from "@angular/core";

@Component({
    selector: 'path-actions',
    templateUrl: './actions.component.html',
    styleUrls: ['./actions.component.css']
})
export class ActionsComponent{
    @Output() locationChanged: EventEmitter<Position> = new EventEmitter<Position>();
    @Output() polylineActions: EventEmitter<Object> = new EventEmitter<Object>();
    @Output() showDatabasePaths: EventEmitter<Object> = new EventEmitter<Object>();

    show: boolean =  false;

    difficultyLevel: string[] = ["very easy", "easy", "moderate", "hard", "very hard"]; 
    pathType: string[] = ["climbing", "sidewalk", "cycle path", "path", "underpass"];
    pathName: string ="";
    type: string = "";
    difficulty: string = "";
    missions: Object = [
        {
            "lat":39.062148,
            "lng":22.781390,
            "description":"Υπάρχει ένα αχαρτογράφητο μονοπάτι για ορεινή πεζοπορία",
            "points":9
        },
        {
            "lat":39.675568,
            "lng":20.853366,
            "description":"Μόλις φτιάχτηκε νέος ποδηλατόδρομος και χρειάζεται χαρτογράφηση",
            "points":3
        },
        {
            "lat":38.175645,
            "lng":23.714078,
            "description":"Υπάρχει ένας δρόμος που θα βοηθούσε πολύ στο έργο της πυροσβεστικής",
            "points":15
        },
        {
            "lat":40.635039,
            "lng":22.945849,
            "description":"Ανοίγει ο σταθμός του μετρό. Χαρτογράφησε την υπόγεια διάβαση",
            "points":5
        }
    ];

    findMe() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            this.locationChanged.emit(position);
          });
        } else {
          alert("Geolocation is not supported by this browser.");
        }
      }

    editPolyline() {
        let message = {"pathName": this.pathName,"action":"add", "type":this.type, "difficulty":this.difficulty};
        console.log(this.difficulty + ", " + this.type + ", " + this.pathName);
        this.polylineActions.emit(message);
    }

    cancel(){
        let message = {"action":"cancel", "type":"", "difficulty": ""};
        this.polylineActions.emit(message)
    }

    showMissions(){
        this.show = !this.show;
        this.showDatabasePaths.emit(this.missions);
    }
}