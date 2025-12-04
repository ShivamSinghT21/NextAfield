import React, { useState, useEffect } from 'react';
import './styles/Admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('results');
  const [selectedExam, setSelectedExam] = useState('');
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [questionType, setQuestionType] = useState('mcq');
  const [results, setResults] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    code: '',
    difficulty: 'medium',
    marks: 1,
    exam: ''
  });

  const examCategories = ['HTML', 'CSS', 'JavaScript', 'React'];

  // Load data from localStorage on mount
  useEffect(() => {
    const savedResults = localStorage.getItem('examResults');
    const savedQuestions = localStorage.getItem('examQuestions');

    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    }
  }, []);

  // Refresh results when switching to results tab
  useEffect(() => {
    if (activeTab === 'results') {
      const savedResults = localStorage.getItem('examResults');
      if (savedResults) {
        setResults(JSON.parse(savedResults));
      }
    }
  }, [activeTab]);

  // Save questions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('examQuestions', JSON.stringify(questions));
  }, [questions]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newQuestion = {
      id: Date.now(),
      type: questionType,
      exam: selectedExam,
      ...formData,
      createdAt: new Date().toISOString()
    };
    setQuestions([...questions, newQuestion]);

    // Reset form
    setFormData({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      code: '',
      difficulty: 'medium',
      marks: 1,
      exam: selectedExam
    });
    setShowAddQuestion(false);
    alert('Question added successfully!');
  };

  const deleteQuestion = (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const deleteResult = (id) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      const updatedResults = results.filter(r => r.id !== id);
      setResults(updatedResults);
      localStorage.setItem('examResults', JSON.stringify(updatedResults));
    }
  };

  const clearAllResults = () => {
    if (window.confirm('Are you sure you want to clear all results? This action cannot be undone.')) {
      setResults([]);
      localStorage.setItem('examResults', JSON.stringify([]));
    }
  };

  const exportResults = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `exam-results-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  // Calculate statistics
  const calculateStats = () => {
    if (results.length === 0) return null;

    const totalStudents = results.length;
    const avgScore = (results.reduce((sum, r) => sum + parseFloat(r.percentage), 0) / totalStudents).toFixed(1);
    const passCount = results.filter(r => parseFloat(r.percentage) >= 70).length;
    const passRate = ((passCount / totalStudents) * 100).toFixed(1);

    return { totalStudents, avgScore, passCount, passRate };
  };

  const stats = calculateStats();

  // Filter questions by selected exam
  const filteredQuestions = selectedExam
    ? questions.filter(q => q.exam === selectedExam)
    : [];

  // Handle exam selection
  const handleExamSelect = (exam) => {
    setSelectedExam(exam);
    setShowAddQuestion(false);
  };

  // Go back to exam selection
  const backToExamSelection = () => {
    setSelectedExam('');
    setShowAddQuestion(false);
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage examination results and questions</p>
      </div>

      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          📊 Results
          {results.length > 0 && <span className="tab-badge">{results.length}</span>}
        </button>
        <button
          className={`tab-btn ${activeTab === 'exams' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('exams');
            setSelectedExam('');
            setShowAddQuestion(false);
          }}
        >
          📝 Exams & Questions
        </button>
      </div>

      {/* RESULTS TAB */}
      {activeTab === 'results' && (
        <div className="admin-content single-column">
          <div className="results-management-card">
            <div className="results-header-section">
              <div>
                <h2>Student Results & Marks</h2>
                <p className="results-subtitle">View and manage examination results</p>
              </div>
              <div className="results-actions-header">
                {results.length > 0 && (
                  <>
                    <button onClick={exportResults} className="export-btn">
                      📥 Export Results
                    </button>
                    <button onClick={clearAllResults} className="clear-btn">
                      🗑️ Clear All
                    </button>
                  </>
                )}
              </div>
            </div>

            {stats && (
              <div className="stats-overview">
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-content">
                    <div className="stat-title">Total Students</div>
                    <div className="stat-number">{stats.totalStudents}</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-content">
                    <div className="stat-title">Average Score</div>
                    <div className="stat-number">{stats.avgScore}%</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-content">
                    <div className="stat-title">Pass Rate</div>
                    <div className="stat-number">{stats.passRate}%</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🎯</div>
                  <div className="stat-content">
                    <div className="stat-title">Passed Students</div>
                    <div className="stat-number">{stats.passCount}/{stats.totalStudents}</div>
                  </div>
                </div>
              </div>
            )}

            {results.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3>No Results Yet</h3>
                <p>Student exam results will appear here once they complete their tests.</p>
              </div>
            ) : (
              <div className="results-table-container">
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Test Name</th>
                      <th>Category</th>
                      <th>Score</th>
                      <th>Percentage</th>
                      <th>Status</th>
                      <th>Submitted At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)).map((result) => (
                      <tr key={result.id}>
                        <td className="student-id-cell">{result.studentId}</td>
                        <td className="test-title-cell">{result.testTitle}</td>
                        <td>
                          <span className="category-badge">{result.category}</span>
                        </td>
                        <td className="score-cell">
                          <strong>{result.score}</strong> / {result.totalMarks}
                        </td>
                        <td className="percentage-cell">
                          <span className={`percentage-badge ${
                            parseFloat(result.percentage) >= 70 ? 'pass' : 
                            parseFloat(result.percentage) >= 40 ? 'average' : 'fail'
                          }`}>
                            {result.percentage}%
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${
                            parseFloat(result.percentage) >= 70 ? 'passed' : 'failed'
                          }`}>
                            {parseFloat(result.percentage) >= 70 ? 'Passed' : 'Failed'}
                          </span>
                        </td>
                        <td className="date-cell">
                          {new Date(result.submittedAt).toLocaleString('en-IN', {
                            dateStyle: 'short',
                            timeStyle: 'short'
                          })}
                        </td>
                        <td>
                          <button
                            onClick={() => deleteResult(result.id)}
                            className="delete-result-btn"
                            title="Delete Result"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* EXAMS TAB */}
      {activeTab === 'exams' && (
        <div className="admin-content single-column">
          {!selectedExam ? (
            // Exam Selection Screen
            <div className="exam-selection-card">
              <h2>Select Exam Category</h2>
              <p className="exam-subtitle">Choose an exam to manage its questions</p>

              <div className="exam-grid">
                {examCategories.map((exam) => {
                  const examQuestions = questions.filter(q => q.exam === exam);
                  return (
                    <div
                      key={exam}
                      className="exam-card"
                      onClick={() => handleExamSelect(exam)}
                    >
                      <div className="exam-icon">
                        {exam === 'HTML' && '🌐'}
                        {exam === 'CSS' && '🎨'}
                        {exam === 'JavaScript' && '⚡'}
                        {exam === 'React' && '⚛️'}
                      </div>
                      <h3>{exam}</h3>
                      <div className="exam-stats">
                        <span className="question-count">{examQuestions.length} Questions</span>
                      </div>
                      <button className="manage-btn">Manage Questions →</button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // Question Bank Screen
            <div className="question-bank-card">
              <div className="question-bank-header">
                <div>
                  <button onClick={backToExamSelection} className="back-btn">
                    ← Back to Exams
                  </button>
                  <h2>{selectedExam} - Question Bank</h2>
                  <p className="bank-subtitle">{filteredQuestions.length} questions available</p>
                </div>
                <button
                  onClick={() => setShowAddQuestion(!showAddQuestion)}
                  className="add-question-btn"
                >
                  {showAddQuestion ? '✕ Cancel' : '+ Add Question'}
                </button>
              </div>

              {/* Add Question Form */}
              {showAddQuestion && (
                <div className="add-question-form">
                  <h3>Add New Question</h3>

                  <div className="question-type-selector">
                    <button
                      className={`type-btn ${questionType === 'mcq' ? 'active' : ''}`}
                      onClick={() => setQuestionType('mcq')}
                    >
                      Multiple Choice
                    </button>
                    <button
                      className={`type-btn ${questionType === 'truefalse' ? 'active' : ''}`}
                      onClick={() => setQuestionType('truefalse')}
                    >
                      True/False
                    </button>
                    <button
                      className={`type-btn ${questionType === 'coding' ? 'active' : ''}`}
                      onClick={() => setQuestionType('coding')}
                    >
                      Coding
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="question-form">
                    <div className="form-group">
                      <label>Question *</label>
                      <textarea
                        name="question"
                        value={formData.question}
                        onChange={handleInputChange}
                        placeholder="Enter your question here..."
                        required
                        rows="3"
                      />
                    </div>

                    {questionType === 'mcq' && (
                      <>
                        <div className="form-group">
                          <label>Options *</label>
                          {formData.options.map((option, index) => (
                            <input
                              key={index}
                              type="text"
                              value={option}
                              onChange={(e) => handleOptionChange(index, e.target.value)}
                              placeholder={`Option ${index + 1}`}
                              required
                            />
                          ))}
                        </div>
                        <div className="form-group">
                          <label>Correct Answer *</label>
                          <select
                            name="correctAnswer"
                            value={formData.correctAnswer}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Select correct option</option>
                            {formData.options.map((option, index) => (
                              <option key={index} value={index}>Option {index + 1}</option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}

                    {questionType === 'truefalse' && (
                      <div className="form-group">
                        <label>Correct Answer *</label>
                        <select
                          name="correctAnswer"
                          value={formData.correctAnswer}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select answer</option>
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      </div>
                    )}

                    {questionType === 'coding' && (
                      <div className="form-group">
                        <label>Sample Code Template</label>
                        <textarea
                          name="code"
                          value={formData.code}
                          onChange={handleInputChange}
                          placeholder="// Enter starter code template..."
                          rows="5"
                        />
                      </div>
                    )}

                    <div className="form-row">
                      <div className="form-group">
                        <label>Difficulty *</label>
                        <select
                          name="difficulty"
                          value={formData.difficulty}
                          onChange={handleInputChange}
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Marks *</label>
                        <input
                          type="number"
                          name="marks"
                          value={formData.marks}
                          onChange={handleInputChange}
                          min="1"
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" className="submit-btn">Add Question</button>
                  </form>
                </div>
              )}

              {/* Questions List */}
              <div className="questions-list-section">
                {filteredQuestions.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <h3>No Questions Yet</h3>
                    <p>Click "Add Question" to create your first {selectedExam} question!</p>
                  </div>
                ) : (
                  <div className="questions-list">
                    {filteredQuestions.map((q, index) => (
                      <div key={q.id} className="question-item">
                        <div className="question-number">Q{index + 1}</div>
                        <div className="question-content">
                          <div className="question-header">
                            <span className={`question-type-badge ${q.type}`}>
                              {q.type === 'mcq' ? 'MCQ' : q.type === 'truefalse' ? 'T/F' : 'Coding'}
                            </span>
                            <span className={`difficulty-badge ${q.difficulty}`}>{q.difficulty}</span>
                            <span className="marks-badge">{q.marks} marks</span>
                          </div>
                          <p className="question-text">{q.question}</p>

                          {q.type === 'mcq' && q.options && (
                            <div className="question-options">
                              {q.options.map((opt, idx) => (
                                <div key={idx} className={`option ${idx == q.correctAnswer ? 'correct' : ''}`}>
                                  <span className="option-label">{String.fromCharCode(65 + idx)}.</span>
                                  <span>{opt}</span>
                                  {idx == q.correctAnswer && <span className="correct-mark">✓</span>}
                                </div>
                              ))}
                            </div>
                          )}

                          {q.type === 'truefalse' && (
                            <div className="question-options">
                              <div className={`option ${q.correctAnswer === 'true' ? 'correct' : ''}`}>
                                True {q.correctAnswer === 'true' && <span className="correct-mark">✓</span>}
                              </div>
                              <div className={`option ${q.correctAnswer === 'false' ? 'correct' : ''}`}>
                                False {q.correctAnswer === 'false' && <span className="correct-mark">✓</span>}
                              </div>
                            </div>
                          )}
                        </div>
                        <button onClick={() => deleteQuestion(q.id)} className="delete-btn">
                          🗑️ Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;