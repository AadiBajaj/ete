import { Complaint } from '../models/complaint.model.js';

export const createComplaint = async (req, res) => {
  try {
    const { userName, issue, priority } = req.body;
    const newComplaint = new Complaint({ userName, issue, priority });
    await newComplaint.save();
    res.status(201).json(newComplaint);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ timestamp: -1 });
    res.status(200).json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
    res.status(200).json(complaint);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateComplaint = async (req, res) => {
  try {
    const { userName, issue, priority } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { userName, issue, priority },
      { new: true, runValidators: true }
    );
    if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
    res.status(200).json(complaint);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
    res.status(200).json({ message: 'Complaint deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
