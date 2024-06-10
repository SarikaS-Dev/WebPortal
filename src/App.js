import React, { useState, useEffect } from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
  MsalProvider,
} from "@azure/msal-react";
import Header from "./components/Header";
import SideBar from "./components/Sidebar";
import Main from "./components/Main";
import Login from "./components/Login";
import NotFound from "./components/NotFound";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
// import icons
import "bootstrap-icons/font/bootstrap-icons.css";
import "remixicon/fonts/remixicon.css";
// import bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./App.css";

// WrappedView component containing main logic and routing
const WrappedView = () => {
  // Initialize MSAL instance
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!activeAccount);

  // Handle redirection after login
  const handleRedirect = () => {
    instance.loginPopup().catch((error) => console.error(error));
  };

  // Handle logout
  const handleLogout = () => {
    sessionStorage.clear();
    instance.logout();
    setIsLoggedOut(true);
  };

  useEffect(() => {
    setIsAuthenticated(!!activeAccount);
  }, [activeAccount]);

  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          {/* Authenticated routes */}
          <Route
            path="/supressionlist"
            render={() =>
              isAuthenticated ? (
                <AuthenticatedTemplate>
                  <>
                    <Header
                      handleLogout={handleLogout}
                      userName={activeAccount ? activeAccount.name : ""}
                    />
                    <SideBar />
                    <Main />
                  </>
                </AuthenticatedTemplate>
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          {/* Unauthenticated routes */}
          <Route
            path="/login"
            render={() =>
              isAuthenticated ? (
                <Redirect to="/supressionlist" />
              ) : (
                <UnauthenticatedTemplate>
                  {isLoggedOut ? (
                    <p></p>
                  ) : (
                    <Login handleRedirect={handleRedirect} />
                  )}
                </UnauthenticatedTemplate>
              )
            }
          />
          {/* NotFound route */}
          <Route path="/notfound" component={NotFound} />
          {/* Catch-all route */}
          <Route
            path="*"
            render={() =>
              isAuthenticated ? (
                <Redirect to="/notfound" />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

// App component wrapping WrappedView with MSALProvider
const App = ({ instance }) => {
  return (
    <MsalProvider instance={instance}>
      <WrappedView />
    </MsalProvider>
  );
};

export default App;
