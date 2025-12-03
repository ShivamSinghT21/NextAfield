import React, { useEffect, useState } from 'react';
import './Quelist.css';

const Quelist = ({ category }) => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("quizQuestions")) || [];
    const filtered = stored.filter(q => q.category === category);
    setQuestions(filtered);
  }, [category]);

  const handleDelete = (indexToDelete) => {
    const allQuestions = JSON.parse(localStorage.getItem("quizQuestions")) || [];

    const updated = allQuestions.filter((_, i) => i !== indexToDelete);

    localStorage.setItem("quizQuestions", JSON.stringify(updated));

    const filtered = updated.filter(q => q.category === category);
    setQuestions(filtered);
  };

  return (
    <div className="quelist">
      <h3>{category} Questions</h3>

      {questions.length === 0 ? (
        <p className="empty">No questions added for this category.</p>
      ) : (
        questions.map((q, index) => (
          <div className="question-card" key={index}>
            
            <div className="q-header">
              <h4>Q{index + 1}. {q.question}</h4>
              <button
                className="delete-btn"
                onClick={() => handleDelete(index)}
              >
                Delete
              </button>
            </div>

            <ul>
              {q.options.map((opt, i) => (
                <li key={i}>{opt}</li>
              ))}
            </ul>

            <p className="answer">Correct: {q.answer}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Quelist;
