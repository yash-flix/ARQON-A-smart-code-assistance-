require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.GEMINI_API_KEY;

async function testGemini() {
  try {
    console.log('Testing Gemini API...');
    console.log('API Key:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'NOT FOUND');
    
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const result = await model.generateContent('Say hello in 3 words');
    const response = await result.response;
    
    console.log('\n✅ SUCCESS! Gemini API is working!');
    console.log('Response:', response.text());
    console.log('\n🎉 You can now use real AI in your app!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.message.includes('API key not valid')) {
      console.log('\n💡 The API key might be wrong or needs time to activate (wait 2-3 minutes)');
    }
  }
}

testGemini();