import React, {Fragment} from 'react';

import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import NavBar from './components/layout/NavBar';

import {IndexPage} from "./pages/IndexPage";

import {
  createTheme,
  ThemeProvider,
  Box,
  Container,
  CssBaseline
} from "@mui/material";
import {green} from '@mui/material/colors';

const darkTheme = createTheme({
  palette: {
    primary: {
      main: green[500],
    },
  },
});

function App() {
  return (
    <Router>
      <Fragment>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline/>
          <Box sx={{
            minHeight: '100vh'
          }}>
            <NavBar siteName={'GreenAPI'}/>
            <Container sx={{my: 4}}>
              <Routes>
                <Route path="/" element={<IndexPage/>} exact/>
              </Routes>
            </Container>
          </Box>
        </ThemeProvider>
      </Fragment>
    </Router>
  );
}

export default App;