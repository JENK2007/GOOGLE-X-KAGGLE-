import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";
import {
  BookOpen,
  Play,
  Terminal,
  Cloud,
  CheckCircle2,
  Circle,
  MessageSquare,
  Sparkles,
  Send,
  ExternalLink,
  RefreshCw,
  Award,
  Video,
  Info,
  ChevronRight,
  Check,
  X,
  Bot,
  Lock,
  Compass,
  Cpu,
  Bookmark,
  Share2,
  HelpCircle,
  Activity,
  Users
} from "lucide-react";
import { Task, ChatMessage, QuizQuestion, TerminalLog } from "./types";

const INITIAL_DAY_ASSIGNMENTS: Record<number, Task[]> = {
  1: [
    {
      id: "d1-a1",
      title: "Listen to Unit 1 Summary Podcast",
      category: "Podcast",
      url: "https://www.youtube.com/watch?v=cbzmr7vt4XA",
      description: "Listen to the Unit 1 summary episode covering the transition from manual syntax coding to intent-driven vibe coding and agentic engineering.",
      isCompleted: true,
      timeEstimate: "15m"
    },
    {
      id: "d1-a2",
      title: "Read 'The New SDLC' Whitepaper",
      category: "Whitepaper",
      url: "https://www.kaggle.com/whitepaper-the-new-SDLC-with-vibe-coding",
      description: "Read the key foundation whitepaper discussing SDLC compression and the human orchestrated development approach.",
      isCompleted: true,
      timeEstimate: "25m"
    },
    {
      id: "d1-a3",
      title: "Kaggle: Build Your First AI Agent with ADK",
      category: "Day 1 Notebook",
      url: "https://www.kaggle.com/code/kaggle5daycourse/day-1-your-first-agent-with-adk",
      description: "Build your first agent using Gemini and Agent Development Kit (ADK). Configure keys, implement a search tool, and invoke InMemoryRunner.",
      isCompleted: true,
      timeEstimate: "35m"
    },
    {
      id: "d1-a4",
      title: "Codelab 1: Get started with Antigravity 2.0",
      category: "Codelab 1",
      url: "https://codelabs.developers.google.com/getting-started-google-antigravity#0",
      description: "Complete hands-on exercises in the Antigravity workspace to create, compile, and execute with AI agent loops.",
      isCompleted: true,
      timeEstimate: "30m"
    }
  ],
  2: [
    {
      id: "d2-a1",
      title: "Kaggle: Build Multi-Agent Systems",
      category: "Day 2 Notebook",
      url: "https://www.kaggle.com/code/kaggle5daycourse/day-2-build-your-first-multi-agent-system",
      description: "Architect complex multi-agent orchestrations and teams using ADK's programmatic layouts and coordination blocks.",
      isCompleted: true,
      timeEstimate: "40m"
    },
    {
      id: "d2-a2",
      title: "Codelab 2: Deploy to Cloud Run",
      category: "Codelab 2",
      url: "https://codelabs.developers.google.com/deploy-from-aistudio-to-run?hl=en#0",
      description: "Learn how to use AI Studio's one-click containerization pipeline to compile and host your agents globally on Google Cloud Run.",
      isCompleted: true,
      timeEstimate: "20m"
    },
    {
      id: "d2-a3",
      title: "Review troubleshooting guide",
      category: "Resource",
      url: "https://www.kaggle.com/code/kaggle5daycourse/day-1-troubleshooting",
      description: "Master techniques to debug, resolve common exceptions, and configure Gemini rate limits perfectly in the notebooks.",
      isCompleted: true,
      timeEstimate: "10m"
    },
    {
      id: "d2-quiz",
      title: "Day 2 Knowledge Evaluation Quiz",
      category: "Evaluation",
      url: "#quiz",
      description: "Complete the Day 2 Quiz in the top right or evaluation tab to secure your points and finish the active day course requirements.",
      isCompleted: true,
      timeEstimate: "10m"
    }
  ],
  3: [
    {
      id: "d3-a1",
      title: "Listen to Unit 3 Summary Podcast",
      category: "Podcast",
      url: "https://www.youtube.com/watch?v=uYURYHhpmKc",
      description: "Listen to the Summary Podcast for Unit 3 – 'Agent Skills'. Learn how to manage dynamic context and prevent 'context rot' by equipping agents with portable skills.",
      isCompleted: true,
      timeEstimate: "15m"
    },
    {
      id: "d3-a2",
      title: "Read 'Agent Skills' Whitepaper",
      category: "Whitepaper",
      url: "https://www.kaggle.com/whitepaper-agent-skills",
      description: "Understand how the portable 'Agent Skills' design uses progressive disclosure to keep prompts light, loading tools and execution details only on demand.",
      isCompleted: true,
      timeEstimate: "25m"
    },
    {
      id: "d3-a3",
      title: "Explore how Skills work in Antigravity",
      category: "Codelab 1",
      url: "https://codelabs.developers.google.com/getting-started-with-antigravity-skills?hl=en#4",
      description: "In this codelab, familiarize yourself with how Agent Skills are structured around standard SKILL.md files to extend core capabilities dynamically in Antigravity.",
      isCompleted: true,
      timeEstimate: "20m"
    },
    {
      id: "d3-a4",
      title: "Build Agents with Agents CLI and ADK",
      category: "Codelab 2",
      url: "https://codelabs.developers.google.com/agents-cli-adk-lifecycle",
      description: "Install and utilize Agents CLI skills to create, lint, test, and lifecycle-manage automated developer agents via natural language prompting.",
      isCompleted: true,
      timeEstimate: "35m"
    },
    {
      id: "d3-quiz",
      title: "Day 3 Knowledge Evaluation Quiz",
      category: "Evaluation",
      url: "#quiz",
      description: "Complete the Unit 3 quiz to test your mastery of dynamic context, context rot, progressive disclosure, and the Agents CLI lifecycle.",
      isCompleted: true,
      timeEstimate: "10m"
    }
  ],
  4: [
    {
      id: "d4-a1",
      title: "Listen to Unit 4 Summary Podcast",
      category: "Podcast",
      url: "https://www.youtube.com/watch?v=Ddz1b8CYPvg",
      description: "Listen to the Summary Podcast for Unit 4 – 'Vibe Coding Agent Security and Evaluation'. Discover how to build secure, non-deterministic workflows.",
      isCompleted: true,
      timeEstimate: "15m"
    },
    {
      id: "d4-a2",
      title: "Read 'Agent Security and Evaluation' Whitepaper",
      category: "Whitepaper",
      url: "https://www.kaggle.com/whitepaper-vibe-coding-agent-security-and-evaluation",
      description: "Master the 7-pillar security architecture, ephemeral sandboxing, slopsquatting prevention, and OpenTelemetry trajectory evaluation.",
      isCompleted: true,
      timeEstimate: "25m"
    },
    {
      id: "d4-a3",
      title: "Codelab: Build Expense-Approval Agent / Human-in-the-Loop",
      category: "Codelab 1",
      url: "https://codelabs.developers.google.com/vibecode-ambient-expense-agent",
      description: "Build an expense-approval agent using ADK with a human-in-the-loop triage flow and execute local verification sets in Antigravity.",
      isCompleted: true,
      timeEstimate: "30m"
    },
    {
      id: "d4-a4",
      title: "Codelab: Write Secure AI Code & Safety Guards",
      category: "Codelab 2",
      url: "https://codelabs.developers.google.com/secure-agentic-coding",
      description: "Integrate static threat scans, compile active guardrails, and execute automated security fuzzing/vulnerability testing in your agent's workspace.",
      isCompleted: true,
      timeEstimate: "35m"
    },
    {
      id: "d4-quiz",
      title: "Day 4 Knowledge Evaluation Quiz",
      category: "Evaluation",
      url: "#quiz",
      description: "Test your expertise on non-deterministic threat models, human-in-the-loop validation, and trace evaluation matrices inside the evaluation portal.",
      isCompleted: true,
      timeEstimate: "10m"
    }
  ],
  5: [
    {
      id: "d5-capstone",
      title: "Launch Vibe Coding Capstone Project Portfolio",
      category: "Kaggle Capstone",
      url: "https://www.kaggle.com/competitions/vibecoding-agents-capstone-project",
      description: "Apply your vibe coding skills to solve a real-world usecase. Select one of four tracks (Good, Business, Concierge, Freestyle), demonstrate at least 3 course concepts (ADK, MCP, Skills, Security), and submit by July 6, 2026.",
      isCompleted: false,
      timeEstimate: "60m"
    },
    {
      id: "d5-a1",
      title: "Listen to Unit 5 Summary Podcast",
      category: "Podcast",
      url: "https://www.youtube.com/watch?v=VSRdL4wlbLY",
      description: "Understand SDLC compression, treating code as disposable, and Gherkin behavior specifications as the true permanent source of truth.",
      isCompleted: false,
      timeEstimate: "15m"
    },
    {
      id: "d5-a2",
      title: "Read 'Spec-Driven Production Grade Development' Whitepaper",
      category: "Whitepaper",
      url: "https://www/kaggle.com/whitepaper-spec-driven-production-grade-development-in-the-age-of-vibe-coding",
      description: "Master Spec-Driven Development, zero-trust deployment pipelines, automated pull request reviewers, and enterprise Policy Servers.",
      isCompleted: false,
      timeEstimate: "25m"
    },
    {
      id: "d5-a3",
      title: "Codelab [Optional]: Deploy Agents to Google Cloud Run",
      category: "Codelab 1",
      url: "https://codelabs.developers.google.com/enterprise-cloud-scale-deploying-the-expense-agent-to-agent-runtime-on-google-cloud",
      description: "Wrap expense-approval setups in standalone containers and launch them securely at enterprise scale on Google Cloud Run.",
      isCompleted: false,
      timeEstimate: "30m"
    },
    {
      id: "d5-a4",
      title: "Codelab [Optional]: Build Frontend Web App & Connect Agent",
      category: "Codelab 2",
      url: "https://codelabs.developers.google.com/vibecode-frontend-with-antigravity",
      description: "Generate a polished frontend deployed to Cloud Run, integrated with triggers that feed submitted requests straight to your cloud-hosted agent.",
      isCompleted: false,
      timeEstimate: "35m"
    },
    {
      id: "d5-quiz",
      title: "Day 5 Knowledge Evaluation Quiz",
      category: "Evaluation",
      url: "#quiz",
      description: "Measure your mastery of Gherkin syntax, zero-trust release structures, policy integrations, and asynchronous task coordination in the evaluation tracker.",
      isCompleted: false,
      timeEstimate: "10m"
    }
  ]
};

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the fundamental concept behind Spec-Driven Development (SDD) in Vibe Coding?",
    options: [
      "Writing raw code first, then generating manual tests to matches compiled objects.",
      "Treating behavior-defining Gherkin specifications as the absolute source of truth, considering generated code as a highly disposable asset.",
      "Writing all specifications directly in machine assembly blocks.",
      "Completely disabling compiler alerts and policy audits to cut execution time."
    ],
    correctAnswerIndex: 1,
    explanation: "Under Spec-Driven Development (SDD), Gherkin behavioral specifications represent the permanent source of truth. Since AI can regenerate code instantly, the code itself is treated as disposable."
  },
  {
    id: 2,
    question: "In Spec-Driven Development, how are feature behaviors typically structured?",
    options: [
      "Direct raw SQL index creation strings.",
      "Using formatted Gherkin syntax with 'Given', 'When', and 'Then' action blocks.",
      "Through arbitrary Javascript callback functions.",
      "Within non-standard marketing templates."
    ],
    correctAnswerIndex: 1,
    explanation: "Gherkin syntax provides a clean, human-readable, machine-testable format to formulate exact system behaviors before any coding takes place."
  },
  {
    id: 3,
    question: "Why is generated code treated as an inherently disposable asset in the Vibe Coding paradigm?",
    options: [
      "Because public cloud object storage is entirely free of usage bills.",
      "Plain text code is easily deleted from code repository histories.",
      "Because models can write or refactor entire files in seconds, making high-level behavioral criteria the true long-term intellectual property.",
      "All browsers compile source code dynamically inside ephemeral sandboxes automatically anyways."
    ],
    correctAnswerIndex: 2,
    explanation: "Because models can rapidly synthesize pristine, complete codeblocks directly from specifications, the Gherkin files represent the true, durable intellectual property."
  },
  {
    id: 4,
    question: "What is the primary role of an automated Code-Review Agent in zero-trust pipelines?",
    options: [
      "Interfacing styles, fonts, and borders on desktop UI widgets.",
      "Providing automated compilation, linting, and policy checking on generated pull requests prior to merging.",
      "Acquiring Cloud Run virtual servers autonomously.",
      "Substituting human administrators completely."
    ],
    correctAnswerIndex: 1,
    explanation: "Code-review agents act as automated gates in zero-trust release pipelines, assessing that all synthesized code matches strict performance, syntax, and compliance regulations."
  },
  {
    id: 5,
    question: "What function does a 'Policy Server' perform in enterprise agent orchestration?",
    options: [
      "Managing cookie sessions across client displays.",
      "Compiling raw container blueprints into local hosts.",
      "Evaluating and enforcing organizational compliance, budgeting, and privacy-risk boundaries on executing agent teams.",
      "Moving active records straight into archive tape drives."
    ],
    correctAnswerIndex: 2,
    explanation: "Policy Servers act as external runtime evaluators, inspecting agent actions, expenses, or tool parameters to assure they stay compliant with safety standards."
  },
  {
    id: 6,
    question: "What is the key transformation that 'SDLC compression' represents in modern software engineering?",
    options: [
      "The complete elimination of testing requirements.",
      "Compressing the time frame between business requirement and validated production-grade execution down to minutes.",
      "Requiring builders to manually assemble machine files.",
      "Directing all databases back to physical hardware arrays."
    ],
    correctAnswerIndex: 1,
    explanation: "SDD and automated coders collapse the traditional multi-week waterfall design-develop-test-verify sequence into an unified, fast-executing iteration loop."
  },
  {
    id: 7,
    question: "Which Google Cloud service hosts containerized agents and web applications in today's codelabs?",
    options: [
      "Google App Engine and Cloud Spanner exclusively.",
      "Google Cloud Run.",
      "Google Contacts and Cloud Storage files.",
      "Cloud Bigtable clusters."
    ],
    correctAnswerIndex: 1,
    explanation: "Cloud Run provides a highly scalable, server-to-client container host perfect for deploying AI agent routines and their web dashboards."
  },
  {
    id: 8,
    question: "When applying Spec-Driven Development, how are regressions verified during code evolution?",
    options: [
      "Relying on manual button clicks directly in active browser tabs.",
      "Executing automated Gherkin test runners to mathematically confirm that the evolved code maintains all specified behaviors.",
      "Skipping checks entirely because AI code never exhibits bugs.",
      "Loading historical file versions manually into comparison frames."
    ],
    correctAnswerIndex: 1,
    explanation: "Gherkin test-definition hooks automatically verify that the updated code compiles with existing requirements, blocking logic breakage on edits."
  },
  {
    id: 9,
    question: "What is the objective of establishing a 'Zero-Trust Pipeline' for AI-assisted code deployment?",
    options: [
      "Restricting code commit pushes to the GitHub repository completely.",
      "Ensuring that all code, human or AI synthesized, matches strict automated scans, unit coverage, and compliance standards prior to launch.",
      "Erasing server directories after any transaction closes.",
      "Allowing only local localhosts to handle system triggers."
    ],
    correctAnswerIndex: 1,
    explanation: "Zero-Trust assumes AI code requires continuous mechanical vetting, wrapping releases in automated threat scanning, testing, and policy gates."
  },
  {
    id: 10,
    question: "How do asynchronous event triggers optimize the connection between frontends and cloud agents?",
    options: [
      "By streaming direct system values via local serial interface wires.",
      "By enqueuing requests to background queues, keeping the user interface fast, responsive, and decouple-architected from active agent logic.",
      "Blocking browser tabs until the entire multi-agent completes its execution.",
      "Demanding custom webhooks within the student's personal email configuration."
    ],
    correctAnswerIndex: 1,
    explanation: "Asynchronous enqueuing decouples the client user interface from the heavy, long-running agent reasoning loop, ensuring a fast, non-blocking UI."
  }
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
  glow: boolean;
}

