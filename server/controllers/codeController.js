const CodeAnalysis = require('../models/CodeAnalysis');
const geminiService = require('../services/geminiService');
const User = require('../models/User');

// @desc    Analyze code for bugs and issues
// @route   POST /api/code/analyze
// @access  Private
exports.analyzeCode = async (req, res) => {
  try {
    const { code, language = 'javascript' } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Please provide code to analyze'
      });
    }

    // Call Gemini AI service
    const analysis = await geminiService.analyzeCode(code, language);

    // Save analysis to database
    const codeAnalysis = await CodeAnalysis.create({
      userId: req.user._id,
      code,
      language,
      analysis,
      status: 'completed'
    });

    // Update user API usage
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { apiUsageCount: 1 }
    });

    res.status(200).json({
      success: true,
      message: 'Code analysis completed',
      data: {
        analysisId: codeAnalysis._id,
        analysis,
        apiUsageCount: req.user.apiUsageCount + 1
      }
    });

  } catch (error) {
    console.error('Code analysis error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze code'
    });
  }
};

// @desc    Fix bug in code
// @route   POST /api/code/fix-bug
// @access  Private
exports.fixBug = async (req, res) => {
  try {
    const { code, bugDescription, language = 'javascript' } = req.body;

    if (!code || !bugDescription) {
      return res.status(400).json({
        success: false,
        message: 'Please provide code and bug description'
      });
    }

    // Call Gemini AI service
    const fixResult = await geminiService.fixBug(code, bugDescription, language);

    // Update user API usage
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { apiUsageCount: 1 }
    });

    res.status(200).json({
      success: true,
      message: 'Bug fix generated',
      data: fixResult
    });

  } catch (error) {
    console.error('Bug fix error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fix bug'
    });
  }
};

// @desc    Generate documentation for code
// @route   POST /api/code/generate-docs
// @access  Private
exports.generateDocs = async (req, res) => {
  try {
    const { code, language = 'javascript' } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Please provide code to document'
      });
    }

    // Call Gemini AI service
    const documentation = await geminiService.generateDocs(code, language);

    // Update user API usage
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { apiUsageCount: 1 }
    });

    res.status(200).json({
      success: true,
      message: 'Documentation generated',
      data: {
        documentation
      }
    });

  } catch (error) {
    console.error('Documentation generation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate documentation'
    });
  }
};

// @desc    Get user's code analysis history
// @route   GET /api/code/history
// @access  Private
exports.getHistory = async (req, res) => {
  try {
    const analyses = await CodeAnalysis.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('-code'); // Don't send full code in list

    res.status(200).json({
      success: true,
      count: analyses.length,
      data: analyses
    });

  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch history'
    });
  }
};

// @desc    Get specific analysis by ID
// @route   GET /api/code/analysis/:id
// @access  Private
exports.getAnalysis = async (req, res) => {
  try {
    const analysis = await CodeAnalysis.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }

    res.status(200).json({
      success: true,
      data: analysis
    });

  } catch (error) {
    console.error('Analysis fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analysis'
    });
  }
};
