# RPWeb User Experience Design

This document outlines the comprehensive UX and product design for the RPWeb platform, focusing on immersion, character-driven storytelling, and a clean, accessible interface.

## User Journey

1. **New User Onboarding**
   - **Landing**: The user lands on a visually immersive homepage showcasing featured worlds and characters.
   - **Registration**: Simple sign-up process (email or OAuth). 
   - **Welcome Experience**: The user is greeted with "Who are you in this universe?" and prompted to either create their first character or explore existing worlds.

2. **Creating First Character**
   - **Action**: User clicks "Create Character".
   - **Process**: A multi-step, clean form. 
     - *Step 1*: Basic Identity (Name, Pronouns, Avatar).
     - *Step 2*: Appearance & Personality (Traits, physical description).
     - *Step 3*: Backstory (Rich text).
   - **Completion**: The user is redirected to their new character's beautifully formatted profile page.

3. **Joining a World**
   - **Discovery**: User navigates to the World Directory and filters by genre (Fantasy, Sci-Fi, Modern).
   - **Exploration**: User clicks on a world, reading the "TL;DR" lore summary and rules.
   - **Action**: User clicks "Join World" and selects which of their characters will step into this universe.

4. **Creating a Scene**
   - **Action**: Inside a World or via the Dashboard, the user clicks "Start a Scene".
   - **Setup**: User defines the scene title, location (tied to world lore), and privacy (Public or Invite-only).
   - **Opening**: User writes the opening narrative establishing the setting and action.
   - **Publish**: The scene becomes active and invites are sent (if applicable).

5. **Participating in a Scene**
   - **Notification**: User sees an indicator on their Dashboard under "Your Turn".
   - **Reading**: User enters the scene, reading chronological posts seamlessly.
   - **Writing**: User drafts a response using the RP-focused Rich Text Editor. A prominent avatar reminds them *which* character they are currently playing.
   - **Posting**: The scene updates in real-time.

6. **Managing Relationships**
   - **Discovery**: User visits another character's profile.
   - **Action**: User clicks "Add Relationship" and selects the dynamic (e.g., Rival, Ally, Family).
   - **Approval**: A notification is sent to the other user to approve the relationship. Once approved, it appears as a card on both profiles.

7. **Creating Story Arcs**
   - **Action**: From a World page, a user clicks "Start Story Arc".
   - **Setup**: User defines the overarching premise and links participating characters.
   - **Tracking**: As scenes are created, they are linked to the arc. The Arc Page shows a timeline of events and milestones achieved.

---

## Site Map

- **Marketing / Auth**
  - `/` (Landing Page)
  - `/login`
  - `/register`
- **User Space**
  - `/dashboard` (Feed, active scenes, quick links)
  - `/settings` (Account, preferences, theme)
- **Worlds**
  - `/worlds` (Directory)
  - `/worlds/[id]` (World Page)
    - `/worlds/[id]/lore`
    - `/worlds/[id]/rules`
    - `/worlds/[id]/timeline`
    - `/worlds/[id]/characters`
    - `/worlds/[id]/scenes`
- **Characters**
  - `/characters` (Directory)
  - `/characters/create`
  - `/characters/[id]` (Character Profile)
    - `/characters/[id]/journals`
    - `/characters/[id]/relationships`
- **Scenes**
  - `/scenes` (Global directory)
  - `/scenes/create`
  - `/scenes/[id]` (Scene Page)
- **Story Arcs**
  - `/arcs/[id]` (Story Arc Page)

---

## Navigation Structure

### Desktop Navigation
A permanent, clean **Left Sidebar** to maintain a web-app feel without Discord-like clutter.
- **Top of Sidebar**: Brand Logo (Links to Dashboard)
- **Main Links**: 
  - 🏠 Dashboard
  - 🌍 Worlds
  - 🎭 Characters
  - 📖 Scenes
- **Bottom of Sidebar**: User Avatar & Name (Click to open menu: Profile, Settings, Log Out).
- **Contextual Sub-navigation**: Horizontal tab menus inside specific entities (e.g., Lore, Rules, Characters tabs inside a World).

### Mobile Navigation
A fixed **Bottom Tab Bar** for primary actions to ensure easy thumb reach.
- **Tabs**: Dashboard (Home), Worlds (Globe), Scenes (Book), Characters (Mask).
- **Top Header**: Page Title, Contextual Back Button, and a generic hamburger/avatar menu for Settings and Log Out.

---

## Page Wireframes

