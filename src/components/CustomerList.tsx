import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ModuleRegistry, AllCommunityModule, ICellRendererParams } from "ag-grid-community";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import "ag-grid-community/styles/ag-theme-material.css";
import AddCustomer from "./AddCustomer";
import EditCustomer from "./EditCustomer";
import { Customer } from "../types";
import { saveAs } from "file-saver";

ModuleRegistry.registerModules([AllCommunityModule]);



export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [open, setOpen] = useState(false);

  const [columnDefs] = useState<ColDef<Customer>[]>([ 
    { field: "firstname", filter: true },
    { field: "lastname", filter: true },
    { field: "email", filter: true },
    { field: "phone", filter: true },
    { field: "streetaddress", filter: true },
    { field: "postcode", filter: true },
    { field: "city", filter: true },
    {
      headerName: "Edit",
      cellRenderer: (params: ICellRendererParams) => (
        <EditCustomer data={params.data} fetchCustomers={fetchCustomers} />
      )
    },
    {
      cellRenderer: (params: ICellRendererParams) => (
        <Button size = "small" color = "error" onClick={() => handleDelete(params)}>
            Delete
        </Button>   
        )
    }
    
  ]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    fetch("https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers")
      .then(res => res.json())
      .then(data => {
        setCustomers(data._embedded.customers);
        setOpen(true);
      })
      .catch(error => console.error(error));
  };

  const handleDelete = (params: ICellRendererParams) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    const customerUrl = params.data._links?.customer?.href;
    if (!customerUrl) {
    alert("Customer link is missing!");
    return;
    }
    fetch(customerUrl, { method: "DELETE" })
    .then(() => fetchCustomers())
    .catch(error => console.error(error));
    };

  const exportToCSV = () => {
    const headers = ["Firstname", "Lastname", "Email", "Phone", "Streetaddress", "Postcode", "City"];
    const rows = customers.map(c => [
      c.firstname,
      c.lastname,
      c.email,
      c.phone,
      c.streetaddress,
      c.postcode,
      c.city,
    ]);
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(","))
      .join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "customers.csv");
  };

  return (
    <>
      <AddCustomer fetchCustomers={fetchCustomers} />
      <Button variant="outlined" onClick={exportToCSV} style={{ margin: "10px 0" }}>
        Export to CSV
      </Button>
      <div className="ag-theme-material" style={{ height: 600, width: "100%" }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={customers}
          pagination={true}
        />
      </div>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message="Customer data loaded"
      />
    </>
  );
}
