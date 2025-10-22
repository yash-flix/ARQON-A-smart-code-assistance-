const mongoose = require('mongoose');

const codeAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    default: 'javascript'
  },
  // ✅ Flatten the structure - remove nested 'analysis' object
  bugs: [{
    line: Number,
    severity: String,
    message: String,
    suggestion: String
  }],
  qualityScore: {
    type: Number,
    min: 0,
    max: 100
  },
  suggestions: [String],
  complexity: String,
  securityIssues: [String], // ✅ Added this field
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed' // ✅ Changed default
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CodeAnalysis', codeAnalysisSchema);
