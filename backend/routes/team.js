const express = require('express');
const Team = require('../models/Team');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get my team members
router.get('/my-team', auth, async (req, res) => {
  try {
    let team = await Team.findOne({ user: req.user._id }).populate('teamMembers');
    
    if (!team) {
      // Create empty team for user if doesn't exist
      team = new Team({ user: req.user._id, teamMembers: [] });
      await team.save();
    }
    
    res.json(team.teamMembers || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add member to my team (by email)
router.post('/my-team/add', auth, async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    const userToAdd = await User.findOne({ email }).select('-password');
    if (!userToAdd) {
      return res.status(404).json({ message: 'User not found with this email' });
    }
    
    // Can't add yourself
    if (userToAdd._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot add yourself to your team' });
    }
    
    // Get or create team
    let team = await Team.findOne({ user: req.user._id });
    if (!team) {
      team = new Team({ user: req.user._id, teamMembers: [] });
    }
    
    // Check if already in team
    const alreadyExists = team.teamMembers.some(
      memberId => memberId.toString() === userToAdd._id.toString()
    );
    
    if (alreadyExists) {
      return res.status(400).json({ message: 'User already in your team' });
    }
    
    // Add to team
    team.teamMembers.push(userToAdd._id);
    await team.save();
    await team.populate('teamMembers');
    
    res.json({ message: 'Team member added successfully', team: team.teamMembers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove member from my team
router.delete('/my-team/:userId', auth, async (req, res) => {
  try {
    const team = await Team.findOne({ user: req.user._id });
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    // Remove member
    team.teamMembers = team.teamMembers.filter(
      memberId => memberId.toString() !== req.params.userId
    );
    
    await team.save();
    await team.populate('teamMembers');
    
    res.json({ message: 'Team member removed', team: team.teamMembers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