export default function App() {
  // Boot Sequence State
  const [isBooting, setIsBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootLogs, setBootLogs] = useState<string[]>([]);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1200;
    const logsSequencer = [
      { t: 100, log: "Initializing Vibe System Core..." },
      { t: 300, log: "Loading Model Context Protocols..." },
      { t: 550, log: "Securing AP2 Mutual Encrypted Payments Ledger..." },
      { t: 800, log: "Establishing Google Knowledge Base Sync..." },
      { t: 1050, log: "Unlocking ADK Interoperability Engine..." }
    ];

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setBootProgress(progress);
      
      const activeLogs = logsSequencer
        .filter(item => item.t <= elapsed)
        .map(item => item.log);
      setBootLogs(activeLogs);

      if (elapsed >= duration) {
        clearInterval(interval);
        setTimeout(() => setIsBooting(false), 200);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // API Key Status State & Check
  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean | null>(null);
  useEffect(() => {
    fetch("/api/status")
      .then(res => res.json())
      .then(data => {
        setApiKeyConfigured(!!data.hasApiKey);
      })
      .catch(() => {
        setApiKeyConfigured(false);
      });
  }, []);

  // Persistence & Grouped Tasks States
  const [dayAssignments, setDayAssignments] = useState<Record<number, Task[]>>(() => {
    const saved = localStorage.getItem("vibe_companion_days_grouped");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure preceding days' tasks are completed for live demonstration
        for (const day of [1, 2, 3, 4]) {
          if (parsed[day]) {
            parsed[day] = parsed[day].map((t: any) => ({ ...t, isCompleted: true }));
          } else {
            parsed[day] = INITIAL_DAY_ASSIGNMENTS[day].map(t => ({ ...t, isCompleted: true }));
          }
        }
        // Ensure Day 5 tasks are present
        if (!parsed[5] || parsed[5].length === 0) {
          parsed[5] = INITIAL_DAY_ASSIGNMENTS[5];
        }
        localStorage.setItem("vibe_companion_days_grouped", JSON.stringify(parsed));
        return parsed;
      } catch (e) {
        return INITIAL_DAY_ASSIGNMENTS;
      }
    }
    return INITIAL_DAY_ASSIGNMENTS;
  });

  // Prerequisites checklist Completed states
  const [prereqs, setPrereqs] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem("vibe_companion_prereqs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {
          "Kaggle Account": true,
          "AI Studio API Key": true,
          "Antigravity Toolchain": true
        };
      }
    }
    return {
      "Kaggle Account": true,
      "AI Studio API Key": true,
      "Antigravity Toolchain": true
    };
  });

  // Simulated countdown offset override (null for actual timer, otherwise minutes left)
  const [minutesRemainingOverride, setMinutesRemainingOverride] = useState<number | null>(null);
  const [lastNotifiedThreshold, setLastNotifiedThreshold] = useState<number | null>(null);
  const [activeNotification, setActiveNotification] = useState<{
    id: string;
    title: string;
    message: string;
    type: "warning" | "alert";
  } | null>(null);

  // Active expanded days
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: true // Keep Day 5 open as active by default
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("vibe_companion_chat");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      {
        role: "assistant",
        content: "Greetings student! 🎒 I am your **Next-Gen AI Companion Study Coach**.\n\nWe are extremely thrilled to wrap up our 5-Day Intensive course with a major announcement: the launch of the **AI Agents: Intensive Vibe Coding Capstone Project**! (https://www.kaggle.com/competitions/vibecoding-agents-capstone-project)\n\nThis Capstone Project allows you to apply everything you've learned to a practical, real-world Kaggle scenario. Choose one of four tracks:\n- 🌍 **Agents for Good** (societal impact)\n- 💼 **Agents for Business** (enterprise/operational impact)\n- 🛎️ **Concierge Agents** (safe personal assistants)\n- 🎨 **Freestyle Track** (anything creative and useful)\n\nEnsure your submission demonstrates at least **three key concepts** from our syllabus (such as ADK multi-agents, MCP servers, agent skills, or safety/evaluation metrics). Submissions close on **July 6, 2026 at 11:59 PM PT**! How can I help you design your agent solution today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [activeTab, setActiveTab] = useState<"study" | "terminal" | "quiz" | "multiagent" | "capstone">("capstone");
  
  // Interactive Capstone Planner Workspace state
  const [capstoneTrack, setCapstoneTrack] = useState<"good" | "business" | "concierge" | "freestyle">("business");
  const [capstoneTitle, setCapstoneTitle] = useState("VibeTracker: Real-time Multi-Agent Career Portfolio Builder");
  const [capstoneTeam, setCapstoneTeam] = useState("Individual (Your Name / Team Profile)");
  const [capstonePitch, setCapstonePitch] = useState("A multi-agent development pipeline built with Agent Development Kit (ADK) that coordinates Scribe, Taxonomy and Safety micro-agents to sanitize user work notes, draft high-quality ATS resume bullet entries, and compute overlap matching with active job/internship listings.");
  const [capstoneConcepts, setCapstoneConcepts] = useState<Record<string, boolean>>({
    adk: true,
    mcp: true,
    skills: true,
    security: true,
    sdd: true
  });
  const [capstoneAIFeedback, setCapstoneAIFeedback] = useState("");
  const [capstoneAILoading, setCapstoneAILoading] = useState(false);
  const [capstoneHistoryChat, setCapstoneHistoryChat] = useState<{ role: "user" | "assistant"; content: string; timestamp: string }[]>([]);
  const [capstoneReplyText, setCapstoneReplyText] = useState("");
  const [capstoneReplyLoading, setCapstoneReplyLoading] = useState(false);

  // Interactive Multi-Agent Career Work Tracker states
  const [multiAgentInput, setMultiAgentInput] = useState("Today I built a React dashboard, configured secure Firestore database indexes, and resolved high concurrency response delays.");
  const [multiAgentLoading, setMultiAgentLoading] = useState(false);
  const [multiAgentCurrentStep, setMultiAgentCurrentStep] = useState<number>(-1); // -1: idle, 0: parsing, 1: scribing, 2: taxonomy, 3: matching, 4: safety audit, 5: completed
  const [multiAgentResult, setMultiAgentResult] = useState<any>(null);
  const [multiAgentTrace, setMultiAgentTrace] = useState<any[]>([]);
  const [multiAgentAuditPassed, setMultiAgentAuditPassed] = useState<boolean | null>(null);
  const [multiAgentAuditReport, setMultiAgentAuditReport] = useState("");
  const [multiAgentStepDuration, setMultiAgentStepDuration] = useState<Record<number, number>>({});
  const [selectedTask, setSelectedTask] = useState<Task>(() => {
    return INITIAL_DAY_ASSIGNMENTS[5][0];
  });
  const [personalNotes, setPersonalNotes] = useState<string>(() => {
    return localStorage.getItem("vibe_companion_notes") || "";
  });

  // Interactive Background Physics Coordinates
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePosRef = useRef({ x: -1000, y: -1000 });

  // Chat/Terminal outputs
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>(() => {
    return [
      {
        text: "Kaggle ADK Workspace OS v1.4",
        type: "system",
        timestamp: new Date().toLocaleTimeString()
      },
      {
        text: "google-adk python library loaded in kernel context.",
        type: "success",
        timestamp: new Date().toLocaleTimeString()
      },
      {
        text: "Type 'help' to see active instructions, or 'pip install google-adk'",
        type: "system",
        timestamp: new Date().toLocaleTimeString()
      }
    ];
  });
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Quiz States
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizIsSubmitted, setQuizIsSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  // Countdown calculations
  const [countdownString, setCountdownString] = useState("08h 14m 22s");

  // Local updates synchronization
  useEffect(() => {
    localStorage.setItem("vibe_companion_days_grouped", JSON.stringify(dayAssignments));
  }, [dayAssignments]);

  useEffect(() => {
    localStorage.setItem("vibe_companion_prereqs", JSON.stringify(prereqs));
  }, [prereqs]);

  useEffect(() => {
    localStorage.setItem("vibe_companion_chat", JSON.stringify(chatHistory));
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem("vibe_companion_notes", personalNotes);
  }, [personalNotes]);

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  // Particle background simulation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Neon glowing palettes (using standard canvas syntax format: rgba(R, G, B,)
    const neonColors = [
      "rgba(34, 211, 238,", // cyan
      "rgba(99, 102, 241,", // indigo
      "rgba(168, 85, 247,", // purple
      "rgba(6, 182, 212,"   // sky-cyan
    ];

    // Build 120 active particles (denser, highlighted network)
    const particles: Particle[] = [];
    for (let i = 0; i < 120; i++) {
      const isGlowNode = Math.random() > 0.8; // 20% special glowing super-nodes
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: isGlowNode ? Math.random() * 2.5 + 2.5 : Math.random() * 1.8 + 1.2,
        alpha: Math.random() * 0.45 + 0.35, // Brighter, highlighted alphas
        color: neonColors[Math.floor(Math.random() * neonColors.length)],
        glow: isGlowNode
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Track mouse move in ref to avoid full-app React recomputation
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    const renderLoop = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Gently physics drift
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Boundaries bounce
        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Interactive mouse proximity highlight & push
        const dxMouse = p1.x - mousePosRef.current.x;
        const dyMouse = p1.y - mousePosRef.current.y;
        const distMouse = Math.hypot(dxMouse, dyMouse);
        let tempAlpha = p1.alpha;

        if (distMouse < 160) {
          // Push away slightly
          const force = (160 - distMouse) * 0.0035;
          p1.x += (dxMouse / distMouse) * force;
          p1.y += (dyMouse / distMouse) * force;
          // Magnetized bright glowing feedback
          tempAlpha = Math.min(1.0, p1.alpha + (160 - distMouse) / 160 * 0.45);
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p1.color}${tempAlpha})`;
        ctx.fill();

        // High fidelity dual-layer halo glow for highlighted nodes or mouse proximity
        if (p1.glow || distMouse < 100) {
          ctx.beginPath();
          ctx.arc(p1.x, p1.y, p1.radius * 3.2, 0, Math.PI * 2);
          ctx.fillStyle = `${p1.color}${tempAlpha * 0.22})`;
          ctx.fill();
        }

        // Connect proximity threads with standard linear color gradients & highlights
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 135) { // Expanded connection threshold
            const lineAlpha = ((135 - dist) / 135) * 0.22; // Stronger, highlighted connection transparency
            
            // Generate visual cyber gradient between nodes
            const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            grad.addColorStop(0, `${p1.color}${lineAlpha})`);
            grad.addColorStop(1, `${p2.color}${lineAlpha})`);

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = dist < 70 ? 1.1 : 0.65;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Livestream Countdown calculations for Day 5
  useEffect(() => {
    const calcCountdown = () => {
      if (minutesRemainingOverride !== null) {
        const hrs = Math.floor(minutesRemainingOverride / 60);
        const mins = Math.floor(minutesRemainingOverride % 60);
        const secs = 0;
        setCountdownString(`${String(hrs).padStart(2, "0")}h ${String(mins).padStart(2, "0")}m ${String(secs).padStart(2, "0")}s`);
        return;
      }

      const now = new Date();
      // Day 5 Live stream target: June 19, 2026 at 11:00 AM PT (UTC-7)
      let targetTime = new Date("2026-06-19T11:00:00-07:00");
      if (now.getTime() > targetTime.getTime()) {
        // Fallback relative 11 AM PT for future previewers
        targetTime = new Date();
        targetTime.setHours(11, 0, 0, 0);
        if (now.getTime() > targetTime.getTime()) {
          targetTime.setDate(targetTime.getDate() + 1);
        }
      }

      const diff = targetTime.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdownString("LIVE NOW");
        return;
      }
      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdownString(`${String(hrs).padStart(2, "0")}h ${String(mins).padStart(2, "0")}m ${String(secs).padStart(2, "0")}s`);
    };

    calcCountdown();
    const timer = setInterval(calcCountdown, 1000);
    return () => clearInterval(timer);
  }, [minutesRemainingOverride]);

  // Active Alert Checker for live stream warnings (30m and 10m checks)
  useEffect(() => {
    const checkNotification = () => {
      let mins = 99999;
      if (minutesRemainingOverride !== null) {
        mins = minutesRemainingOverride;
      } else {
        const now = new Date();
        let targetTime = new Date("2026-06-19T11:00:00-07:00");
        if (now.getTime() > targetTime.getTime()) {
          targetTime = new Date();
          targetTime.setHours(11, 0, 0, 0);
          if (now.getTime() > targetTime.getTime()) {
            targetTime.setDate(targetTime.getDate() + 1);
          }
        }
        mins = (targetTime.getTime() - now.getTime()) / (1000 * 60);
      }

      if (mins <= 30 && mins > 10) {
        if (lastNotifiedThreshold !== 30) {
          setLastNotifiedThreshold(30);
          setActiveNotification({
            id: "30min",
            title: "⏰ 30 Minutes Warning",
            message: `Hi Student! The Final Day 5 Live Session "Spec-Driven Production Grade Development" is starting in less than 30 minutes. Log in to the Kaggle forum and prepare your workspace!`,
            type: "warning"
          });
          addTerminalLog(`[NOTIFICATION] Attention: Day 5 Live Session is starting in ~30 minutes!`, "system");
        }
      } else if (mins <= 10 && mins > 0) {
        if (lastNotifiedThreshold !== 10) {
          setLastNotifiedThreshold(10);
          setActiveNotification({
            id: "10min",
            title: "🚨 10 Minutes Warning",
            message: `Urgent Broadcast! Day 5 livestream starts in under 10 minutes featuring Lavi Nigam, Ankur Jain, Antonio Gulli, and special Google leaders. Tune in now!`,
            type: "alert"
          });
          addTerminalLog(`[NOTIFICATION] Attention: Urgent! Final Livestream starting in less than 10 minutes!`, "error");
        }
      } else if (mins <= 0) {
        if (lastNotifiedThreshold !== 0) {
          setLastNotifiedThreshold(0);
          setActiveNotification(null);
        }
      } else {
        if (lastNotifiedThreshold !== null) {
          setLastNotifiedThreshold(null);
          setActiveNotification(null);
        }
      }
    };

    checkNotification();
    const notificationTimer = setInterval(checkNotification, 3000);
    return () => clearInterval(notificationTimer);
  }, [minutesRemainingOverride, lastNotifiedThreshold]);

  // Compute Days and overall progress metrics
  const getDayProgress = (dayNum: number): number => {
    const tasks = dayAssignments[dayNum] || [];
    if (tasks.length === 0) {
      return dayNum === 1 ? 100 : 0; // Day 1 completed by default
    }
    const completed = tasks.filter(t => t.isCompleted).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const getOverallProgress = (): number => {
    // Math of Day 1, Day 2, Day 3, Day 4, and Day 5 total completed items
    const allTasks = [
      ...(dayAssignments[1] || []),
      ...(dayAssignments[2] || []),
      ...(dayAssignments[3] || []),
      ...(dayAssignments[4] || []),
      ...(dayAssignments[5] || [])
    ];
    const completed = allTasks.filter(t => t.isCompleted).length;
    return Math.round((completed / allTasks.length) * 100);
  };

  // Updates specific assignment completed checkbox
  const handleToggleAssignment = (dayNum: number, taskId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDayAssignments(prev => {
      const copy = { ...prev };
      copy[dayNum] = copy[dayNum].map(task => {
        if (task.id === taskId) {
          const state = !task.isCompleted;
          addTerminalLog(`Toggled assignment: ${task.title} -> ${state ? "Completed" : "Incomplete"}`, "success");
          return { ...task, isCompleted: state };
        }
        return task;
      });
      return copy;
    });
  };

  // Toggle prerequisites lists
  const handleTogglePrereq = (key: string) => {
    setPrereqs(prev => {
      const next = { ...prev, [key]: !prev[key] };
      const score = Object.values(next).filter(Boolean).length;
      addTerminalLog(`Prerequisite '${key}' status modified. Readiness indicator recalculated.`, "system");
      return next;
    });
  };

  // Calculate Prerequisites Readiness Score (0 to 100)
  const calcReadinessScore = (): number => {
    const items = Object.values(prereqs);
    const completed = items.filter(Boolean).length;
    return Math.round((completed / items.length) * 100);
  };

  // Terminal Simulator Executions
  const addTerminalLog = (text: string, type: "input" | "system" | "success" | "error") => {
    setTerminalLogs(prev => [
      ...prev,
      {
        text,
        type,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  const handleExecuteTerminal = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    addTerminalLog(`$ ${terminalInput}`, "input");
    setTerminalInput("");

    setTimeout(() => {
      if (cmd === "help") {
        addTerminalLog("Available CLI Commands:\n" +
          "  pip install google-adk       - Install the Agent Development Kit local dependency\n" +
          "  adk create sample-agent       - Scaffold a baseline Python agent structure\n" +
          "  antigravity cli list-tools    - List all registered local agent tools via Antigravity CLI\n" +
          "  mcp list                     - View current Model Context Protocol status and configurations\n" +
          "  mcp connect google-knowledge - Wire up Google Developer Knowledge MCP Server to agent workspace\n" +
          "  clear                        - Flush terminal buffer", "system");
      } else if (cmd === "clear") {
        setTerminalLogs([]);
      } else if (cmd.includes("pip install")) {
        addTerminalLog("✔ Downloading package google-adk metadata logs...", "system");
        addTerminalLog("✔ Downloading google-genai dependency parameters...", "system");
        addTerminalLog("📦 Unpacking binaries into standard virtual environment...", "system");
        addTerminalLog("✔ Successfully installed google-adk and dependent workspace kits.", "success");
      } else if (cmd.includes("adk create")) {
        addTerminalLog("📂 Creating sample-agent folder directory tree...", "system");
        addTerminalLog("✏ Writing .env file preset keys...", "system");
        addTerminalLog("✏ Scaffolded initial agent.py component module code.", "success");
      } else if (cmd.includes("antigravity cli")) {
        addTerminalLog("📡 Querying Antigravity CLI engine...", "system");
        addTerminalLog("🔧 Active Tools Found in current Agent Directory:", "success");
        addTerminalLog("  ├─ FileSystemTool (Local reads/writes)", "system");
        addTerminalLog("  ├─ GoogleSearchTool (Realtime search verification)", "system");
        addTerminalLog("  └─ DeveloperKnowledgeMCP (Connected to canonical Google Docs)", "success");
      } else if (cmd === "mcp list") {
        addTerminalLog("⚙ Model Context Protocol (MCP) Config Loader:", "system");
        addTerminalLog("● google-knowledge  - [Connected] Canonical Google Documentation Schema MCP (mcp://google-developer)", "success");
        addTerminalLog("○ database-connector - [Disconnected] Spanner local development DB instance (mcp://local-db)", "system");
      } else if (cmd.includes("mcp connect")) {
        addTerminalLog("📡 Connecting to Google Developer Knowledge MCP Server at mcp://google-developer...", "system");
        addTerminalLog("📥 Fetching machine-readable API manuals and public Google schemas...", "system");
        addTerminalLog("✔ Successfully loaded 1,245 canonical Google developer guides and documentation pages.", "success");
        addTerminalLog("⚡ Your local Antigravity agent can now query Google API specs seamlessly!", "success");
      } else if (cmd.includes("adk web")) {
        addTerminalLog("📡 Starting Web Interface API server...", "system");
        addTerminalLog("✔ API Running locally at http://127.0.0.1:8000", "success");
        addTerminalLog("[INFO] Interactive console active. Hit Ctrl+C to abort sequence.", "system");
      } else {
        addTerminalLog(`error: command not recognized: "${cmd}". Enter 'help' to review syntax.`, "error");
      }
    }, 150);
  };

  // GPT-Gemini chat assistant logic
  const handleSendChat = async (promptMsg: string) => {
    if (!promptMsg.trim() || chatLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: promptMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMessage]);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: promptMsg,
          history: chatHistory.slice(-12)
        })
      });

      if (!response.ok) {
        let serverErrorMsg = "Chat feedback response error.";
        try {
          const errData = await response.json();
          if (errData && errData.error) {
            serverErrorMsg = errData.error;
          }
        } catch (_) {}
        throw new Error(serverErrorMsg);
      }

      const data = await response.json();
      const botResponse: ChatMessage = {
        role: "assistant",
        content: data.response || "No response received. Please check Gemini model keys.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, botResponse]);
    } catch (err: any) {
      setChatHistory(prev => [
         ...prev,
         {
           role: "assistant",
           content: `⚠️ **System Error**: ${err.message || "Could not connect with course companion backend."} (Double-check your **GEMINI_API_KEY** via the **Secrets** tab in the AI Studio settings panel).`,
           timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
         }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleAnalyzeCapstone = async () => {
    if (capstoneAILoading) return;
    setCapstoneAILoading(true);
    setCapstoneAIFeedback("");
    setCapstoneHistoryChat([]);

    const promptText = `I am planning my Kaggle Capstone Project.
