import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { CreateTraining, Customer } from "../types";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

type AddTrainingProps = {
  fetchTrainings: () => void;
};

export default function AddTraining({ fetchTrainings }: AddTrainingProps) {
  const [open, setOpen] = useState(false);
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState<number>(30);
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [customers, setCustomers] = useState<Customer[]>([])
  const [currentCustomerHref, setCurrentCustomerHref] = useState("")

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setActivity("")
    setDuration(0)
    setDate(dayjs())
    setCurrentCustomerHref("")
  }

  useEffect(() => {
    getCustomers()
  }, [])

  const getCustomers = () => {
    fetch("https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to save training");
        return response.json();
      })
      .then((data) => {
        setCustomers(data._embedded.customers)
      })
  }

  const handleSave = () => {
    if (!date) return;

    const training: CreateTraining = {
      date: date.toISOString(),
      duration: duration + "",
      activity,
      customer: currentCustomerHref
    }

    fetch("https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(training),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to save training");
        return response.json();
      })
      .then(() => fetchTrainings())
      .then(() => handleClose())
      .catch((error) => console.error(error));
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Training
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Training Session</DialogTitle>
        <DialogContent>
          <DateTimePicker
            label="Date and Time"
            value={date as null}
            format="yyyy-MM-dd"
            onChange={(newValue) => setDate(newValue as null)}
            sx={{ marginTop: 2, marginBottom: 1 }}
          />
          <TextField
            margin="dense"
            label="Activity"
            fullWidth
            variant="standard"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Customer</InputLabel>
              <Select
                variant="standard"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={currentCustomerHref}
                label="Customer"
                onChange={({ target: { value } }) => {
                  setCurrentCustomerHref(value)
                }}
              >
                {customers.map(customer => {
                  return (
                    <MenuItem value={customer._links.self.href}>{customer.firstname} {customer.lastname}</MenuItem>
                  )
                })}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Duration (minutes)"
            type="number"
            fullWidth
            variant="standard"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
