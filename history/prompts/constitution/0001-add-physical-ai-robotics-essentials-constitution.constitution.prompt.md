---
id: 0001
title: Add Physical AI Robotics Essentials Constitution
stage: constitution
date: 2025-12-10
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: user
command: /sp.constitution
labels: ["constitution","project-setup"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - N/A
---

## Prompt

```text
/sp.constitution

Project Name: Physical AI & Humanoid Robotics — Essentials

Purpose:
Create a short, clean, professional AI-Native textbook based on the Physical AI & Humanoid Robotics course.
The book must serve as a fast, simple, high-quality learning resource built with a modern Docusaurus UI
and a fully integrated free-tier RAG chatbot.

Scope:
- 6 short chapters:
  1. Introduction to Physical AI
  2. Basics of Humanoid Robotics
  3. ROS 2 Fundamentals
  4. Digital Twin Simulation (Gazebo + Isaac)
  5. Vision-Language-Action Systems
  6. Capstone: Simple AI-Robot Pipeline
- Clean UI
- Free-tier friendly
- Lightweight embeddings

Core Principles:
- Simplicity
- Accuracy
- Minimalism
- Fast builds
- Free-tier architecture
- RAG answers ONLY from book text

Key Features:
- Docusaurus textbook
- RAG chatbot (Qdrant + Neon + FastAPI)
- Select-text → Ask AI
- Optional Urdu / Personalize features

Constraints:
- No heavy GPU usage
- Minimal embeddings

Success Criteria:
- Build success
- Accurate chatbot
- Clean UI
- Smooth GitHub Pages deployment

Generate full constitution.
```

## Response snapshot

The project constitution for 'Physical AI & Humanoid Robotics — Essentials' has been created, defining core principles, scope, features, constraints, and success criteria. The constitution is versioned 1.0.0 and ratified on 2025-12-10. Manual follow-up is recommended for `README.md` and `docs/quickstart.md` updates.

## Outcome

- ✅ Impact: Constitution v1.0.0 created and written.
- 🧪 Tests: N/A
- 📁 Files: .specify/memory/constitution.md modified.
- 🔁 Next prompts: N/A
- 🧠 Reflection: Successfully generated constitution and identified necessary follow-ups.

## Evaluation notes (flywheel)

- Failure modes observed: `create-phr.sh` script not found, falling back to agent-native PHR creation.
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Ensure `create-phr.sh` script path is correct or `Bash` tool usage for scripts in `.specify/scripts/bash/` is verified.
