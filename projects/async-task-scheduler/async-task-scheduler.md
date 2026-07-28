---
title: "Async Task & Timer Scheduler"
slug: "async-task-scheduler"
shortDescription: "Lightweight JavaScript background job runner with cron expression parsing and status notifications."
tech:
  - JavaScript
  - Web Workers
  - Algorithms
  - Async
github: "https://github.com/jeetprakash"
demo: "https://github.com/jeetprakash"
date: "2026-07-20"
---

# Async Task & Timer Scheduler

A high-performance JavaScript task scheduler supporting non-blocking background execution, 5-field cron parsing, one-shot timers, and early cancellation triggers.

---

## 🌟 Key Features

- **Cron Expression Parsing**: Full support for standard 5-field cron expressions (e.g. `*/5 * * * *` for every 5 minutes).
- **One-Shot Timers with Early Termination**: Flexible trigger conditions (`never`, `any`, or specific task ID listeners).
- **Non-Blocking Background Threads**: Runs background jobs inside Web Workers without blocking the main UI thread.
- **Robust Event API**: Lifecycle hooks for `onStart`, `onProgress`, `onComplete`, and `onError`.

---

## 💻 Code Example

```javascript
import { TaskScheduler } from 'async-task-scheduler';

const scheduler = new TaskScheduler();

// Schedule a recurring health check every 10 minutes
scheduler.scheduleCron({
  cron: '*/10 * * * *',
  maxIterations: 6,
  task: async () => {
    const res = await fetch('/api/health');
    console.log('Health Status:', res.status);
  }
});
```
