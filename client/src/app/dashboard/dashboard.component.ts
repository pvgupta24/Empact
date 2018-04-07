import { Component, OnInit } from '@angular/core';
import { AuthenticationService, UserDetails } from '../authentication.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BlobService, UploadConfig, UploadParams } from 'angular-azure-blob-service'

@Component({
	/*selector: 'app-dashboard',*/
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent {
	user: UserDetails
	rooms: Object[] = []
	newroom = {
		code: "",
		name: "",
		owner: ""
	}
/** The upload config */
config: UploadConfig
/** The selected file */
currentFile: File
/** The current percent to be displayed */
percent: number
Config: UploadParams = {
	sas: '?sv=2017-07-29&ss=b&srt=sco&sp=rwdlac&se=2020-04-08T02:34:34Z&st=2018-04-07T18:34:34Z&spr=https,http&sig=jXU8X%2B2Uwjcm4fk2ms%2B9GWaTC4K7mvKjvuOvpfLRIQY%3D',
	storageAccount: 'empactstorage',
	containerName: 'empact-container'
};
upload() {
	if (this.currentFile !== null) {
		const baseUrl = this.blob.generateBlobUrl(this.Config, this.currentFile.name);
		this.config = {
			baseUrl: baseUrl,
			sasToken: this.Config.sas,
			blockSize: 1024 * 64, // OPTIONAL, default value is 1024 * 32
			file: this.currentFile,
			complete: () => {
				console.log('Transfer completed !');
			},
			error: () => {
				console.log('Error !');
			},
			progress: (percent) => {
				this.percent = percent;
			}
		};
		this.blob.upload(this.config);
	}
}
// results:any = [];
updateFiles(files) {
	this.currentFile = files[0];
	console.log(this.currentFile);
}
	constructor(private auth: AuthenticationService, private router: Router, private http: HttpClient, private blob: BlobService) {
		this.currentFile = null;
		this.config = null;
		this.percent = 0;
	 }
	httpOptions = {
		headers: new HttpHeaders({ 'Content-Type': 'application/json' })
	};
	ngOnInit() {
		this.auth.profile().subscribe(user => {
			this.user = user;
			this.rooms = user.rooms;
			for (let room in this.rooms) {
				console.log("Requesting " + JSON.stringify(this.rooms[room]));
			}
			this.newroom.owner = user.name;

		}, (err) => {
			console.error(err);
		});

	}

	newRoom() {
		this.rooms.push(this.newroom);
		this.http.post('/api/newRoom',
			JSON.stringify({
				"user": this.user._id, "room": this.newroom
			}), this.httpOptions)
			.subscribe(res => console.log(res));
		// this.router.navigateByUrl('/room/'+this.newroom.code);      
		// this.refresh();
	}

	
	//  refresh(): void{
	//     window.location.reload();
	//   }
}
