import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
  @Input() selectedUser: User | null = null;
  @Input() actionButtonLabel: string = 'Create';
  @Output() action = new EventEmitter();

  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      firstName: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      nickname: [''],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      currentActivity: [''],
      id: [''],
    });
  }

  ngOnInit(): void {
    this.checkAction();
  }

  checkAction() {
    if (this.selectedUser) {
      this.actionButtonLabel = 'Update';
      this.patchDataValues();
    }
  }

  emitAction() {
    this.action.emit({ value: this.userForm.value, action: this.actionButtonLabel });
  }

  patchDataValues() {
    if (this.selectedUser) {
      this.userForm.patchValue(this.selectedUser);
    }
  }

  resetForm() {
    this.userForm.reset();
  }

  // Get form controls to use for form validation
  get firstName() {
    return this.userForm.get('firstName');
  }

  get lastName() {
    return this.userForm.get('lastName');
  }

  get email() {
    return this.userForm.get('email');
  }

}
