import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ColDef, ModuleRegistry, ICellRendererParams } from "ag-grid-community";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import "ag-grid-community/styles/ag-theme-material.css";
import { Training } from "../types";
import AddTraining from "./AddTraining";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function TrainingList() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [open, setOpen] = useState(false);
  

  const [columnDefs] = useState<ColDef<Training>[]>([ 
    {
      headerName: "Date",
      field: "date",
      valueFormatter: params => dayjs(params.value).format("DD.MM.YYYY HH:mm"),
      filter: true
    },
    { field: "activity", filter: true },
    { field: "duration", headerName: "Duration (min)", filter: true },
    {
      headerName: "Customer",
      valueGetter: params => {
      const customer = params.data?.customer;
      return customer ? `${customer.firstname} ${customer.lastname}` : "N/A";
      },
      filter: true
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
    fetchTrainings();
  }, []);

  const fetchTrainings = () => {
    fetch("https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/gettrainings")
      .then(res => res.json())
      .then(data => {
        setTrainings(data);
        setOpen(true);
      })
      .catch(error => console.error(error));
  };
  
  const handleDelete = (params: ICellRendererParams) => {
    if (!window.confirm("Are you sure you want to delete this training?")) return;
  
    const trainingId = params.data?.id;
    if (!trainingId) return;
  
    fetch(`https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings/${trainingId}`, {
      method: "DELETE"
    })
      .then(() => fetchTrainings())
      .catch((err) => console.error(err));
  };

  return (
    <>
    <AddTraining fetchTrainings={fetchTrainings} />
      <div className="ag-theme-material" style={{ height: 600, width: "100%" }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={trainings}
          pagination={true}
        />
      </div>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message="Trainings loaded"
      />
    </>
  );
}