import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { skip } from 'rxjs';

import { AppState } from 'src/app/state/app.state';
import { ProfileInterface } from 'src/app/app.model';
import { UserActions } from '../../state/user.actions';
import { selectUsers } from '../../state/user.selectors';

import { CommonService } from 'src/app/shared/common.service';
import { UsersService } from '../../users.service';

import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html'
})
export class UsersListComponent implements OnInit {
  // Select users slice of state
  usersData: ReadonlyArray<ProfileInterface> = [];
  users$ = this.store.select(selectUsers());

  // Font Awesome 5 icons
  faTimes = faTimes;

  alertMessage = '';
  alertType = '';

  isLoading = false;
  shouldShowAlert = false;

  // users: any = [];

  constructor(
    private commonService: CommonService,
    private router: Router,
    private store: Store<AppState>,
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.store.dispatch({ type: UserActions.GET_USER_LIST });
    this.users$.pipe(skip(1)).subscribe(data => this.usersData = data);
    // this.fetchData();
  }

  deleteUser(userId: any) {
    this.isLoading = true;
    this.usersService
      .deleteUserData(userId)
      .subscribe({
        next: () => {
          this.showAlert('success', 'User successfully deleted!');
          this.reloadUsersList(true);
          this.reloadPage();
        },
        error: err => {
          console.error('Error deleting user. Please try again.');
          console.log(err);
          this.isLoading = false;
        }
      });
  }

  /* fetchData(): void {
    this.isLoading = true;
    this.usersService
      .getUsersData()
      .subscribe({
        next: (results: any) => {
          let users = this.usersData;
          this.formatCurrentActivity(users);
          users = results;
          this.isLoading = false;
        },
        error: err => {
          console.error('Error fetching data. Please try again later.');
          console.log(err);
          this.isLoading = false;
        },
      });
  }

  formatCurrentActivity(users: any) {
    this.users.push(users.forEach((user: ProfileInterface) => {
      switch (user.currentActivity) {
        case 'cleaning':
          user.currentActivity = 'Cleaning my dirty house!';
          break;
        case 'coding':
          user.currentActivity = 'Slinging code for the man';
          break;
        case 'codingForFun':
          user.currentActivity = 'Coding (for fun!)';
          break;
        case 'cooking':
          user.currentActivity = 'Cooking delicious meals for my family';
          break;
        case 'debugging':
          user.currentActivity = 'Debugging my buggy code';
          break;
        case 'devOps':
          user.currentActivity = 'Deploying code'
          break;
        case 'hamRadio':
          user.currentActivity = 'Geeking out on ham radio';
          break;
        case 'mentoring':
          user.currentActivity = 'Mentoring a new generation of developers';
          break;
        case 'photography':
          user.currentActivity = 'Photography';
          break;
        case 'reading':
          user.currentActivity = 'Getting lost in a good book';
          break;
        case 'stormChasing':
          user.currentActivity = 'Going storm chasing!';
          break;
        case 'videoGames':
          user.currentActivity = 'Playing video games';
          break;
        case 'watchingClassicMovies':
          user.currentActivity = 'Watching Turner Classic Movies';
          break;
        default: ''
        break;
      }
    }));
  } */

  reloadPage() {
    window.location.reload();
  }

  reloadUsersList(self: boolean, urlToNavigateTo?: string) {
    // skipLocationChange: true means don't update the URL to / when navigating
    const url = self ? this.router.url : urlToNavigateTo;

    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => {
        this.router.navigate([`/${url}`])
        .then(() => {
          console.log(`On ${this.router.url}`);
        });
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
}
