import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Box,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Home = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(`${API_URL}/complaints`);
        setComplaints(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch complaints. Please try again later.');
        setLoading(false);
        console.error('Error fetching complaints:', err);
      }
    };

    fetchComplaints();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        await axios.delete(`${API_URL}/complaints/${id}`);
        setComplaints(complaints.filter(complaint => complaint._id !== id));
      } catch (err) {
        console.error('Error deleting complaint:', err);
        setError('Failed to delete complaint. Please try again.');
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      default:
        return 'success';
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
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Complaints
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={Link}
          to="/create"
        >
          New Complaint
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {complaints.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="textSecondary" align="center">
              No complaints found. Create your first complaint!
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {complaints.map((complaint) => (
            <Grid item xs={12} sm={6} md={4} key={complaint._id}>
              <Card elevation={2}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {complaint.userName}
                    </Typography>
                    <Chip
                      label={complaint.priority}
                      color={getPriorityColor(complaint.priority)}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {complaint.issue}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    component={Link}
                    to={`/complaints/${complaint._id}`}
                  >
                    View Details
                  </Button>
                  <Button
                    size="small"
                    color="secondary"
                    component={Link}
                    to={`/complaints/${complaint._id}/edit`}
                    startIcon={<EditIcon fontSize="small" />}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(complaint._id)}
                    startIcon={<DeleteIcon fontSize="small" />}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Home;
