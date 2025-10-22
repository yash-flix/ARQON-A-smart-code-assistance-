const groqService = require('../services/groqService');
const CodeAnalysis = require('../models/CodeAnalysis');

exports.analyzeCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Code is required' });
    }

    // Analyze code using Groq
    const analysis = await groqService.analyzeCode(code, language);

    // Save to database
    const codeAnalysis = new CodeAnalysis({
      userId: req.user._id, // ✅ Changed from 'user' to 'userId'
      code,
      language,
      ...analysis, // ✅ Spread analysis directly (not nested)
    });

    await codeAnalysis.save();

    res.json(analysis);
  } catch (error) {
    console.error('Code analysis error:', error);
    res.status(500).json({ message: 'Failed to analyze code' });
  }
};

// ... rest of the file stays the same
exports.fixBug = async (req, res) => {
  try {
    const { code, bugDescription, language } = req.body;

    const fix = await groqService.fixBug(code, bugDescription, language);

    res.json(fix);
  } catch (error) {
    console.error('Bug fix error:', error);
    res.status(500).json({ message: 'Failed to fix bug' });
  }
};

exports.generateDocs = async (req, res) => {
  try {
    const { code, language } = req.body;

    const docs = await groqService.generateDocs(code, language);

    res.json({ documentation: docs });
  } catch (error) {
    console.error('Documentation generation error:', error);
    res.status(500).json({ message: 'Failed to generate documentation' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const analyses = await CodeAnalysis.find({ userId: req.user._id }) // ✅ Changed from 'user' to 'userId'
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(analyses);
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch history' });
  }
};

exports.getAnalysis = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid analysis ID' });
    }

    const analysis = await CodeAnalysis.findById(id);

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    // Check if user owns this analysis
    if (analysis.userId.toString() !== req.user._id.toString()) { // ✅ Changed from 'user' to 'userId'
      return res.status(403).json({ message: 'Not authorized to view this analysis' });
    }

    res.json(analysis);
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ message: 'Failed to get analysis' });
  }
};
