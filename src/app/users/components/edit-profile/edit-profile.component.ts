import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';

import { ProfileInterface, SelectListInterface } from 'src/app/app.model';
import { UsersService } from '../../users.service';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html'
})
export class EditProfileComponent implements OnInit, OnDestroy {
  alertType = '';
  alertMessage = '';

  hasHobbiesValue = false;
  hasUpdatedProfileData = false;
  hasWorkDutiesValue = false;
  isLoading = false;
  shouldShowAlert = false;
  tooMuchCodingWarning = false;

  editProfileForm: FormGroup;
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
      value: ""
    },
    {
      label: "Coding",
      value: "coding"
    },
    {
      label: "Debugging",
      value: "debugging"
    },
    {
      label: "DevOps",
      value: "devOps",
    },
    {
      label: "Mentoring",
      value: "mentoring"
    },
    {
      label: "Solution design",
      value: "solutionDesign"
    },
  ];

  existingProfileData: ProfileInterface;
  profileData: ProfileInterface = {
    firstName: '',
    lastName: '',
    nickname: '',
    email: '',
    currentActivity: '',
  };

  private userId: string = '';

  constructor(
    private usersService: UsersService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.buildPage();
    this.getUserId();
    this.fetchData();
    this.setupEditProfileFormListeners();
  }

  ngOnDestroy(): void {
    this.hobbiesListener.unsubscribe();
    this.profileListener.unsubscribe();
    this.workDutiesListener.unsubscribe();
  }

  buildPage(): void {
    this.setupEditProfileForm();
  }

  fetchData(): void {
    this.isLoading = true;
    this.usersService
      .getUsersData()
      .subscribe({
        next: (results: any) => {
          this.setProfileData(results);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching data. Please try again later.');
          console.log(err);
          this.isLoading = false;
        },
      });
  }

  /**
   * Checks existing current activity value in profile data
   * and populates the correct select list in the template
   * with the appropriate value.
   * @param existingCurrentActivity
   */
  hasHobbyOrWorkDuty(existingCurrentActivity: any) {
    this.profileData.currentActivity = existingCurrentActivity;
    this.hobbies.forEach(hobby => {
      if (hobby.value === existingCurrentActivity) {
        this.getHobbiesFormControl().patchValue(existingCurrentActivity);
        this.hasUpdatedProfileData = hobby.value === existingCurrentActivity;
      } else if (hobby.value === 'removeHobby') {
        this.getHobbiesFormControl().patchValue('');
        this.profileData.currentActivity = '';
      }
    });

    this.workDuties.forEach(workDuty => {
      if (workDuty.value === existingCurrentActivity) {
        this.getWorkDutiesFormControl().patchValue(existingCurrentActivity);
        this.hasUpdatedProfileData = workDuty.value === existingCurrentActivity;
      } else if (workDuty.value === 'removeWorkDuty') {
        this.getWorkDutiesFormControl().patchValue('');
        this.profileData.currentActivity = '';
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
   * Reset form data to initial values
   */
  resetForm(): void {
    const hobbiesValue = this.getHobbiesFormControl().value;
    const workDutiesValue = this.getWorkDutiesFormControl().value;

    this.getFirstNameFormControl().patchValue(this.existingProfileData.firstName);
    this.getLastNameFormControl().patchValue(this.existingProfileData.lastName);
    this.getNicknameFormControl().patchValue(this.existingProfileData.nickname);
    this.getEmailFormControl().patchValue(this.existingProfileData.email);

    if (this.hasHobbiesValue || hobbiesValue === 'removeHobby') {
      this.getHobbiesFormControl().patchValue(
        this.existingProfileData.currentActivity
      );
    }

    if (this.hasWorkDutiesValue || workDutiesValue === 'removeWorkDuty') {
      this.getWorkDutiesFormControl().patchValue(
        this.existingProfileData.currentActivity
      );
    }

    if (hobbiesValue !== '' && hobbiesValue !== 'removeHobby') {
      this.getWorkDutiesFormControl().disable();
    } else {
      this.getWorkDutiesFormControl().enable();
    }

    if (workDutiesValue !== '' && workDutiesValue !== 'removeWorkDuty') {
      this.getHobbiesFormControl().disable();
    } else {
      this.getHobbiesFormControl().enable();
    }
  }

  /**
   * Set profile data on initial page draw
   * @param existingProfileData
   */
  setProfileData(existingProfileData: ProfileInterface[]): void {
    if (existingProfileData) {
      existingProfileData.forEach(profileData => {
        const currentUserId = profileData.id?.toString();
        if (currentUserId === this.userId) {
          this.existingProfileData = {
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            nickname: profileData.nickname,
            email: profileData.email,
            currentActivity: profileData.currentActivity,
          };

          // Update form fields in template with latest data
          this.getFirstNameFormControl().patchValue(profileData.firstName);
          this.getLastNameFormControl().patchValue(profileData.lastName);
          this.getNicknameFormControl().patchValue(profileData.nickname);
          this.getEmailFormControl().patchValue(profileData.email);

          const existingCurrentActivity = profileData.currentActivity;
          this.hasHobbyOrWorkDuty(existingCurrentActivity);

          if (existingCurrentActivity !== '' && existingCurrentActivity === 'codingForFun') {
            this.tooMuchCodingWarning = true;
          }
        }
      });
    }
  }

  setupEditProfileForm(): void {
    this.editProfileForm = this.fb.group({
      profile: this.fb.group({
        firstName: [''],
        lastName: [''],
        nickname: [''],
        email: [''],
      }),
      hobbies: [{ value: '', disabled: false }],
      workDuties: [{ value: '', disabled: false }],
    });
  }

  /**
   * Listen to the form for value changes
   */
  setupEditProfileFormListeners(): void {
    this.profileListener = this.getProfileFormGroup()
      .valueChanges
      .subscribe(profileValueChange => {
        this.profileData = {
          id: +this.userId,
          firstName: profileValueChange.firstName,
          lastName: profileValueChange.lastName,
          nickname: profileValueChange.nickname,
          email: profileValueChange.email,
          currentActivity: this.existingProfileData.currentActivity,
        };

        this.hasUpdatedProfileData =
          this.profileData.firstName !== this.existingProfileData.firstName
          || this.profileData.lastName !== this.existingProfileData.lastName
          || this.profileData.nickname !== this.existingProfileData.nickname
          || this.profileData.email !== this.existingProfileData.email
          || this.profileData.currentActivity !== this.existingProfileData.currentActivity;
      });

    this.hobbiesListener = this.getHobbiesFormControl()
      .valueChanges
      .subscribe(hobbyChange => {
        this.isNoValueSelected();

        if (
          hobbyChange !== this.profileData.currentActivity
          && !this.hasWorkDutiesValue
        ) {
          this.hasUpdatedProfileData = true;

          if (hobbyChange === '' || hobbyChange === 'removeHobby') {
            this.hasHobbiesValue = false;
            this.profileData.currentActivity = '';
            this.getWorkDutiesFormControl().enable({ emitEvent: false });
          } else {
            this.hasHobbiesValue = true;
            this.profileData.currentActivity = hobbyChange;
            this.getWorkDutiesFormControl().disable({ emitEvent: false });
          }
        } else {
          this.hasUpdatedProfileData = false;
        }
      });

    this.workDutiesListener = this.getWorkDutiesFormControl()
        .valueChanges
        .subscribe(workDutyChange => {
          this.isNoValueSelected();

          if (
            workDutyChange !== this.profileData.currentActivity &&
            !this.hasHobbiesValue
          ) {
            this.hasUpdatedProfileData = true;

            if (workDutyChange === '' || workDutyChange === 'removeWorkDuty') {
              this.hasWorkDutiesValue = false;
              this.profileData.currentActivity = '';
              this.getHobbiesFormControl().enable({ emitEvent: false });
            } else {
              this.hasWorkDutiesValue = true;
              this.profileData.currentActivity = workDutyChange;
              this.getHobbiesFormControl().disable({ emitEvent: false });
            }
          } else {
            this.hasUpdatedProfileData = false;
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
    this.hasUpdatedProfileData = false;
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

  /**
   * Send updated profile data to backend for data persistence
   */
  updateProfileData(): void {
    const hobbiesValue = this.getHobbiesFormControl().value;
    const workDutiesValue = this.getWorkDutiesFormControl().value;

    if (hobbiesValue === '' && workDutiesValue === '') {
      this.profileData.currentActivity = '';
    } else if (hobbiesValue !== '' && workDutiesValue === '') {
      this.profileData.currentActivity = hobbiesValue;
    } else if (hobbiesValue === '' && workDutiesValue !== '') {
      this.profileData.currentActivity = workDutiesValue;
    }

    this.isLoading = true;
    this.usersService
      .updateUserData(this.profileData)
      .subscribe({
        next: () => {
          this.showAlert('success', 'Your profile was successfully updated!');
        },
        error: (err) => {
          console.log('Uh oh! Something went wrong.');
          console.log(err);
          this.showAlert('error', 'There was a problem updating your profile. Please try again.');
        }
      });
  }

  private getUserId() {
    this.userId = this.route.snapshot.params['id'];
  }

  private getProfileFormGroup(): FormGroup {
    return this.editProfileForm.get('profile') as FormGroup;
  }

  private getEmailFormControl(): FormControl {
    return this.editProfileForm.get('profile.email') as FormControl;
  }

  private getFirstNameFormControl(): FormControl {
    return this.editProfileForm.get('profile.firstName') as FormControl;
  }

  private getLastNameFormControl(): FormControl {
    return this.editProfileForm.get('profile.lastName') as FormControl;
  }

  private getNicknameFormControl(): FormControl {
    return this.editProfileForm.get('profile.nickname') as FormControl;
  }

  private getHobbiesFormControl(): FormControl {
    return this.editProfileForm.get('hobbies') as FormControl;
  }

  private getWorkDutiesFormControl(): FormControl {
    return this.editProfileForm.get('workDuties') as FormControl;
  }
}