### 1. Landing Page
* **Purpose**: Convert visitors into users by showcasing an immersive storytelling platform.
* **Sections**: Hero Banner, Feature Highlights (Worlds, Characters, Scenes), Footer.
* **Components**: Full-width background art, Primary Call-to-Action (CTA) Button, Feature Cards.
* **User actions**: Login, Register, Scroll to read features.

### 2. Login/Register
* **Purpose**: Secure and distraction-free authentication.
* **Sections**: Centered Form Card.
* **Components**: Email/Password text inputs, Primary Auth Button, OAuth links (e.g., Google).
* **User actions**: Enter credentials, Submit, Toggle between login/signup.

### 3. Dashboard
* **Purpose**: The central hub for a user's active roleplays.
* **Sections**: 
  - **"Your Turn"**: High-priority list of scenes waiting for a reply.
  - **Recent Activity**: Feed of updates from joined worlds.
  - **My Roster**: Quick-access carousel of the user's characters.
* **Components**: Notification Badges, Scene Cards (compact), Avatar Carousel.
* **User actions**: Click to reply to a scene, create new character/scene.

### 4. World Directory
* **Purpose**: Discover new worlds.
* **Sections**: Header with Search/Filter, Grid of Worlds.
* **Components**: Search Input, Dropdown Selects (Genre, Activity Level), World Cards (Cover image, title, member count).
* **User actions**: Type to search, apply filters, click a card to view.

### 5. World Page
* **Purpose**: Present lore and activity for a specific world.
* **Sections**: Hero Header (Large cover image, title, join button), Tabbed Navigation, Main Content Area.
* **Components**: Tabs, Markdown Content Renderer, Member List.
* **User actions**: Switch tabs (Lore/Rules/Scenes), click "Join World".

### 6. Character Directory
* **Purpose**: Browse the global character roster.
* **Sections**: Search/Filter bar, Grid of Characters.
* **Components**: Character Cards (Avatar, Name, Short Tagline).
* **User actions**: Search, click to view profile.

### 7. Character Profile
* **Purpose**: Detail a character's identity.
* **Sections**: Header (Avatar, Name, Pronouns), Two-column layout (Left: Stats/Traits, Right: Bio/Backstory), Tabbed sections for Relationships/Journals.
* **Components**: Large Avatar display, Trait Badges, Relationship Cards.
* **User actions**: Read bio, add relationship, edit (if owner).

### 8. Scene Directory
* **Purpose**: Browse active and completed scenes.
* **Sections**: Filters (Active, Completed, Genre), Scene List.
* **Components**: Scene List Items (Title, Participants, Last Post Time).
* **User actions**: Browse, click to read or join.

### 9. Scene Page
* **Purpose**: The core roleplay interface.
* **Sections**: Scene Header (Title, Location), Reading Log (Chronological posts), Composer (Input area fixed to bottom or integrated seamlessly).
* **Components**: Message Bubbles/Blocks with character avatars, Rich Text Editor, Formatting Toolbar.
* **User actions**: Read previous posts, draft reply, format text, post.

### 10. Create Character
* **Purpose**: Form to input character details.
* **Sections**: Step-by-step or single long form (Basic Info, Appearance, Backstory).
* **Components**: Text Inputs, Image Upload Box, Markdown Editor.
* **User actions**: Fill details, upload image, submit.

### 11. Create Scene
* **Purpose**: Setup a new roleplay thread.
* **Sections**: Settings (Title, Location, Tags), Privacy (Open vs. Invite), Opening Post.
* **Components**: Toggles, Dropdowns, Rich Text Editor.
* **User actions**: Configure scene, write opening, publish.

### 12. Story Arc Page
* **Purpose**: Track the progression of a larger story.
* **Sections**: Arc Summary, Timeline of Events, Linked Scenes.
* **Components**: Progress Tracker/Timeline vertical list, Scene Cards.
* **User actions**: Read timeline, link new scene.

### 13. Settings
* **Purpose**: Manage account.
* **Sections**: Profile, Notifications, Appearance.
* **Components**: Form inputs, Toggle Switches (Dark/Light mode).
* **User actions**: Update preferences, save.

---

## Design System

* **Colors**:
  * **Primary (Brand)**: Deep Indigo (`#3730A3`) - Immersive, literary, and calm.
  * **Secondary (Accent)**: Amber/Gold (`#F59E0B`) - Used for highlights, active states, and important buttons.
  * **Background (Dark Mode Default)**: Very Dark Slate (`#0F172A`) - Reduces eye strain for long reading sessions.
  * **Surface (Cards/Modals)**: Dark Slate (`#1E293B`).
  * **Text**: Light Gray (`#F8FAFC`) for body, White (`#FFFFFF`) for headings.
  * **Muted Text**: Gray (`#94A3B8`).

