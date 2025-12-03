import React, { useState } from 'react';
import './Quefrom.css';

const Queform = ({ category }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!question.trim() || options.some(opt => !opt.trim()) || !correctAnswer.trim()) {
      alert('Please fill all fields');
      return;
    }

    const newQuestion = {
      category,
      question,
      options,
      answer: correctAnswer
    };

    const stored = JSON.parse(localStorage.getItem("quizQuestions")) || [];
    localStorage.setItem("quizQuestions", JSON.stringify([...stored, newQuestion]));

    alert(`Question added to ${category} ✅`);

    setQuestion('');
    setOptions(['', '', '', '']);
    setCorrectAnswer('');
  };

  return (
    <div className="queform">
      <h3 className="form-title">Add {category} Question</h3>

      <form className="que-form" onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Write the question here"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <div className="options">
          {options.map((opt, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Option ${index + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(index, e.target.value)}
            />
          ))}
        </div>

        <input
          type="text"
          placeholder="Correct answer"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
        />

        <button type="submit">Add Question</button>
      </form>
    </div>
  );
};

export default Queform;
