import React, { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { generateQuiz, saveUserProfile, getFeedback } from "../services/api";

const QuizContext = createContext();

export function QuizProvider({ children }) {
  const [state, setState] = useLocalStorage("ai-quiz-state", {
    userName: "",
    subject: "",
    topic: "",
    count: 5,
    difficulty: "Easy",
    questions: [],
    currentIndex: 0,
    answers: {}, // { [questionId]: optionId }
    status: {}, // { [questionId]: "notVisited"|"notAnswered"|"answered"|"marked" }
    summary: { correct: 0, incorrect: 0, skipped: 0 },
    feedback: "",
    isLoading: false,
  });

  const update = (patch) => setState((s) => ({ ...s, ...patch }));

  const setBasicInfo = ({ userName, subject, topic }) => {
    update({ userName, subject, topic });

    saveUserProfile({
      name: userName,
      lastSubject: subject,
      lastDifficulty: state.difficulty,
    }).catch(() => {});
  };

  const setQuizConfig = ({ count, difficulty }) => {
    update({ count, difficulty });
  };

  const buildInitialStatus = (questions) => {
    const status = {};
    (questions || []).forEach((q) => {
      status[q.id] = "notVisited";
    });
    return status;
  };

  const startQuiz = async (overrides = {}) => {
    // Set loading state first - this will trigger the loader to show
    update({
      isLoading: true,
      questions: [],
      answers: {},
      status: {},
      currentIndex: 0,
      summary: { correct: 0, incorrect: 0, skipped: 0 },
      feedback: "",
    });

    try {
      // Use overrides if provided, otherwise fall back to state values
      // This ensures we use the exact values passed, avoiding stale state issues
      const quizParams = {
        subject: overrides.subject || state.subject,
        topic: overrides.topic || state.topic || state.subject,
        count: overrides.count !== undefined ? overrides.count : state.count,
        difficulty: overrides.difficulty || state.difficulty,
      };

      console.log("Generating quiz with params:", quizParams);

      // Generate quiz
      const questions = await generateQuiz(quizParams);

      console.log("Quiz generated successfully, questions count:", questions.length);

      // Build status and update state
      const status = buildInitialStatus(questions);

      update({
        questions,
        status,
        currentIndex: 0,
        isLoading: false,
      });
    } catch (err) {
      console.error("startQuiz error:", err);
      update({ isLoading: false });
      throw err; // Re-throw so caller can handle it
    }
  };

  const selectAnswer = (questionId, optionId) => {
    setState((s) => ({
      ...s,
      answers: { ...s.answers, [questionId]: optionId },
      status: {
        ...s.status,
        [questionId]: "answered",
      },
    }));
  };

  const markForReview = (questionId) => {
    setState((s) => ({
      ...s,
      status: {
        ...s.status,
        [questionId]: "marked",
      },
    }));
  };

  const goToQuestion = (index) => {
    setState((s) => {
      const questions = s.questions || [];
      if (index < 0 || index >= questions.length) return s;
      const q = questions[index];
      const currentStatus = s.status[q.id];
      const nextStatus =
        !currentStatus || currentStatus === "notVisited"
          ? { ...s.status, [q.id]: "notAnswered" }
          : s.status;
      return {
        ...s,
        currentIndex: index,
        status: nextStatus,
      };
    });
  };

  const goNext = () => {
    setState((s) => {
      const questions = s.questions || [];
      const nextIndex = Math.min(s.currentIndex + 1, questions.length - 1);
      if (nextIndex === s.currentIndex) return s;
      const q = questions[nextIndex];
      const currentStatus = s.status[q.id];
      const nextStatus =
        !currentStatus || currentStatus === "notVisited"
          ? { ...s.status, [q.id]: "notAnswered" }
          : s.status;
      return {
        ...s,
        currentIndex: nextIndex,
        status: nextStatus,
      };
    });
  };

  const goPrev = () => {
    setState((s) => ({
      ...s,
      currentIndex: Math.max(s.currentIndex - 1, 0),
    }));
  };

  const calculateSummary = (questions, answers) => {
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;

    (questions || []).forEach((q) => {
      const ans = answers[q.id];
      if (!ans) skipped++;
      else if (ans === q.correctOptionId) correct++;
      else incorrect++;
    });

    return { correct, incorrect, skipped };
  };

  const finishQuiz = async () => {
    // Use a snapshot of current state to avoid race conditions
    const snapshot = { ...state };
    const summary = calculateSummary(snapshot.questions, snapshot.answers);
    update({ summary });

    try {
      const feedback = await getFeedback({
        name: snapshot.userName || "Learner",
        subject: snapshot.subject,
        score: summary.correct,
        total: (snapshot.questions || []).length,
      });
      update({ feedback });
    } catch (err) {
      console.error("finishQuiz feedback error:", err);
      update({ feedback: "Could not generate feedback at the moment." });
    }
  };

  const resetForNewTest = () => {
    update({
      questions: [],
      currentIndex: 0,
      answers: {},
      status: {},
      summary: { correct: 0, incorrect: 0, skipped: 0 },
      feedback: "",
    });
  };

  const resetLoading = () => {
    update({ isLoading: false });
  };

  const value = {
    ...state,
    setBasicInfo,
    setQuizConfig,
    startQuiz,
    selectAnswer,
    markForReview,
    goToQuestion,
    goNext,
    goPrev,
    finishQuiz,
    resetForNewTest,
    resetLoading,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export const useQuiz = () => useContext(QuizContext);
