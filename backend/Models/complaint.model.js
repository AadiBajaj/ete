import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true
  },
  issue: {
    type: String,
    required: true,
    trim: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low'
  }
},
{
  timestamps: true
}
);

export const Complaint = mongoose.model('Complaint', complaintSchema);
