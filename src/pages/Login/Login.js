import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { hideSnackbar, signin } from '../../redux/actions/auth';

const StyledForm = styled('form')({
  width: 300,
  textAlign: 'center',
});

const LoginPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
  
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (email !== '' && password !== '') {
        dispatch(hideSnackbar());
        setLoading(true);
        dispatch(signin({ email, password }, history, setLoading));
      }
    };

  return (
    <Box>
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ height: '100vh' }}
    >
      <StyledForm>
      <TextField
          label="Email"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          sx={{ mb: 2 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
          Submit
        </Button>
      </StyledForm>
    </Grid>
    </Box>
  );
};

export default LoginPage;
