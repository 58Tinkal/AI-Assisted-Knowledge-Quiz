import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext.jsx";

const SUBJECT_OPTIONS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Geography",
  "History",
  "Civics",
  "Economics",
  "English Literature",
  "React",
  "JavaScript",
  "Data Structures",
  "Aptitude",
  "General Knowledge",
];

export default function StartPage() {
  const navigate = useNavigate();
  const { userName, subject, topic, setBasicInfo } = useQuiz();

  const [name, setName] = useState(userName || "");
  const [selectedSubject, setSelectedSubject] = useState(
    subject || SUBJECT_OPTIONS[0]
  );
  const [topicText, setTopicText] = useState(topic || "");

  const handleNext = () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    setBasicInfo({
      userName: name.trim(),
      subject: selectedSubject,
      topic: topicText.trim() || selectedSubject,
    });

    navigate("/customize");
  };

  return (
    <div className="page-container">
      <div className="card">
        <h1 className="title">
          Welcome, <span className="title-highlight">Start Practice!</span>
        </h1>

        <label className="label">Your Name</label>
        <input
          className="input"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="row space-between">
          <div className="column">
            <label className="label">Subject Name</label>
            <select
              className="select"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {SUBJECT_OPTIONS.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          <div className="column">
            <label className="label">Topic (optional)</label>
            <input
              className="input"
              placeholder="e.g. React Hooks, World War II"
              value={topicText}
              onChange={(e) => setTopicText(e.target.value)}
            />
          </div>
        </div>

        <button className="primary-btn" onClick={handleNext}>
          Next
        </button>

        <p className="footer-text">ExamPrep © 2025 | All rights reserved</p>
      </div>
    </div>
  );
}
