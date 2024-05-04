import "./App.css";
import Homepage from "./pages/Homepage/Homepage";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { connect, useDispatch } from "react-redux";
import { hideSnackbar } from "./redux/actions/auth";
import { Alert, Snackbar } from "@mui/material";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginPage from "./pages/Login/Login";
import ProtectedRoute from "./utils/ProtectedRoute";

function App({ snackbar }) {
  const dispatch = useDispatch();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(hideSnackbar());
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Snackbar
          open={snackbar.isOpen}
          anchorOrigin={{
            vertical: snackbar.vertical,
            horizontal: snackbar.horizontal,
          }}
          autoHideDuration={snackbar.autoHideDuration}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={snackbar.type}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      <Router>
        <Switch>
          <Route exact path="/login">
            <LoginPage />
           </Route>
          <Route path="/">
            <ProtectedRoute component={<Homepage  />} />
          </Route>
        </Switch>
      </Router>
    </LocalizationProvider>
  );
}
const mapStateToProps = (state) => ({ snackbar: state.snackbar });

export default connect(mapStateToProps)(App);
