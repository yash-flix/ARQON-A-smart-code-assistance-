require('dotenv').config();
const Groq = require('groq-sdk');

async function testGroq() {
  try {
    console.log('Testing Groq API...\n');
    
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Say hello in 5 words"
        }
      ],
      model: "llama-3.3-70b-versatile", // ✅ Updated model name
    });

    console.log('✅ SUCCESS! Groq API is working!');
    console.log('Response:', completion.choices[0]?.message?.content);
    console.log('\n🎉 Your code assistant is ready with Groq AI!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGroq();
