# Data Model: Docusaurus Textbook

**Feature Branch**: `docusaurus-textbook-plan`  
**Created**: 2025-12-10  
**Status**: Draft

## Key Entities

### Entity: Chapter

Represents a major organizational unit of the textbook.

-   **Attributes**:
    *   `id`: Unique identifier (auto-generated, e.g., based on folder name).
    *   `title`: Display name of the chapter (e.g., "Introduction to Physical AI").
    *   `order`: Numerical sequence for ordering chapters in the navigation.
    *   `modules`: A list of `Module` entities contained within this chapter.
-   **Relationships**: Has many `Module` entities.
-   **Validation Rules**: `title` and `order` are mandatory. `order` must be unique among chapters.

### Entity: Module

Represents a secondary organizational unit, nested within a chapter, focusing on a specific topic.

-   **Attributes**:
    *   `id`: Unique identifier (auto-generated, e.g., based on filename).
    *   `title`: Display name of the module (e.g., "The Robotic Nervous System (ROS 2)").
    *   `order`: Numerical sequence for ordering modules within a chapter.
    *   `chapter_id`: Foreign key referencing the parent `Chapter` entity.
    *   `lessons`: A list of `Lesson` entities contained within this module.
-   **Relationships**: Belongs to one `Chapter` entity, has many `Lesson` entities.
-   **Validation Rules**: `title`, `order`, and `chapter_id` are mandatory. `order` must be unique within its parent chapter.

### Entity: Lesson

Represents the fundamental content unit within a module. This is typically a Markdown file.

-   **Attributes**:
    *   `id`: Unique identifier (auto-generated, e.g., based on filename).
    *   `title`: Display name of the lesson.
    *   `content`: The actual text content of the lesson (Markdown format).
    *   `order`: Numerical sequence for ordering lessons within a module.
    *   `module_id`: Foreign key referencing the parent `Module` entity.
-   **Relationships**: Belongs to one `Module` entity.
-   **Validation Rules**: `title`, `content`, `order`, and `module_id` are mandatory. `order` must be unique within its parent module.

### Entity: Student

Represents the primary user of the textbook. While no direct data model is required for the static textbook itself, this entity is relevant for the integrated RAG chatbot.

-   **Attributes**: (No attributes for the textbook's data model, but conceptually represents a user accessing the content).
-   **Relationships**: Interacts with `Chapter`, `Module`, and `Lesson` entities by reading their content.
-   **Validation Rules**: N/A (managed by external systems for RAG chatbot).

## Conclusion

This data model provides a clear structure for organizing the textbook's content, supporting hierarchical navigation and content delivery.
