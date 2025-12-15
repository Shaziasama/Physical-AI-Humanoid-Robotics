---

description: "Task list for Docusaurus Textbook feature implementation"
---

# Tasks: Docusaurus Textbook

**Input**: Design documents from `/specs/docusaurus-textbook-plan/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize Docusaurus project using `create-docusaurus` in `./`
- [ ] T002 Configure `docusaurus.config.js` with basic site metadata and plugin setup in `./docusaurus.config.js`
- [ ] T003 Configure `sidebars.js` for initial empty chapter/module structure in `./sidebars.js`
- [ ] T004 [P] Create custom CSS file for basic theming in `src/css/custom.css`
- [ ] T005 [P] Add `package.json` scripts for `start`, `build`, `serve` in `./package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Create `docs/` directory for textbook content in `./docs/`
- [ ] T007 Implement basic custom Docusaurus theme (CSS variables) in `src/css/custom.css` (refine T004)
- [ ] T008 Set up Docusaurus search functionality (configure plugin) in `./docusaurus.config.js`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Read Textbook Chapters (Priority: P1) 🎯 MVP

**Goal**: Students can easily navigate and read through the textbook chapters and their modules.

**Independent Test**: The deployed textbook platform allows a user to successfully browse all chapters and modules.

### Implementation for User Story 1

- [ ] T009 [US1] Create `docs/chapter1/` directory for "Introduction to Physical AI" in `./docs/chapter1/`
- [ ] T010 [US1] Create `_category_.json` for Chapter 1 in `./docs/chapter1/_category_.json`
- [ ] T011 [US1] Create `docs/chapter1/module1-ros2-nervous-system.md` for "Module 1: The Robotic Nervous System (ROS 2)" content in `./docs/chapter1/module1-ros2-nervous-system.md`
- [ ] T012 [US1] Create `docs/chapter2/` directory for "The Digital Twin (Gazebo & Unity)" in `./docs/chapter2/`
- [ ] T013 [US1] Create `_category_.json` for Chapter 2 in `./docs/chapter2/_category_.json`
- [ ] T014 [US1] Create `docs/chapter2/module1-gazebo-unity-digital-twin.md` for "Module 2: The Digital Twin (Gazebo & Unity)" content in `./docs/chapter2/module1-gazebo-unity-digital-twin.md`
- [ ] T015 [US1] Create `docs/chapter3/` directory for "The AI-Robot Brain (NVIDIA Isaac™)" in `./docs/chapter3/`
- [ ] T016 [US1] Create `_category_.json` for Chapter 3 in `./docs/chapter3/_category_.json`
- [ ] T017 [US1] Create `docs/chapter3/module1-nvidia-isaac-ai-brain.md` for "Module 3: The AI-Robot Brain (NVIDIA Isaac™)" content in `./docs/chapter3/module1-nvidia-isaac-ai-brain.md`
- [ ] T018 [US1] Create `docs/chapter4/` directory for "Vision-Language-Action (VLA)" in `./docs/chapter4/`
- [ ] T019 [US1] Create `_category_.json` for Chapter 4 in `./docs/chapter4/_category_.json`
- [ ] T020 [US1] Create `docs/chapter4/module1-vla-llm-robotics.md` for "Module 4: Vision-Language-Action (VLA)" content in `./docs/chapter4/module1-vla-llm-robotics.md`
- [ ] T021 [US1] Create `docs/chapter5/` directory and `_category_.json` for "Chapter 5: [To be defined]" in `./docs/chapter5/` and `./docs/chapter5/_category_.json`
- [ ] T022 [US1] Create `docs/chapter6/` directory and `_category_.json` for "Chapter 6: Capstone: Simple AI-Robot Pipeline" in `./docs/chapter6/` and `./docs/chapter6/_category_.json`
- [ ] T023 [US1] Update `./sidebars.js` to include all 6 chapters and their respective modules.
- [ ] T024 [P] [US1] Implement Next/Previous navigation buttons for content pages by configuring Docusaurus settings in `./docusaurus.config.js` or via theme customization.
- [ ] T025 [P] [US1] Implement on-page Table of Contents (TOC) for long modules by configuring Docusaurus settings in `./docusaurus.config.js` or via theme customization.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Search for Specific Information (Priority: P1)

