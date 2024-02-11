import "./App.css";
import PricingDashboard from "@/pricing_dashboard";
import AdminDashboard from "@/admin_dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import Theme from "@/Theme";
import { useAuth0 } from "@auth0/auth0-react";
import { LinearProgress } from "@mui/material";
import { styled } from "@mui/system";

const StyledDiv = styled("div")(({ theme }) => ({
  minWidth: "80vw",
  minHeight: "80vh",
  color: theme.typography.color.primary,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2, 4),
}));

function App() {
  const { user, isAuthenticated, loginWithRedirect, logout, isLoading } =
    useAuth0();

  if (!isAuthenticated && !isLoading) {
    loginWithRedirect();
  }

  return (
    <ThemeProvider theme={Theme}>
      <div className="App">
        {isLoading || !isAuthenticated ? (
          <StyledDiv>
            <div style={{ width: "70vw", margin: "30vh auto" }}>
              <h2> Welcome to Aurbitrage! </h2>
              <LinearProgress />
            </div>
          </StyledDiv>
        ) : (
          <BrowserRouter>
            <Routes>
              <Route exact path="/" element={<PricingDashboard />} />
              <Route exact path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<h2>Page Not Found</h2>} />
            </Routes>
          </BrowserRouter>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
