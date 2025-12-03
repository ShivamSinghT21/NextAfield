import React, { useEffect, useState } from "react";
import "./styles/admin.css";

const Admin = () => {
  const categories = ["HTML", "CSS", "JavaScript", "React"];

  const [activeCategory, setActiveCategory] = useState("HTML");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState("");
  const [questions, setQuestions] = useState([]);

  // Load questions on mount & when category changes
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("quizQuestions")) || [];
    const filtered = stored.filter(q => q.category === activeCategory);
    setQuestions(filtered);
  }, [activeCategory]);

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();

    if (!question.trim() || options.some(opt => !opt.trim()) || !answer.trim()) {
      alert("Please fill all fields");
      return;
    }

    const newQuestion = {
      category: activeCategory,
      question,
      options,
      answer
    };

    const stored = JSON.parse(localStorage.getItem("quizQuestions")) || [];
    const updated = [...stored, newQuestion];

    localStorage.setItem("quizQuestions", JSON.stringify(updated));

    const filtered = updated.filter(q => q.category === activeCategory);
    setQuestions(filtered);

    setQuestion("");
    setOptions(["", "", "", ""]);
    setAnswer("");
  };

  const handleDelete = (index) => {
    const all = JSON.parse(localStorage.getItem("quizQuestions")) || [];

    const updatedAll = all.filter((q, i) => {
      if (q.category === activeCategory) {
        const filteredIndexes = all
          .map((item, idx) => item.category === activeCategory ? idx : null)
          .filter(i => i !== null);

        return filteredIndexes[index] !== i;
      }
      return true;
    });

    localStorage.setItem("quizQuestions", JSON.stringify(updatedAll));

    const filtered = updatedAll.filter(q => q.category === activeCategory);
    setQuestions(filtered);
  };

  return (
    <div className="admin-page">
      <div className="admin-wrapper">

        {/* HEADER */}
        <div className="admin-header">
          <h1>Quiz Admin Dashboard</h1>
          <p>Manage questions by category</p>
        </div>

        {/* SIDEBAR */}
        <div className="admin-sidebar">
          <h3>Categories</h3>
          {categories.map(cat => (
            <button
              key={cat}
              className={`cat-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* MAIN CONTENT */}
        <div className="admin-main">

          {/* ADD QUESTION FORM */}
          <form className="question-form" onSubmit={handleAddQuestion}>
            <h3>Add Question ({activeCategory})</h3>

            <input
              type="text"
              placeholder="Enter your question"
              value={question}
              onChange={e => setQuestion(e.target.value)}
            />

            {options.map((opt, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={e => handleOptionChange(i, e.target.value)}
              />
            ))}

            <input
              type="text"
              placeholder="Correct Answer"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
            />

            <button type="submit">Add Question</button>
          </form>

          {/* QUESTION LIST */}
          <div className="question-list">
            <h3>{activeCategory} Questions</h3>

            {questions.length === 0 ? (
              <p className="empty">No questions added yet.</p>
            ) : (
              questions.map((q, idx) => (
                <div className="question-card" key={idx}>
                  <div className="q-top">
                    <h4>Q{idx + 1}. {q.question}</h4>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(idx)}
                    >
                      Delete
                    </button>
                  </div>

                  <ul>
                    {q.options.map((opt, i) => (
                      <li key={i}>{opt}</li>
                    ))}
                  </ul>

                  <p className="correct">Correct: {q.answer}</p>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Admin;