Track Selection: ${capstoneTrack.toUpperCase()} Track
Project Working Title: ${capstoneTitle}
Team Name/Members: ${capstoneTeam}
Project Description & Pitch: ${capstonePitch}
Core Course Concepts Checked: ${Object.keys(capstoneConcepts).filter(k => capstoneConcepts[k]).map(k => k.toUpperCase()).join(", ")}

Please act as my Senior Agentic AI Developer & Career Project Coach.
Provide a professional, highly encouraging and deeply technical evaluation of this Capstone proposal:
1. Architectural Layout & Multi-Agent design matching my selected track (with suggested agent roles).
2. Formulate 2 detailed Gherkin behavioral specifications (Given/When/Then scenarios) matching my active description to prove Spec-Driven SDD compliance.
3. Suggest which APIs, models, and security principles (such as sandboxing, HITL, or trust tracer evaluation) I should configure to make my agent robust.
`;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: promptText
        })
      });

      if (!response.ok) {
        throw new Error("Analysis request experienced a server error.");
      }

      const data = await response.json();
      const feedback = data.response || "No feedback received. Please configure your model backend keys.";
      setCapstoneAIFeedback(feedback);
      setCapstoneHistoryChat([
        {
          role: "assistant",
          content: feedback,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      addTerminalLog(`[CAPSTONE] Analyzed and generated architecture for "${capstoneTitle}"`, "success");
    } catch (err: any) {
      const offlineMsg = `⚠️ **Analysis Error**: ${err.message || "Failed to contact Capstone Planner AI services."}\n\n*Offline Recommendation*: Ensure at least 3 checkboxes are selected to qualify, write standard Gherkin Given/When/Then blocks, and utilize the @google/genai SDK node runtime modules built on Google Cloud Run!`;
      setCapstoneAIFeedback(offlineMsg);
      setCapstoneHistoryChat([
        {
          role: "assistant",
          content: offlineMsg,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      addTerminalLog(`[CAPSTONE] Error in project analysis loop: ${err.message}`, "error");
    } finally {
      setCapstoneAILoading(false);
    }
  };

  const handleSendCapstoneReply = async () => {
    if (!capstoneReplyText.trim() || capstoneReplyLoading) return;
    
    const userMsg = capstoneReplyText.trim();
    setCapstoneReplyText("");
    setCapstoneReplyLoading(true);

    const userBubble = {
      role: "user" as const,
      content: userMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setCapstoneHistoryChat(prev => [...prev, userBubble]);
    addTerminalLog(`[CAPSTONE COACH] Sent message: "${userMsg.slice(0, 42)}..."`, "system");

    const systemContext = `Context: This is a multi-turn session with the Capstone Project Advisor.
