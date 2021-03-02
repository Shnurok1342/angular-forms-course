import {Component} from '@angular/core';
import {FormBuilder} from '@angular/forms';


@Component({
  selector: 'app-create-course-step-3',
  templateUrl: 'create-course-step-3.component.html',
  styleUrls: ['create-course-step-3.component.scss']
})
export class CreateCourseStep3Component {
  form = this.fb.group({
  });

  constructor(private fb: FormBuilder) {}
}
