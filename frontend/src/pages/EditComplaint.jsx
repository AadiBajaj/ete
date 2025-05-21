import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
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

const EditComplaint = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    userName: '',
    issue: '',
    priority: 'Low',
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await axios.get(`${API_URL}/complaints/${id}`);
        const { userName, issue, priority } = response.data;
        setFormData({ userName, issue, priority });
        setLoading(false);
      } catch (err) {
        setError('Failed to load complaint. Please try again later.');
        setLoading(false);
        console.error('Error fetching complaint:', err);
      }
    };

    fetchComplaint();
  }, [id]);

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
    
    setSubmitting(true);
    setError('');
    
    try {
      await axios.put(`${API_URL}/complaints/${id}`, formData);
      navigate(`/complaints/${id}`, { replace: true });
    } catch (err) {
      console.error('Error updating complaint:', err);
      setError(
        err.response?.data?.message || 'Failed to update complaint. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      <Typography variant="h4" component="h1" gutterBottom>
        Edit Complaint
      </Typography>
      <Typography color="textSecondary" paragraph>
        Update the complaint details below.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Box mb={3}>
            <TextField
              fullWidth
              label="Your Name"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              error={!!errors.userName}
              helperText={errors.userName}
              disabled={submitting}
              variant="outlined"
              margin="normal"
            />
          </Box>


          <Box mb={3}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="priority-label">Priority</InputLabel>
              <Select
                labelId="priority-label"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                label="Priority"
                disabled={submitting}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
          </Box>


          <Box mb={4}>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Issue Description"
              name="issue"
              value={formData.issue}
              onChange={handleChange}
              error={!!errors.issue}
              helperText={errors.issue || 'Please describe your issue in detail'}
              disabled={submitting}
              variant="outlined"
              margin="normal"
            />
          </Box>


          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default EditComplaint;