* **Typography**:
  * **Headings**: *Playfair Display* or *Merriweather* (Serif). Gives a literary, storybook feel.
  * **Body**: *Inter* or *Roboto* (Sans-serif). Ensures clean legibility for long paragraphs of roleplay text.

* **Spacing**:
  * Base unit: `8px`. 
  * Generous padding (`24px` to `32px` on containers) to prevent clutter and let the text breathe.

* **Cards**:
  * Subtle borders (`#334155`), rounded corners (`8px` or `12px`), and soft drop shadows.
  * Hover states slightly elevate the card and brighten the border to encourage interaction.

* **Buttons**:
  * **Primary**: Solid Indigo background, white text, slightly rounded.
  * **Secondary**: Transparent with Indigo border.
  * **Ghost**: Text only, subtle hover background.

* **Modals**:
  * Darkened overlay (`rgba(0,0,0,0.7)`).
  * Centered box matching the Surface color. Used sparingly for destructive actions or quick inputs.

---

## Empty States

* **No characters**: 
  * *Visual*: Illustration of an empty portrait frame or blank silhouette.
  * *Text*: "Your story hasn't begun."
  * *Action*: Button -> "Create Your First Character".
* **No worlds**: 
  * *Visual*: Illustration of an unmapped galaxy or a closed, dusty book.
  * *Text*: "The universe is vast and empty."
  * *Action*: Button -> "Explore Worlds".
* **No scenes**: 
  * *Visual*: Illustration of an empty theater stage or blank parchment.
  * *Text*: "The stage is set, but the actors are missing."
  * *Action*: Button -> "Start a Scene".
* **No relationships**: 
  * *Visual*: Illustration of a solitary figure or two disconnected puzzle pieces.
  * *Text*: "A lone wolf. No connections found."
  * *Action*: Button -> "Find Connections".

---

## MVP UI Components

* **Typography**: `Heading`, `Text`, `Label`
* **Layout**: `Container`, `Grid`, `Stack`, `SectionDivider`
* **Navigation**: `Sidebar`, `BottomTabNav`, `Tabs`
* **Inputs**: `TextInput`, `TextArea`, `Select`, `Toggle`, `ImageUpload`
* **Actions**: `Button`, `IconButton`, `TextLink`
* **Display**: `Avatar`, `Card`, `Badge` (for tags/status), `TimelineItem`
* **Feedback**: `Toast` (Notifications), `Modal`, `SkeletonLoader` (for loading states)
* **Story Specific**: 
  * `ScenePost` (A structured message block containing avatar, character name, timestamp, and rich text).
  * `RPEditor` (A text editor optimized for writing story posts).

---

## Potential UX Problems & Solutions

1. **Problem: Wall of Text Fatigue**
   * *Issue*: Roleplay scenes can get very long, making the page overwhelming to load or read.
   * *Solution*: Implement pagination or a "Load More" mechanism. Ensure distinct visual separation between posts and optimize typography (max-width of `65-75ch`, comfortable line height of `1.6`).

2. **Problem: Context Switching (Wrong Character)**
   * *Issue*: Users playing multiple characters might accidentally reply to a scene using the wrong persona.
   * *Solution*: Place a prominent visual indicator (the current character's avatar and name) directly next to or inside the text composer. Add a quick-switch dropdown in the composer itself.

3. **Problem: Overwhelming Lore**
   * *Issue*: Joining a new world with dozens of pages of rules and lore can be daunting for newcomers.
   * *Solution*: Provide a required "TL;DR" or summary section for worlds. Use collapsible accordions for deep lore so the page isn't an endless scroll.

4. **Problem: Formatting Difficulties**
   * *Issue*: Users might struggle with markdown syntax or making their posts look aesthetically pleasing.
   * *Solution*: Provide a WYSIWYG editor tailored for RP. Include quick-format buttons specifically for "Dialogue" (quotes) and "Action" (italics).

5. **Problem: Finding Active Roleplays**
   * *Issue*: A user might join a world but feel lost on where to start or who is currently online.
   * *Solution*: Highlight "Looking for RP" badges on character profiles. Display "last active" timestamps on worlds and suggest open/public scenes on the dashboard.
