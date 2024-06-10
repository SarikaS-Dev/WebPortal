import { LogLevel } from "@azure/msal-browser";
import { ClientId, TenantId } from "./constant";
// Browser check variables
// If you support IE, our recommendation is that you sign-in using Redirect APIs
// If you as a developer are testing using Edge InPrivate mode, please add "isEdge" to the if check
const ua = window.navigator.userAgent;
const msie = ua.indexOf("MSIE ");
const msie11 = ua.indexOf("Trident/");
const msedge = ua.indexOf("Edge/");
const firefox = ua.indexOf("Firefox");
const isIE = msie > 0 || msie11 > 0;
const isEdge = msedge > 0;
const isFirefox = firefox > 0; // Only needed if you need to support the redirect flow in Firefox incognito

// Configuration for MSAL
export const msalConfig = {
  auth: {
    clientId: ClientId, // Client ID obtained from Azure AD app registration
    authority: "https://login.microsoftonline.com/" + TenantId, // Authority URL for authentication
    redirectUri: "http://localhost:3000/", // Redirect URI after successful login
    postLogoutRedirectUri: "http://localhost:3000/", // Redirect URI after logout
    navigateToLoginRequestUrl: false, // Whether to navigate to login request URL after login
  },
  cache: {
    cacheLocation: "sessionStorage", // Location to cache tokens
    storeAuthStateInCookie: isIE || isEdge || isFirefox,
  },
  system: {
    loggerOptions: {
      // Logger callback function to handle log messages
      loggerCallback: (level, message, containsPii) => {
        // Check if message contains Personally Identifiable Information (PII)
        if (containsPii) {
          return; // Do not log PII
        }
        // Log messages based on log level
        switch (level) {
          case LogLevel.Error:
            // Handle error messages
            // console.error(message);
            return;
          case LogLevel.Info:
            // Handle info messages
            // console.info(message);
            return;
          case LogLevel.Verbose:
            // Handle verbose messages
            // console.debug(message);
            return;
          case LogLevel.Warning:
            // Handle warning messages
            // console.warn(message);
            return;
          default:
            return;
        }
      },
    },
  },
};
