import {Component} from '@angular/core';
import {FormArray, FormBuilder, Validators} from '@angular/forms';


@Component({
  selector: 'app-create-course-step-3',
  templateUrl: 'create-course-step-3.component.html',
  styleUrls: ['create-course-step-3.component.scss']
})
export class CreateCourseStep3Component {
  form = this.fb.group({
    lessons: this.fb.array([])
  });

  get lessons() {
    return this.form.controls['lessons'] as FormArray;
  }

  constructor(private fb: FormBuilder) {}

  addLesson() {
    const lessonForm = this.fb.group({
      title: ['', Validators.required],
      level: ['', Validators.required]
    });
    this.lessons.push(lessonForm);
  }

  deleteLesson(lessonIndex: number) {
    this.lessons.removeAt(lessonIndex);
  }
}
