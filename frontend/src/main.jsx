import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Auth0Provider } from "@auth0/auth0-react";

const providerConfig = {
  domain: "dev-i67n80rdo3y1dv8y.us.auth0.com",
  clientId: "Ph0FeS2km1BfrDYf027WmwVdLmmoKo2F",
  authorizationParams: {
    redirect_uri: window.location.origin,
  },
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <Auth0Provider
    {...providerConfig}
  >
    <App />
  </Auth0Provider>
  </React.StrictMode>,
)
