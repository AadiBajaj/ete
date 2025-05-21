import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await axios.get(`${API_URL}/complaints/${id}`);
        setComplaint(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch complaint details. Please try again later.');
        setLoading(false);
        console.error('Error fetching complaint:', err);
      }
    };

    fetchComplaint();
  }, [id]);

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

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${API_URL}/complaints/${id}`);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Error deleting complaint:', err);
      setError('Failed to delete complaint. Please try again.');
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          component={Link}
          to="/"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Back to Complaints
        </Button>
      </Container>
    );
  }

  if (!complaint) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">Complaint not found</Alert>
        <Button
          component={Link}
          to="/"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Back to Complaints
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button
        component={Link}
        to="/"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Back to Complaints
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            Complaint Details
          </Typography>
          <Chip
            label={complaint.priority}
            color={getPriorityColor(complaint.priority)}
            size="medium"
            sx={{ height: 32, fontSize: '0.875rem' }}
          />
        </Box>

        <Box mb={4}>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            Submitted by
          </Typography>
          <Typography variant="h6" gutterBottom>
            {complaint.userName}
          </Typography>
        </Box>

        <Box mb={4}>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            Issue
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {complaint.issue}
          </Typography>
        </Box>

        <Box mb={4}>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            Status
          </Typography>
          <Chip 
            label={complaint.status || 'Open'} 
            color={complaint.status === 'Resolved' ? 'success' : 'default'}
            variant="outlined"
          />
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} pt={2} sx={{ borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="textSecondary">
            Created: {new Date(complaint.createdAt).toLocaleString()}
            {complaint.updatedAt !== complaint.createdAt && 
              ` • Updated: ${new Date(complaint.updatedAt).toLocaleString()}`}
          </Typography>
          
          <Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              component={Link}
              to={`/complaints/${id}/edit`}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleting && setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Complaint</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this complaint? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : null}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ComplaintDetails;
