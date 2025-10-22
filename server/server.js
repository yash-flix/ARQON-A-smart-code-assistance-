const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');  
const codeRoutes = require('./routes/codeRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Test route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running!', 
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    ai: process.env.GEMINI_API_KEY ? 'Gemini API Configured' : 'No AI API Key'
  });
});

// Quick Gemini test route
app.post('/api/test-ai', async (req, res) => {
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = req.body.prompt || 'Say hello!';
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    res.json({
      success: true,
      response: response.text()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);  
app.use('/api/code', codeRoutes);

// 404 handler (optional but good practice)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`
  });
});

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI.replace('localhost', '127.0.0.1');
    
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, 
    });
    
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Server will continue without database connection');
    console.log('💡 Make sure MongoDB is running on your system');
    console.log('   Run: net start MongoDB (Windows)');
  }
};

// Start server function
const startServer = async () => {
  // Connect to database
  await connectDB();

  // Check Gemini API key
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.log('⚠️  Warning: Gemini API key not configured');
    console.log('📝 Get your free key from: https://makersuite.google.com/app/apikey');
  } else {
    console.log('✅ Gemini API configured');
  }

  // Start Express server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log('');
    console.log('🚀 ========================================');
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    console.log('🚀 ========================================');
    console.log('');
  });
};

// Error handling
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
});

startServer();
