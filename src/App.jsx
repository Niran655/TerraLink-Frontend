import { ApolloProvider } from "@apollo/client/react";
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import ThemeCustomizer from './Components/ThemeCustomizer/ThemeCustomizer';
import AlertMessage from "./Components/AlertMessage/AlertMessage";
import { ThemeProvider } from './Context/ThemeContext';
import { client } from "../apolloClient";
import './App.scss';
import Router from './Router';
import { AuthProvider } from "./Context/AuthContext";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ApolloProvider client={client}>
          <BrowserRouter>
            <CssBaseline />
            <Router />
            <ThemeCustomizer />
          </BrowserRouter>
          <AlertMessage/>
        </ApolloProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;