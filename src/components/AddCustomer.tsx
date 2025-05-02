import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Customer } from "../types";

type AddCustomerProps = {
  fetchCustomers: () => void;
};

export default function AddCustomer({ fetchCustomers }: AddCustomerProps) {
  const [customer, setCustomer] = useState<Customer>({} as Customer);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = () => {
    fetch("https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to save customer");
        return response.json();
      })
      .then(() => fetchCustomers())
      .then(() => handleClose())
      .catch((error) => console.error(error));
  };

  const fields: (keyof Customer)[] = [
    "firstname", "lastname", "email", "phone", "streetaddress", "postcode", "city"
  ];
  

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Customer
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogContent>
            {fields.map((field) => (
                <TextField
                key={field}
                margin="dense"
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                fullWidth
                variant="standard"
                value={customer[field] || ""}
                onChange={(e) => setCustomer({ ...customer, [field]: e.target.value })}
    />
  ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
