import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  StickyNote,
  Quote,
  Clock,
  Sun,
  Moon,
  CheckSquare,
} from "lucide-react";

const Card = ({ children, className = "" }) => (
  <div className={`card shadow-sm p-4 ${className}`}>{children}</div>
);

const Button = ({
  onClick,
  children,
  variant = "primary",
  className = "",
  disabled,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`btn btn-${variant} d-flex align-items-center gap-2 ${className}`}
  >
    {children}
  </button>
);

const TodoList = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Review project requirements", completed: false },
    { id: 2, text: "Email the design team", completed: true },
    { id: 3, text: "Setup React environment", completed: true },
  ]);
  const [input, setInput] = useState("");

  const addTask = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: input, completed: false }]);
    setInput("");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <Card>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="d-flex align-items-center gap-2 mb-0">
          <CheckSquare size={18} className="text-primary" /> Tasks
        </h5>
        <small className="badge bg-light text-dark">
          {tasks.filter((t) => t.completed).length}/{tasks.length} Done
        </small>
      </div>

      <form onSubmit={addTask} className="d-flex gap-2 mb-3">
        <input
          className="form-control"
          placeholder="Add new task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button variant="primary">
          <Plus size={18} />
        </Button>
      </form>

      <div className="overflow-auto" style={{ maxHeight: 300 }}>
        {tasks.map((t) => (
          <div
            key={t.id}
            className={`d-flex justify-content-between align-items-center p-2 border rounded mb-2 ${
              t.completed ? "bg-light" : "bg-white"
            }`}
          >
            <div className="d-flex align-items-center gap-2">
              <button
                onClick={() => toggleTask(t.id)}
                className="btn btn-link p-0 text-dark"
              >
                {t.completed ? (
                  <CheckCircle2 className="text-success" />
                ) : (
                  <Circle className="text-secondary" />
                )}
              </button>
              <span
                className={
                  t.completed ? "text-muted text-decoration-line-through" : ""
                }
              >
                {t.text}
              </span>
            </div>

            <button
              onClick={() => deleteTask(t.id)}
              className="btn btn-sm text-danger"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
};

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("work");

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0"
    )}`;

  const progress = 100 - (timeLeft / (mode === "work" ? 1500 : 300)) * 100;

  return (
    <Card className="position-relative text-center">
      <div
        className="position-absolute top-0 start-0 bg-primary"
        style={{ width: `${progress}%`, height: 4 }}
      />

      <div className="btn-group mb-4">
        <button
          className={`btn btn-${
            mode === "work" ? "primary" : "outline-secondary"
          }`}
          onClick={() => {
            setMode("work");
            setTimeLeft(25 * 60);
            setIsActive(false);
          }}
        >
          Focus
        </button>
        <button
          className={`btn btn-${
            mode === "break" ? "success" : "outline-secondary"
          }`}
          onClick={() => {
            setMode("break");
            setTimeLeft(5 * 60);
            setIsActive(false);
          }}
        >
          Break
        </button>
      </div>

      <h1 className="display-4 mb-4">{formatTime(timeLeft)}</h1>

      <div className="d-flex gap-2 justify-content-center">
        <Button
          variant={isActive ? "secondary" : "primary"}
          onClick={() => setIsActive(!isActive)}
        >
          {isActive ? <Pause /> : <Play />}
          {isActive ? "Pause" : "Start"}
        </Button>

        <Button
          variant="outline-dark"
          onClick={() => setTimeLeft(mode === "work" ? 1500 : 300)}
        >
          <RotateCcw />
        </Button>
      </div>
    </Card>
  );
};

const QuickNotes = () => {
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("Saved");

  return (
    <Card className="h-100">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="d-flex align-items-center gap-2 mb-0">
          <StickyNote /> Quick Notes
        </h5>
        <small className="text-muted">{status}</small>
      </div>

      <textarea
        className="form-control h-100"
        placeholder="Write something..."
        value={note}
        onChange={(e) => {
          setNote(e.target.value);
          setStatus("Saving...");
          clearTimeout(window.saveTimeout);
          window.saveTimeout = setTimeout(() => setStatus("Saved"), 800);
        }}
      />
    </Card>
  );
};

const QuoteWidget = () => {
  const [quote, setQuote] = useState({
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  });

  const quotes = [
    {
      text: "Focus on being productive instead of busy.",
      author: "Tim Ferriss",
    },
    { text: "Your time is limited, don't waste it.", author: "Steve Jobs" },
    { text: "Start before you're ready.", author: "Stephen King" },
  ];

  return (
    <Card className="bg-primary text-white text-center">
      <Quote size={32} className="mb-3 opacity-50" />

      <p className="fs-5">"{quote.text}"</p>
      <p className="fw-light">— {quote.author}</p>

      <button
        className="btn btn-light btn-sm mt-3"
        onClick={() =>
          setQuote(quotes[Math.floor(Math.random() * quotes.length)])
        }
      >
        New Quote
      </button>
    </Card>
  );
};

const Header = ({ isDark, toggleTheme }) => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
      <div>
        <h2>Be Productive</h2>
        <p className="text-muted">{date.toLocaleDateString()}</p>
      </div>

      <button
        onClick={toggleTheme}
        className="btn btn-outline-dark d-flex align-items-center gap-2"
      >
        {isDark ? <Sun /> : <Moon />}
        {isDark ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  );
};

export default function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div
      className={
        isDark ? "bg-dark text-light min-vh-100" : "bg-light min-vh-100"
      }
    >
      <div className="container py-5">
        <Header isDark={isDark} toggleTheme={() => setIsDark(!isDark)} />

        <div className="row g-4">
          {/* Timer + Quote */}
          <div className="col-md-4">
            <PomodoroTimer />
            <div className="mt-4">
              <QuoteWidget />
            </div>
          </div>

          {/* Tasks */}
          <div className="col-md-4">
            <TodoList />
          </div>

          {/* Notes */}
          <div className="col-md-4">
            <QuickNotes />
          </div>
        </div>
      </div>
    </div>
  );
}
