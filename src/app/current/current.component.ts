import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { config } from 'src/config/config';
import { SubmissionService } from '../services/submission.service';

@Component({
  selector: 'app-current',
  templateUrl: './current.component.html',
  styleUrls: ['./current.component.css']
})
export class CurrentComponent implements OnInit {
  issue: any;
  imageToShow: any;
  constructor(private submissionService : SubmissionService,
    private config: config,
    private sanitizer : DomSanitizer
    ) { }

  ngOnInit(): void {
    this.submissionService.current().subscribe((data) => {
      if(data.body.data === null){
        this.issue = null;
      }
      else{
        this.issue = data.body.data;
        this.loadimage();
      }

    });
  }
  loadimage(){
    this.submissionService.getImage(this.issue.id).subscribe((data)=>{
      let objectURL = URL.createObjectURL(data);
      this.imageToShow = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    }, (err) => {
      console.log(err)
    })
  }
  download(submission){
    window.open(this.config.apiPath + 'submission/file/' + submission.id , '_blank');
  }

}
