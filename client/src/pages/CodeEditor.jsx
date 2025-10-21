import { useState } from 'react';
import Editor from '@monaco-editor/react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  BugReport,
  AutoFixHigh,
  Description,
  Send
} from '@mui/icons-material';
import API from '../utils/api';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' }
];

function CodeEditor() {
  const [code, setCode] = useState('// Write your code here\n\nfunction hello() {\n  console.log("Hello World");\n}');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Please write some code to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const response = await API.post('/code/analyze', {
        code,
        language
      });

      if (response.data.success) {
        setAnalysis(response.data.data.analysis);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze code');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'error',
      high: 'error',
      medium: 'warning',
      low: 'info'
    };
    return colors[severity] || 'default';
  };

  const getComplexityColor = (complexity) => {
    const colors = {
      low: 'success',
      medium: 'warning',
      high: 'error'
    };
    return colors[complexity] || 'default';
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          AI Code Assistant 🤖
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Analyze your code for bugs, get suggestions, and improve code quality
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left Panel - Code Editor */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Language</InputLabel>
                <Select
                  value={language}
                  label="Language"
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {LANGUAGES.map((lang) => (
                    <MenuItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                onClick={handleAnalyze}
                disabled={loading}
                fullWidth
              >
                {loading ? 'Analyzing...' : 'Analyze Code'}
              </Button>
            </Box>

            <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
              <Editor
                height="500px"
                language={language}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Right Panel - Analysis Results */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, minHeight: '580px' }}>
            <Typography variant="h6" gutterBottom>
              Analysis Results
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <CircularProgress />
              </Box>
            )}

            {!loading && !analysis && !error && (
              <Box sx={{ textAlign: 'center', color: 'text.secondary', mt: 10 }}>
                <BugReport sx={{ fontSize: 80, opacity: 0.3, mb: 2 }} />
                <Typography>
                  Write some code and click "Analyze Code" to get started
                </Typography>
              </Box>
            )}

            {analysis && (
              <Box>
                {/* Quality Score */}
                <Card sx={{ mb: 2, bgcolor: 'primary.light', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h3" align="center">
                      {analysis.qualityScore || 0}/100
                    </Typography>
                    <Typography variant="body2" align="center">
                      Code Quality Score
                    </Typography>
                  </CardContent>
                </Card>

                {/* Complexity */}
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={`Complexity: ${analysis.complexity || 'N/A'}`}
                    color={getComplexityColor(analysis.complexity)}
                    sx={{ mr: 1 }}
                  />
                </Box>

                {/* Bugs */}
                {analysis.bugs && analysis.bugs.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      <BugReport sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Bugs Found ({analysis.bugs.length})
                    </Typography>
                    <List>
                      {analysis.bugs.map((bug, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            bgcolor: 'background.paper',
                            mb: 1,
                            borderRadius: 1,
                            border: '1px solid #e0e0e0'
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                  label={bug.severity}
                                  color={getSeverityColor(bug.severity)}
                                  size="small"
                                />
                                {bug.line && <Chip label={`Line ${bug.line}`} size="small" />}
                              </Box>
                            }
                            secondary={
                              <>
                                <Typography variant="body2" component="span" display="block">
                                  {bug.message}
                                </Typography>
                                {bug.suggestion && (
                                  <Typography variant="caption" color="success.main" display="block">
                                    💡 {bug.suggestion}
                                  </Typography>
                                )}
                              </>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Suggestions */}
                {analysis.suggestions && analysis.suggestions.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      <AutoFixHigh sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Suggestions
                    </Typography>
                    <List>
                      {analysis.suggestions.map((suggestion, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={`• ${suggestion}`} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Security Issues */}
                {analysis.securityIssues && analysis.securityIssues.length > 0 && (
                  <Box>
                    <Typography variant="h6" gutterBottom color="error">
                      🔒 Security Issues
                    </Typography>
                    <List>
                      {analysis.securityIssues.map((issue, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={`• ${issue}`} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CodeEditor;
