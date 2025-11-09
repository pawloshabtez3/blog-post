# Requirements Document

## Introduction

Inkflow is a modern blog platform that enables users to create, manage, and publish blog posts with integrated AI writing assistance. The system combines user authentication, content management, public blog viewing, and Google Gemini AI integration to provide an intelligent writing experience. Users can write in Markdown, manage their posts through a dashboard, and leverage AI to enhance their content with suggestions, improvements, and summaries.

## Glossary

- **Inkflow System**: The complete blog platform application including frontend, backend, and AI integration
- **User**: An authenticated individual who can create and manage blog posts
- **Post**: A blog article containing title, slug, content, and publication status
- **Dashboard**: The authenticated user interface for managing posts
- **Blog Feed**: The public-facing list of published posts
- **AI Assistant**: The Google Gemini integration that provides writing enhancement features
- **Markdown**: A lightweight markup language used for formatting post content
- **Slug**: A URL-friendly identifier derived from the post title
- **Draft Status**: A post state indicating the content is not publicly visible
- **Published Status**: A post state indicating the content is publicly accessible

## Requirements

### Requirement 1

**User Story:** As a new visitor, I want to sign up for an account using email/password or Google sign-in, so that I can create and manage my own blog posts.

#### Acceptance Criteria

1. WHEN a visitor accesses the sign-up interface, THE Inkflow System SHALL provide options for email/password registration and Google OAuth authentication
2. WHEN a user submits valid registration credentials, THE Inkflow System SHALL create a new user account using Supabase Auth
3. IF a user attempts to register with an already-registered email, THEN THE Inkflow System SHALL display an error message indicating the email is already in use
4. WHEN a user successfully completes registration, THE Inkflow System SHALL redirect the user to the Dashboard
5. THE Inkflow System SHALL maintain user session state across page navigations

### Requirement 2

**User Story:** As an authenticated user, I want to create new blog posts with a title, slug, and Markdown content, so that I can draft my articles.

#### Acceptance Criteria

1. WHEN an authenticated user accesses the post creation interface, THE Inkflow System SHALL display input fields for title, slug, and content
2. THE Inkflow System SHALL provide a textarea editor for Markdown content input
3. WHEN a user enters a title, THE Inkflow System SHALL automatically generate a URL-friendly slug
4. WHEN a user saves a new post, THE Inkflow System SHALL store the post in the Supabase database with draft status by default
5. THE Inkflow System SHALL associate each created post with the authenticated user's identifier

### Requirement 3

**User Story:** As an authenticated user, I want to edit my existing blog posts, so that I can update and improve my content over time.

#### Acceptance Criteria

1. WHEN an authenticated user accesses the edit interface for their post, THE Inkflow System SHALL display the current title, slug, and content in editable fields
2. WHEN a user modifies post content and saves changes, THE Inkflow System SHALL update the post record in the database
3. WHEN a post is updated, THE Inkflow System SHALL record the current timestamp in the updated_at field
4. THE Inkflow System SHALL prevent users from editing posts that do not belong to them
5. IF a user attempts to save a post with a slug that already exists for another post, THEN THE Inkflow System SHALL display an error message

### Requirement 4

**User Story:** As an authenticated user, I want to delete my blog posts, so that I can remove content I no longer want published.

#### Acceptance Criteria

1. WHEN an authenticated user views their post list in the Dashboard, THE Inkflow System SHALL display a delete option for each post
2. WHEN a user initiates post deletion, THE Inkflow System SHALL request confirmation before proceeding
3. WHEN a user confirms deletion, THE Inkflow System SHALL remove the post record from the database
4. THE Inkflow System SHALL prevent users from deleting posts that do not belong to them
5. WHEN a post is deleted, THE Inkflow System SHALL update the Dashboard view to reflect the removal

### Requirement 5

**User Story:** As an authenticated user, I want to publish or unpublish my posts, so that I can control which content is visible to the public.

#### Acceptance Criteria

1. WHEN an authenticated user views a draft post in the Dashboard, THE Inkflow System SHALL display a publish action
2. WHEN an authenticated user views a published post in the Dashboard, THE Inkflow System SHALL display an unpublish action
3. WHEN a user publishes a post, THE Inkflow System SHALL update the post status to published
4. WHEN a user unpublishes a post, THE Inkflow System SHALL update the post status to draft
5. THE Inkflow System SHALL only display published posts in the public Blog Feed

### Requirement 6

**User Story:** As a visitor, I want to view a list of all published blog posts, so that I can discover content to read.

#### Acceptance Criteria

1. WHEN a visitor accesses the blog route, THE Inkflow System SHALL display a list of all published posts
2. THE Inkflow System SHALL display each post with its title and creation date in the Blog Feed
3. THE Inkflow System SHALL order posts by creation date with newest posts first
4. WHEN a visitor clicks on a post in the Blog Feed, THE Inkflow System SHALL navigate to the individual post view
5. THE Inkflow System SHALL exclude draft posts from the Blog Feed display

### Requirement 7

**User Story:** As a visitor, I want to view individual blog posts with formatted content, so that I can read the full article.

#### Acceptance Criteria

1. WHEN a visitor accesses a post by its slug, THE Inkflow System SHALL display the post title and rendered content
2. THE Inkflow System SHALL render Markdown content as formatted HTML using react-markdown
3. IF a visitor attempts to access a draft post by slug, THEN THE Inkflow System SHALL display a not-found or unauthorized message
4. THE Inkflow System SHALL display the post creation date on the individual post page
5. IF a visitor attempts to access a non-existent slug, THEN THE Inkflow System SHALL display a not-found message

### Requirement 8

**User Story:** As an authenticated user, I want to access a dashboard that shows all my posts, so that I can manage my content in one place.

#### Acceptance Criteria

1. WHEN an authenticated user accesses the Dashboard route, THE Inkflow System SHALL display a list of all posts belonging to that user
2. THE Inkflow System SHALL display each post with its title, status, and last updated date
3. THE Inkflow System SHALL provide action buttons for editing, deleting, and changing publication status for each post
4. THE Inkflow System SHALL display a button to create a new post
5. THE Inkflow System SHALL prevent unauthenticated users from accessing the Dashboard

### Requirement 9

**User Story:** As an authenticated user writing a post, I want to use AI to improve my draft content, so that I can enhance the quality and engagement of my writing.

#### Acceptance Criteria

1. WHEN an authenticated user is editing a post, THE Inkflow System SHALL display an AI improvement button
2. WHEN a user clicks the AI improvement button, THE Inkflow System SHALL send the current draft content to the Google Gemini API
3. WHEN the AI Assistant receives a draft, THE AI Assistant SHALL return a refined version, catchy title suggestion, three keyword tags, and a meta description
4. WHEN the AI Assistant returns suggestions, THE Inkflow System SHALL display the results to the user
5. THE Inkflow System SHALL allow the user to accept or reject the AI suggestions

### Requirement 10

**User Story:** As an authenticated user, I want to generate a concise summary of my blog post using AI, so that I can create meta descriptions or preview text.

#### Acceptance Criteria

1. WHEN an authenticated user is editing a post with content, THE Inkflow System SHALL display a summarize button
2. WHEN a user clicks the summarize button, THE Inkflow System SHALL send the post content to the Google Gemini API
3. WHEN the AI Assistant receives content to summarize, THE AI Assistant SHALL return a two-to-three sentence summary
4. WHEN the AI Assistant returns a summary, THE Inkflow System SHALL display the summary to the user
5. THE Inkflow System SHALL allow the user to copy or use the generated summary
