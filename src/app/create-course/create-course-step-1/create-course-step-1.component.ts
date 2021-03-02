import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {courseTitleValidator} from '../../validators/course-title.validator';
import {CoursesService} from '../../services/courses.service';
import {Observable} from 'rxjs';

interface CourseCategory {
  code: string;
  description: string;
}

@Component({
  selector: 'app-create-course-step-1',
  templateUrl: './create-course-step-1.component.html',
  styleUrls: ['./create-course-step-1.component.scss']
})
export class CreateCourseStep1Component implements OnInit {
  form = this.fb.group({
    title: ['', {
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(60)
      ],
      asyncValidators: [courseTitleValidator(this.coursesService)],
      updateOn: 'blur'
    }],
    category: ['BEGINNER', Validators.required],
    releaseAt: [new Date(), Validators.required],
    downloadsAllowed: [false, Validators.requiredTrue],
    longDescription: ['', [
      Validators.required,
      Validators.minLength(3)
    ]]
  });

  courseCategories$: Observable<CourseCategory[]>;

  get courseTitle() {
    return this.form.controls['title'];
  }

  constructor(
    private fb: FormBuilder,
    private coursesService: CoursesService
  ) {}

  ngOnInit() {
    this.courseCategories$ = this.coursesService.findCourseCategories();
  }
}