**Goal**: Students can quickly find specific information within the textbook using a search function.

**Independent Test**: A user can enter a search query and receive accurate results that link to the relevant sections of the textbook.

### Implementation for User Story 2

- [ ] T026 [US2] Verify Docusaurus search indexing of all textbook content by running `docusaurus build` command and inspecting output.
- [ ] T027 [P] [US2] Implement UI for search bar and display of search results, potentially customizing Docusaurus theme components in `src/theme/Search*.js`.
- [ ] T028 [US2] Ensure search results link correctly to relevant textbook sections by testing search functionality with various queries.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Interact with AI Chatbot (Priority: P2)

**Goal**: Students can select text within the textbook and ask the integrated AI chatbot questions about it.

**Independent Test**: A user can select text, trigger the "Ask AI" function, and receive a relevant response from the chatbot based on the selected text and textbook content.

### Implementation for User Story 3

- [ ] T029 [US3] Develop placeholder UI for "Select-text → Ask AI" interaction, potentially as a custom Docusaurus component in `src/components/AskAIButton.js`.
- [ ] T030 [P] [US3] Integrate placeholder for chatbot API call (e.g., a service module in `src/services/chatbot.js` that returns mock data), with clear interfaces for future RAG chatbot development.

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and overall quality.

- [ ] T031 Review all content in `./docs/` for adherence to Markdown Best Practices (from `research.md`).
- [ ] T032 Add favicon to `./static/img/favicon.ico` and basic SEO metadata in `./docusaurus.config.js`.
- [ ] T033 Implement graceful handling for edge cases, e.g., "No results found" page for empty search results, custom 404 page for broken links.
- [ ] T034 Code cleanup and refactoring across all Docusaurus configuration and custom components.

---

## Dependencies & Execution Order

### Phase Dependencies

-   **Setup (Phase 1)**: No dependencies - can start immediately.
-   **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
-   **User Stories (Phase 3+)**: All depend on Foundational phase completion.
    *   User stories can then proceed in parallel (if staffed) or sequentially in priority order (P1 → P1 → P2).
-   **Polish (Final Phase)**: Depends on all desired user stories being complete.

### User Story Dependencies

-   **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories.
-   **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Integrates with User Story 1's content.
-   **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Relies on textbook content from US1.

### Within Each User Story

-   Core implementation before integration.
-   Story complete before moving to next priority.

### Parallel Opportunities

-   All Setup tasks marked [P] can run in parallel.
-   Once Foundational phase completes, User Story 1, 2, and 3 can be worked on concurrently by different team members, though US2 and US3 rely on content provided by US1 tasks.
-   Tasks marked [P] within user stories (T024, T025, T027, T030) can run in parallel.

---

## Parallel Example: User Story 1

```bash
# Example of parallel tasks for User Story 1:
# Task: T024 [P] [US1] Implement Next/Previous navigation buttons for content pages by configuring Docusaurus settings in `./docusaurus.config.js` or via theme customization.
# Task: T025 [P] [US1] Implement on-page Table of Contents (TOC) for long modules by configuring Docusaurus settings in `./docusaurus.config.js` or via theme customization.
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1.  Complete Phase 1: Setup
2.  Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3.  Complete Phase 3: User Story 1 (Read Textbook Chapters)
4.  **STOP and VALIDATE**: Test User Story 1 independently
5.  Deploy/demo if ready

### Incremental Delivery

1.  Complete Setup + Foundational → Foundation ready
2.  Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3.  Add User Story 2 → Test independently → Deploy/Demo
4.  Add User Story 3 → Test independently → Deploy/Demo
5.  Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1.  Team completes Setup + Foundational together.
2.  Once Foundational is done:
    *   Developer A: Focuses on User Story 1 (Content Structure, Basic Navigation).
    *   Developer B: Focuses on User Story 2 (Search Implementation).
    *   Developer C: Focuses on User Story 3 (AI Chatbot Placeholder Integration).
3.  Stories complete and integrate independently.

---

## Notes

-   [P] tasks = different files, no dependencies
-   [Story] label maps task to specific user story for traceability
-   Each user story should be independently completable and testable
-   Commit after each task or logical group
-   Stop at any checkpoint to validate story independently
-   Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
