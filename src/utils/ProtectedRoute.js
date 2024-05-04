import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  Redirect,
  useHistory,
} from "react-router-dom/cjs/react-router-dom.min";
import { loadUser } from "../redux/actions/auth";
import { isValidToken } from "../api/User";
import { Box } from "@mui/material";
import { LOGOUT } from "../redux/const/actionsTypes";

function ProtectedRoute(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState("");

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user_info"));
    if (localUser) {
      const token = localUser.token;
      if (token != undefined) {
        isValidToken()
          .then((res) => {
            setIsAuthenticated(res.data);
            if (res.data == false) {
              dispatch({ type: LOGOUT });
              history.push("/login");
            }
          })
          .catch((err) => {
            dispatch({ type: LOGOUT });
            history.push("/login");
            setIsAuthenticated(false);
          });
      }
    } else {
      history.push("/login");
      setIsAuthenticated(false);
    }
  }, [props.auth]);

  return isAuthenticated && props.component;
}

const mapStateToProps = (state) => ({ auth: state.auth });

export default connect(mapStateToProps)(ProtectedRoute);
