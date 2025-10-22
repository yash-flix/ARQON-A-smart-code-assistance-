const { GoogleGenerativeAI } = require('@google/generative-ai');

//  Initialize Gemini AI only if API key is valid
let genAI, model;
const hasValidKey =
  process.env.GEMINI_API_KEY &&
  process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' 
 

if (hasValidKey) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: 'gemini-pro' });
} else {
  console.warn('⚠️  No valid Gemini API key found — using mock mode.');
}

class GeminiService {
  // MOCK ANALYSIS — Used when no valid API key
  getMockAnalysis(code, language) {
    console.log('⚠️  Using MOCK data - Add valid Gemini API key for real AI analysis');

    const bugs = [];
    const suggestions = [];
    let qualityScore = 85;
    const securityIssues = [];

    // Basic static code checks
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

    if (code.includes('==') && !code.includes('===')) {
      bugs.push({
        line: code.split('\n').findIndex(line => line.includes('==')) + 1,
        severity: 'low',
        message: 'Use of loose equality operator (==)',
        suggestion: 'Use === for type-safe comparisons'
      });
      qualityScore -= 5;
    }

    if (code.includes('console.log')) {
      suggestions.push('Remove console.log statements in production code');
      qualityScore -= 5;
    }

    if (code.includes('for') && code.includes('<=')) {
      bugs.push({
        line: code.split('\n').findIndex(line => line.includes('for') && line.includes('<=')) + 1,
        severity: 'high',
        message: 'Potential array index out of bounds in loop condition',
        suggestion: 'Use < instead of <= when iterating over array indices'
      });
      qualityScore -= 10;
    }

    if (language === 'javascript' && !code.includes('use strict')) {
      suggestions.push('Add "use strict" directive for stricter code validation');
    }

    if (bugs.length === 0) {
      suggestions.push('Code looks clean! No major issues detected');
    } else {
      suggestions.push('Fix the detected bugs to improve code quality');
      suggestions.push('Consider adding error handling and input validation');
    }

    const complexity =
      qualityScore > 80 ? 'low' : qualityScore > 60 ? 'medium' : 'high';

    return {
      bugs,
      qualityScore: Math.max(0, Math.min(100, qualityScore)),
      suggestions,
      complexity,
      securityIssues
    };
  }

  //  REAL AI ANALYSIS
  async analyzeCode(code, language = 'javascript') {
    if (!hasValidKey) return this.getMockAnalysis(code, language);

    try {
      console.log('🤖 Using Real Gemini AI for analysis...');

      const prompt = `
You are an expert code analyzer. Analyze the following ${language} code and provide:
1. List of bugs with severity (critical, high, medium, low)
2. Code quality score out of 100
3. Performance issues
4. Security vulnerabilities
5. Best practice suggestions

Code:
\`\`\`${language}
${code}
\`\`\`

Return ONLY valid JSON in this exact format:
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

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log('✅ Gemini AI response received');

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      console.warn('⚠️ Could not parse AI response, using mock data');
      return this.getMockAnalysis(code, language);
    } catch (error) {
      console.error('Gemini API Error:', error.message);
      return this.getMockAnalysis(code, language);
    }
  }

  //  FIX BUGS
  async fixBug(code, bugDescription, language = 'javascript') {
    if (!hasValidKey) {
      return {
        fixedCode: code,
        explanation: 'Add valid Gemini API key to enable AI-powered bug fixing',
        changes: ['Mock fix: Please configure Gemini API key']
      };
    }

    try {
      const prompt = `Fix this bug in ${language} code:

Bug: ${bugDescription}

Code:
\`\`\`${language}
${code}
\`\`\`

Provide:
1. Fixed code
2. Explanation of the fix
3. List of changes made

Return as JSON:
{
  "fixedCode": "...",
  "explanation": "...",
  "changes": ["change1"]
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);

      return {
        fixedCode: code,
        explanation: 'Unable to parse AI response',
        changes: []
      };
    } catch (error) {
      console.error('Gemini API Error:', error.message);
      return {
        fixedCode: code,
        explanation: 'Error calling Gemini API',
        changes: []
      };
    }
  }

  //  GENERATE DOCUMENTATION
  async generateDocs(code, language = 'javascript') {
    if (!hasValidKey) {
      return `/**
 * Mock Documentation
 * 
 * This is mock documentation generated without a valid Gemini API key.
 * Configure your API key in server/.env to enable AI-powered documentation.
 */`;
    }

    try {
      const prompt = `Generate comprehensive documentation for this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Include:
- Function/class descriptions
- Parameters and return values
- Usage examples
- Edge cases`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error.message);
      return '// Error generating documentation';
    }
  }
}

module.exports = new GeminiService();
