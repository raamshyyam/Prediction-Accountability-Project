name: ✨ Feature Request
description: Suggest a new feature or enhancement
title: "[FEATURE] "
labels: ["enhancement", "needs-triage"]
assignees: []

body:
  - type: markdown
    attributes:
      value: |
        Thank you for suggesting a feature! We'd love to hear your ideas. 🚀

  - type: textarea
    id: is-your-feature-related-to-a-problem
    attributes:
      label: Is your feature request related to a problem?
      description: Describe the problem or use case. Ex. "I'm frustrated when..."
      placeholder: "I'm frustrated when I can't search claims by date range..."
    validations:
      required: false

  - type: textarea
    id: describe-the-solution
    attributes:
      label: Describe the solution you'd like
      description: A clear and concise description of what you want to happen
      placeholder: |
        Add a date range picker to the search bar:
        - Allow users to filter claims by date made or target date
        - Show results between selected dates
      validations:
        required: true

  - type: textarea
    id: describe-alternatives
    attributes:
      label: Describe alternatives you've considered
      description: Any other solutions or workarounds you've thought of
      placeholder: |
        Alternative 1: Allow filtering by year only
        Alternative 2: Show timeline view by default
      validations:
        required: false

  - type: dropdown
    id: category
    attributes:
      label: Feature category
      options:
        - "Claims Management"
        - "Claimant Profiles"
        - "Verification System"
        - "Analytics & Dashboards"
        - "Search & Filtering"
        - "AI Features"
        - "UI/UX"
        - "Performance"
        - "Documentation"
        - "Other"
    validations:
      required: true

  - type: textarea
    id: additional-context
    attributes:
      label: Additional context
      description: Any screenshots, mockups, or other examples?
      placeholder: "Here's a screenshot of how similar features work..."
    validations:
      required: false

  - type: checkboxes
    id: checklist
    attributes:
      label: Before submitting
      description: Make sure you've done the following
      options:
        - label: I've searched existing issues to avoid duplicates
          required: false
        - label: I've checked if this feature is in the Roadmap
          required: false

  - type: markdown
    attributes:
      value: |
        **Thanks for the idea!** We'll review it and discuss with the team. ✨
