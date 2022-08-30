interface RegisterKeys {
  [key: string]: string;
}

export interface Register extends RegisterKeys {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
}

export interface Login {
  email: string;
  password: string;
}
