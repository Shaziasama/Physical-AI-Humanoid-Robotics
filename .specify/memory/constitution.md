<!--
Sync Impact Report:
Version change: 1.0.0 → 1.1.0
Modified principles:
- I. Modular and Composable Design → I. Spec-First Development
- II. Extensible and Pluggable Architecture → II. Technical Accuracy and Reproducibility
- III. Reproducibility and Determinism (NON-NEGOTIABLE) → III. Clear and Accessible Content
- IV. Workflow-Driven and Explicit Processes → IV. Grounded and Non-Hallucinated Responses
- V. Performance and Optimization → (removed as core principle, moved to Key Standards)
- VI. Cross-Platform Compatibility → (removed as core principle, moved to Key Standards)
Added sections:
- Success Criteria
- Key Standards (replacing previous "Additional Constraints" and "Development Workflow" with new content)
Removed sections:
- Development Workflow
Follow-up TODOs: None
-->
# AI-spec–driven technical book with embedded RAG chatbot Constitution

## Core Principles

### I. Spec-First Development
All development must follow a spec-first approach using Spec-Kit Plus, ensuring detailed specifications guide implementation from conception to completion.

### II. Technical Accuracy and Reproducibility
All technical content and code implementations must be rigorously accurate and fully reproducible. This includes documented steps, verifiable results, and consistent environments.

### III. Clear and Accessible Content
Written content, including explanations, code examples, and documentation, must be clear, concise, and accessible to both human developers and AI engineers.

### IV. Grounded and Non-Hallucinated Responses
Any AI-generated responses, particularly from the embedded RAG chatbot, must be strictly grounded in provided source material and explicitly avoid hallucination.

## Key Standards and Constraints

### Key Standards
- Book framework: Docusaurus
- Deployment: GitHub Pages
- Content authored via Claude Code
- Structured chapters with objectives and summaries
- RAG stack: OpenAI Agents / ChatKit, FastAPI, Neon Serverless Postgres, Qdrant Cloud (Free Tier)

### Data Constraints
- Embeddings generated from book content only
- Semantic chunking with chapter and section metadata
- No external knowledge unless explicitly specified

### Operational Constraints
- GitHub Pages compatible
- Free-tier services only
- Secrets via environment variables
- Fully reproducible setup

## Success Criteria
- Book successfully deployed
- Embedded RAG chatbot fully functional
- Accurate, source-grounded answers
- Specs map directly to final implementation

## Governance

This constitution is the single source of truth for all development practices. Any amendments to this constitution require a formal proposal, review, and approval process. All pull requests must be reviewed for compliance with this constitution.

**Version**: 1.1.0 | **Ratified**: 2025-12-16 | **Last Amended**: 2025-12-16
