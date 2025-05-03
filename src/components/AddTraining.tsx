import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { Training } from "../types";

type AddTrainingProps = {
  customerHref: string; // esim. customer._links.customer.href
  fetchTrainings: () => void;
};

export default function AddTraining({ customerHref, fetchTrainings }: AddTrainingProps) {
  const [open, setOpen] = useState(false);
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState<number>(30);
  const [date, setDate] = useState<Dayjs | null>(dayjs());

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = () => {
    if (!date) return;

    const training: Training = {
      date: date.toISOString(),
      activity,
      duration,
      customer: { href: customerHref },
    };

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
            value={date}
            onChange={(newValue) => setDate(newValue)}
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
