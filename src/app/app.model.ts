export interface ProfileInterface {
  id: number;
  firstName: string;
  lastName: string;
  nickname: string;
  email: string;
  currentActivity?: string;
}

export interface SelectListInterface {
  label: string;
  value: string;
}
