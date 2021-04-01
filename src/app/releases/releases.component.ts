import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SubmissionService } from '../services/submission.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-releases',
  templateUrl: './releases.component.html',
  styleUrls: ['./releases.component.css']
})
export class ReleasesComponent implements OnInit {
  releaseForm : FormGroup;
  file: any;
  filename: any;
  submissions: any;
  uploaded: boolean;
  users: any;
  selecteduser:any;
  usersubmissions:any;
  selectedarticle:any;
  submission:any;
  constructor(private userService : UserService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private submissionService : SubmissionService) {
      this.users = [];
      this.filename = 'Please upload a cover image';
      this.selecteduser = '';
      this.usersubmissions = [];
      this.selectedarticle = '';
      this.submissions = [];
      this.submission = [];
      this.releaseForm = this.fb.group({
        title: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
      });
  }

  ngOnInit(): void {
    this.getUsers();
  }
  uploadDocument(file : File) {
    this.file = file;
    this.filename = file.name;
   }
   uploadreleaseimage() {
     this.submissionService.uploadreleaseimage(this.file).subscribe(data => {
       // do something, if upload success
       this.uploaded = true;
       }, error => {
         console.log(error);
       });
   }
   getUsers(){
     this.userService.getusers().subscribe((data) => {
      this.users = data.body.results;
     }, (err) => {
      this.toastr.error('Could not get users!', 'Server Error!');
     })
   }
   getSubmissions(value){
    this.submissionService.getlist(value).subscribe((data)=> {
      this.usersubmissions = data.body.data.data;
    }, (err) => {
      this.toastr.error('Could not get submissions!', 'Server Error!');
     })
   }
   setCurrentSubmission(value){
    console.log(value);
   }
   addtolist(value){
     if(value === null || value === '' || value === undefined){
      this.toastr.error('Please select an article for a user!', 'Server Error!');
     }
     else{
      let search = this.usersubmissions.find(obj => obj.id === value);
      this.submissions.push(value);
      this.submission.push(search);
     }
   }
   delete(submission){
     let pos1 = this.submissions.indexOf(submission);
     let pos2 = this.submission.indexOf(submission);
     this.submissions.splice(pos1, 1);
     this.submission.splice(pos2, 1);
   }
   createrelease(){
    if(this.releaseForm.controls['title'].invalid){
      this.toastr.error('Title cannot be empty!', 'Validation Error!');
    } else if(this.releaseForm.controls['description'].invalid){
      this.toastr.error('Description cannot be empty!', 'Validation Error!');
    } else if(this.file === null || this.file === undefined){
      this.toastr.error('File cannot be empty!', 'Validation Error!');
    } else {
      // CREATE RELEASE AND UPLOAD IMAGE
      this.submissionService.createRelease(
        this.releaseForm.controls['title'].value,
        this.releaseForm.controls['description'].value,
        this.file,
        this.submissions).subscribe((data)=>{
          this.toastr.success('Successfully created release!', 'Success');
        }, (err) => {
          this.toastr.error('Could not create release!', 'Server Error!');
        })
    }
   }
}
