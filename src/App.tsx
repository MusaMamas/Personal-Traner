import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CustomerList from "./components/CustomerList";
import TrainingList from "./components/TrainingList";
import TrainingCalendar from "./components/TrainingCalendar";
import ActivityStats from "./components/ActivityStats";
import "./App.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function App() {
  return (
    <Router>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Personal Trainer
            </Typography>
            <Button color="inherit" component={Link} to="/customers">
              Customers
            </Button>
            <Button color="inherit" component={Link} to="/trainings">
              Trainings
            </Button>
            <Button color="inherit" component={Link} to="/calendar">
              Calendar
            </Button>
            <Button color="inherit" component={Link} to="/stats">
              Stats
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Routes>
            <Route path="*" element={<CustomerList />} />
            <Route path="/trainings" element={<TrainingList />} />
            <Route path="/calendar" element={<TrainingCalendar />} />
            <Route path="/stats" element={<ActivityStats />} />
          </Routes>
        </Container>
      </LocalizationProvider>
    </Router>
  );
}

export default App;