# Project Setup & Migration Guide

This guide details how to move this project to a new machine and run it successfully.

## 1. Prerequisites
Before you begin, ensure the new machine has **Node.js** installed.
- **Download Node.js**: [https://nodejs.org/](https://nodejs.org/)
- **Recommended Version**: LTS (Long Term Support) version (e.g., v18 or v20).

## 2. Transferring the Project
When copying the project folder (`CRM-Prototype`) to the new machine, **skip** the following folders to reduce file size and errors:
- `node_modules` (These are large and will be re-installed)
- `dist` (Build artifacts, re-generated automatically)
- `.git` (Optional: Only include if you want version history)

**What to Copy:**
- `src` folder
- `public` folder
- `package.json`
- `package-lock.json`
- `vite.config.js`
- `tailwind.config.js`
- `postcss.config.js`
- `index.html`
- `.gitignore`
- `README.md`

## 3. Installation
1. Open a terminal (Command Prompt, PowerShell, or Terminal).
2. Navigate to the project folder:
   ```bash
   cd path/to/CRM-Prototype
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
   *This will read `package.json` and download all necessary libraries into a new `node_modules` folder.*

## 4. Running the Application
To start the development server:
```bash
npm run dev
```
- The terminal will show a local URL (e.g., `http://localhost:5173/`).
- Open this URL in your web browser to view the application.

## 5. Troubleshooting
- **Port In Use**: If `5173` is taken, Vite will try `5174`. Check the terminal output.
- **Missing Dependencies**: If you see "module not found" errors, run `npm install` again.
