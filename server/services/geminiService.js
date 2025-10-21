const { GoogleGenerativeAI } = require('@google/generative-ai');


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

class GeminiService {
  // Analyze code for bugs and issues
  async analyzeCode(code, language = 'javascript') {
    try {
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

Return the analysis in this JSON format:
{
  "bugs": [
    {
      "line": number,
      "severity": "critical|high|medium|low",
      "message": "description",
      "suggestion": "how to fix"
    }
  ],
  "qualityScore": number (0-100),
  "suggestions": ["suggestion 1", "suggestion 2"],
  "complexity": "low|medium|high",
  "securityIssues": ["issue 1", "issue 2"]
}
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to parse JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback if JSON parsing fails
      return {
        bugs: [],
        qualityScore: 75,
        suggestions: [text],
        complexity: 'medium',
        securityIssues: []
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to analyze code');
    }
  }

  // Fix bugs in code
  async fixBug(code, bugDescription, language = 'javascript') {
    try {
      const prompt = `
You are an expert programmer. Fix the following bug in this ${language} code:

Bug Description: ${bugDescription}

Original Code:
\`\`\`${language}
${code}
\`\`\`

Provide:
1. Fixed code
2. Explanation of the fix
3. Prevention tips

Return in JSON format:
{
  "fixedCode": "corrected code here",
  "explanation": "what was wrong and how it was fixed",
  "preventionTips": ["tip 1", "tip 2"]
}
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        fixedCode: code,
        explanation: text,
        preventionTips: []
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to fix bug');
    }
  }

  // Generate documentation
  async generateDocs(code, language = 'javascript') {
    try {
      const prompt = `
Generate comprehensive documentation for this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Include:
1. Function/class descriptions
2. Parameter explanations
3. Return value descriptions
4. Usage examples
5. Notes/warnings

Format as markdown.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate documentation');
    }
  }
}

module.exports = new GeminiService();
