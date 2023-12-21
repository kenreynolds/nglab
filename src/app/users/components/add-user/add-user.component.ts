import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ProfileInterface, SelectListInterface } from 'src/app/app.model';
import { UsersService } from '../../users.service';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html'
})
export class AddUserComponent implements OnInit, OnDestroy {
  alertType = '';
  alertMessage = '';

  hasHobbiesValue = false;
  hasNewUserData = false;
  hasWorkDutiesValue = false;
  isLoading = false;
  shouldShowAlert = false;

  addUserForm: FormGroup;
  hobbiesListener: Subscription;
  profileListener: Subscription;
  workDutiesListener: Subscription;

  hobbies: SelectListInterface[] = [
    {
      label: "Remove hobby",
      value: "removeHobby",
    },
    {
      label: "Cleaning",
      value: "cleaning",
    },
    {
      label: "Coding (for fun)",
      value: "codingForFun",
    },
    {
      label: "Cooking",
      value: "cooking",
    },
    {
      label: "Ham radio",
      value: "hamRadio",
    },
    {
      label: "Reading",
      value: "reading",
    },
    {
      label: "Storm chasing",
      value: "stormChasing",
    },
    {
      label: "Video games",
      value: "videoGames",
    },
    {
      label: "Photography",
      value: "photography",
    },
    {
      label: "Watching classic movies",
      value: "watchingClassicMovies",
    },
  ];

  workDuties: SelectListInterface[] = [
    {
      label: "Remove work duty",
      value: "removeWorkDuty"
    },
    {
      label: "Coding",
      value: "coding",
    },
    {
      label: "Debugging",
      value: "debugging",
    },
    {
      label: "DevOps",
      value: "devOps",
    },
    {
      label: "Mentoring",
      value: "mentoring",
    },
    {
      label: "Solution design",
      value: "solutionDesign",
    },
  ]

  profileData: ProfileInterface = {
    firstName: '',
    lastName: '',
    nickname: '',
    email: '',
    currentActivity: '',
  };

  constructor(
    private usersService: UsersService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildPage();
    this.setupAddUserFormListeners();
  }

  ngOnDestroy(): void {
    this.hobbiesListener.unsubscribe();
    this.profileListener.unsubscribe();
    this.workDutiesListener.unsubscribe();
  }

  buildPage(): void {
    this.setupAddUserForm();
  }

  addNewUser() {
    this.isLoading = true;
    this.usersService
      .addUser(this.profileData)
      .subscribe({
        next: newUser => {
          console.log('Adding a new user now...');
          this.router.navigateByUrl('/users');
          this.showAlert('success', 'The new user was successfully added!');
        },
        error: (err) => {
          console.log('Uh oh! Something went wrong.');
          console.log(err);
          this.showAlert('error', 'There was a problem adding the new user. Please try again.');
        }
      });
  }

  /**
   * Check to see if any value is selected for hobbies or work duties
   * and enable both select lists if no values are selected
   */
  isNoValueSelected(): void {
    if (!this.hasHobbiesValue && !this.hasWorkDutiesValue) {
      this.hasHobbiesValue = false;
      this.hasWorkDutiesValue = false;
      this.getHobbiesFormControl().enable({ emitEvent: false });
      this.getWorkDutiesFormControl().enable({ emitEvent: false });
    }
  }

  /**
   * Reset form to empty
   */
  resetForm(): void {
    this.getFirstNameFormControl().patchValue('');
    this.getLastNameFormControl().patchValue('');
    this.getNicknameFormControl().patchValue('');
    this.getEmailFormControl().patchValue('');
    this.getHobbiesFormControl().patchValue('');
    this.getWorkDutiesFormControl().patchValue('');

    // Update form states to clear validation errors
    this.addUserForm.markAsPristine();
    this.addUserForm.markAsUntouched();
    this.addUserForm.updateValueAndValidity();
  }

  setupAddUserForm(): void {
    this.addUserForm = this.fb.group({
      profile: this.fb.group({
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
      }),
      hobbies: [{ value: '', disabled: false }],
      workDuties: [{ value: '', disabled: false }],
    });
  }

