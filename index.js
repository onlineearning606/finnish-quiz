import { useState, useEffect } from "react";

const quiz = [
  { id: 1, subject: "minä", verb: "asua", type: "positive", answer: "minä asun" },
  { id: 2, subject: "sinä", verb: "tietää", type: "negative", answer: "sinä et tiedä" },
  { id: 3, subject: "hän", verb: "syödä", type: "positive", answer: "hän syö" },
  { id: 4, subject: "me", verb: "mennä", type: "negative", answer: "me emme mene" },
  { id: 5, subject: "te", verb: "kuunnella", type: "positive", answer: "te kuuntelette" },
  { id: 6, subject: "he", verb: "ostaa", type: "negative", answer: "he eivät osta" },
  { id: 7, subject: "sinä", verb: "nukkua", type: "positive", answer: "sinä nukut" },
  { id: 8, subject: "hän", verb: "pelata", type: "negative", answer: "hän ei pelaa" },
  { id: 9, subject: "me", verb: "katsoa", type: "positive", answer: "me katsomme" },
  { id: 10, subject: "te", verb: "ymmärtää", type: "negative", answer: "te ette ymmärrä" }
];

export default function Home() {
  const [screen, setScreen] = useState("name"); 
  const [playerName, setPlayerName] = useState("");
  const [index, setIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);

  // Load leaderboard from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("leaderboard");
    if (saved) {
      setLeaderboard(JSON.parse(saved));
    }
  }, []);

  // Save leaderboard to localStorage
  useEffect(() => {
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  }, [leaderboard]);

  const current = quiz[index];

  function startQuiz() {
    setIndex(0);
    setScore(0);
    setScreen("quiz");
  }

  function finishQuiz() {
    const newEntry = { name: playerName, score, date: new Date().toLocaleString() };
    setLeaderboard((prev) => [...prev, newEntry]);
    setScreen("winner");
  }

  function checkAnswer(e) {
    e.preventDefault();

    const normalize = (text) =>
      text
        .trim()
        .toLowerCase()
        .replace(/\./g, "")
        .replace(/ä/g, "a")
        .replace(/ö/g, "o")
        .replace(/\s+/g, " ");

    const correct = normalize(current.answer);
    const user = normalize(userAnswer);

    if (correct === user) {
      setFeedback("✅ Correct!");
      setScore((prev) => prev + 1);
    } else {
      setFeedback(`❌ Wrong. Correct: ${current.answer}`);
    }

    setTimeout(() => {
      setFeedback("");
      setUserAnswer("");

      if (index + 1 >= quiz.length) {
        finishQuiz();
      } else {
        setIndex((prev) => prev + 1);
      }
    }, 1500);
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0f172a",
      color: "#e5e7eb",
      padding: "16px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "600px",
        background: "#020617",
        borderRadius: "12px",
        padding: "24px",
        border: "1px solid #1f2937"
      }}>

        {/* NAME SCREEN */}
        {screen === "name" && (
          <>
            <h1>Enter Your Name</h1>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your name..."
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "12px",
                borderRadius: "8px",
                border: "1px solid #374151",
                background: "#020617",
                color: "#e5e7eb"
              }}
            />
            <button
              onClick={() => setScreen("dashboard")}
              disabled={!playerName.trim()}
              style={{
                width: "100%",
                marginTop: "16px",
                padding: "10px",
                borderRadius: "8px",
                background: playerName.trim() ? "#22c55e" : "#4b5563",
                color: "#020617",
                fontWeight: 600
              }}
            >
              Continue
            </button>
          </>
        )}

        {/* DASHBOARD */}
        {screen === "dashboard" && (
          <>
            <h1>Welcome, {playerName}!</h1>
            <p style={{ color: "#9ca3af" }}>Ready to test your Finnish?</p>

            <button
              onClick={startQuiz}
              style={{
                width: "100%",
                marginTop: "16px",
                padding: "10px",
                borderRadius: "8px",
                background: "#22c55e",
                color: "#020617",
                fontWeight: 600
              }}
            >
              Start Quiz
            </button>

            <button
              onClick={() => setScreen("winner")}
              style={{
                width: "100%",
                marginTop: "12px",
                padding: "10px",
                borderRadius: "8px",
                background: "#3b82f6",
                color: "#020617",
                fontWeight: 600
              }}
            >
              View Leaderboard
            </button>
          </>
        )}

        {/* QUIZ SCREEN */}
        {screen === "quiz" && (
          <>
            <h2>Question {index + 1} / {quiz.length}</h2>

            <div style={{
              padding: "12px",
              borderRadius: "8px",
              background: "#020617",
              border: "1px solid #1f2937",
              marginBottom: "16px"
            }}>
              <p>Type: <strong>{current.type}</strong></p>
              <p>Subject: <strong>{current.subject}</strong></p>
              <p>Verb: <strong>{current.verb}</strong></p>
            </div>

            <form onSubmit={checkAnswer}>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer..."
                autoFocus
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #374151",
                  background: "#020617",
                  color: "#e5e7eb",
                  marginBottom: "12px"
                }}
              />
              <button
                type="submit"
                disabled={!userAnswer.trim()}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  background: userAnswer.trim() ? "#22c55e" : "#4b5563",
                  color: "#020617",
                  fontWeight: 600
                }}
              >
                Submit
              </button>
            </form>

            {feedback && (
              <div style={{
                marginTop: "12px",
                padding: "10px",
                borderRadius: "8px",
                background: "#020617",
                border: "1px solid #374151"
              }}>
                {feedback}
              </div>
            )}
          </>
        )}

        {/* LEADERBOARD */}
        {screen === "winner" && (
          <>
            <h1>Leaderboard</h1>

            {leaderboard.length === 0 && <p>No scores yet.</p>}

            {leaderboard
              .sort((a, b) => b.score - a.score)
              .map((entry, i) => (
                <p key={i}>
                  <strong>{i + 1}. {entry.name}</strong> — {entry.score} points
                </p>
              ))}

            <button
              onClick={() => setScreen("dashboard")}
              style={{
                width: "100%",
                marginTop: "16px",
                padding: "10px",
                borderRadius: "8px",
                background: "#22c55e",
                color: "#020617",
                fontWeight: 600
              }}
            >
              Back to Dashboard
            </button>
          </>
        )}

      </div>
    </div>
  );
}