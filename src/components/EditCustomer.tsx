import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Customer } from "../types";

type EditCustomerProps = {
  data: Customer;
  fetchCustomers: () => void;
};

export default function EditCustomer({ data, fetchCustomers }: EditCustomerProps) {
  const [customer, setCustomer] = useState<Customer>({ ...data });
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setCustomer({ ...data });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleUpdate = () => {
    fetch(data._links.customer.href, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update customer");
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
        Edit
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Customer</DialogTitle>
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
          <Button onClick={handleUpdate}>Update</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