  /**
   * Listen to the form for value changes
   */
  setupAddUserFormListeners(): void {
    this.profileListener = this.getProfileFormGroup()
      .valueChanges
      .subscribe(profileValueChange => {
        this.profileData = {
          firstName: profileValueChange.firstName,
          lastName: profileValueChange.lastName,
          nickname: profileValueChange.nickname,
          email: profileValueChange.email,
          currentActivity: '',
        };

        this.hasNewUserData =
          this.profileData.firstName !== ''
          && this.profileData.lastName !== ''
          && this.profileData.email !== ''
      });

    this.hobbiesListener = this.getHobbiesFormControl()
      .valueChanges
      .subscribe(hobbiesValueChange => {
        this.isNoValueSelected();

        if (!this.hasWorkDutiesValue) {
          if (hobbiesValueChange === '' || hobbiesValueChange === 'removeHobby') {
            if (hobbiesValueChange === 'removeHobby') {
              this.getHobbiesFormControl().patchValue('', { emitEvent: false });
              this.hasHobbiesValue = false;
              this.hasNewUserData = false;
            }

            this.hasHobbiesValue = false;
            this.profileData.currentActivity = '';
            this.getWorkDutiesFormControl().enable({ emitEvent: false });
          } else {
            this.hasHobbiesValue = true;
            this.hasNewUserData = true;
            this.profileData.currentActivity = hobbiesValueChange;
            this.getWorkDutiesFormControl().disable({ emitEvent: false });
          }
        } else {
          this.hasNewUserData = false;
        }
      });

    this.workDutiesListener = this.getWorkDutiesFormControl()
      .valueChanges
      .subscribe(workDutiesValueChange => {
        this.isNoValueSelected();

        if (!this.hasHobbiesValue) {
          if (workDutiesValueChange === '' || workDutiesValueChange === 'removeWorkDuty') {
            if (workDutiesValueChange === 'removeWorkDuty') {
              this.getWorkDutiesFormControl().patchValue('', { emitEvent: false });
              this.hasWorkDutiesValue = false;
              this.hasNewUserData = false;
            }

            this.hasWorkDutiesValue = false;
            this.profileData.currentActivity = '';
            this.getHobbiesFormControl().enable({ emitEvent: false });
          } else {
            this.hasWorkDutiesValue = true;
            this.hasNewUserData = true;
            this.profileData.currentActivity = workDutiesValueChange;
            this.getHobbiesFormControl().disable({ emitEvent: false });
          }
        } else {
          this.hasNewUserData = false;
        }
      });
  }

  /**
   * Show alert message depending on the alert type
   * @param alertType Determines which alert to show
   * @param message Sets the message to display
   */
  showAlert(alertType: string, message: string) {
    alertType === 'success' ? this.alertType = 'success' : this.alertType = 'error';

    this.alertMessage = message;
    this.hasNewUserData = false;
    this.commonService.scrollToTop();
    this.shouldShowAlert = true;

    // Handle alert
    setTimeout(() => {
      this.isLoading = false;

      setTimeout(() => {
        this.shouldShowAlert = false;
      }, 3000);
    }, 1000);
  }

  // Get form controls to use for form validation
  get firstName() {
    return this.addUserForm.get('profile.firstName');
  }

  get lastName() {
    return this.addUserForm.get('profile.lastName');
  }

  get email() {
    return this.addUserForm.get('profile.email');
  }

  // Get form controls to use for decision logic
  private getProfileFormGroup(): FormGroup {
    return this.addUserForm.get('profile') as FormGroup;
  }

  private getEmailFormControl(): FormControl {
    return this.addUserForm.get('profile.email') as FormControl;
  }

  private getFirstNameFormControl(): FormControl {
    return this.addUserForm.get('profile.firstName') as FormControl;
  }

  private getLastNameFormControl(): FormControl {
    return this.addUserForm.get('profile.lastName') as FormControl;
  }

  private getNicknameFormControl(): FormControl {
    return this.addUserForm.get('profile.nickname') as FormControl;
  }

  private getHobbiesFormControl(): FormControl {
    return this.addUserForm.get('hobbies') as FormControl;
  }

  private getWorkDutiesFormControl(): FormControl {
    return this.addUserForm.get('workDuties') as FormControl;
  }
}
