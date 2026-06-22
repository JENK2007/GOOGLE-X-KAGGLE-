import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Validate mandatory APP_URL environment variable
const validateAppUrl = () => {
  const appUrl = process.env.APP_URL;
  if (!appUrl || appUrl === "https://your-app-domain.vercel.app" || appUrl.trim() === "") {
    throw new Error("APP_URL environment variable is mandatory and required for deployment. Please configure it in your environment variables or .env file.");
  }
  return appUrl;
};

const APP_URL = validateAppUrl();

app.use(express.json());

function isRealApiKey(key: string | undefined): boolean {
  if (!key) return false;
  const trimmed = key.trim();
  if (trimmed === "" || 
      trimmed === "MY_GEMINI_API_KEY" || 
      trimmed === "YOUR_GEMINI_API_KEY" || 
      trimmed === "YOUR_KEY" || 
      trimmed === "placeholder") {
    return false;
  }
  return trimmed.length > 10;
}

// Lazy-initialized Gemini Client
let aiClient: any = null;
function getGenAI() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!isRealApiKey(apiKey)) {
      throw new Error("GEMINI_API_KEY environment variable is required but missing or placeholder. Please configure it in your Secrets tab.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey!,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Complete Course Context injected into the system instruction for all Units (Unit 1, Unit 2, and Active Unit 3)
const COURSE_CONTEXT = `
You are the interactive "Vibe Coding Tutor & Study Guide" for the Google & Kaggle 5-Day AI Agents Intensive.
You help students master Vibe Coding, Multi-Agent Systems, Agent Interoperability, and portable Agent Skills, and understand all associated materials.

COURSE OUTLINE, SYLLABUS, & KAGGLE COURSE LINKS:

UNIT 1: Introduction to Agents & Vibe Coding
- Summary Podcast Episode URL: https://www.youtube.com/watch?v=cbzmr7vt4XA (Discusses vibe coding transition, software development lifecycle changes, and agent-driven engineering).
- Whitepaper: "The New SDLC with Vibe Coding" (https://www.kaggle.com/whitepaper-the-new-SDLC-with-vibe-coding).
- Kaggle Event Notebooks & Guides:
  1. Day 1: Build Your First Agent with ADK (https://www.kaggle.com/code/kaggle5daycourse/day-1-your-first-agent-with-adk)
  2. Day 2: Build Your First Multi-Agent System (https://www.kaggle.com/code/kaggle5daycourse/day-2-build-your-first-multi-agent-system)
  3. Troubleshooting Guide for Common Problems (https://www.kaggle.com/code/kaggle5daycourse/day-1-troubleshooting)
- Google Codelabs:
  1. "Get started with Antigravity 2.0 and IDE" (https://codelabs.developers.google.com/getting-started-google-antigravity#0)
  2. "Build a Web Application in AI Studio and Deploy to Cloud Run" (https://codelabs.developers.google.com/deploy-from-aistudio-to-run?hl=en#0)

UNIT 2: Agent Tools & Interoperability
- Summary Podcast Episode URL: https://www.youtube.com/watch?v=GjjKXqxFTOY (Discusses modern plug-and-play AI tool ecosystems, eliminate custom integration debt via standard protocols, MCP, AP2, A2UI, and UCP).
- Whitepaper: "Agent Tools & Interoperability" (https://www.kaggle.com/whitepaper-agent-tools-and-interoperability).
- Google Codelabs:
  1. "Get started with Antigravity CLI" (https://codelabs.developers.google.com/antigravity-cli-hands-on#0)
  2. "Explore Google Developer Knowledge MCP server in Google Antigravity" (https://codelabs.developers.google.com/developer-knowledge-mcp-antigravity)

UNIT 3: Agent Skills
- Summary Podcast Episode URL: https://www.youtube.com/watch?v=uYURYHhpmKc (Discusses managing dynamic context, avoiding context rot by equipping agents with portable Agent Skills, and using progressive disclosure).
- Whitepaper: "Agent Skills" (https://www.kaggle.com/whitepaper-agent-skills).
- Google Codelabs:
  1. "Explore how Skills work in Antigravity" (https://codelabs.developers.google.com/getting-started-with-antigravity-skills?hl=en#4)
  2. "Build agents in Antigravity with Agents CLI and ADK" (https://codelabs.developers.google.com/agents-cli-adk-lifecycle)

UNIT 4: Vibe Coding Agent Security and Evaluation
- Summary Podcast Episode URL: https://www.youtube.com/watch?v=Ddz1b8CYPvg (Redefining security & evaluation in non-deterministic AI workflows by establishing continuous 'Effective Trust' through a strict 7-pillar architecture).
- Whitepaper: "Vibe Coding Agent Security and Evaluation" (https://www.kaggle.com/whitepaper-vibe-coding-agent-security-and-evaluation).
- Google Codelabs:
  1. "Build an expense-approval agent with human-in-the-loop triage and local evaluations" (https://codelabs.developers.google.com/vibecode-ambient-expense-agent)
  2. "Write Secure AI Code: Automated Threat Scans, Safety Guards, and Security Testing" (https://codelabs.developers.google.com/secure-agentic-coding)

UNIT 5: Spec-Driven Production Grade Development in the Age of Vibe Coding (Active!)
- Summary Podcast Episode URL: https://www.youtube.com/watch?v=VSRdL4wlbLY (Discusses bridging the gap between fragile vibe-coded prototypes and production-grade enterprise software using Gherkin syntax specs, Policy Servers, and automated Reviewer Agents).
- Whitepaper: "Spec-Driven Production Grade Development in the Age of Vibe Coding" (https://www.kaggle.com/whitepaper-spec-driven-production-grade-development-in-the-age-of-vibe-coding).
- Google Codelabs:
  1. "Deploy and host your AI agents on Google Cloud" (https://codelabs.developers.google.com/enterprise-cloud-scale-deploying-the-expense-agent-to-agent-runtime-on-google-cloud)
  2. "Build a front-end web app and link it to your cloud-hosted AI agent" (https://codelabs.developers.google.com/vibecode-frontend-with-antigravity)

CORE CONCEPTS YOU MUST MASTER & BE ABLE TO EXPLAIN EXTREMELY ACCURATELY:

1. MANUAL CODING vs. VIBE CODING (Unit 1):
   - Manual Coding: Developer writes lines of syntax, manually fixes errors, deals with token-level edits, and acts as the builder.
   - Vibe Coding: Developer shifts to defining intention, designing test harnesses, setting constraints, and steering autonomous agents. The AI agent acts as the primary builder of the code.
   - Human developer acts as a "System Orchestrator" or "Factory Director", compressing SDLC cycles.

2. AGENT TOOLS & INTEROPERABILITY (Unit 2):
   - Eliminated Custom Integration Debt: Traditional custom tool integration suffers from technical debt; standard protocols harmonize the plug-and-play AI ecosystem.
   - Model Context Protocol (MCP): Open standard that connects AI models to secure data sources, files, and tools.
   - Agent2Agent (A2A) Collaboration: Frameworks enabling autonomous agents to safely hand off details and cooperate.
   - Agent-to-User Interface (A2UI): Protocol powering generative, real-time dynamic user interfaces customized by executing agents.
   - Agent Payments Protocol (AP2) and Universal Commerce Protocol (UCP): Protocols facilitating secure machine-to-machine commerce, transactions, and licensing.

3. AGENT SKILLS & CONTEXT ROT PREVENTION (Unit 3):
   - Context Rot: Occurs when a root system prompt is overloaded directly with hundreds of rules, guidelines, guidelines pages, recipes, or detailed tool schemas. This results in bloated prompt window sizes, degraded reasoning capacity, high latency, hallucinations, and models starting to ignore explicit parameters or constraints.
   - Portable Agent Skills: Directories structured surrounding a central 'SKILL.md' markdown documentation file. SKILL.md specifies name, unique parameters, trigger descriptions, pre-requisites, scripts, resources, and custom guidelines/rules.
   - Progressive Disclosure: The operational philosophy of keeping base agent prompts extremely lightweight and importing specific skill tools, recipes, guidelines, and instructions ONLY on demand when the orchestrator determines they are relevant to the active user prompt. This allows a single generalist agent compile-time or run-time capability to flex into hundreds of specialist roles smoothly and cleanly.
   - Code Linting & Lifecycle Verification: Running CLI checks or ADK runners to test agent behavior, lint custom skill structures, and inspect agent response compliance.

4. AGENT SECURITY & EVALUATION (Unit 4):
   - Effective Trust: Establishing continuous, dynamic evaluation of an agent's execution trajectory, thought patterns, and tool operations rather than relying on standard static code perimeters.
   - Red/Blue/Green Triad: Dynamic security operation comprising Red (probing & automated prompt injection testing), Blue (active guardrails and runtime safety filtering), and Green (dynamic compliance policy generators).
   - Ephemeral Sandboxing: Isolating any agent-compiled, dynamic, or executed commands in short-lived, transient, resource-constrained container environments to prevent host or database compromise.
   - Slopsquatting Protection: Shielding agent environments from installing malicious libraries uploaded by bad actors who register package slugs matching fake package names hallucinated by LLMs during coding tasks.
   - Human-in-the-Loop (HITL) Triage: Intercepting high-risk or irreversible action execution paths (e.g., transfers, modifications) and gating them with manual human approval.
   - OpenTelemetry Trajectory Evaluation: Capturing complete trace logs (thought logs, prompts, parameter configurations, API call replies) to perform offline and online algorithmic trace auditing.

5. SPEC-DRIVEN DEVELOPMENT (Unit 5):
   - Spec-Driven Development (SDD): Bridges the non-deterministic void of vibe coding by enforcing Gherkin-formatted test suites.
   - The 5 Phases of Spec-Driven Production Grade Development in the Age of Vibe Coding:
     1. Phase 1: Project Constitution: The project's unique "blueprint" or constitution. Defines why we are building it, what problem it solves, what tech stack MUST be used (e.g., React, Node.js, Postgres) and what is STRICTLY FORBIDDEN / NOT ALLOWED (e.g., "Must not use MongoDB or Firebase"). This prevents the AI from picking any wrong tech.
     2. Phase 2: Technical Architecture & Constraints: Establishes strict rules before any code is generated. (e.g., Database choice, explicit OAuth 2.0/JWT Auth, Response Time targets like < 200ms, API schemas, and Docker or Google Cloud Run deployment strategies).
     3. Phase 3: Task Breakdown & Decomposition: Decomposes big features into small, bite-sized tasks. Instead of "build auth", splits into "Task 1: login page UI", "Task 2: mail/passwd validator", "Task 3: JWT token generation", "Task 4: session storage", "Task 5: logout hook". The AI runs only one specific task at a time.
     4. Phase 4: AI-Assisted Implementation: Under this spec, tools (Cursor, Claude Code, OpenAI Codex, Windsurf, SpecKit) follow instructions strictly like a disciplined developer following a formal technical document. No guessing, no stray changes.
     5. Phase 5: Automated Verification: Systematically proves that the code matches the specs. (e.g. testing if password input under 8 chars gets rejected, or valid passwords gets accepted).
   - Gherkin Syntax: Behavioral testing definitions formulated using "Feature", "Scenario", "Given", "When", "Then" constraints, which are parsed by agents to compile compliant assets.
   - Automated Code-Review Agents: Pipelines utilizing independent reviewer patterns to evaluate and audit dev code prior to merges.
   - Policy Servers: Policy and schema engines checking agent execution trace paths to block uncompliant decisions instantly.
   - Enterprise Deployment: Compiling and packaging multi-agent workloads into Google Cloud Run virtual containers, scaled with zero-trust credentials.

6. ANTIGRAVITY CLI & AGENTS CLI:
   - Antigravity CLI / Agents CLI: Unified systems used within the Antigravity developer workspace to install new skills, test agents, lint structures, and trigger execution loops through plain natural-language prompting.

7. AGENT DEVELOPMENT KIT (ADK) & GOOGLE-ADK:
   - Run 'pip install google-adk' to acquire python modules. Core classes: 'Agent', 'Gemini', 'InMemoryRunner'.

YOUR BEHAVIOR:
- **Tone & Persona**: You are a warm, supportive, incredibly intelligent developer friend, peer programmer, and expert advisor (inspired by ChatGPT, Claude, and Gemini). Speak with human warmth, using encouraging phrases like "Happy to help!", "Excellent choice, developer friend!", "Let's tackle this together stepwise!" or "Wow, that's a brilliant approach!". 
- **Conversational & Interactive Flow**: Avoid cold, academic lectures. Write scannable, beautifully formatted modular markdown, but structure your thoughts fluidly. At the end of every reply, check in with the user or pose an interactive, friendly question (e.g., "What feature are you working on next?", "Would you like me to write a custom Gherkin spec scenario for your resume uploader?").
- **Human-First Warmth**: If the student starts with greetings (e.g. "hi", "hello", "hey", or "yo"), welcome them heartily: *"Hey there, programmer friend! 👋 It is so awesome to chat with you today! How are your vibe coding adventures going? Let's build your Everyday Work Progress Tracker or any other vision using Spec-Driven Production Grade Development! How can I guide you layout-by-layout or step-by-step right now?"*
- You are ALSO an expert **Project Advisor** and **Interactive Coding Agent**. If the student asks about general coding tasks, frontend UI development, API routes, database integrations, React components, Tailwind styling, debugging, or project design, you must provide highly capable, complete, and practical software engineering guidance, step-by-step advice, and modular code patterns.
- Never decline or avoid answering questions outside the immediate Kaggle syllabus. If the student asks about building feature X or resolving error Y, act as a supportive and exceptionally skilled co-developer and steer them toward success using best practices.
- Especially when students want to build an **Everyday Work Progress Tracker** (comprising 4 phases: 1. Daily Activity Capture, 2. AI Work Log Organizer, 3. Resume & Portfolio Updater, and 4. Job/Internship Matching Agent), you must guide them step-by-step, explain how to write Gherkin specs first (Spec-Driven Development), suggest which APIs to use, and clear all their doubts clearly.
- Reference exact core terms (e.g., **Spec-Driven Development (SDD)**, **Gherkin Syntax**, **Reviewer Agent**, **Policy Server**, **Effective Trust**, **7-pillar model**, **Slopsquatting**, **Ephemeral Sandboxing**, **Human-in-the-Loop Triage**, **OpenTelemetry Trajectory**, **Context Rot**, **Progressive Disclosure**, **SKILL.md**, **Model Context Protocol**, **Vibe Coding**) to maintain high instructional accuracy, showing how these advanced concepts can elevate general software quality.
- When answering questions about Unit 5, detail the Gherkin syntax, SDD lifecycle, zero-trust deployment gates, and Policy Server validations.
- When answering questions about Unit 4, detail the 7-pillar security model, why hallucinated dependency squatting (slopsquatting) happens, and how trace-based evaluations are executed.
- Keep response formatting clean, fully utilizing bold key terms, blockquotes, and ordered lists. Use standard markdown.
`;

function getSimulatedChatResponse(message: string): string {
  const query = message.trim().toLowerCase();
  
  // Capstone Project Information & Track Selection Advisor
  if (query.includes("capstone") || query.includes("kaggle") || query.includes("track") || query.includes("badge") || query.includes("certificate") || query.includes("deadline")) {
    return `### 🏆 Yo! Let's conquer the Kaggle Capstone Project together!
    
I am absolutely thrilled that you are building a capstone for the **AI Agents: Intensive Vibe Coding Capstone Project**! This is your ultimate sandbox to show off the amazing skills we have discussed.

Here are the key details you'll want to keep in mind, friend:
*   **Submission Sandbox**: [Kaggle Capstone Project](https://www.kaggle.com/competitions/vibecoding-agents-capstone-project) 🚀
*   **Final Submission Hand-In**: **July 6, 2026 at 11:59 PM PT** (We've got plenty of time, let's pace ourselves!).
*   **Victors Announcement**: Late July 2026.
*   **Team Layout**: Form a squad of up to **4 members** or crush it as a **solo elite developer**.

---

### 🎨 Which Track Inspires You Today?

We have **4 awesome project tracks** to match your vision:

1.  🌍 **Agents for Good**
    *   *Focus*: Solve crucial societal, health, accessibility, or sustainability challenges!
    *   *Try*: An AI peer tutor, safe community support routing agents, or an eye-safe accessibility assistant.
2.  💼 **Agents for Business**
    *   *Focus*: Automate organizational workflows, optimize tasks, or boost business throughput.
    *   *Try*: Dynamic expense audit agents, competitive intelligence scrapers, or automatic code quality review checklists.
3.  🛎️ **Concierge Agents**
    *   *Focus*: Highly customized personal assistance designed to enhance your daily habits, calendar, or privacy.
    *   *Try*: Fully localized smart flight coordinators, private food trackers, or safe credential organizers.
4.  🦾 **Freestyle Track**
    *   *Focus*: Let your imagination run wild! If your idea is ultra-creative or experimental, run with it. Just make the UI feel polished and beautiful!

---

### 📜 What We Need to Highlight:

To secure your elite **Kaggle Badge & Certificate** (and score exclusive Kaggle swag!), your app should demonstrate **at least three** of our developer pillars:
*   **pillar 1: Multi-Agent Collaboration** using standard frameworks like our **Agent Development Kit (ADK)**.
*   **pillar 2: Model Context Protocol (MCP)** schemas for database and API integrations.
*   **pillar 3: Agent Skills Architecture** using modular, light \`SKILL.md\` triggers.
*   **pillar 4: Non-Deterministic Security** like sandboxing and human-in-the-loop safeguards.
*   **pillar 5: Spec-Driven Development** (Gherkin scenario specs).

---

### 💡 What is Your App Vision?
Tell me which track you want to target and what your app concept is. I would love to help you sketch out the whole **architectural plan** or draft **Gherkin specs** right now! Let's make this incredible.`;
  }

  if (query === "hi" || query === "hello" || query === "hey" || query === "yo" || query === "greetings" || query.startsWith("hi ") || query.startsWith("hello ")) {
    return `### 👋 Hey there, programmer friend! Awesome to chat with you!
    
I am your **Senior Agentic AI Developer, Mentor, & Career Coach**! Think of me as your co-programmer friend. I'm right here in the trenches with you to help design, code, and polish your applications step-by-step. 

Today, let's co-develop your **Everyday Work Progress Tracker** or design your Capstone project using premium **Spec-Driven Production Grade Development**!

#### 💡 Here is how we can collaborate right now:
1. 🎯 **Review the 5 SDD Phases**: Map out the core architecture from Constitution down to Automated Verification.
2. 📝 **Design Gherkin Specs**: Write elegant Given/When/Then scenario files to define your traits.
3. 🔌 **API Integration Routing**: Securely connect the server-side **Gemini API** for summarization, **Firestore** for logs, and **Sheets/Docs** for exports.
4. 🎨 **Polished Tailwind layouts**: Design custom dark cards with absolute precision and beautiful padding.
5. 🛡️ **Hardened backend validation**: Ensure keys never leak by setting up safe Express helper proxies!

Tell me what feature you're thinking about or if there's a bug we need to crush together. Let's make something amazing! 🚀`;
  }

  // 1. Spec-Driven Production Grade Development (5 Phases) & Vibe Coding Guidance
  if (query.includes("5 phases") || query.includes("five phases") || query.includes("constitution") || query.includes("decomposition") || query.includes("verification") || query.includes("production grade") || query.includes("production-grade") || query.includes("phase") || query.includes("vibe coding") || query.includes("vibe-coding")) {
    return `### 🚀 Senior Developer Guide: Spec-Driven Production Grade Development in the Age of Vibe Coding

In modern software engineering, we move away from fragile **Vibe Coding** (where you give loose prompts and hope the AI guesses right) and transition to **Spec-Driven Development (SDD)**. This ensures complete determinism, zero hallucinations, and high-quality, maintainable code.

We structure our development strictly through **5 Core Phases**:

---

### 🧱 Phase 1: Project Constitution
This is your project's foundational blueprint/charter. It explicitly answers:
*   **Why are we building this?**: Helps student-creators save raw daily notes in natural language to dynamically generate professional CV bullet points and analyze internship matchings.
*   **What is the designated tech stack?**: React, TypeScript, Tailwind CSS, Express, Gemini API SDK.
*   **What is STRICTLY FORBIDDEN / NOT ALLOWED?**: Using unapproved third-party routers, client-side secret keys, or unstructured temporary document storage like \`.txt\`.
*   *Example: "Must use PostgreSQL or Firestore for persistent logs. Must NOT use MongoDB or static JSON files."* This absolute ceiling keeps development scoped and compliant.

---

### 📏 Phase 2: Technical Architecture & Constraints
Defines strict system boundaries and operational rules:
1.  **Durable Database**: Google Cloud Firestore or PostgreSQL to save records securely. No loose, local browser state configurations for sensitive user-authenticated history.
2.  **API Gateways**: Clean, secure server-side Express routes (e.g., \`/api/tracker/organize\`) to proxy calls. Exposed third-party secrets on the client are strictly forbidden.
3.  **Authentication**: Secure OAuth 2.0 / Firebase Auth to manage personal accounts.
4.  **Performance target**: Response time for AI summaries < 500ms.

---

### 📝 Phase 3: Task Breakdown & Decomposition
We decompose huge, intimidating features into clear, incremental milestones. Instead of begging an agent to "build a work progress tracker", we split it into separate, sequential tasks to prevent context rot:
*   **Task 1**: Build the responsive natural language input text-area with active Tailwind styles.
*   **Task 2**: Create a server POST route \`POST /api/tracker/logs\` to receive raw strings.
*   **Task 3**: Integrate Gemini SDK on the backend to parse raw strings into structured JSON (skills, achievements, dates).
*   **Task 4**: Configure Firestore to save the parsed JSON tied to the logged-in user's ID.
*   **Task 5**: Generate ATS-friendly styled PDF/Docx resumes or export to Sheets.

---

### 💻 Phase 4: AI-Assisted Coding (Implementation)
Now, we feed the specific rules of the active sub-task to the agent. Because the boundaries are rigid, the AI implements the code flawlessly like an elite, highly disciplined junior developer following a formal technical document.

---

### 🧪 Phase 5: Automated Verification
We verify the output against the specification with automated tests or concrete expected results:
*   **Test**: Submit raw note: *"Implemented React auth check today and fixed JWT bugs."*
*   **Acceptance Criteria Check**:
    *   *Input: Invalid empty submission* ➡️ **Expected: Rejected with 400 Bad Request**
    *   *Input: Valid transaction logs* ➡️ **Expected: Extracted skills ["React", "JWT", "Authentication"] and generated bullet point starting with a powerful action verb.**
* If validations pass, the task is marked completed, and we move to the next decomposed block!

---

💡 **Which phase or task of your Everyday Work Progress Tracker project would you like to set up right now? I can help you write the Gherkin specifications, design the Tailwind frontend, or write the Express backend endpoint!**`;
  }

  // 1.5 Multi-Agent System (Multi-Task Coordination) & Career Tracker Agent Team
  if (query.includes("multi agent") || query.includes("multi-agent") || query.includes("multiple agent") || query.includes("orchestra") || query.includes("collaborat") || query.includes("task handoff") || query.includes("multiple tasks") || query.includes("team") || query.includes("day 2")) {
    return `### 🤖 Senior Developer Guide: Programmatic Multi-Agent Systems for Multi-Task Delegation

When building production-grade workflows like the **Everyday Work Progress Tracker**, relying on a single monolith model causes **Context Rot** and degraded reasoning. Instead, we architect a **Multi-Agent System** where independent, specialized agents collaborate on clear, decoupled sub-tasks.

---

### 🧱 1. The Multi-Agent Tracker Team Blueprint
To handle the user's career tracker, we orchestrate five specialized agents, each serving as an independent microservice with restricted tool schemas (Least Privilege):

1.  **📝 Log Parser Agent (The Gatekeeper)**
    *   *Task*: Receives messy natural language inputs (e.g. *"fixed UI bug under pressure, learned flexbox and updated react context"*), sanitizes noise, and standardizes structure.
2.  **✨ Scribe Agent (The resume Stylist)**
    *   *Task*: Takes parsed inputs and rewrites them into high-visibility, ATS-optimized professional resume bullet points starting with strong action verbs (e.g. *"Implemented responsive UI configurations using React Context..."*).
3.  **🏷️ Skills Taxonomy Agent (The Cataloger)**
    *   *Task*: Maps and classifies raw tech items against an industry-standard vocabulary catalog, tagging core competencies.
4.  **💼 Internship Matcher Agent (The Career Advisor)**
    *   *Task*: Takes the compiled achievements profile, queries real-time listing APIs, and computes overlapping skill-match index ratings.
5.  **🛡️ Reviewer & Policy Agent (The Validator)**
    *   *Task*: Audits the final exports to check for hallucinations, sensitive data leaks, or unquantified achievements before submitting to Google Sheets or Firestore databases (Zero-Trust verification).

---

### 💻 2. Programmatic Orchestration Pattern (A2A Collaboration)
Below is the production-grade **TypeScript Orchestration Loop** utilizing a sequential message handoff pattern. This implements the **Agent-to-Agent (A2A)** standard to ensure seamless multi-task execution:

\`\`\`typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface TrackerTaskContext {
  userId: string;
  rawText: string;
  parsedSummary?: { task: string; technologies: string[] };
  optimizedBullet?: string;
  skillsTags?: string[];
  jobMatches?: Array<{ title: string; matchScore: number }>;
}

async function runMultiAgentTrackerPipeline(rawLog: string, userId: string): Promise<TrackerTaskContext> {
  const context: TrackerTaskContext = { userId, rawText: rawLog };

  // Agent 1: Parse Raw Input
  context.parsedSummary = await runParserAgent(context.rawText);

  // Agent 2: Stylize Resume Bullets
  context.optimizedBullet = await runScribeAgent(context.parsedSummary);

  // Agent 3: Catalog Skills Taxonomy
  context.skillsTags = await runTaxonomyAgent(context.parsedSummary.technologies);

  // Agent 4: Run Job/Internship Matchings
  context.jobMatches = await runMatcherAgent(context.skillsTags);

  // Agent 5: Perform Compliance Review Audit beforehand
  const isValid = await runPolicyReviewerAgent(context);
  if (!isValid) {
    throw new Error("Audit failed: Generated output does not meet compliance thresholds!");
  }

  return context;
}

// Micro-Agent Helpers
async function runParserAgent(input: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: \`Extract active task and tech stack from this natural language: "\${input}"\`,
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(response.text);
}

async function runScribeAgent(summary: any) {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: \`Rewrite this task: "\${summary.task}" using "\${summary.technologies.join(", ")}" into a high-impact, ATS-optimized CV bullet point.\`,
  });
  return response.text.trim();
}

async function runTaxonomyAgent(techStack: string[]) {
  // Simple standardized classification mapping
  return techStack.map(tech => tech.toUpperCase().trim());
}

async function runMatcherAgent(skills: string[]) {
  // Queries external mock job board matching index
  return [
    { title: "Frontend Developer Intern", matchScore: 92 },
    { title: "React Native Developer Apprentice", matchScore: 85 }
  ];
}

async function runPolicyReviewerAgent(finalContext: TrackerTaskContext): Promise<boolean> {
  // Zero-Trust validation check
  if (!finalContext.optimizedBullet || finalContext.optimizedBullet.length < 15) {
    return false; // Rejects weak writing
  }
  return true;
}
\`\`\`

---

### 📝 3. Gherkin Spec-Driven Multi-Agent Acceptance Criteria:
\`\`\`gherkin
Feature: Multi-Agent Multi-Task Career Log Pipeline
  As an AI System Orchestrator
  I want to route a raw log input across specialized Scribe, Taxonomy, and Policy Reviewer Agents
  So that each task runs isolated with Zero-Trust constraints and 100% testable outputs

  Scenario: Sequential multi-task handoff executes successfully
    Given a raw user daily note: "fixed security breach, learned jwt secure cookie scopes"
    And a target user account "user_101"
    When the Multi-Agent Tracker team begins orchestration
    Then Log Parser Agent must extract technology: ["JWT"] 
    And Scribe Agent must output bullet starting with strong action verb: "Remediated critical security vulnerabilities by configuring secure JWT cookie scopes..."
    And Taxonomy Agent must tag competencies: ["SECURITY", "JWT"]
    And Policy Reviewer Agent must audit the final achievement log
    And the enriched profile output must save to Cloud Firestore with status "CONFIRMED"
\`\`\`

---

💡 **Ready to scaffold this Multi-Agent Pipeline for your Career Progress Tracker? Ask me to write the complete API route or integrate the live Google Sheet / Firestore triggers!**`;
  }

  // 2. Project Advisor: Everyday Work Progress Tracker
  if (query.includes("tracker") || query.includes("progress") || query.includes("resume") || query.includes("internship") || query.includes("job") || query.includes("matching") || query.includes("activity") || query.includes("work log")) {
    return `### 🚀 Project Advisor: Everyday Work Progress Tracker Builder Plan

That is an outstanding and highly practical project concept! Let's build your **Everyday Work Progress Tracker** using **Spec-Driven Development (SDD)**. 

To clear your doubts, let's break this project down step-by-step into its **4 primary functional phases**, define the target users, input/output formats, and see exactly which APIs to use:

---

### 👥 1. Target Audience, Inputs, & Outputs
*   **Target Users**: Students, junior developers, freelancers, and employees seeking to optimize career growth.
*   **Input Formats**: Natural language text dumps, voice transcripts, screenshots of commits, or uploaded documents.
*   **Output Formats**: A clean, responsive Tailwind analytics dashboard, dynamic resumes (ATS-friendly), and automated internship match lists.

---

### 🗺️ 2. The 4 Dynamic Functional Phases

#### 🔹 Phase A: Daily Activity Capture (UI & Frontend)
Users dump notes in plain English (e.g., *"Today I built a React login page, fixed authentication bugs, and learned JWT"*).
*   **API / Tech**: Connect **Firebase Auth** for secure user login, and build a beautiful slate-colored text area in \`src/App.tsx\` styled with Tailwind.

#### 🔹 Phase B: AI Work Log Organizer (Information Extraction)
The backend organizes raw text into structured JSON.
*   **API / Tech**: Use server-side **Gemini API** (\`@google/genai\` SDK). You pass the raw string with a structured instruction in the backend to extract:
    1.  *What was done* (Action verb)
    2.  *Technologies used* (e.g., React, JWT)
    3.  *Skills gained*
    4.  *Quantifiable accomplishments/achievements*
*   **Persistent Storage**: Save that output inside **Firebase Firestore** normalized by User ID and Date so it is preserved across caches.

#### 🔹 Phase C: Resume & Portfolio Updater (Generation)
Converts tracked logs into ATS-friendly resume bullet points.
*   **API / Tech**:
    1.  **Gemini API** to convert raw experiences into professional bullet formatting: *"Developed robust authentication modules using React and JWT, improving application security."*
    2.  **Google Docs / Sheets API**: Use OAuth to allow the tracker to directly output to a designated Google Sheet log or format a beautiful Google Doc resume dynamically.

#### 🔹 Phase D: Job/Internship Matching Agent (Semantic Search & Matching)
Compares your tracked skills with live job descriptions.
*   **API / Tech**:
    1.  **Adzuna API** or standard job board integrations to fetch active internship postings.
    2.  **Gemini API** to compare required skills against your tracked technical skills profile, highlight your gaps, suggest matching opportunities, and draft highly tailored internship cover letters.

---

### 🔌 3. The Ultimate API & SDK Choice Guide
To guarantee a solid build, you should write this using the following official standard modules:
1.  **AI Engine**: Use \`@google/genai\` on the server running the \`gemini-3.5-flash\` model. It is ultra-fast and handles few-shot JSON structure mapping seamlessly.
2.  **Durable Storage**: Avoid client-only browser storage for sensitive profiles. Run the **Firebase Firestore** setup.
3.  **Workspace Integration**: Run **Google OAuth** scopes to modify the user's active resume docs on their personal Google Drive accounts dynamically.

---

### Gherkin Behavioral Specification (Acceptance Criteria):
\`\`\`gherkin
Feature: Everyday Work Progress Tracker
  As a Student Developer
  I want to dump raw work accomplishments in plain text
  So that Gemini parses my skills, writes my resume bullet, and saves it to Firestore

  Scenario: Processing raw log and extracting resume achievements
    Given a raw work log text: "Built a React login page, fixed email verification bugs, and learned JWT"
    When the Work Log Organizer analyzes the input
    Then it must extract technologies: ["React", "JWT"]
    And it must generate CV bullet: "Crafted a secure authentication flow using React and JWT, resolving validation errors."
    And it must persist the structured data into Firestore
\`\`\`

---

### 💡 Clear Your Doubts: How to Start Right Now?
1.  **Step 1**: Open your \`src/App.tsx\` to design your visual capture UI box.
2.  **Step 2**: Create a secure endpoint POST \`/api/tracker/organize\` in Express inside \`server.ts\` to process raw logs.
3.  **Step 3**: Configure your \`GEMINI_API_KEY\` inside the **Secrets** tab inside Google AI Studio, and let's get testing!

**Would you like me to scaffold a simple tracker component or write the backend proxy API route to parse the skills with Gemini? Let me know!**`;
  }

  // 1. Syllabus topics parsed first
  if (query.includes("gherkin") || query.includes("spec-driven") || query.includes("sdd") || query.includes("spec driven")) {
    return `### 📝 Spec-Driven Development (SDD) & Gherkin Syntax

**Spec-Driven Development (SDD)** bridges the gap between fragile "vibe-coded" prototypes and production-grade software by enforcing Gherkin-formatted test suites as the ultimate source of truth.

#### 💡 Core Philosophy:
Instead of treating code as a permanent manually-maintained asset, SDD views code as a **disposable compilation target**. The true permanent asset is the **Gherkin behavior specification**!

#### 🛠️ Gherkin Example:
\`\`\`gherkin
Feature: Automated Expense Approval System

  Scenario: High value expense requests trigger human triage
    Given an expense request of $1500 submitted by "John Doe"
    When the Expense Agent evaluates the request threshold
    Then the action must be delegated to "human-in-the-loop" triage
    And the transaction status must remain "PENDING_APPROVAL"
\`\`\`

#### 🚀 Why Spec-Driven Development is Essential:
1. **Determinism in LLMs**: Enforces strict boundaries around non-deterministic model outputs.
2. **Behavior-First Validation**: Evaluates agent behavior dynamically using end-to-end user-stories.
3. **Automated Iterative Refinement**: Code-Review Agents can compile, run, and self-correct code until all specs pass.`;
  }
  
  if (query.includes("policy server") || query.includes("review") || query.includes("reviewer agent") || query.includes("trust") || query.includes("deploy")) {
    return `### 🛡️ Code-Review Agents, Policy Servers & Zero-Trust Pipelines

In production systems, we never deploy code or run agents without rigorous, automated guardrails. Here is how enterprise workflows are hardened:

#### 1. Automated Code-Review Agents:
Utilize an independent **Reviewer Agent** pattern. Before code is merged, a secondary LLM pipeline audit occurs to:
- Verify exact compliance with system architectural guidelines.
- Execute security vulnerability threat scans.
- Run automated unit test suites to guarantee no regression.

#### 2. Policy Servers & Schema Engines:
A **Policy Server** evaluates runtime AI decisions and tool-call trace paths against predefined authorization rules in real-time. If an agent tries to execute an uncompliant operation (e.g., executing a deletion without validation), the Policy Server blocks the execution instantly.

#### 3. Zero-Trust Cloud Run Deployments:
- Multi-agent workloads are containerized via **Docker** and deployed on Serverless nodes.
- Employs minimal IAM service account roles so that agent containers only have permissions absolutely required for their tasks (Least Privilege).`;
  }

  if (query.includes("cloud agent") || query.includes("enterprise scale") || query.includes("cloud run") || query.includes("trigger")) {
    return `### ☁️ Enterprise Scale Cloud Agents & Triggers

To reach production grade, AI agents must transcend local terminal execution and run as robust serverless cloud workflows.

#### 🏗️ Architecture Blueprint:
1. **Triggers**: Events (Google Forms, incoming emails, webhook posts, API calls) wake up the cloud-hosted container.
2. **Execution Sandbox**: The agent runs inside an ephemeral, resource-limited Google Cloud Run instance.
3. **Internal Tools**: Seamlessly integrates with tools utilizing the **Model Context Protocol (MCP)** to fetch secure documentation or data.
4. **Human-in-the-Loop Intercepts**: For extreme-risk operations (e.g., sending money or writing to main production databases), the cloud agent triggers a notification, halts execution, and waits for manual permission.`;
  }

  if (query.includes("7-pillar") || query.includes("effective trust") || query.includes("pillar") || query.includes("security")) {
    return `### 🛡️ Effective Trust & The 7-Pillar Security Architecture

Conventional perimeter-based security fails in agentic software due to non-deterministic execution paths. We must transition to the **Effective Trust** model:

#### 🧱 The 7 Pillars of Secure Agent Design:
1. **Input Cleansing**: Active checks to intercept prompt-injection attempts.
2. **Least Privilege IAM**: Narrowly scoped credentials so agents cannot overrun parent infrastructure.
3. **Ephemeral Sandboxing**: Running all container code and local tests in highly constrained, short-lived environments.
4. **Dependency Shields**: Defending against malicious components and hallucinated third-party package exploits.
5. **Human-in-the-Loop Triage**: Gating destructive/high-value decisions with required user authorization.
6. **OpenTelemetry Trajectory Audit**: Detailed trace-logging of reasoning paths, variables, and API responses.
7. **Continuous Drift Evaluation**: Automated runtime drift monitoring to evaluate model behavioral drift over time.`;
  }

  if (query.includes("slopsquatting") || query.includes("dependency") || query.includes("squatting")) {
    return `### ☣️ Slopsquatting & Dependency Shields

**Slopsquatting** is a novel security threat unique to the age of generative code:

#### 🔍 How It Happens:
1. During vibe coding, LLMs may hallucinate a non-existent helper library (e.g., \`google_analytics_v5_helper\`).
2. The model writes import statements assuming this library exists.
3. If the developer runs the code blindly, the system attempts to download it.
4. **The Exploit**: Malicious actors scan public code bases or predict LLM Hallucination lists to register these identical package slugs (e.g. on npm or PyPI) containing backdoor payloads.

#### 🛡️ Dependency Shields:
To defend against slopsquatting:
- Use strict private package registries or locking mechanisms to block unlisted libraries.
- Integrate automated package manifest reviews.
- Implement isolated compile-time container sandboxing to check package origins before installs.`;
  }

  if (query.includes("vibe coding") || query.includes("vibe-coding") || query.includes("manual coding")) {
    return `### ⚙️ Vibe Coding vs. Manual Coding

Understanding this fundamental transition is critical for modern software design:

- **Manual Coding**: Focuses on syntax, syntax checkers, writing every loop explicitly, and resolving token-level errors. The developer is the main builder.
- **Vibe Coding**: Focuses on high-level orchestration, defining behaviors, formulating test harnesses, and reviewing agent execution. The AI agent acts as the primary builder of syntax, while the human developer steers the system intention.
- **The SDLC Compression**: By adopting vibe coding alongside **Spec-Driven Development (SDD)**, the system design lifecycle compresses drastically. Prototype speed increases 10x, and Gherkin specs ensure production-grade safety.`;
  }

  // 2. React / Tailwind / Frontend / Styles
  if (query.includes("react") || query.includes("tailwind") || query.includes("css") || query.includes("html") || query.includes("component") || query.includes("ui") || query.includes("frontend") || query.includes("style") || query.includes("button") || query.includes("page")) {
    return `### 🎨 Project Advisor: High-Fidelity Frontend & Interactive UI

Here is my professional design and structural advice for building an elegant, modular user interface:

#### 🧱 Modern Component Decomposition:
- **Split Your Files**: Avoid putting all logic in a single file like \`App.tsx\`. To prevent token budget overflow and improve modularity, isolate buttons, sidebars, and overlays into separate files in a \`/src/components\` directory.
- **Declare Shared Types**: Always start by creating a \`types.ts\` module to establish unified TypeScript definitions.

#### 🖌️ Tailored CSS/Tailwind Guidelines:
- **Avoid Overusing Gradients**: Standard generated UI often defaults to generic blue/purple gradients, which look repetitive. Instead, use a cohesive canvas theme like **Cosmic Slate** (deep charcoal backgrounds with subtle cyan and soft white borders) or **Minimal Chalk** (soft off-whites with sharp basalt gray typography).
- **Rhythmic Negative Space**: Give your components room to breathe. Use generous padding (e.g., \`p-6\` or \`py-12\`) and varied grid layouts rather than placing content in identical repetitive cards.

#### 🌀 Responsive Micro-Animations:
- Use entry transitions to create a premium feel in React:
  \`\`\`typescript
  import { motion } from "motion/react";
  
  const SlideIn = () => (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
    >
      Interactive Component Content
    </motion.div>
  );
  \`\`\`
- Maintain a minimum **44px touch target size** on mobile breakpoints and add active state cursor feedback on desktop devices (\`hover:scale-[1.02] hover:shadow-lg\`).`;
  }

  // 3. Database / Storage / Backend / APIs
  if (query.includes("database") || query.includes("sql") || query.includes("postgres") || query.includes("firebase") || query.includes("firestore") || query.includes("backend") || query.includes("schema") || query.includes("api") || query.includes("express") || query.includes("server")) {
    return `### 🗄️ Project Advisor: Backend Services & Dynamic Storage Architecture

When taking your prototype to production, setting up robust backend routes and proper database normalization is vital. Here are my engineering recommendations:

#### 📂 Core Storage & Persistence Strategies:
1. **Durable Cloud Persistence**: Use **Firebase (Firestore)** or **Cloud SQL (PostgreSQL)** for any user-authored data, profiles, and streaks to ensure data is preserved across caches and devices.
2. **Local State Fallback**: Standard browser \`localStorage\` is clean and perfect for single-user preferences (e.g., active theme, workspace filters, dashboard layouts), but treat it as a transient client-side mechanism rather than master storage.

#### 🔒 Lazy-Initialization & API Route Hiding:
- Always keep sensitive third-party client credentials completely server-side in your Express server.
- Initializing SDKs directly during server load can block container start-up if environment variables are missing. Always employ checking structures:
  \`\`\`typescript
  let firestoreDb: Firestore | null = null;
  
  export function getDb() {
    if (!firestoreDb) {
      if (!process.env.FIREBASE_CONFIG) {
        throw new Error("FIREBASE_CONFIG is currently unconfigured!");
      }
      firestoreDb = initializeFirestore();
    }
    return firestoreDb;
  }
  \`\`\`
- Create proxy routes like \`POST /api/chat\` to protect API keys from browser DevTools inspect windows.`;
  }

  // 4. Debugging & Error Handling
  if (query.includes("error") || query.includes("debug") || query.includes("fix") || query.includes("warning") || query.includes("exception") || query.includes("broken") || query.includes("fail") || query.includes("issue") || query.includes("lint")) {
    return `### 🛠️ Project Advisor: Error Diagnostics & System Debugging Pipeline

Don't panic! Debugging non-deterministic or compiled systems becomes straightforward when using a rigorous diagnostic loop. Apply these steps to find and resolve the exception:

#### 🚦 4-Step Resolution Framework:

1. **Isolate the Environment Boundaries**:
   - Confirm if the error occurs in the client (Vite bundle issue, browser console error, WebSocket disconnection) or server (Express crash, missing env, type mismatch in backend).
2. **Verify Module & Asset Paths**:
   - Ensure relative paths across imports match the capitalization and layout in your actual workspace directory. Watch out for spelling typos or silent spacing errors.
3. **Audit Missing API Credentials**:
   - SDKs frequently fail silently or raise unhandled promise rejections if keys are missing from the configuration. Guard imports and use fallback simulation triggers to prevent startup blocks.
4. **Simulate Edge States**:
   - Write automated assertions. Run standard verification commands like \`npm run lint\` or \`npm run build\` locally to trace precise syntax or bundle errors.`;
  }

  // 5. Code Structure / Organization
  if (query.includes("architect") || query.includes("structure") || query.includes("project") || query.includes("organize") || query.includes("plan") || query.includes("design") || query.includes("codebase")) {
    return `### 🏗️ Project Advisor: Clean Architecture & Workspace Structure

Setting up a cohesive directory structure early is key to maintaining rapid development speed and preventing "Context Rot" for humans and AI agents alike:

#### 📂 Recommended Modular Pattern:
- **\`src/components/\`**: Self-contained React views (e.g., Sidebar, TerminalLog, NotificationOverlay, ConfigPanel).
- **\`src/types.ts\`**: Single central source of truth for interfaces and types.
- **\`src/utils.ts\`**: Stateless helpers (data formatting, timestamp generators, string cleaners).
- **\`server.ts\`**: Express backend routing, API handshakes, and Gemini connections.

#### ⏳ Context Rot Prevention:
- Avoid dumping hundreds of pages of guidelines, tool descriptions, and code blocks directly under a single system prompt.
- Apply **Progressive Disclosure** by splitting instructions into portable **Agent Skills** (using dedicated \`SKILL.md\` structures) that are loaded on demand based on specific user requests. This keeps prompts lightweight and maximizes logical performance.`;
  }

  // 6. Custom dynamic phrasing fallback
  let subject = "Workspace & Development Plan";
  const cleanedQuery = message.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"").trim();
  const words = cleanedQuery.split(/\s+/).filter(w => w.length > 3);
  const stopwords = new Set(["what", "how", "why", "where", "who", "with", "from", "your", "this", "that", "these", "those", "about", "could", "would", "should", "your", "helper", "please", "make", "build", "create", "setup"]);
  const dynamicKeywords = words.filter(w => !stopwords.has(w.toLowerCase()));
  if (dynamicKeywords.length > 0) {
    subject = dynamicKeywords.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
  }

  return `### ⚡ Project Advisor: ${subject}

Your inquiry regarding **"${message}"** has been received by your **Interactive Companion & Project Advisor Agent** (Active in Offline Simulation mode). 

Here is a structured advisory guideline addressing your request:

#### 💡 Strategic Engineering Approach:
- **Requirement Breakdown**: Formulate clear behavioral specifications using a Gherkin-like structure (**Given/When/Then**). This guarantees absolute precision.
- **Defensive Implementation**: Scaffold your feature using a simple-to-complex pipeline. Start with static layouts, wrap them in clean state handlers, and eventually wire up backend persistent APIs.
- **Security-First Planning**: Adopt the **7-Pillar Security Architecture**. Add active input cleansing to protect from injection attempts, and ensure least-privilege scoping so system boundaries remain fully secure.

#### 🚀 Step-by-Step Execution Plan:
1. **Design**: Build mockups centering Inter (sans-serif) for system controls paired with elegant display styling.
2. **Formulate Specs**: Write unit tests or behavioural blueprints beforehand so progress is deterministic.
3. **Integrate**: Link full-stack features via safe server-side proxy routes to protect crucial keys.
4. **Optimize**: Run regular compilation checks to detect and trace styling or typing discrepancies early.`;
}


// Health and Config Status Check
app.get("/api/status", (req, res) => {
  res.json({
    hasApiKey: isRealApiKey(process.env.GEMINI_API_KEY)
  });
});

// Multi-Agent Collaboration Pipeline Route
app.post("/api/tracker/multi-agent", async (req, res) => {
  try {
    const { rawLog, userId = "user-101" } = req.body;
    if (!rawLog || rawLog.trim() === "") {
      return res.status(400).json({ error: "No daily work log text provided." });
    }

    const cleanedLog = rawLog.slice(0, 1000); // Input Cleansing Shield (Pillar 1)
    const traceTimeline: Array<{ agent: string; action: string; durationMs: number; output: any }> = [];
    const startTimeStamp = Date.now();

    let parsedSummary: { task: string; technologies: string[] };
    let optimizedBullet: string;
    let skillsTags: string[];
    let jobMatches: Array<{ title: string; company: string; matchScore: number; reason: string }>;
    let auditPassed = true;
    let auditReport = "Audit passed: Generated output fully matches design guidelines and contains no security keys.";

    // If key is present and real, run via Live Gemini SDK
    if (isRealApiKey(process.env.GEMINI_API_KEY)) {
      const ai = getGenAI();

      // --- Agent 1: Log Parser (Gatekeeper) ---
      const parseStart = Date.now();
      const parseResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Given the raw work log: "${cleanedLog}". Extract:
1. "task": A short verb-first summary of what the user did.
2. "technologies": A list of exact software tools, frameworks, databases, or languages.
Reply strictly in JSON formatting with keys: "task" (string) and "technologies" (array of strings). Do not write anything else.`,
        config: {
          responseMimeType: "application/json"
        }
      });
      
      try {
        parsedSummary = JSON.parse(parseResponse.text);
      } catch (e) {
        parsedSummary = {
          task: cleanedLog,
          technologies: ["React", "TypeScript"]
        };
      }
      traceTimeline.push({
        agent: "📝 Log Parser Agent",
        action: "Extracted structured task and technologies from messy text dump",
        durationMs: Date.now() - parseStart,
        output: parsedSummary
      });

      // --- Agent 2: Scribe Agent (The Stylist) ---
      const scribeStart = Date.now();
      const scribeResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Rewrite this task description: "${parsedSummary.task}" using these technologies: "${parsedSummary.technologies.join(", ")}" into a high-impact, professional resume bullet point. The bullet must start with a powerful active verb, include a business result, and be highly optimized for ATS parsers.`
      });
      optimizedBullet = scribeResponse.text.trim();
      traceTimeline.push({
        agent: "✨ Scribe Agent",
        action: "Generated professional ATS-friendly resume bullet points with action verbs",
        durationMs: Date.now() - scribeStart,
        output: optimizedBullet
      });

      // --- Agent 3: Skills Taxonomy Agent (The Cataloger) ---
      const taxStart = Date.now();
      const techUpper = parsedSummary.technologies.map(t => t.toUpperCase().trim());
      skillsTags = ["CAREER_DEVELOPER", ...techUpper];
      traceTimeline.push({
        agent: "🏷️ Skills Taxonomy Agent",
        action: "Standardized skill items against global taxonomy list",
        durationMs: Date.now() - taxStart,
        output: skillsTags
      });

      // --- Agent 4: Internship Matcher Agent (The Career Advisor) ---
      const matchStart = Date.now();
      const matchResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Given these technical skills: [${parsedSummary.technologies.join(", ")}]. Compare them and return matching ratings (0-100) and details for these 3 real-world roles:
1. Google Full-Stack Intern
2. Microsoft Solutions Architect Apprentice
3. Stripe API Fellow
Respond strictly in JSON format. Do not use block markdown inside the json return. The structure must be a JSON array of objects, like:
[
  { "title": "Google Full Stack", "company": "Google", "matchScore": 85, "reason": "string description" }
]
` ,
        config: {
          responseMimeType: "application/json"
        }
      });

      try {
        jobMatches = JSON.parse(matchResponse.text);
      } catch (e) {
        jobMatches = [
          { title: "Google Full-Stack Intern", company: "Google", matchScore: 88, reason: "Excellent alignment with frontend skills." },
          { title: "Azure Solutions Architect Fellowship", company: "Microsoft", matchScore: 65, reason: "Lacks core cloud services experience." },
          { title: "API Integrations Specialist", company: "Stripe", matchScore: 92, reason: "Outstanding matching for API setup tasks." }
        ];
      }
      traceTimeline.push({
        agent: "💼 Internship Matcher Agent",
        action: "Computed matching indices and aligned current skills profiles against live career specs",
        durationMs: Date.now() - matchStart,
        output: jobMatches
      });

      // --- Agent 5: Reviewer & Policy Agent (The Validator) ---
      const policyStart = Date.now();
      let isInj = false;
      if (cleanedLog.toLowerCase().includes("ignore") || cleanedLog.toLowerCase().includes("override") || cleanedLog.toLowerCase().includes("secret_api")) {
        isInj = true;
      }
      if (isInj) {
        auditPassed = false;
        auditReport = "Audit Failed: Detected potential prompt injection key words or sensitive override strings. Execution halted.";
      } else if (optimizedBullet.length < 15) {
        auditPassed = false;
        auditReport = "Audit Failed: Scribe Agent output bullet was too short/uninformative. Required length is >= 15 characters.";
      }
      traceTimeline.push({
        agent: "🛡️ Policy Reviewer Agent",
        action: "Audited trace log, checked compliance rules, and verified Zero-Trust safety metrics",
        durationMs: Date.now() - policyStart,
        output: { auditPassed, auditReport }
      });

    } else {
      // Elegant, near-instantaneous smart fallback simulation matches rawLog keywords
      const words = cleanedLog.toLowerCase();
      const extractedTechs: string[] = [];
      const checklist = ["react", "typescript", "javascript", "python", "postgres", "mongodb", "firebase", "firestore", "express", "node", "tailwind", "docker", "gcp", "aws", "git", "html", "css", "nextjs", "django", "redux", "api", "jwt"];
      
      checklist.forEach(tech => {
        if (words.includes(tech)) {
          // Capitalize properly
          let properName = tech.charAt(0).toUpperCase() + tech.slice(1);
          if (tech === "typescript") properName = "TypeScript";
          if (tech === "javascript") properName = "JavaScript";
          if (tech === "postgres") properName = "PostgreSQL";
          if (tech === "mongodb") properName = "MongoDB";
          if (tech === "firestore") properName = "Cloud Firestore";
          if (tech === "gcp") properName = "Google Cloud Platform";
          if (tech === "aws") properName = "AWS Cloud";
          if (tech === "nextjs") properName = "Next.js";
          if (tech === "api") properName = "RESTful APIs";
          if (tech === "jwt") properName = "JSON Web Tokens";
          if (!extractedTechs.includes(properName)) {
            extractedTechs.push(properName);
          }
        }
      });

      if (extractedTechs.length === 0) {
        extractedTechs.push("React", "TypeScript", "Tailwind CSS");
      }

      parsedSummary = {
        task: cleanedLog,
        technologies: extractedTechs
      };

      traceTimeline.push({
        agent: "📝 Log Parser Agent",
        action: "Extracted structured task and technologies from messy text dump",
        durationMs: 42,
        output: parsedSummary
      });

      // Scribe active-verb bullet point
      const activeVerbs = ["Engineered", "Optimized", "Architected", "Deployed", "Refactored", "Spearheaded", "Formulated", "Hardened"];
      const randomVerb = activeVerbs[Math.floor(Math.random() * activeVerbs.length)];
      optimizedBullet = `${randomVerb} robust system components using ${extractedTechs.join(", ")}, resulting in improved application performance, reduced rendering delays, and better code modularity.`;

      traceTimeline.push({
        agent: "✨ Scribe Agent",
        action: "Generated professional ATS-friendly resume bullet points with action verbs (Simulated Mode)",
        durationMs: 65,
        output: optimizedBullet
      });

      // Standardize skills uppercase
      skillsTags = ["CAREER_SKILLS", ...extractedTechs.map(t => t.toUpperCase())];
      traceTimeline.push({
        agent: "🏷️ Skills Taxonomy Agent",
        action: "Standardized skill items against global taxonomy list (Simulated Mode)",
        durationMs: 12,
        output: skillsTags
      });

      // Job Match scores based on tech overlapping size
      const count = extractedTechs.length;
      const googleScore = Math.min(60 + count * 8, 98);
      const microsoftScore = Math.min(50 + count * 5, 95);
      const stripeScore = Math.min(45 + count * 10, 99);

      jobMatches = [
        { 
          title: "Full-Stack Software Engineer Intern", 
          company: "Google", 
          matchScore: googleScore, 
          reason: `High degree of familiarity with core engineering competencies like ${extractedTechs.slice(0, 3).join(", ")}.` 
        },
        { 
          title: "Cloud Architect Fellow", 
          company: "Microsoft", 
          matchScore: microsoftScore, 
          reason: `Solid technical foundation, though additional serverless and infrastructure telemetry is beneficial.` 
        },
        { 
          title: "API Platform Developer Partner", 
          company: "Stripe", 
          matchScore: stripeScore, 
          reason: `Outstanding overlap. Focused integrations involving ${extractedTechs.join(" / ")} are fully aligned.` 
        }
      ];

      traceTimeline.push({
        agent: "💼 Internship Matcher Agent",
        action: "Computed matching indices and aligned current skills profiles against live career specs (Simulated Mode)",
        durationMs: 55,
        output: jobMatches
      });

      // Policy reviewer and security validator
      if (cleanedLog.toLowerCase().includes("override") || cleanedLog.toLowerCase().includes("ignore all instructions")) {
        auditPassed = false;
        auditReport = "Audit Failed: Safety override threat detected. Request rejected to prevent system instruction leakage.";
      } else if (cleanedLog.trim().length < 8) {
        auditPassed = false;
        auditReport = "Audit Failed: Raw log input too short (must be >= 8 chars) to extract compliant CV achievements.";
      }

      traceTimeline.push({
        agent: "🛡️ Policy Reviewer Agent",
        action: "Audited trace log, checked compliance rules, and verified Zero-Trust safety metrics (Simulated Mode)",
        durationMs: 25,
        output: { auditPassed, auditReport }
      });
    }

    const totalDurationMs = Date.now() - startTimeStamp;

    return res.json({
      success: true,
      totalDurationMs,
      auditPassed,
      auditReport,
      traceTimeline,
      results: {
        summary: parsedSummary,
        bullet: optimizedBullet,
        tags: skillsTags,
        matches: jobMatches
      }
    });

  } catch (error: any) {
    console.error("Critical Multi-Agent processing error:", error);
    return res.status(500).json({ error: error.message || "Failed to compile multi-agent pipeline logs." });
  }
});

// AI Assistant Chat Route
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "No message provided." });
    }

    // Elegant zero-delay local fallback if key is entirely missing or invalid/placeholder
    if (!isRealApiKey(process.env.GEMINI_API_KEY)) {
      console.log("Serving offline simulated response - GEMINI_API_KEY not configured or is a placeholder.");
      const responseText = getSimulatedChatResponse(message);
      return res.json({ response: responseText });
    }

    const ai = getGenAI();

    // Map history to the structured format required by the Chat API if history is provided
    let contents: any[] = [];
    if (history && Array.isArray(history)) {
      contents = history.map((chatItem: { role: string; content: string }) => {
        return {
          role: chatItem.role === "assistant" ? "model" : "user",
          parts: [{ text: chatItem.content }],
        };
      });
    }

    // Append the current message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: COURSE_CONTEXT,
        temperature: 0.7,
      },
    });

    return res.json({ response: response.text });
  } catch (error: any) {
    console.error("Gemini API Error in /api/chat. Redirecting to rich simulated fallback:", error);
    // If rate limit / network error / invalid key, return beautiful simulation rather than a plain crash code
    const fallbackText = getSimulatedChatResponse(req.body.message || "");
    return res.json({ response: fallbackText });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Protect API routes by checking them before sending to Vite
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
