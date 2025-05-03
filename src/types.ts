export type Customer = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  streetaddress: string;
  postcode: string;
  city: string;
  _links : {
      self : {
        href: string;
      }
      customer : {
        href: string;
      }  
    }
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

export type CreateTraining = {
  date: string
  activity: string
  duration: string
  customer: string
}

export type CalendarEvent = {
  title: string;
  start: string;
  allDay: boolean;
};
