import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ColDef, ModuleRegistry } from "ag-grid-community";
import Snackbar from "@mui/material/Snackbar";
import dayjs from "dayjs";
import "ag-grid-community/styles/ag-theme-material.css";
import { Training } from "../types";


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
      valueGetter: params => `${params.data?.customer?.firstname ?? ""} ${params.data?.customer?.lastname ?? ""}`,
      filter: true
    },
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

  
  return (
    <>
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