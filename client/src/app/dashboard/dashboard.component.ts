import { Component, OnInit } from '@angular/core';
import { AuthenticationService, UserDetails } from '../authentication.service';
import { Router } from '@angular/router';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Component({
  /*selector: 'app-dashboard',*/
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent {
  user: UserDetails
  courses : Object[] = []
  newcourse = {
    code:"",
    name:"",
    owner:""
  }

  constructor(private auth: AuthenticationService, private router: Router, private http: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  ngOnInit() {    
    this.auth.profile().subscribe(user => {
    this.user = user;
      
      // for (var course in user.courses){
      //   console.log("Requesting "+ user.courses[course]);
      //   this.http.get('/api/courseDetails/'+ user.courses[course] ,this.httpOptions)
      //   .subscribe(res => {this.courses.push(res);});
      // }
      // this.newcourse.owner = user._id;

    }, (err) => {
      console.error(err);
    });
    
  }
  newRoom(){}
  // newCourse() {    
  //   this.http.post('/api/newCourse',
  //   JSON.stringify({"name":this.newcourse.name,
  //    "code":this.newcourse.code,
  //    "owner":this.newcourse.owner}), this.httpOptions)
  //   .subscribe(res => console.log(res));
  //   // this.router.navigateByUrl('/newCourse');
  // }

}