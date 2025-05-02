export type Customer = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  streetaddress: string;
  postcode: string;
  city: string;
}

export type Training = {
  id: number;
  date: string;
  duration: number;
  activity: string;
  customer: {
    firstname: string;
    lastname: string;
  }
}
