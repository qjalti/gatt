import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Container,
} from '@mui/material';

export default function NavBar(props) {
  return (
    <Box>
      <AppBar position={'static'}>
        <Container>
          <Toolbar>
            <Typography
              variant="h6"
            >
              {props.siteName}
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}