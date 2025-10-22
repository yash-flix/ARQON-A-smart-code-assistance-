require('dotenv').config()
const Groq = require('groq-sdk');

// Check if API key exists before initializing
let groq = null;
const hasValidKey = process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.startsWith('gsk_');

if (hasValidKey) {
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });
  console.log('✅ Groq API initialized');
} else {
  console.log('⚠️  No valid Groq API key found — using mock mode.');
}

class GroqService {
  async analyzeCode(code, language = 'javascript') {
    // If no valid API key, use mock data immediately
    if (!hasValidKey || !groq) {
      console.log('⚠️  Using mock analysis (no Groq API key)');
      return this.getMockAnalysis(code, language);
    }

    try {
      console.log('🚀 Using Groq AI (Llama 3.3) for analysis...');
      
      const prompt = `You are an expert code analyzer. Analyze the following ${language} code and provide:
1. List of bugs with severity (critical, high, medium, low)
2. Code quality score out of 100
3. Performance issues
4. Security vulnerabilities
5. Best practice suggestions

Code:
\`\`\`${language}
${code}
\`\`\`

Return ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "bugs": [
    {
      "line": 1,
      "severity": "high",
      "message": "description",
      "suggestion": "how to fix"
    }
  ],
  "qualityScore": 75,
  "suggestions": ["suggestion 1", "suggestion 2"],
  "complexity": "medium",
  "securityIssues": ["issue 1"]
}`;

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
        max_tokens: 2000,
      });

      const responseText = completion.choices[0]?.message?.content || '{}';
      console.log('✅ Groq AI response received');
      
      // Clean up response (remove markdown if present)
      const cleanedText = responseText.replace(/``````\n?/g, '').trim();
      
      // Parse JSON
      const analysis = JSON.parse(cleanedText);
      
      return analysis;
      
    } catch (error) {
      console.error('Groq API Error:', error.message);
      
      // Fallback to mock data
      return this.getMockAnalysis(code, language);
    }
  }

  getMockAnalysis(code, language) {
    console.log('⚠️  Using mock data fallback');
    
    const bugs = [];
    const suggestions = [];
    let qualityScore = 85;
    const securityIssues = [];

    if (code.includes('var ')) {
      bugs.push({
        line: code.split('\n').findIndex(line => line.includes('var ')) + 1,
        severity: 'medium',
        message: 'Use of "var" keyword instead of "let" or "const"',
        suggestion: 'Replace "var" with "let" or "const" for better scoping'
      });
      qualityScore -= 5;
    }

    if (code.toLowerCase().includes('password')) {
      bugs.push({
        line: code.split('\n').findIndex(line => line.toLowerCase().includes('password')) + 1,
        severity: 'critical',
        message: 'Potential hardcoded password detected',
        suggestion: 'Use environment variables for sensitive data'
      });
      securityIssues.push('Hardcoded sensitive information detected');
      qualityScore -= 15;
    }

    if (code.includes('console.log')) {
      suggestions.push('Remove console.log statements in production code');
      qualityScore -= 5;
    }

    if (code.includes('for') && code.includes('<=')) {
      bugs.push({
        line: code.split('\n').findIndex(line => line.includes('for') && line.includes('<=')) + 1,
        severity: 'high',
        message: 'Potential array index out of bounds',
        suggestion: 'Use < instead of <= in array loops'
      });
      qualityScore -= 10;
    }

    if (bugs.length === 0) {
      suggestions.push('Code looks clean! Consider adding error handling');
    }

    const complexity = qualityScore > 80 ? 'low' : qualityScore > 60 ? 'medium' : 'high';

    return {
      bugs,
      qualityScore: Math.max(0, Math.min(100, qualityScore)),
      suggestions,
      complexity,
      securityIssues
    };
  }

  async fixBug(code, bugDescription, language = 'javascript') {
    if (!hasValidKey || !groq) {
      return {
        fixedCode: code,
        explanation: 'Groq API key not configured',
        changes: []
      };
    }

    try {
      const prompt = `Fix this bug in ${language} code:

Bug: ${bugDescription}

Code:
\`\`\`${language}
${code}
\`\`\`

Provide fixed code, explanation, and changes. Return as JSON:
{"fixedCode": "...", "explanation": "...", "changes": ["change1"]}`;

      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
        max_tokens: 2000,
      });

      const responseText = completion.choices[0]?.message?.content || '{}';
      const cleanedText = responseText.replace(/``````\n?/g, '').trim();
      
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('Groq API Error:', error);
      return {
        fixedCode: code,
        explanation: 'Error calling Groq API',
        changes: []
      };
    }
  }

  async generateDocs(code, language = 'javascript') {
    if (!hasValidKey || !groq) {
      return '// Groq API key not configured';
    }

    try {
      const prompt = `Generate comprehensive documentation for this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Include function descriptions, parameters, return values, and usage examples.`;

      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.5,
        max_tokens: 1500,
      });

      return completion.choices[0]?.message?.content || '// Documentation unavailable';
    } catch (error) {
      console.error('Groq API Error:', error);
      return '// Error generating documentation';
    }
  }
}

module.exports = new GroqService();
