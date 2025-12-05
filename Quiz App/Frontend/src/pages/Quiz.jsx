import React, { useState, useEffect } from 'react';
import './styles/Quiz.css';

const examCategories = ['HTML', 'CSS', 'JavaScript', 'React'];
const EXAM_DURATION_MINUTES = 30;

const Quiz = () => {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'exam' | 'results' | 'history'
  const [selectedExam, setSelectedExam] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [studentId] = useState('STU' + Date.now().toString().slice(-6));
  const [myResults, setMyResults] = useState([]);

  // Load previous results from localStorage
  useEffect(() => {
    const allResults = JSON.parse(localStorage.getItem('examResults') || '[]');
    const mine = allResults.filter(r => r.studentId === studentId);
    setMyResults(mine);
  }, [studentId]);

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && examStarted && currentView === 'exam') {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    if (timeRemaining === 0 && examStarted && currentView === 'exam') {
      handleSubmitExam(true);
    }
  }, [timeRemaining, examStarted, currentView]); // eslint-disable-line react-hooks/exhaustive-deps

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Start exam - Load questions from localStorage
  const startExam = (exam) => {
    const savedQuestions = JSON.parse(localStorage.getItem('examQuestions') || '[]');
    const examQuestions = savedQuestions.filter(q => q.exam === exam);

    if (examQuestions.length === 0) {
      alert(`No questions found for ${exam}. Please contact the admin.`);
      return;
    }

    setSelectedExam(exam);
    setQuestions(examQuestions);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeRemaining(EXAM_DURATION_MINUTES * 60);
    setExamStarted(true);
    setCurrentView('exam');
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateScore = () => {
    let totalScore = 0;
    let maxScore = 0;

    questions.forEach(q => {
      maxScore += q.marks || 0;
      if (q.type === 'mcq' || q.type === 'truefalse') {
        if (answers[q.id] !== undefined && answers[q.id] === q.correctAnswer) {
          totalScore += q.marks || 0;
        }
      }
    });

    return { totalScore, maxScore };
  };

  // Submit exam - Save to localStorage
  const handleSubmitExam = (auto = false) => {
    if (!auto) {
      const ok = window.confirm('Submit the exam?');
      if (!ok) return;
    }

    const { totalScore, maxScore } = calculateScore();
    const percentage = maxScore > 0
      ? ((totalScore / maxScore) * 100).toFixed(1)
      : '0.0';

    const allResults = JSON.parse(localStorage.getItem('examResults') || '[]');
    const newResult = {
      id: Date.now(),
      studentId,
      testTitle: `${selectedExam} Examination`,
      category: selectedExam,
      score: totalScore,
      totalMarks: maxScore,
      percentage,
      submittedAt: new Date().toISOString(),
      answers,
      questionsCount: questions.length
    };

    const updatedResults = [...allResults, newResult];
    localStorage.setItem('examResults', JSON.stringify(updatedResults));
    setMyResults(prev => [...prev, newResult]);

    setScore(totalScore);
    setExamStarted(false);
    setCurrentView('results');
  };

  const goHome = () => {
    setCurrentView('home');
    setSelectedExam('');
    setQuestions([]);
    setAnswers({});
    setExamStarted(false);
    setTimeRemaining(0);
    setCurrentQuestion(0);
  };

  const viewHistory = () => {
    const allResults = JSON.parse(localStorage.getItem('examResults') || '[]');
    const mine = allResults.filter(r => r.studentId === studentId);
    setMyResults(mine);
    setCurrentView('history');
  };

  const getQuestionStatus = (index) => {
    const q = questions[index];
    if (answers[q.id] !== undefined && answers[q.id] !== '') {
      return 'answered';
    }
    return 'unanswered';
  };

  // ==================== HOME VIEW ====================
  if (currentView === 'home') {
    const savedQuestions = JSON.parse(localStorage.getItem('examQuestions') || '[]');

    return (
      <div className="quiz-container">
        <div className="quiz-header-home">
          <h1>Online Examination Portal</h1>
          <p>Select an exam to begin your test</p>
          <div className="student-info-header">
            <span className="student-id-display">Student ID: {studentId}</span>
            <button onClick={viewHistory} className="history-btn">
              View My Results
            </button>
          </div>
        </div>

        <div className="exam-selection-grid">
          {examCategories.map(exam => {
            const examQuestions = savedQuestions.filter(q => q.exam === exam);
            const totalMarks = examQuestions.reduce((sum, q) => sum + (q.marks || 0), 0);

            return (
              <div key={exam} className="exam-card-student">
                <div className="exam-card-icon">
                  {exam === 'HTML' && '🌐'}
                  {exam === 'CSS' && '🎨'}
                  {exam === 'JavaScript' && '⚡'}
                  {exam === 'React' && '⚛️'}
                </div>
                <h3>{exam}</h3>
                <div className="exam-info-grid">
                  <div className="info-item">
                    <span className="info-label">Questions</span>
                    <span className="info-value">{examQuestions.length}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Duration</span>
                    <span className="info-value">{EXAM_DURATION_MINUTES} min</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Total Marks</span>
                    <span className="info-value">{totalMarks}</span>
                  </div>
                </div>
                <button
                  onClick={() => startExam(exam)}
                  className="start-exam-btn"
                  disabled={examQuestions.length === 0}
                >
                  {examQuestions.length === 0 ? 'No Questions Available' : 'Start Exam →'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ==================== HISTORY VIEW ====================
  if (currentView === 'history') {
    return (
      <div className="quiz-container">
        <div className="history-header">
          <button onClick={goHome} className="back-home-btn">
            ← Back to Exams
          </button>
          <h1>My Examination History</h1>
          <p>Student ID: {studentId}</p>
        </div>

        <div className="history-content">
          {myResults.length === 0 ? (
            <div className="empty-history">
              <div className="empty-icon">📋</div>
              <h3>No Exam History</h3>
              <p>You haven't taken any exams yet. Start your first exam!</p>
              <button onClick={goHome} className="start-exam-btn">
                Go to Exams
              </button>
            </div>
          ) : (
            <div className="history-grid">
              {myResults
                .slice()
                .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
                .map(result => (
                  <div key={result.id} className="history-card">
                    <div className="history-card-header">
                      <h3>{result.category}</h3>
                      <span className={`status-badge ${parseFloat(result.percentage) >= 50 ? 'passed' : 'failed'}`}>
                        {parseFloat(result.percentage) >= 50 ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                    <div className="history-stats">
                      <div className="stat-row">
                        <span className="stat-label">Score:</span>
                        <span className="stat-value">{result.score} / {result.totalMarks}</span>
                      </div>
                      <div className="stat-row">
                        <span className="stat-label">Percentage:</span>
                        <span className={`stat-value ${parseFloat(result.percentage) >= 50 ? 'pass-color' : 'fail-color'}`}>
                          {result.percentage}%
                        </span>
                      </div>
                      <div className="stat-row">
                        <span className="stat-label">Questions:</span>
                        <span className="stat-value">{result.questionsCount}</span>
                      </div>
                      <div className="stat-row">
                        <span className="stat-label">Date:</span>
                        <span className="stat-value date-text">
                          {new Date(result.submittedAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="stat-row">
                        <span className="stat-label">Time:</span>
                        <span className="stat-value date-text">
                          {new Date(result.submittedAt).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==================== RESULTS VIEW ====================
  if (currentView === 'results') {
    const { maxScore } = calculateScore();
    const percentage = maxScore > 0 ? ((score / maxScore) * 100).toFixed(1) : '0.0';

    return (
      <div className="quiz-container">
        <div className="results-view">
          <div className="results-card-final">
            <div className="results-icon-success">✓</div>
            <h1>Exam Completed!</h1>
            <h2>{selectedExam} Examination</h2>

            <div className="final-score-display">
              <div className="score-circle-large">
                <svg width="200" height="200" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="rgba(71, 85, 105, 0.3)"
                    strokeWidth="12"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke={parseFloat(percentage) >= 70 ? '#22c55e' : '#ef4444'}
                    strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 90}`}
                    strokeDashoffset={`${2 * Math.PI * 90 * (1 - percentage / 100)}`}
                    strokeLinecap="round"
                    transform="rotate(-90 100 100)"
                  />
                  <text x="100" y="95" textAnchor="middle" fill="#e2e8f0" fontSize="40" fontWeight="700">
                    {percentage}%
                  </text>
                  <text x="100" y="120" textAnchor="middle" fill="#94a3b8" fontSize="16">
                    {score} / {maxScore}
                  </text>
                </svg>
              </div>
            </div>

            <div className="result-status">
              <span className={`result-badge ${parseFloat(percentage) >= 50 ? 'passed' : 'failed'}`}>
                {parseFloat(percentage) >= 50 ? 'Passed' : 'Failed'}
              </span>
            </div>

            <div className="results-summary">
              <div className="summary-item">
                <span className="summary-label">Total Questions</span>
                <span className="summary-value">{questions.length}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Answered</span>
                <span className="summary-value">{Object.keys(answers).length}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Your Score</span>
                <span className="summary-value">{score}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Passing Score</span>
                <span className="summary-value">{Math.ceil(maxScore * 0.7)}</span>
              </div>
            </div>

            <div className="results-actions">
              <button onClick={goHome} className="btn-primary-large">
                Take Another Exam
              </button>
              <button onClick={viewHistory} className="btn-secondary-large">
                View My History
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== EXAM VIEW ====================
  const currentQ = questions[currentQuestion];

  return (
    <div className="quiz-container">
      <div className="exam-header">
        <div className="exam-title-section">
          <h2>{selectedExam} Examination</h2>
          <span className="student-id-exam">Student ID: {studentId}</span>
        </div>
        <div className={`timer-display ${timeRemaining <= 300 ? 'warning' : ''}`}>
          <span className="timer-icon">⏰</span>
          <span className="timer-text">{formatTime(timeRemaining)}</span>
          {timeRemaining <= 300 && <span className="timer-warning">Time Running Out!</span>}
        </div>
      </div>

      <div className="exam-content">
        <div className="question-navigator-panel">
          <h3>Questions</h3>
          <div className="question-nav-grid">
            {questions.map((q, index) => (
              <button
                key={q.id}
                className={`nav-btn ${index === currentQuestion ? 'active' : ''} ${getQuestionStatus(index)}`}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button onClick={() => handleSubmitExam(false)} className="submit-exam-btn">
            Submit Exam
          </button>
        </div>

        <div className="question-display-panel">
          <div className="question-info-bar">
            <div className="question-meta-tags">
              <span className={`type-badge ${currentQ.type}`}>
                {currentQ.type === 'mcq' ? 'Multiple Choice' : currentQ.type === 'truefalse' ? 'True / False' : 'Coding'}
              </span>
              <span className={`difficulty-badge ${currentQ.difficulty}`}>
                {currentQ.difficulty}
              </span>
              <span className="marks-badge">
                {currentQ.marks} mark{currentQ.marks > 1 ? 's' : ''}
              </span>
            </div>
            <span className="question-counter">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>

          <div className="question-text-section">
            <h3 className="question-text">{currentQ.question}</h3>
          </div>

          <div className="answer-section">
            {currentQ.type === 'mcq' && (
              <div className="options-container">
                {currentQ.options.map((opt, idx) => (
                  <label key={idx} className="option-label">
                    <input
                      type="radio"
                      name={`q-${currentQ.id}`}
                      value={idx}
                      checked={answers[currentQ.id] === idx}
                      onChange={() => handleAnswerChange(currentQ.id, idx)}
                    />
                    <span className="option-text">
                      <span className="option-letter">{String.fromCharCode(65 + idx)}.</span>
                      {opt}
                    </span>
                    <span className="radio-custom" />
                  </label>
                ))}
              </div>
            )}

            {currentQ.type === 'truefalse' && (
              <div className="options-container">
                <label className="option-label">
                  <input
                    type="radio"
                    name={`q-${currentQ.id}`}
                    value="true"
                    checked={answers[currentQ.id] === 'true'}
                    onChange={() => handleAnswerChange(currentQ.id, 'true')}
                  />
                  <span className="option-text">True</span>
                  <span className="radio-custom" />
                </label>
                <label className="option-label">
                  <input
                    type="radio"
                    name={`q-${currentQ.id}`}
                    value="false"
                    checked={answers[currentQ.id] === 'false'}
                    onChange={() => handleAnswerChange(currentQ.id, 'false')}
                  />
                  <span className="option-text">False</span>
                  <span className="radio-custom" />
                </label>
              </div>
            )}

            {currentQ.type === 'coding' && (
              <div className="code-editor-section">
                <div className="code-editor-header">
                  <span>Code Editor</span>
                  <span className="code-hint">Write your solution below</span>
                </div>
                <textarea
                  className="code-textarea"
                  placeholder={currentQ.code || '// Write your code here...'}
                  value={answers[currentQ.id] || ''}
                  onChange={e => handleAnswerChange(currentQ.id, e.target.value)}
                  rows="10"
                />
              </div>
            )}
          </div>

          <div className="navigation-buttons">
            <button
              className="nav-button prev"
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
            >
              ← Previous
            </button>

            {currentQuestion < questions.length - 1 ? (
              <button
                className="nav-button next"
                onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
              >
                Next →
              </button>
            ) : (
              <button className="nav-button submit" onClick={() => handleSubmitExam(false)}>
                Submit Exam
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;