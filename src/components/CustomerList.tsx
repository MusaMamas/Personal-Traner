import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import Snackbar from "@mui/material/Snackbar";
import "ag-grid-community/styles/ag-theme-material.css";
import { Customer } from "../types";

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
    { field: "city", filter: true }
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

  return (
    <>
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
