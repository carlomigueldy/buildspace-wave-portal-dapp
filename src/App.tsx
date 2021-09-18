import {
  ChakraProvider,
  extendTheme,
  ThemeConfig,
  withDefaultColorScheme,
} from "@chakra-ui/react";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";

const theme = extendTheme(
  withDefaultColorScheme({
    colorScheme: "primary",
  }),
  {
    config: {
      initialColorMode: "dark",
      useSystemColorMode: false,
    } as ThemeConfig,
    colors: {
      primary: "rgb(27, 32, 189)",
      background: "#1b2145",
      "navbar-background": "rgba(27, 33, 69, 0.25)",
    },
    fonts: {
      heading: "DM Sans",
      body: "DM Sans",
    },
    styles: {
      body: {
        bg: "red",
        color: "white",
      },
    },
  }
);

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Switch>
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    </ChakraProvider>
  );
}

export default App;