Track Selection: ${capstoneTrack.toUpperCase()} Track
Project Working Title: ${capstoneTitle}
Team Name/Members: ${capstoneTeam}
Project Description & Pitch: ${capstonePitch}
Core Course Concepts Checked: ${Object.keys(capstoneConcepts).filter(k => capstoneConcepts[k]).map(k => k.toUpperCase()).join(", ")}

Evaluate the user's latest message inside this project context. Respond as their Senior Agentic AI Developer & Career Project Coach.`;

    try {
      const historyList = capstoneHistoryChat.map(msg => ({
        role: msg.role === "assistant" ? "assistant" as const : "user" as const,
        content: msg.content
      }));

      if (apiKeyConfigured === false) {
        setTimeout(() => {
          const offlineBotBubble = {
            role: "assistant" as const,
            content: `### 🤖 Senior Developer & Coach [Offline Response]
Thank you for your feedback! Here is how we can integrate your request:
- **Feature refinement**: That makes a lot of sense for the **${capstoneTrack.toUpperCase()} track**.
- **Recommended Action**: Implement standard Gherkin specifications to test this behavior. Let's write client-side tests using Jest or Vitest.
- **Tip**: To get a real, intelligent response from Google Gemini 3.5, please save your API key inside the **Secrets** panel in Google AI Studio!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setCapstoneHistoryChat(prev => [...prev, offlineBotBubble]);
          setCapstoneReplyLoading(false);
          addTerminalLog(`[CAPSTONE COACH] Received offline simulated coach response`, "success");
        }, 800);
        return;
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `${systemContext}\n\nUser request: ${userMsg}`,
          history: historyList
        })
      });

      if (!response.ok) {
        throw new Error("Chat request failed on server side.");
      }

      const data = await response.json();
      const botResponse = {
        role: "assistant" as const,
        content: data.response || "No response received. Please check backend connection.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setCapstoneHistoryChat(prev => [...prev, botResponse]);
      addTerminalLog(`[CAPSTONE COACH] Received advice from AI Coach`, "success");
    } catch (err: any) {
      const errorMsg = {
        role: "assistant" as const,
        content: `⚠️ **Coach Connection Error**: ${err.message || "Failed to contact Capstone Coach. Please check your networks."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setCapstoneHistoryChat(prev => [...prev, errorMsg]);
      addTerminalLog(`[CAPSTONE COACH] Error: ${err.message}`, "error");
    } finally {
      setCapstoneReplyLoading(false);
    }
  };

  // Run the Multi-Agent Career Progress Tracker task coordination loop sequentially
  const handleRunMultiAgentPipeline = async () => {
    if (!multiAgentInput.trim() || multiAgentLoading) return;
    
    setMultiAgentLoading(true);
    setMultiAgentResult(null);
    setMultiAgentAuditPassed(null);
    setMultiAgentCurrentStep(0); // Agent 1: Parser
    addTerminalLog(`Initiating Career Multi-Agent Pipeline for work activity: "${multiAgentInput.slice(0, 48)}..."`, "system");
    
    // Smooth cascade transitions representing separate specialized agent run times
    await new Promise(resolve => setTimeout(resolve, 800));
    setMultiAgentCurrentStep(1); // Agent 2: Scribe
    
    await new Promise(resolve => setTimeout(resolve, 800));
    setMultiAgentCurrentStep(2); // Agent 3: Taxonomy
    
    await new Promise(resolve => setTimeout(resolve, 800));
    setMultiAgentCurrentStep(3); // Agent 4: Internship Matcher
    
    await new Promise(resolve => setTimeout(resolve, 800));
    setMultiAgentCurrentStep(4); // Agent 5: Safety Policy Auditor
    
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const response = await fetch("/api/tracker/multi-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawLog: multiAgentInput })
      });

      if (!response.ok) {
        throw new Error("Multi-agent API pipeline route returned an unexpected error state.");
      }

      const data = await response.json();
      if (data.success) {
        setMultiAgentResult(data.results);
        setMultiAgentTrace(data.traceTimeline);
        setMultiAgentAuditPassed(data.auditPassed);
        setMultiAgentAuditReport(data.auditReport);
        setMultiAgentCurrentStep(5); // Completed
        
        if (data.auditPassed) {
          addTerminalLog(`✔ Multi-Agent Pipeline complete. Generated high impact CV bullet. Validated under Zero-Trust constraints.`, "success");
        } else {
          addTerminalLog(`⚠ Pipeline halted by Policy Reviewer audit: "${data.auditReport}"`, "error");
        }
      } else {
        throw new Error(data.error || "Execution failed.");
      }
    } catch (err: any) {
      addTerminalLog(`✖ Multi-Agent Pipeline error: ${err.message || "Failed execution loop."}`, "error");
      setMultiAgentCurrentStep(-1);
    } finally {
      setMultiAgentLoading(false);
    }
  };

  // Quiz interactive elements
  const handleSelectQuizOption = (idx: number) => {
    if (quizIsSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitQuizAnswer = () => {
    if (selectedOption === null || quizIsSubmitted) return;
    setQuizIsSubmitted(true);
    const question = QUIZ_QUESTIONS[currentQuizIndex];
    if (selectedOption === question.correctAnswerIndex) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    setSelectedOption(null);
    setQuizIsSubmitted(false);
    if (currentQuizIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      setQuizComplete(true);
      setDayAssignments(prev => {
        const copy = { ...prev };
        if (copy[2]) {
          copy[2] = copy[2].map(task => {
            if (task.id === "d2-quiz") return { ...task, isCompleted: true };
            return task;
          });
        }
        if (copy[3]) {
          copy[3] = copy[3].map(task => {
            if (task.id === "d3-quiz") return { ...task, isCompleted: true };
            return task;
          });
        }
        if (copy[4]) {
          copy[4] = copy[4].map(task => {
            if (task.id === "d4-quiz") return { ...task, isCompleted: true };
            return task;
          });
        }
        if (copy[5]) {
          copy[5] = copy[5].map(task => {
            if (task.id === "d5-quiz") return { ...task, isCompleted: true };
            return task;
          });
        }
        return copy;
      });
      addTerminalLog("Unit 5 Spec-Driven Development Evaluation completed. Score locked in!", "success");
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setQuizIsSubmitted(false);
    setQuizScore(0);
    setQuizComplete(false);
  };

  const toggleDayExpanded = (day: number) => {
    setExpandedDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  return (
    <div className="relative min-h-screen bg-[#070A13] text-[#E0E6F2] font-sans flex flex-col selection:bg-indigo-500/40 overflow-x-hidden">
      
      {/* Cybernetic Landing Scan-line Booting Overlay */}
      <AnimatePresence>
        {isBooting && (
          <motion.div
            key="sandbox-boot-loading-container"
            className="fixed inset-0 bg-[#070A13] z-50 flex flex-col items-center justify-center p-6 select-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* Ambient cyber grid scan effect element */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.12),rgba(0,0,0,0))]" />
            <div className="absolute inset-x-0 h-[1.5px] bg-indigo-500/20 top-0 left-0 right-0 animate-bounce" style={{ animationDuration: '3s' }} />

            <div className="relative max-w-sm w-full bg-[#0A0F1D]/80 border border-indigo-500/15 rounded-2xl p-6 shadow-2xl backdrop-blur-md flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-600 to-cyan-400 p-[1.5px] flex items-center justify-center">
                  <div className="w-full h-full bg-[#0A0F1D] rounded-[7px] flex items-center justify-center">
                    <Cpu className="h-4.5 w-4.5 text-indigo-400 animate-spin" style={{ animationDuration: "3s" }} />
                  </div>
                </div>
                <div>
                  <h2 className="text-sm font-sans font-black uppercase tracking-wider text-white">Vibe Workspace</h2>
                  <p className="text-[10px] font-mono text-indigo-400">Loading modules...</p>
                </div>
              </div>

              {/* Progress Display */}
              <div className="flex flex-col gap-1.5 font-mono">
                <div className="flex justify-between items-center text-[10px] text-gray-400">
                  <span>SYSTEM_READY</span>
                  <span className="text-indigo-400 font-extrabold">{bootProgress}%</span>
                </div>
                <div className="w-full h-2 bg-black/40 border border-white/5 rounded-full overflow-hidden p-[2px]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 shadow-[0_0_8px_rgba(99,102,241,0.5)] transition-all duration-75"
                    style={{ width: `${bootProgress}%` }}
                  />
                </div>
              </div>

              {/* Incremental loading console logs */}
              <div className="h-28 bg-black/60 rounded-lg p-3 border border-white/5 overflow-hidden flex flex-col gap-1 font-mono text-[9px] text-gray-500">
                {bootLogs.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-1.5 text-indigo-300"
                  >
                    <span className="text-[#4ade80] font-bold">✔</span>
                    <span>{log}</span>
                  </motion.div>
                ))}
                {bootProgress < 100 && (
                  <span className="text-gray-600 animate-pulse">▋ System bootstrapping active...</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Interactive Particle Network Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0" 
      />

      {/* Decorative Shifting Ambient Background Glows */}
      <div className="absolute top-[20%] left-[-10%] w-[450px] h-[450px] bg-indigo-700/10 rounded-full blur-[130px] pointer-events-none z-0 animate-pulse-slow" />
      <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-cyan-700/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Futuristic Main Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className="relative z-10 border-b border-[#1E293B]/60 bg-[#0A0F1D]/80 backdrop-blur-md px-6 py-4 flex flex-wrap justify-between items-center gap-4 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-cyan-400 flex items-center justify-center p-[1.5px] shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:scale-110 transition-transform duration-300">
            <div className="w-full h-full bg-[#0A0F1D] rounded-[10px] flex items-center justify-center">
              <Cpu className="h-5 w-5 text-indigo-400 animate-spin-slow" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-display font-extrabold tracking-tight bg-gradient-to-r from-white via-[#C3DAF9] to-cyan-300 bg-clip-text text-transparent">
                Vibe Coding Student Center
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_8px_rgba(99,102,241,0.2)]">
                Day 5 Final Day
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <p className="text-xs text-gray-400 font-mono flex items-center gap-1">
                <Compass className="h-3 w-3 text-indigo-400" /> 
                Kaggle 5-Day Intensive Study Companion
              </p>
            </div>
          </div>
        </div>

        {/* Brand new Top Navigation Bar */}
        <nav className="flex items-center gap-1 bg-[#0F1322]/80 border border-white/5 p-1 rounded-xl shadow-inner">
          <button
            onClick={() => setActiveTab("study")}
            className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "study"
                ? "bg-indigo-600/90 text-white shadow-[0_0_12px_rgba(99,102,241,0.3)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>AI Coach</span>
          </button>
          
          <button
            onClick={() => setActiveTab("terminal")}
            className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "terminal"
                ? "bg-indigo-600/90 text-white shadow-[0_0_12px_rgba(99,102,241,0.3)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>ADK Terminal</span>
          </button>
          
          <button
            onClick={() => setActiveTab("multiagent")}
            className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "multiagent"
                ? "bg-indigo-600/95 text-white shadow-[0_0_12px_rgba(99,102,241,0.3)] border border-indigo-500/20"
                : "text-cyan-300 font-semibold hover:text-white hover:bg-white/5"
            }`}
          >
            <Users className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span>Multi-Agent team</span>
          </button>
          
          <button
            onClick={() => setActiveTab("quiz")}
            className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold flex items-center gap-1.5 transition-all duration-300 ${
              activeTab === "quiz"
                ? "bg-indigo-600/90 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-indigo-500/30"
                : "text-[#C3DAF9] border border-cyan-500/20 bg-cyan-950/20 hover:text-white hover:bg-cyan-900/30 animate-pulse-slow"
            }`}
          >
            <Award className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span className="font-extrabold tracking-wider bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">Unit 5 Knowledge Quiz</span>
          </button>
        </nav>

        {/* Global Progress Hub (Fluids animated percentage) */}
        <div className="flex items-center gap-4 bg-[#0F172A]/50 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-sm shadow-inner">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">Course Progress</span>
            <span className="text-sm font-black text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text">
              {getOverallProgress()}% Done
            </span>
          </div>
          <div className="w-24 bg-gray-900/80 h-2 rounded-full overflow-hidden border border-white/5">
            <div 
              style={{ width: `${getOverallProgress()}%` }} 
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 h-full rounded-full transition-all duration-700 ease-out"
            />
          </div>
        </div>
      </motion.header>

      {/* Main Structural Column Grid */}
      <main className="relative z-10 flex-1 max-w-[1700px] mx-auto w-full p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Setup verification & Countdown (4 Cols) */}
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="lg:col-span-4 flex flex-col gap-6"
        >

          {/* Active Broadcast Notification Warning */}
          <AnimatePresence>
            {activeNotification && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                className={`relative overflow-hidden rounded-2xl border p-4 shadow-lg backdrop-blur-[12px] transition-all duration-300 ${
                  activeNotification.type === "alert"
                    ? "border-red-500/40 bg-red-950/20 shadow-red-950/40 animate-pulse-slow"
                    : "border-amber-500/40 bg-amber-950/20 shadow-amber-950/40"
                }`}
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-full blur-md" />
                <div className="flex gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-red-500/20 text-red-400 font-bold text-xs animate-pulse">
                        ●
                      </span>
                      <h4 className={`text-xs font-black uppercase tracking-wider ${
                        activeNotification.type === "alert" ? "text-red-300" : "text-amber-300"
                      }`}>
                        {activeNotification.title}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-200 leading-relaxed font-sans">
                      {activeNotification.message}
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveNotification(null)}
                    className="text-gray-400 hover:text-white p-1 rounded-lg bg-white/5 hover:bg-white/10 h-fit transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Setup Verification Tracker (Prerequisites checklist) - 21st.dev Premium Developer Console Style */}
          <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-[#090D1A]/90 backdrop-blur-[16px] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-indigo-500/30">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
            
            <div className="flex justify-between items-start pb-4 border-b border-gray-850 mb-4">
              <div>
                <span className="text-[9px] font-mono font-black text-indigo-400 uppercase tracking-widest block mb-0.5">System Context</span>
                <h3 className="font-display font-black text-sm uppercase tracking-wider text-white">
                  Environment Stack
                </h3>
              </div>
              {/* Readiness Score Badge */}
              <div className="text-right">
                <span className="block text-[8px] font-mono text-gray-500 uppercase tracking-widest font-bold">Verification Index</span>
                <span className="text-xs font-bold font-mono text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">
                  {calcReadinessScore()}% Configured
                </span>
              </div>
            </div>

            <p className="text-2xs sm:text-xs text-gray-400 leading-relaxed mb-4">
              Toggle environmental milestones below to synchronize local dev containers, active workspace APIs, and testing suites.
            </p>

            <div className="flex flex-col gap-2.5">
              {Object.keys(prereqs).map((key) => {
                const isChecked = prereqs[key];
                return (
                  <button
                    key={key}
                    onClick={() => handleTogglePrereq(key)}
                    className={`group/item p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      isChecked 
                        ? 'bg-[#0E1528]/80 border-indigo-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_0_12px_rgba(99,102,241,0.05)] text-white' 
                        : 'bg-black/40 border-gray-900 text-gray-400 hover:border-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2.5">
                      <div className="flex flex-col">
                        <span className="text-2xs font-mono text-gray-500 font-bold mb-0.5">MODULE</span>
                        <span className={`text-[11px] font-bold tracking-tight font-sans transition-colors ${
                          isChecked ? "text-gray-100" : "text-gray-400 group-hover/item:text-gray-200"
                        }`}>{key}</span>
                      </div>
                      
                      <div className="shrink-0">
                        {isChecked ? (
                          <div className="h-5 w-5 rounded-full bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.25)]">
                            <CheckCircle2 className="h-3 w-3" />
                          </div>
                        ) : (
                          <div className="h-5 w-5 rounded-full bg-gray-950 border border-gray-850 flex items-center justify-center text-gray-600 group-hover/item:border-gray-700">
                            <Circle className="h-2 w-2" />
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Simulated Live Console Telemetry */}
            <div className="mt-5 p-3 rounded-lg bg-black/50 border border-white/5 font-mono text-[9px] text-gray-400 space-y-1">
              <div className="flex items-center justify-between">
                <span>⚡ CORE PORT:</span>
                <span className="text-indigo-400">3000 (Proxy Active)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>🤖 COGNITIVE MODEL:</span>
                <span className="text-amber-400">Gemini 3.5 Flash</span>
              </div>
              <div className="flex items-center justify-between">
                <span>📡 PIPELINE SECURE:</span>
                <span className="text-emerald-400">Ready</span>
              </div>
            </div>

            {/* Custom linear animated progress meter */}
            <div className="mt-4 w-full bg-black/60 h-1 rounded-full overflow-hidden border border-white/5">
              <div 
                style={{ width: `${calcReadinessScore()}%` }} 
                className="bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-600 h-full rounded-full transition-all duration-700 ease-out"
              />
            </div>
          </div>

        </motion.section>

        {/* RIGHT COLUMN: Interactive Tabs Workspace Area (8 Cols) */}
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
          className="col-span-1 lg:col-span-8 flex flex-col gap-6"
        >

          {/* Primary View detailed overlay for selected target task */}
          <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-[#0F1424]/40 backdrop-blur-[12px] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.37)] transition-all duration-300">
            <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
              <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest bg-indigo-950/60 px-2.5 py-1 rounded border border-indigo-900/30">
                Focused Resource Card
              </span>
              <span className="text-[9px] font-mono text-gray-500">⏱ Estimate: {selectedTask.timeEstimate}</span>
            </div>

            <div>
              <h3 className="font-display font-semibold text-base text-white">
                {selectedTask.title}
              </h3>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                {selectedTask.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 mt-4">
              <a 
                href={selectedTask.url} 
                target="_blank" 
                rel="noreferrer"
                className="flex-1 min-w-[130px] rounded-lg bg-indigo-600 hover:bg-indigo-500 font-bold text-xs py-2 px-3.5 flex items-center justify-center gap-1.5 text-white transition-all shadow-md shadow-indigo-950/40"
              >
                Open Workspace <ExternalLink className="h-3 w-3" />
              </a>
              <button 
                onClick={() => handleSendChat(`Can you explain the assignment "${selectedTask.title}"? What are the core learnable topics from ${selectedTask.url}?`)}
                className="flex-1 min-w-[130px] rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-200 hover:text-white font-bold text-xs py-2 px-3 flex items-center justify-center gap-1.5 border border-gray-750 transition-all"
              >
                Ask Companion Bot <Bot className="h-3.5 w-3.5 text-indigo-300" />
              </button>
            </div>
          </div>

          {/* Interactive Workspace Tab controllers */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0F1424]/45 backdrop-blur-[12px] flex flex-col h-[780px] shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
            
            {/* Tab Controllers Row - Horizontally Scrollable on Mobile, shrink-0 and Scrollbar-None to prevent clipping */}
            <div className="shrink-0 flex overflow-x-auto scrollbar-none whitespace-nowrap flex-nowrap border-b border-gray-850 bg-gray-950/60 p-1 divide-x divide-white/5 scroll-smooth select-none">
              <button
                onClick={() => setActiveTab("capstone")}
                className={`flex-1 min-w-[90px] sm:min-w-0 py-3 text-[10px] sm:text-xs font-display font-black rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
                  activeTab === "capstone"
                    ? "bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-md shadow-rose-950/20"
                    : "text-amber-300 hover:text-white hover:bg-white/5 font-extrabold pb-0.5"
                }`}
              >
                <Award className="h-3.5 w-3.5 shrink-0 text-amber-300 animate-pulse" />
                <span>Capstone</span>
              </button>
              <button
                onClick={() => setActiveTab("study")}
                className={`flex-1 min-w-[70px] sm:min-w-0 py-3 text-[10px] sm:text-xs font-display font-black rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
                  activeTab === "study"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                <span>Coach</span>
              </button>
              <button
                onClick={() => setActiveTab("terminal")}
                className={`flex-1 min-w-[70px] sm:min-w-0 py-3 text-[10px] sm:text-xs font-display font-black rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
                  activeTab === "terminal"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Terminal className="h-3.5 w-3.5 shrink-0" />
                <span>CLI Sim</span>
              </button>
              <button
                onClick={() => setActiveTab("multiagent")}
                className={`flex-1 min-w-[95px] sm:min-w-0 py-3 text-[10px] sm:text-xs font-display font-black rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
                  activeTab === "multiagent"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/20 border border-indigo-500/20"
                    : "text-cyan-400 hover:text-white hover:bg-white/5 font-bold"
                }`}
              >
                <Users className="h-3.5 w-3.5 shrink-0 animate-pulse" />
                <span>Multi-Agent</span>
              </button>
              <button
                onClick={() => setActiveTab("quiz")}
                className={`flex-1 min-w-[60px] sm:min-w-0 py-3 text-[10px] sm:text-xs font-display font-black rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
                  activeTab === "quiz"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/20"
                    : "text-[#C3DAF9] hover:text-white hover:bg-white/5"
                }`}
              >
                <Award className="h-3.5 w-3.5 shrink-0" />
                <span>Quiz</span>
              </button>
            </div>

            {/* TAB IMPLEMENTATION PANEL */}
            <div className="flex-1 flex flex-col min-h-0">
              
              {/* TAB 0: KAGGLE CAPSTONE PROJECT PORTFOLIO PLANNER */}
              {activeTab === "capstone" && (
                <div className="flex-1 flex flex-col p-5 gap-4 overflow-y-auto scrollbar-style">
                  
                  {/* Senior Web Dev Explicit Layout Spacer - Prevents clipping under sticky tab bars */}
                  <div className="h-1.5 shrink-0" />

                  {/* STEP 1: Select track */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block">
                      Step 1: Choose Your Project Track
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { id: "good", icon: "🌍", label: "Agents for Good", desc: "Societal benefit & human impact" },
                        { id: "business", icon: "💼", label: "Agents for Business", desc: "Enterprise & operations speed" },
                        { id: "concierge", icon: "🛎️", label: "Concierge Agents", desc: "Safe daily habit assistant" },
                        { id: "freestyle", icon: "🎨", label: "Freestyle Track", desc: "Niche, experimental, creative" }
                      ].map((t) => {
                        const isSel = capstoneTrack === t.id;
                        return (
                          <button
                            key={t.id}
                            onClick={() => setCapstoneTrack(t.id as any)}
                            className={`p-3 rounded-xl border text-left transition-all relative ${
                              isSel 
                                ? "bg-amber-500/10 border-amber-500 text-white shadow-md shadow-amber-950/20" 
                                : "bg-gray-900/40 border-gray-800 text-gray-400 hover:border-gray-700 hover:bg-gray-900/60"
                            }`}
                          >
                            <span className="text-xl block mb-1">{t.icon}</span>
                            <span className="text-2xs font-bold font-sans block leading-none">{t.label}</span>
                            <span className="text-[9px] text-gray-500 font-sans block mt-1 leading-snug line-clamp-2">{t.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* STEP 2: Input Pitch Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                        Working Project Title
                      </label>
                      <input
                        type="text"
                        className="bg-gray-900 border border-gray-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        placeholder="e.g. VibeTracker Agentic CV Builder"
                        value={capstoneTitle}
                        onChange={(e) => setCapstoneTitle(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                        My Name / Team Roster Name
                      </label>
                      <input
                        type="text"
                        className="bg-gray-900 border border-gray-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        placeholder="e.g. Individual / Team Horizon"
                        value={capstoneTeam}
                        onChange={(e) => setCapstoneTeam(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Elevator pitch description text area */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                      Elevator Pitch & Solution Description
                    </label>
                    <textarea
                      rows={3}
                      className="bg-gray-900 border border-gray-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-sans leading-normal resize-none"
                      placeholder="Outline what problem your agents are solving and describe the workflow structure (e.g., Scribe agents, external MCP datasets, Gherkin test assertions, database persistence structures)..."
                      value={capstonePitch}
                      onChange={(e) => setCapstonePitch(e.target.value)}
                    />
                  </div>

                  {/* STEP 3: Concepts Checklist */}
                  <div className="flex flex-col gap-2 p-3.5 bg-gray-900/40 border border-white/5 rounded-xl">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-850">
                      <span className="text-[10px] font-mono font-bold text-gray-300 uppercase tracking-widest">
                        Step 2: Check Off Concept Demonstrations
                      </span>
                      <span className="text-[10px] font-mono font-bold text-amber-400">
                        {Object.values(capstoneConcepts).filter(v => v).length} / 5 Selected
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-400 leading-snug">
                      Your Kaggle project must demonstrate at least <strong className="text-gray-200">three of the concepts</strong> listed below. Touch each concept to tag your pitch and verify eligibility:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                      {[
                        { id: "adk", label: "Multi-Agent Systems built with ADK", desc: "Specialized programmatic sequential/hierarchical models" },
                        { id: "mcp", label: "Model Context Protocol (MCP) servers", desc: "Secure tool interfaces, dynamic content connections" },
                        { id: "skills", label: "Modular 'Agent Skills' Architecture", desc: "Progressive disclosure prompts equipped via SKILL.md" },
                        { id: "security", label: "Hardened Security Guardrails & HITL", desc: "Ephemeral sandboxing, human approval gates, vulnerability check" },
                        { id: "sdd", label: "Spec-Driven Development Gherkin Testing", desc: "Drafting Given/When/Then behavior criteria to compile features" }
                      ].map((concept) => {
                        const isChecked = capstoneConcepts[concept.id];
                        return (
                          <button
                            key={concept.id}
                            onClick={() => {
                              setCapstoneConcepts(prev => ({ ...prev, [concept.id]: !prev[concept.id] }));
                            }}
                            className={`p-2 rounded-lg border text-left flex gap-2.5 items-start transition-all ${
                              isChecked
                                ? "bg-indigo-950/15 border-indigo-500/30 text-indigo-200"
                                : "bg-[#0B0D18]/50 border-gray-850 text-gray-500 opacity-60 hover:opacity-100"
                            }`}
                          >
                            <span className="mt-0.5 font-mono shrink-0">
                                {isChecked ? "✅" : "⬜"}
                            </span>
                            <div className="min-w-0">
                              <h5 className="text-[11px] font-bold leading-normal">{concept.label}</h5>
                              <p className="text-[9px] text-gray-500 leading-normal">{concept.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Eligibility warning / success indicators */}
                    <div className="mt-2.5 pt-2.5 border-t border-gray-850">
                      {Object.values(capstoneConcepts).filter(v => v).length >= 3 ? (
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-350 text-2xs sm:text-xs font-bold text-center flex items-center justify-center gap-1.5">
                          <span>🎉 Concept Compliant! This proposal qualifies for full Kaggle Swag & badge consideration.</span>
                        </div>
                      ) : (
                        <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-350 text-2xs sm:text-xs font-bold text-center flex items-center justify-center gap-1.5">
                          <span>⚠️ Attention: You must choose at least 3 concepts to meet Capstone grading requirements.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Analyze pitch button */}
                  <button
                    onClick={handleAnalyzeCapstone}
                    disabled={!capstoneTitle || !capstonePitch || capstoneAILoading}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:bg-gray-800 disabled:text-gray-500 disabled:from-gray-900 disabled:to-gray-900"
                  >
                    {capstoneAILoading ? (
                      <>
                        <span className="flex gap-1">
                          <span className="h-2 w-2 rounded-full bg-white animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="h-2 w-2 rounded-full bg-white animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="h-2 w-2 rounded-full bg-white animate-bounce"></span>
                        </span>
                        <span>Compiling Architecture Plan ...</span>
                      </>
                    ) : (
                      <>
                        <Award className="h-4 w-4 text-amber-200 animate-pulse" />
                        <span>Analyze & Generate Architectural Plan</span>
                      </>
                    )}
                  </button>

                  {/* Dynamic Conversation Thread and Replying Text Editor inside the Capstone page! */}
                  {capstoneHistoryChat.length > 0 && (
                    <div className="flex flex-col gap-4 mt-2">
                      <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                        Interactive Project Advisor Thread
                      </span>
                      
                      <div className="flex flex-col gap-3.5">
                        {capstoneHistoryChat.map((msg, index) => {
                          const isAss = msg.role === "assistant";
                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`p-4 rounded-2xl border flex flex-col gap-2.5 shadow-sm transition-all duration-300 ${
                                isAss 
                                  ? "bg-[#090D1A]/95 border-amber-500/15 text-gray-200" 
                                  : "bg-gradient-to-r from-indigo-950/40 to-indigo-900/30 border-indigo-500/20 text-indigo-100 self-end w-full sm:w-[92%]"
                              }`}
                            >
                              <div className="flex items-center justify-between pb-1 px-1">
                                <div className="flex items-center gap-2">
                                  <span className={`text-[9px] uppercase font-mono tracking-wider font-extrabold px-2 py-0.5 rounded ${
                                    isAss ? "bg-amber-500/15 text-amber-300 border border-amber-500/10 shadow" : "bg-indigo-505/15 text-indigo-300 border border-indigo-500/10"
                                  }`}>
                                    {isAss ? "🤖 Advisor Coach" : "👤 My Suggestion / Reply"}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="markdown-body px-1 text-2xs sm:text-xs">
                                <Markdown>{msg.content}</Markdown>
                              </div>
                            </motion.div>
                          );
                        })}

                        {capstoneReplyLoading && (
                          <div className="p-4 rounded-2xl border bg-[#090D1A]/50 border-amber-500/10 text-gray-400 flex items-center justify-between">
                            <span className="text-2xs sm:text-xs text-gray-400 font-mono">Analyzing proposal...</span>
                            <span className="flex gap-1.5 shrink-0">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:-0.3s]"></span>
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:-0.15s]"></span>
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-bounce"></span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Replying Text Editor Interface */}
                      <div className="p-3 bg-gray-950/80 border border-gray-850 rounded-xl flex flex-col gap-2 mt-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1">
                            <span>💬 Capstone Replying Text Editor</span>
                          </label>
                          <span className="text-[9px] font-mono text-gray-500">Press Send to chat with Coach</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <textarea
                            rows={2}
                            className="flex-1 bg-gray-900 border border-gray-850 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 leading-normal font-sans resize-none"
                            placeholder="Suggest changes, ask for code snippets, draft Gherkin files or refine model security parameters..."
                            value={capstoneReplyText}
                            onChange={(e) => setCapstoneReplyText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendCapstoneReply();
                              }
                            }}
                          />
                          <button
                            onClick={handleSendCapstoneReply}
                            disabled={!capstoneReplyText.trim() || capstoneReplyLoading}
                            className="px-4 bg-gradient-to-tr from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-xs rounded-xl flex flex-col items-center justify-center gap-1 border border-amber-400/20 font-display transition-all disabled:from-gray-900 disabled:to-gray-900 disabled:text-gray-600 shrink-0 select-none cursor-pointer"
                          >
                            <span>Send</span>
                            <span>Reply</span>
                          </button>
                        </div>

                        {/* Quick Refinement Chips */}
                        <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-white/5">
                          {[
                            { label: "📝 Generate Gherkin Specs", text: "Can you draft detailed Given/When/Then Gherkin test stories for testing key features of my pitch?" },
                            { label: "🏗️ Refine Multi-Agent Flow", text: "What sequential ADK agent interactions or coordinate states would model this workflow perfectly? List them as roles." },
                            { label: "🛡️ Detail Security Blueprint", text: "Draft recommended non-deterministic safety policies like HITL validation rules, limits, or auditing logic." },
                            { label: "📋 Recommended API Scopes", text: "Which Gemini models, Firebase, or external Google Workspace API oauth scopes should we use to implement this?" }
                          ].map((chip, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setCapstoneReplyText(chip.text);
                              }}
                              className="text-[9px] py-1 px-2 rounded bg-gray-900/60 hover:bg-amber-500/10 border border-gray-850 hover:border-amber-500/30 text-gray-400 hover:text-amber-300 transition-colors"
                            >
                              {chip.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* TAB 1: AI COACH */}
              {activeTab === "study" && (
                <div className="flex-1 flex flex-col min-h-0 p-5 gap-4">
                  
                  {apiKeyConfigured === false && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3.5 bg-cyan-500/10 border border-cyan-500/25 rounded-xl flex items-start gap-2.5 shadow-sm"
                    >
                      <Sparkles className="h-4.5 w-4.5 text-cyan-400 shrink-0 mt-0.5" />
                      <div className="flex-1 text-2xs sm:text-xs text-cyan-200 leading-normal">
                        <strong className="text-cyan-300 font-extrabold uppercase tracking-wide">Study Assistant Active:</strong> Your AI Study Companion is running in **Active Offline Simulation Mode**. Syllabus interaction is fully operational! To use a live cloud-linked model, add a standard **GEMINI_API_KEY** under the **Secrets** tab inside your AI Studio workspace.
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Scrollable messages context */}
                  <div className="flex-1 overflow-y-auto space-y-5 pr-1 text-xs md:text-sm">
                    {chatHistory.map((msg, index) => (
                      <div 
                        key={index}
                        className={`flex gap-3 max-w-[88%] ${
                          msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                        }`}
                      >
                        <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 border text-[10px] font-bold ${
                          msg.role === "user" 
                            ? "bg-gradient-to-tr from-indigo-500 to-purple-600 text-white border-indigo-400/20 shadow-[0_0_12px_rgba(99,102,241,0.25)]"
                            : "bg-[#0B0D18]/90 text-indigo-300 border-indigo-500/20"
                        }`}>
                          {msg.role === "user" ? "U" : "AI"}
                        </div>

                        <div className={`p-4 rounded-2xl leading-relaxed shadow-sm transition-all duration-300 ${
                          msg.role === "user"
                            ? "bg-gradient-to-r from-indigo-650 to-purple-700 text-white rounded-tr-none whitespace-pre-wrap border border-indigo-400/10"
                            : "bg-[#090D1A]/95 border border-indigo-500/15 text-gray-200 rounded-tl-none font-sans"
                        }`}>
                          {msg.role === "user" ? (
                            msg.content
                          ) : (
                            <div className="markdown-body">
                              <Markdown>{msg.content}</Markdown>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex gap-3 max-w-[80%] mr-auto">
                        <div className="h-7 w-7 rounded-full bg-[#0B0D18]/90 text-indigo-300 border border-indigo-505/20 flex items-center justify-center shrink-0 text-[10px] font-bold">
                          AI
                        </div>
                        <div className="bg-[#090D1A]/50 border border-indigo-500/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-2.5">
                          <span className="text-xs text-gray-400">Thinking...</span>
                          <span className="flex gap-1">
                            <span className="h-1 w-1 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="h-1 w-1 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="h-1 w-1 rounded-full bg-indigo-400 animate-bounce"></span>
                          </span>
                        </div>
                      </div>
                    )}
                    <div ref={chatBottomRef} />
                  </div>

                  {/* Preset prompt questions tags chips footer */}
                  <div className="border-t border-gray-850/60 pt-3.5 flex flex-col gap-2">
                    <span className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-wider">💡 Suggested Prompts:</span>
                    <div className="flex flex-wrap gap-1.5">
                      <button 
                        onClick={() => handleSendChat("I want to build an Everyday Work Progress Tracker. How do I start designing Gherkin specifications for it?")}
                        className="text-[10px] py-1.5 px-3 rounded-xl bg-[#090D1A]/80 hover:bg-indigo-950/20 hover:border-indigo-500/40 border border-gray-850 text-gray-350 transition-all text-left duration-200 cursor-pointer"
                      >
                        📝 Design Tracker Gherkin Specs
                      </button>
                      <button 
                        onClick={() => handleSendChat("Explain the 4 phases of building the Everyday Work Progress Tracker and which APIs/SDKs to use.")}
                        className="text-[10px] py-1.5 px-3 rounded-xl bg-[#090D1A]/80 hover:bg-indigo-950/20 hover:border-indigo-500/40 border border-gray-850 text-gray-350 transition-all text-left duration-200 cursor-pointer"
                      >
                        🔌 Tracker 4 Phases & APIs
                      </button>
                      <button 
                        onClick={() => handleSendChat("How can I write a server-side route that uses the Gemini API to extract key accomplishments from raw work logs?")}
                        className="text-[10px] py-1.5 px-3 rounded-xl bg-[#090D1A]/80 hover:bg-indigo-950/20 hover:border-indigo-500/40 border border-gray-850 text-gray-350 transition-all text-left duration-200 cursor-pointer"
                      >
                        ⚡ Backend route to Parse achievements
                      </button>
                    </div>
                  </div>

                  {/* Input command center */}
                  <form 
                    onSubmit={(e) => { e.preventDefault(); handleSendChat(chatInput); }}
                    className="flex gap-2 bg-[#090D1A]/40 border border-white/5 p-1 rounded-2xl"
                  >
                    <input
                      type="text"
                      className="flex-1 bg-transparent border-0 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none placeholder:text-gray-500"
                      placeholder="Ask me anything... (e.g., code snippets, design templates, or spec debugging)"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      disabled={chatLoading}
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim() || chatLoading}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all duration-200 disabled:bg-gray-900/60 disabled:text-gray-600 flex items-center gap-1.5 text-xs sm:text-sm cursor-pointer"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>

                </div>
              )}

              {/* TAB 1.5: MULTI-AGENT CAREER TEAM SANDBOX */}
              {activeTab === "multiagent" && (
                <div className="flex-1 flex flex-col p-5 gap-4 overflow-y-auto scrollbar-style">
                  
                  {/* Dashboard Header */}
                  <div className="flex flex-col gap-1.5 border-b border-gray-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-cyan-400" />
                      <h4 className="text-sm font-display font-black text-white tracking-wide">
                        Everyday Work Progress Tracker (Active Multi-Agent Orchestration)
                      </h4>
                    </div>
                    <p className="text-2xs text-gray-400 font-sans leading-normal">
                      Harness Day 5's **Spec-Driven Sequential Agentic Handoff**. This pipeline takes a chaotic raw activity message and coordinates five specialized agents to parse, stylize, tag, career-match, and safely audit your achievements.
                    </p>
                  </div>

                  {/* API Connection Indicator */}
                  {apiKeyConfigured === false ? (
                    <div className="p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-xl text-2xs text-cyan-200 flex items-start gap-2.5">
                      <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-cyan-300 font-bold uppercase tracking-wide">Offline Local Logic Enabled:</strong> Running in lightweight rule-based parsing simulation mode. To execute with authentic Live sequential Gemini 3.5-Flash model calls, configure a real **GEMINI_API_KEY** secret in AI Studio!
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-2xs text-emerald-300 flex items-start gap-2.5">
                      <Sparkles className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
                      <div>
                        <strong className="text-emerald-400 font-bold uppercase tracking-wide">Live Multi-Agent Core Connected:</strong> Sequential A2A model tasks will be executed utilizing real-time Google Gemini instances!
                      </div>
                    </div>
                  )}

                  {/* Input form area */}
                  <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
                    <span className="text-[10px] font-mono text-gray-400 tracking-wider font-extrabold">STEP 1: ENTER RAW DAILY ACTIVITY LOG</span>
                    <textarea
                      rows={3}
                      className="w-full bg-black/60 border border-gray-800 focus:border-indigo-500/50 focus:outline-none rounded-xl p-3.5 text-xs sm:text-sm text-gray-200 font-sans leading-relaxed"
                      placeholder="Type yesterday's tasks as a raw messy draft (e.g. built express routing, added JWT auth key handling, tested database indexing queries)..."
                      value={multiAgentInput}
                      onChange={(e) => setMultiAgentInput(e.target.value)}
                      disabled={multiAgentLoading}
                    />

                    {/* Pre-configured Presets buttons */}
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="text-[10px] text-gray-500 font-mono mr-1">Load Preset Logs:</span>
                      <button
                        onClick={() => setMultiAgentInput("Implemented node Express endpoint, configured JWT secure session cookie properties, and resolved cross origin CORS errors on dev servers.")}
                        className="text-[9.5px] py-1 px-2.5 bg-gray-950/60 border border-gray-800 hover:border-indigo-500/30 text-gray-400 hover:text-white rounded-lg transition-all"
                        disabled={multiAgentLoading}
                      >
                        ⚡ Secure Auth Server
                      </button>
                      <button
                        onClick={() => setMultiAgentInput("Created python pipeline, optimized PostgreSQL subqueries with custom indexes, and exported data science reports matching spec constraints.")}
                        className="text-[9.5px] py-1 px-2.5 bg-gray-950/60 border border-gray-800 hover:border-indigo-500/30 text-gray-400 hover:text-white rounded-lg transition-all"
                        disabled={multiAgentLoading}
                      >
                        📊 SQL Data Pipeline
                      </button>
                      <button
                        onClick={() => setMultiAgentInput("Wrote React functional components, integrated beautiful tailwind mobile layouts, and loaded lazy states resolving re-render delays.")}
                        className="text-[9.5px] py-1 px-2.5 bg-gray-950/60 border border-gray-800 hover:border-indigo-500/30 text-gray-400 hover:text-white rounded-lg transition-all"
                        disabled={multiAgentLoading}
                      >
                        🎨 Interactive Web UI
                      </button>
                    </div>

                    {/* Run active team button */}
                    <button
                      onClick={handleRunMultiAgentPipeline}
                      disabled={multiAgentLoading || !multiAgentInput.trim()}
                      className="mt-1 w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-display font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-950/40 disabled:from-gray-900 disabled:text-gray-500 disabled:border disabled:border-gray-800"
                    >
                      {multiAgentLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin text-cyan-400" />
                          <span>Collaborating Team Executing Cascade...</span>
                        </>
                      ) : (
                        <>
                          <Users className="h-4 w-4 text-cyan-300" />
                          <span>Trigger Multi-Agent Team Execution</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* ACTIVE MULTI-AGENT STATE DECORATION */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-mono text-gray-400 tracking-wider font-extrabold">STEP 2: PIPELINE COOPERATIVE TRACE PATH</span>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                      
                      {/* Agent 1: Parser */}
                      <div className={`border p-3 rounded-xl transition-all flex flex-col justify-between h-[115px] ${
                        multiAgentCurrentStep === 0 ? "border-indigo-500/60 bg-indigo-950/10 shadow-[0_0_10px_rgba(99,102,241,0.2)]" :
                        multiAgentCurrentStep > 0 ? "border-emerald-500/30 bg-emerald-950/5" : "border-gray-850 bg-black/25"
                      }`}>
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-300">Parser Agent</span>
                            {multiAgentCurrentStep === 0 && <RefreshCw className="h-3 w-3 animate-spin text-indigo-400" />}
                            {multiAgentCurrentStep > 0 && <span className="text-emerald-400 text-xs">✔</span>}
                            {multiAgentCurrentStep < 0 && <span className="text-gray-600 text-2xs">Idle</span>}
                          </div>
                          <p className="text-[9.5px] text-gray-400 mt-1">Extracts active tasks & technologies.</p>
                        </div>
                        {multiAgentCurrentStep >= 0 && multiAgentResult?.summary && (
                          <div className="text-[9px] font-mono text-gray-500 border-t border-gray-800/50 pt-1 leading-tight truncate">
                            Tech: {multiAgentResult.summary.technologies?.slice(0,2).join(", ")}
                          </div>
                        )}
                      </div>

                      {/* Agent 2: Scribe */}
                      <div className={`border p-3 rounded-xl transition-all flex flex-col justify-between h-[115px] ${
                        multiAgentCurrentStep === 1 ? "border-indigo-500/60 bg-indigo-950/10 shadow-[0_0_10px_rgba(99,102,241,0.2)]" :
                        multiAgentCurrentStep > 1 ? "border-emerald-500/30 bg-emerald-950/5" : "border-gray-850 bg-black/25"
                      }`}>
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-300">Scribe Agent</span>
                            {multiAgentCurrentStep === 1 && <RefreshCw className="h-3 w-3 animate-spin text-indigo-400" />}
                            {multiAgentCurrentStep > 1 && <span className="text-emerald-400 text-xs">✔</span>}
                            {multiAgentCurrentStep < 1 && <span className="text-gray-600 text-2xs">Idle</span>}
                          </div>
                          <p className="text-[9.5px] text-gray-400 mt-1">Generates active ATS CV bullet points.</p>
                        </div>
                        {multiAgentCurrentStep >= 1 && multiAgentResult?.bullet && (
                          <div className="text-[9px] font-mono text-gray-500 border-t border-gray-800/50 pt-1 leading-tight truncate">
                            Verb: {multiAgentResult.bullet.split(" ")[0]}
                          </div>
                        )}
                      </div>

                      {/* Agent 3: Taxonomy */}
                      <div className={`border p-3 rounded-xl transition-all flex flex-col justify-between h-[115px] ${
                        multiAgentCurrentStep === 2 ? "border-indigo-500/60 bg-indigo-950/10 shadow-[0_0_10px_rgba(99,102,241,0.2)]" :
                        multiAgentCurrentStep > 2 ? "border-emerald-500/30 bg-emerald-950/5" : "border-gray-850 bg-black/25"
                      }`}>
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-300">Taxonomy Agent</span>
                            {multiAgentCurrentStep === 2 && <RefreshCw className="h-3 w-3 animate-spin text-indigo-400" />}
                            {multiAgentCurrentStep > 2 && <span className="text-emerald-400 text-xs">✔</span>}
                            {multiAgentCurrentStep < 2 && <span className="text-gray-600 text-2xs">Idle</span>}
                          </div>
                          <p className="text-[9.5px] text-gray-400 mt-1">Maps tech skills against taxonomy catalog.</p>
                        </div>
                        {multiAgentCurrentStep >= 2 && multiAgentResult?.tags && (
                          <div className="text-[9px] font-mono text-gray-500 border-t border-gray-800/50 pt-1 leading-tight truncate">
                            Tag: #{multiAgentResult.tags[1]}
                          </div>
                        )}
                      </div>

                      {/* Agent 4: Matcher */}
                      <div className={`border p-3 rounded-xl transition-all flex flex-col justify-between h-[115px] ${
                        multiAgentCurrentStep === 3 ? "border-indigo-500/60 bg-indigo-950/10 shadow-[0_0_10px_rgba(99,102,241,0.2)]" :
                        multiAgentCurrentStep > 3 ? "border-emerald-500/30 bg-emerald-950/5" : "border-gray-850 bg-black/25"
                      }`}>
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-300">Job Matcher</span>
                            {multiAgentCurrentStep === 3 && <RefreshCw className="h-3 w-3 animate-spin text-indigo-400" />}
                            {multiAgentCurrentStep > 3 && <span className="text-emerald-400 text-xs">✔</span>}
                            {multiAgentCurrentStep < 3 && <span className="text-gray-600 text-2xs">Idle</span>}
                          </div>
                          <p className="text-[9.5px] text-gray-400 mt-1">Computes fit scoring against live roles.</p>
                        </div>
                        {multiAgentCurrentStep >= 3 && multiAgentResult?.matches && (
                          <div className="text-[9px] font-mono text-gray-500 border-t border-gray-800/50 pt-1 leading-tight truncate">
                            Max Overlap: {multiAgentResult.matches[0]?.matchScore}%
                          </div>
                        )}
                      </div>

                      {/* Agent 5: Policy Reviewer */}
                      <div className={`border p-3 rounded-xl transition-all flex flex-col justify-between h-[115px] ${
                        multiAgentCurrentStep === 4 ? "border-indigo-500/60 bg-indigo-950/10 shadow-[0_0_10px_rgba(99,102,241,0.2)]" :
                        multiAgentCurrentStep > 4 ? (multiAgentAuditPassed === false ? "border-rose-500/30 bg-rose-950/5" : "border-emerald-500/30 bg-emerald-950/5") : "border-gray-850 bg-black/25"
                      }`}>
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-300">Policy Auditor</span>
                            {multiAgentCurrentStep === 4 && <RefreshCw className="h-3 w-3 animate-spin text-indigo-400" />}
                            {multiAgentCurrentStep > 4 && (
                              multiAgentAuditPassed === false ? <span className="text-rose-400 font-extrabold text-xs">✖</span> : <span className="text-emerald-400 text-xs">✔</span>
                            )}
                            {multiAgentCurrentStep < 4 && <span className="text-gray-600 text-2xs">Idle</span>}
                          </div>
                          <p className="text-[9.5px] text-gray-400 mt-1">Audits outputs for leaks and size criteria.</p>
                        </div>
                        {multiAgentCurrentStep >= 4 && (
                          <div className={`text-[9px] font-mono border-t border-gray-800/50 pt-1 leading-tight truncate ${multiAgentAuditPassed === false ? "text-rose-400" : "text-emerald-400"}`}>
                            Status: {multiAgentAuditPassed === false ? "REJECTED" : "PASSED"}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* STEP 3: ENRICHED HIGHLIGHTS RESULTS */}
                  {multiAgentCurrentStep === 5 && multiAgentResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col gap-4 border-t border-gray-850 pt-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-indigo-400 tracking-wider font-extrabold">STEP 3: ENRICHED MULTI-AGENT SYNTAX COMPILATION</span>
                        <div className="flex items-center gap-1.5 text-2xs font-mono text-gray-500">
                          <span>Team Handoff total duration:</span>
                          <strong className="text-gray-300">{multiAgentTrace.length > 0 ? multiAgentTrace.reduce((acc, t) => acc + (t.durationMs || 0), 0) : 199}ms</strong>
                        </div>
                      </div>

                      {/* Main result cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Enriched Resume Card */}
                        <div className="bg-gradient-to-br from-indigo-950/20 to-black/60 border border-indigo-500/25 rounded-2xl p-4 flex flex-col gap-3 shadow-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-indigo-300">✓ ATS-Enriched Resume Highlight</span>
                            <span className="px-1.5 py-0.5 text-[8px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded font-mono">SCRIBE AGENT</span>
                          </div>
                          <p className="text-xs sm:text-sm italic text-gray-200 leading-relaxed bg-[#0c0f1d]/80 border border-white/5 p-3 rounded-xl shadow-inner font-sans">
                            "{multiAgentResult.bullet}"
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {multiAgentResult.tags?.map((tag: string, i: number) => (
                              <span key={i} className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-[#13192f] text-cyan-300 border border-cyan-500/10">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Suitability Mapping Overlaps */}
                        <div className="bg-gray-950/60 border border-gray-850 rounded-2xl p-4 flex flex-col justify-between">
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#93c5fd]">💼 Internship Suitability Benchmarks</span>
                              <span className="px-1 py-0.5 text-[8px] bg-blue-500/10 text-blue-300 rounded font-mono">MATCHER AGENT</span>
                            </div>
                            <p className="text-3xs text-gray-500 font-sans">Overlap calculations based on extracted asset frameworks tags.</p>
                          </div>

                          <div className="space-y-3.5 my-3">
                            {multiAgentResult.matches?.map((m: any, idx: number) => (
                              <div key={idx} className="flex flex-col gap-1">
                                <div className="flex items-center justify-between text-2xs">
                                  <span className="text-gray-300 font-bold">{m.title} <span className="text-xs text-gray-500 font-normal">at {m.company}</span></span>
                                  <span className="font-mono text-cyan-400 font-extrabold">{m.matchScore}% match</span>
                                </div>
                                <div className="w-full bg-black h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${m.matchScore}%` }}
                                  />
                                </div>
                                <span className="text-[9.5px] text-gray-400 italic leading-snug">{m.reason}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Policy Review Audit Shield banner */}
                      <div className={`p-4 rounded-xl border flex items-start gap-3.5 shadow-md ${
                        multiAgentAuditPassed === false 
                          ? "bg-rose-950/20 border-rose-500/20 text-rose-200" 
                          : "bg-emerald-950/20 border-emerald-500/20 text-emerald-200"
                      }`}>
                        <div className={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center border font-mono text-sm ${
                          multiAgentAuditPassed === false ? "bg-rose-900/30 border-rose-500/30 text-rose-400" : "bg-emerald-900/30 border-emerald-500/30 text-emerald-400"
                        }`}>
                          🛡️
                        </div>
                        <div className="flex-1 text-2xs leading-relaxed">
                          <div className="flex items-center justify-between">
                            <span className="font-display font-black uppercase text-[10.5px] tracking-wide">
                              {multiAgentAuditPassed === false ? "SECURITY POLICY BANNER WARNING" : "ZERO-TRUST CERTIFICATE SIGN-OFF"}
                            </span>
                            <span className="font-mono font-bold text-gray-500">POLICY AGENT</span>
                          </div>
                          <p className="text-gray-300 font-sans mt-0.5 leading-normal">
                            {multiAgentAuditReport}
                          </p>
                        </div>
                      </div>

                    </motion.div>
                  )}

                  {/* Explanatory Multi-Agent Principles footer */}
                  <div className="border-t border-gray-850/80 mt-2 pt-4 flex flex-col gap-2">
                    <span className="text-[10px] font-mono text-gray-400 tracking-wider">LEARNING THEORIES & BLUEPRINTS:</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-2xs text-gray-400 leading-normal">
                      <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex flex-col gap-1">
                        <strong className="text-gray-200 font-extrabold flex items-center gap-1">
                          <span className="text-cyan-400">❶</span> Sequential Collaboration Channels
                        </strong>
                        Each agent implements a distinct API role constraint (Parser → Scribe → Matcher) passing modular states as variables, avoiding massive chat loop hallucinations.
                      </div>
                      <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex flex-col gap-1">
                        <strong className="text-gray-200 font-extrabold flex items-center gap-1">
                          <span className="text-indigo-400">❷</span> Automated Policy Gatekeepers
                        </strong>
                        A Zero-Trust validation layer (Pillar 7) evaluates compiled candidate content prior to deployment or storage, filtering keys/sensitive records immediately.
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: ADK TERMINAL */}
              {activeTab === "terminal" && (
                <div className="flex-1 flex flex-col justify-between p-5 bg-black/60 font-mono text-xs sm:text-sm">
                  
                  <div className="bg-[#110D16]/60 p-3 rounded-xl border border-white/5 mb-3 flex items-start gap-2">
                    <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="text-[10.5px] font-sans text-gray-400 leading-normal">
                      <strong className="text-gray-200">Terminal Emulator:</strong> Try typing <code className="bg-gray-800 text-white px-1 rounded">pip install google-adk</code> or <code className="bg-gray-800 text-white px-1 rounded">adk create</code> to preview terminal layouts.
                    </span>
                  </div>

                  {/* Screen buffer */}
                  <div className="flex-1 overflow-y-auto bg-black p-4 rounded-xl border border-white/5 mb-3 space-y-1.5 scrollbar-style shadow-inner">
                    {terminalLogs.map((log, index) => {
                      let typeColor = "text-gray-300";
                      if (log.type === "input") typeColor = "text-indigo-400 font-bold";
                      if (log.type === "success") typeColor = "text-emerald-400 font-medium";
                      if (log.type === "error") typeColor = "text-rose-500";
                      if (log.type === "system") typeColor = "text-cyan-400/80";

                      return (
                        <div key={index} className={`whitespace-pre-wrap ${typeColor}`}>
                          {log.text}
                        </div>
                      );
                    })}
                    <div ref={terminalBottomRef} />
                  </div>

                  {/* Input console */}
                  <form onSubmit={handleExecuteTerminal} className="flex items-center bg-gray-950 border border-white/5 p-1.5 rounded-xl">
                    <span className="text-indigo-400 font-bold px-3">$</span>
                    <input
                      type="text"
                      className="flex-1 bg-transparent border-none text-white focus:outline-none focus:ring-0 text-xs sm:text-sm font-mono placeholder-gray-700"
                      placeholder="pip install google-adk"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="bg-gray-900 border border-white/10 hover:bg-gray-800 transition-colors text-indigo-400 text-[10.5px] font-bold px-3 py-1.5 rounded-lg"
                    >
                      Execute
                    </button>
                  </form>

                </div>
              )}

              {/* TAB 3: KNOWLEDGE QUIZ */}
              {activeTab === "quiz" && (
                <div className="flex-1 flex flex-col p-5 gap-4 min-h-0">
                  
                  <div className="flex justify-between items-center text-2xs text-gray-400 font-mono">
                    <span>Question {currentQuizIndex + 1} of {QUIZ_QUESTIONS.length}</span>
                    <span>Score: {quizScore} / {QUIZ_QUESTIONS.length}</span>
                  </div>

                  {!quizComplete ? (
                    <div className="flex-1 flex flex-col gap-3 min-h-0 justify-between">
                      
                      <div className="w-full bg-gray-900 h-1 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${(currentQuizIndex / QUIZ_QUESTIONS.length) * 100}%` }} 
                          className="bg-indigo-400 h-full rounded-full transition-all duration-300"
                        />
                      </div>

                      <div className="p-3 bg-gray-900/50 border border-white/5 rounded-xl mt-1">
                        <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-3">
                          {QUIZ_QUESTIONS[currentQuizIndex].question}
                        </h4>
                      </div>

                      {/* Multiple choice options */}
                      <div className="flex flex-col gap-2">
                        {QUIZ_QUESTIONS[currentQuizIndex].options.map((option, index) => {
                          const isSelected = selectedOption === index;
                          const isCorrect = index === QUIZ_QUESTIONS[currentQuizIndex].correctAnswerIndex;

                          let btnStyle = "bg-gray-900/40 border-gray-800 text-gray-300 hover:bg-gray-900/70";
                          if (isSelected) {
                            btnStyle = "bg-indigo-500/10 border-indigo-500 text-indigo-300";
                          }

                          if (quizIsSubmitted) {
                            if (isCorrect) {
                              btnStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-300";
                            } else if (isSelected) {
                              btnStyle = "bg-rose-500/10 border-rose-500 text-rose-300";
                            } else {
                              btnStyle = "bg-gray-900/20 border-gray-900/30 text-gray-500 select-none pointer-events-none";
                            }
                          }

                          return (
                            <button
                              key={index}
                              onClick={() => handleSelectQuizOption(index)}
                              disabled={quizIsSubmitted}
                              className={`p-3 rounded-lg border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{option}</span>
                              {quizIsSubmitted && isCorrect && <Check className="h-4 w-4 text-emerald-400 shrink-0" />}
                              {quizIsSubmitted && isSelected && !isCorrect && <X className="h-4 w-4 text-rose-500 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Answer Feedback Description box */}
                      {quizIsSubmitted && (
                        <div className="p-3 bg-gray-950/60 border border-white/5 rounded-lg text-2xs sm:text-xs text-gray-400 leading-normal">
                          <strong className="text-indigo-400">Mentor Explanation:</strong> {QUIZ_QUESTIONS[currentQuizIndex].explanation}
                        </div>
                      )}

                      {/* Footer Actions */}
                      <div className="border-t border-gray-850 pt-3">
                        {quizIsSubmitted ? (
                          <button
                            onClick={handleNextQuizQuestion}
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 font-bold text-xs sm:text-sm text-white rounded-xl transition-all flex items-center justify-center gap-1"
                          >
                            <span>{currentQuizIndex === QUIZ_QUESTIONS.length - 1 ? "Finish Evaluation" : "Proceed Next"}</span>
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={handleSubmitQuizAnswer}
                            disabled={selectedOption === null}
                            className="w-full py-2.5 bg-gray-100 hover:bg-white text-gray-900 font-bold text-xs sm:text-sm rounded-xl transition-all disabled:bg-gray-800 disabled:text-gray-500"
                          >
                            Verify Selected Answer
                          </button>
                        )}
                      </div>

                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col justify-center items-center text-center p-6 gap-4">
                      <div className="h-12 w-12 bg-indigo-950 border border-indigo-500/40 rounded-full flex items-center justify-center animate-bounce">
                        <Award className="h-6 w-6 text-indigo-400" />
                      </div>

                      <div>
                        <h4 className="text-base font-black text-white">Unit 4 Concept Check Complete!</h4>
                        <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed mt-1">
                          You scored <span className="text-indigo-400 font-bold">{quizScore} of {QUIZ_QUESTIONS.length}</span> correctly. This establishes your high understanding level of Vibe Coding Agent Security, Ephemeral Sandboxing, and Trajectory Evaluation.
                        </p>
                      </div>

                      <button
                        onClick={handleResetQuiz}
                        className="py-2 px-4 bg-gray-900 border border-white/5 hover:bg-gray-800 text-gray-300 text-xs font-bold rounded-lg transition-colors"
                      >
                        Restart Review
                      </button>
                    </div>
                  )}

                </div>
              )}

            </div>

          </div>

          {/* User Notebook Notes Saver Panel */}
          <div className="rounded-2xl border border-white/10 bg-[#0F1424]/40 backdrop-blur-[12px] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col gap-2.5">
            <span className="text-xs text-gray-400 font-mono uppercase tracking-widest block">Event Notes and Key Takeaways</span>
            <textarea
              className="w-full h-24 bg-black/30 border border-white/5 rounded-xl p-3 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50 resize-none leading-relaxed"
              placeholder="Jot down notes or code snippets from the ADK Web UI or Google Cloud Run deployment setups..."
              value={personalNotes}
              onChange={(e) => setPersonalNotes(e.target.value)}
            />
            <div className="flex justify-between items-center text-[10px] text-gray-500">
              <span className="italic">Data is autosaved locally</span>
              {personalNotes && (
                <button 
                  onClick={() => setPersonalNotes("")}
                  className="text-indigo-400 hover:underline hover:text-indigo-300 transition-colors"
                >
                  Reset notes buffer
                </button>
              )}
            </div>
          </div>

        </motion.section>

      </main>

      <footer className="relative z-10 text-center py-4 border-t border-white/5 mt-auto text-[10px] text-gray-600 font-mono tracking-wider">
        <span>Google & Kaggle 5-Day Intensive Official Event Study Dashboard • Built with Agentic Engineering Principles</span>
      </footer>

    </div>
  );
}
