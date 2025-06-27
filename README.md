# Find a Community Frontend

This project is the frontend for "Find a Community", a platform designed to help people in Vancouver connect with local, ongoing communities rather than just one-time events. The goal is to foster lasting friendships by making it easy to discover and join groups that meet regularly.

The application is built with a modern tech stack including Vite, React, and TypeScript, and features a clean, user-friendly interface powered by Shadcn UI and Tailwind CSS.

## Purpose

In a city like Vancouver, it can be challenging to find a sense of belonging. "Find a Community" aims to solve this by providing a centralized place to discover and engage with local communities. Unlike platforms that focus on single events, this application emphasizes recurring meetups and active groups, helping users build meaningful connections over time.

## Features

-   **User Authentication:** Secure sign-up and login functionality.
-   **Community Discovery:** Browse and search for communities based on interests, location, and keywords.
-   **Detailed Community Pages:** Get all the information you need about a community, including its description, location, and member count.
-   **User Dashboards:** Personalized spaces for users to track their joined communities and upcoming events.
-   **Organizer Dashboards:** Tools for community organizers to manage their groups and events.
-   **Profile Management:** Users can easily view and update their profile information.

## How It Works

1.  **Search & Discover:** Find communities that match your interests using the search and filter options.
2.  **Join Communities:** Connect with like-minded people by joining groups that align with your passions.
3.  **Attend & Connect:** Keep track of your communities' events and build lasting friendships.

## Technologies Used

-   **Framework:** React
-   **Bundler:** Vite
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS
-   **UI Components:** Shadcn UI
-   **Routing:** React Router
-   **Form Management:** React Hook Form
-   **State Management:** React Query
-   **Linting:** ESLint

## Getting Started

### Prerequisites

Make sure you have [Bun](https://bun.sh/) installed on your machine.

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd find-a-community-front
    ```
3.  Install the dependencies:
    ```bash
    bun install
    ```

## Available Scripts

In the project directory, you can run the following commands:

### `bun dev`

Runs the app in development mode. Open [http://localhost:5173](http://localhost:5173) to view it in your browser. The page will automatically reload when you make changes.

### `bun build`

Builds the app for production to the `dist` folder. This command bundles React in production mode and optimizes the build for the best performance.

### `bun lint`

Lints the project's source files using ESLint to ensure code quality.

### `bun preview`

Runs a local server to preview the production build from the `dist` folder.