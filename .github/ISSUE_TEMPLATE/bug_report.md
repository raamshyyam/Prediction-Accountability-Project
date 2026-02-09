name: 🐛 Bug Report
description: Report a bug or broken feature
title: "[BUG] "
labels: ["bug", "needs-triage"]
assignees: []

body:
  - type: markdown
    attributes:
      value: |
        Thank you for reporting a bug! Please provide as much detail as possible.

  - type: textarea
    id: describe-bug
    attributes:
      label: Describe the bug
      description: A clear and concise description of what the bug is. What happened? What's expected?
      placeholder: The login button doesn't respond when clicked on mobile...
    validations:
      required: true

  - type: textarea
    id: steps-to-reproduce
    attributes:
      label: Steps to reproduce
      description: Exact steps to reproduce the behavior
      placeholder: |
        1. Go to [page]
        2. Click on [button]
        3. Observe [issue]
    validations:
      required: true

  - type: textarea
    id: expected-behavior
    attributes:
      label: Expected behavior
      description: What should happen instead?
      placeholder: The page should navigate to the dashboard...
    validations:
      required: true

  - type: textarea
    id: screenshots
    attributes:
      label: Screenshots
      description: If applicable, add screenshots or screen recordings
      placeholder: Paste image or video URL here

  - type: dropdown
    id: environment
    attributes:
      label: Environment
      description: What's your setup?
      options:
        - "Local development (npm run dev)"
        - "Production deployment"
        - "Docker container"
        - "Other"
    validations:
      required: true

  - type: input
    id: browser
    attributes:
      label: Browser
      description: Browser and version (e.g., Chrome 120, Firefox 121)
      placeholder: Chrome 120.0.0

  - type: input
    id: os
    attributes:
      label: Operating System
      description: OS and version (e.g., Windows 11, macOS 14.2)
      placeholder: Windows 11, macOS 14.2, Ubuntu 23.10

  - type: dropdown
    id: device
    attributes:
      label: Device Type
      options:
        - "Desktop"
        - "Tablet"
        - "Mobile"

  - type: textarea
    id: console-error
    attributes:
      label: Console error (if any)
      description: Paste any error messages from browser console (F12)
      placeholder: "SyntaxError: Unexpected token } in JSON at position..."

  - type: textarea
    id: additional-context
    attributes:
      label: Additional context
      description: Any other context that might help us understand the bug
      placeholder: This happens after clearing browser cache...

  - type: markdown
    attributes:
      value: |
        **Thanks for reporting! We'll get back to you soon.** 🙏
