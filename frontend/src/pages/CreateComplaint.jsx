import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const CreateComplaint = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    issue: '',
    priority: 'Low',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    const newErrors = {};
    
    if (!formData.userName.trim()) {
      newErrors.userName = 'Name is required';
    }
    
    if (!formData.issue.trim()) {
      newErrors.issue = 'Issue description is required';
    } else if (formData.issue.trim().length < 10) {
      newErrors.issue = 'Issue must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    setSubmitError('');
    
    try {
      await axios.post(`${API_URL}/complaints`, formData);
      navigate('/');
    } catch (err) {
      console.error('Error creating complaint:', err);
      setSubmitError(
        err.response?.data?.message || 'Failed to create complaint. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Complaint
        </Typography>
        <Typography color="textSecondary" paragraph>
          Fill in the form below to submit a new complaint.
        </Typography>
      </Box>


      <Paper elevation={2} sx={{ p: 3 }}>
        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Your Name"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                error={!!errors.userName}
                helperText={errors.userName}
                disabled={loading}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  label="Priority"
                  disabled={loading}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Issue Description"
                name="issue"
                value={formData.issue}
                onChange={handleChange}
                error={!!errors.issue}
                helperText={errors.issue || 'Please describe your issue in detail'}
                disabled={loading}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Complaint'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateComplaint;
