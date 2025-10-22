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
    ai: process.env.GROQ_API_KEY ? 'Groq AI Configured' : 'No AI API Key'
  });
});

// Quick Groq test route
app.post('/api/test-ai', async (req, res) => {
  try {
    const Groq = require('groq-sdk');
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
    
    const prompt = req.body.prompt || 'Say hello!';
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
    });
    
    res.json({
      success: true,
      response: completion.choices[0]?.message?.content
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

// 404 handler
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

  // Check Groq API key
  if (!process.env.GROQ_API_KEY) {
    console.log('⚠️  Warning: Groq API key not configured');
    console.log('📝 Get your free key from: https://console.groq.com/keys');
  } else {
    console.log('✅ Groq AI configured');
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
