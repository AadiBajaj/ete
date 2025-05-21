import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="static" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
              '&:hover': {
                opacity: 0.9,
              },
            }}
          >
            Complaint Manager
          </Typography>
          <Box>
            <Button
              component={RouterLink}
              to="/"
              color="inherit"
              sx={{ mx: 1 }}
            >
              Home
            </Button>
            <Button
              component={RouterLink}
              to="/create"
              variant="contained"
              color="secondary"
              sx={{ ml: 1 }}
            >
              New Complaint
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
