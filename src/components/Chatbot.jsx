import React, { useState, useRef, useEffect } from "react";
import chatbotConfig from "../data/chatbotConfig.json";
import { fetchActiveJobs } from "../Utils/ApiService";
import "./Chatbot.css";

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

const renderTextWithLinks = (text) => {
  const parts = text.split(URL_REGEX);
  return parts.map((part, i) =>
    part.match(URL_REGEX) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="chatbot-link">
        {part}
      </a>
    ) : (
      part
    )
  );
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const CAREERS_KEYWORDS = ["careers", "jobs", "openings", "hiring", "apply", "vacancies", "positions"];

  const isCareersQuery = (query) => {
    const lower = query.toLowerCase().trim();
    return CAREERS_KEYWORDS.some((kw) => lower.includes(kw));
  };

  const findAnswer = (query) => {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return null;

    for (const response of chatbotConfig.responses) {
      const match = response.keywords.some((keyword) =>
        lowerQuery.includes(keyword.toLowerCase())
      );
      if (match) return response.answer;
    }
    return chatbotConfig.fallbackAnswer;
  };

  const handleBackToMenu = () => {
    setMessages([]);
    setInputValue("");
  };

  const handleSend = async (text) => {
    const query = text || inputValue;
    if (!query.trim()) return;

    const lowerQuery = query.toLowerCase().trim();
    if (lowerQuery === "back to main menu" || lowerQuery === "main menu") {
      handleBackToMenu();
      return;
    }

    const userMsg = { type: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    if (isCareersQuery(query)) {
      setMessages((prev) => [...prev, { type: "bot", text: "Fetching active jobs...", loading: true }]);
      try {
        const jobs = await fetchActiveJobs();
        const jobsMsg = {
          type: "bot",
          jobs: jobs,
          text: jobs.length > 0
            ? "Here are our current job openings. Visit the Active Job Openings section on this page to apply."
            : "No active job openings at the moment. Please check back later!",
        };
        setMessages((prev) => prev.slice(0, -1).concat(jobsMsg));
      } catch {
        setMessages((prev) =>
          prev.slice(0, -1).concat({
            type: "bot",
            text: "Unable to fetch jobs right now. Please visit the Active Job Openings section on this page.",
          })
        );
      }
      return;
    }

    const answer = findAnswer(query);
    const botMsg = { type: "bot", text: answer };
    setMessages((prev) => [...prev, botMsg]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTopicClick = (topic) => {
    handleSend(topic);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className="chatbot-fab"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open chat"
        title="Chat with us"
      >
        <i className="fa fa-comments"></i>
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div className="chatbot-popup">
          <div className="chatbot-header">
            <h4>TOTAL eBIZ LLC</h4>
            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          <div className="chatbot-body">
            {messages.length === 0 ? (
              <div className="chatbot-welcome">
                <h5 className="chatbot-greeting">{chatbotConfig.greeting}</h5>
                <div className="chatbot-topics">
                  {chatbotConfig.topicButtons.map((topic, i) => (
                    <button
                      key={i}
                      className="chatbot-topic-btn"
                      onClick={() => handleTopicClick(topic)}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="chatbot-messages">
                {messages.map((msg, i) => (
                  <React.Fragment key={i}>
                    <div
                      className={`chatbot-msg chatbot-msg-${msg.type}${msg.loading ? " chatbot-msg-loading" : ""}`}
                    >
                      {msg.type === "bot" ? renderTextWithLinks(msg.text) : msg.text}
                      {msg.type === "bot" && msg.jobs && msg.jobs.length > 0 && (
                        <ul className="chatbot-jobs-list">
                          {msg.jobs.map((job, j) => (
                            <li key={j}>{job.jobTitle}</li>
                          ))}
                        </ul>
                      )}
                      {msg.type === "bot" && !msg.loading && (
                        <div className="chatbot-back-hint">
                          Type <button type="button" className="chatbot-back-link" onClick={handleBackToMenu}>Back to main menu</button> to see more options.
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="chatbot-footer">
            <input
              type="text"
              className="chatbot-input"
              placeholder={chatbotConfig.placeholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="chatbot-send"
              onClick={() => handleSend()}
              aria-label="Send message"
            >
              <i className="fa fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
