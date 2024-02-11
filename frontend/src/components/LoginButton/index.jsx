import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";

import Tooltip from "@mui/material/Tooltip";

const LoginButton = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  if (isAuthenticated) {
    return (
      <Tooltip title={"Logout"}>
        <FontAwesomeIcon
          size="xl"
          style={{ cursor: "pointer" }}
          icon={faRightFromBracket}
          onClick={() => logout({
            logoutParams: {
              returnTo: `${window.location.origin}`,
            },
          })}
        />
      </Tooltip>
    );
  }
  return (
    <Tooltip title={"Login"}>
      <FontAwesomeIcon
        size="xl"
        style={{ cursor: "pointer" }}
        icon={faRightToBracket}
        onClick={() => loginWithRedirect()}
      />
    </Tooltip>
  );
};

export default LoginButton;
