# Contributing to Prediction Accountability Platform (PAP)

Thank you for your interest in contributing to PAP! 🎉 We welcome contributions from everyone—whether you're a developer, designer, researcher, writer, or just someone passionate about accountability.

---

## 📋 Table of Contents

1. [Code of Conduct](#-code-of-conduct)
2. [Getting Started](#-getting-started)
3. [How to Contribute](#-how-to-contribute)
4. [Development Workflow](#-development-workflow)
5. [Coding Standards](#-coding-standards)
6. [Testing](#-testing)
7. [Commit Guidelines](#-commit-guidelines)
8. [Pull Request Process](#-pull-request-process)
9. [Areas We Need Help](#-areas-we-need-help)
10. [Questions & Support](#-questions--support)

---

## 🤝 Code of Conduct

We are committed to providing a welcoming and inclusive environment. By participating, you agree to:

- **Be respectful**: Treat everyone with courtesy and respect
- **Be inclusive**: Welcome people of all backgrounds and experience levels
- **Be constructive**: Provide helpful feedback, not criticism
- **Be honest**: Admit mistakes and learn from them
- **Be focused**: Keep discussions relevant and productive

**Zero tolerance** for harassment, discrimination, or unwelcome behavior. Report concerns to: conduct@predictionaccountability.org

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18.x** or higher ([download](https://nodejs.org/))
- **git** ([download](https://git-scm.com/))
- **A GitHub account** ([sign up](https://github.com/join))
- **Gemini API key** (optional, but recommended) — [get free key](https://ai.google.dev/)

### Fork & Clone

1. **Fork** the repository on GitHub (click "Fork" button)
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/prediction-accountability-platform.git
   cd prediction-accountability-platform
   ```
3. **Add upstream** to stay in sync:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/prediction-accountability-platform.git
   ```

### Setup for Development

```bash
# Install dependencies
npm install

# Create .env.local (copy from .env.example)
cp .env.example .env.local

# Add your Gemini API key (optional)
# Edit .env.local and set VITE_API_KEY=your_key_here

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

---

## 🛠️ How to Contribute

### 1. **Report a Bug** 🐛

Found a bug? Help us fix it!

1. **Check existing issues** to avoid duplicates
2. **Open a new issue** with:
   - Clear title: "Login button doesn't respond on mobile"
   - Description: What happened? What's expected?
   - **Steps to reproduce**: How to recreate the bug
   - **Environment**: Browser, OS, device
   - **Screenshots**: If visual issue
   - **Error logs**: If applicable

**Template:**
```markdown
## Bug Report

### Describe the bug
[Clear description of what's wrong]

### Steps to reproduce
1. Go to [page]
2. Click [button]
3. [What goes wrong?]

### Expected behavior
[What should happen]

### Screenshots
[If applicable]

### Environment
- Browser: [e.g., Chrome 120]
- OS: [e.g., Windows 11]
- Device: [Desktop/Mobile]
```

### 2. **Request a Feature** ✨

Have an idea? We'd love to hear it!

1. **Check existing feature requests**
2. **Open a new issue** with:
   - Clear title: "Add dark mode toggle"
   - Description: What problem does this solve?
   - **Why**: Why is this important?
   - **Suggested solution**: How to implement it?
   - **Alternatives**: Other ways to solve it?

**Template:**
```markdown
## Feature Request

### Description
[What's the feature?]

### Problem it solves
[Why do we need this?]

### Suggested implementation
[Your idea on how to build it]

### Alternatives
[Other approaches?]
```

### 3. **Submit Code** 💻

Want to fix a bug or add a feature? Great!

1. **Pick an issue** to work on (or create one first)
2. **Assign yourself** to the issue
3. **Create a feature branch**:
   ```bash
   git checkout -b feature/claim-verification
   # or
   git checkout -b bugfix/login-crash
   ```
4. **Make changes** following [Coding Standards](#-coding-standards)
5. **Test your work** (see [Testing](#-testing))
6. **Commit** with clear messages (see [Commit Guidelines](#-commit-guidelines))
7. **Push** to your fork:
   ```bash
   git push origin feature/claim-verification
   ```
8. **Open a Pull Request** (see [Pull Request Process](#-pull-request-process))

### 4. **Improve Documentation** 📖

Good documentation helps everyone!

- Fix typos or unclear explanations
- Add examples or tutorials
- Clarify the README, API docs, or inline comments
- Add translations

**Same process as code:** Fork → Branch → Edit → Commit → PR

### 5. **Localization** 🌍

Help PAP reach non-English speakers!

- **Translate UI** to Nepali, Hindi, or other languages
- **Translate docs** (README, guides)
- Check existing translations for accuracy

See `/src/translations.ts` for the translation structure.

### 6. **Design & UX** 🎨

- Suggest UI improvements
- Design new components or pages
- Test accessibility (screen readers, keyboard nav)
- Submit mockups or design files

### 7. **Testing** 🧪

- Write unit tests for new features
- Test across browsers and devices
- Report compatibility issues
- Suggest test cases

### 8. **Community Help** 🤝

- Answer questions in Discussions
- Help new contributors get started
- Review and test Pull Requests
- Share PAP with your network

---

## 🔄 Development Workflow

### Branch Naming

Use descriptive names:
```
feature/feature-name          # New feature
bugfix/issue-description      # Bug fix
docs/what-docs-update         # Documentation
refactor/what-is-refactored   # Code refactoring
test/what-is-being-tested     # Tests
chore/dependency-update       # Dependencies, config
```

**Good:**
- `feature/manifesto-tracker`
- `bugfix/vagueness-calculation`
- `docs/setup-instructions`

**Bad:**
- `fix-stuff`
- `update`
- `my-changes`

### Keep Your Fork Updated

Before starting work, sync with upstream:

```bash
git fetch upstream
git rebase upstream/main
# or
git merge upstream/main
```

### Make Regular Commits

Commit frequently with clear messages:

```bash
git add src/components/NewComponent.tsx
git commit -m "Add vagueness scoring component"

git add src/styles/new.css
git commit -m "Style: Add dark mode support"
```

---

## 🎯 Coding Standards

### TypeScript

- **Use TypeScript** for all new code (no `any` unless unavoidable)
- Define types for props, state, returns:
  ```typescript
  interface ClaimCardProps {
    claim: Claim;
    onUpdate: (updatedClaim: Claim) => void;
  }
  ```

### React Best Practices

- **Functional components** with hooks (no class components)
- **Meaningful component names**: `ClaimDetailView` not `Card2`
- **Props destructuring**: `const { claim, lang } = props`
- **Hook dependencies**: Always include proper dependency arrays
- **Avoid prop drilling**: Use context when passing multiple levels

Example:
```typescript
export const ClaimCard: React.FC<ClaimCardProps> = ({ claim, onUpdate, lang }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    // implementation
  };

  return (
    <div className="claim-card">
      {/* JSX */}
    </div>
  );
};
```

### CSS & Styling

- **Use Tailwind CSS** class names (no inline styles)
- **Responsive design**: Mobile-first approach
- **Color scheme**: Use defined palette from `tailwind.config.ts`
- **Spacing**: Use Tailwind spacing scale (p-4, m-8, etc.)

```tsx
// ✅ Good
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  Click me
</button>

// ❌ Bad
<button style={{ padding: '8px 16px', backgroundColor: 'blue', color: 'white' }}>
  Click me
</button>
```

### Naming Conventions

- **Files**: PascalCase for components, camelCase for utilities
  - `src/components/ClaimCard.tsx`
  - `src/utils/dateFormatter.ts`
- **Functions**: camelCase
  - `calculateVagueness()`
  - `formatDate()`
- **Constants**: UPPER_SNAKE_CASE
  - `const API_TIMEOUT = 5000;`
- **Classes**: PascalCase (rarely used in modern React)

### Comments & Documentation

Write **clear, helpful comments**:

```typescript
// Bad: Obvious comment
const x = y + 1; // Add 1 to y

// Good: Explains "why," not "what"
// User's vagueness score is offset by 1 because initial score is 0-indexed
const vaguenessIndex = rawScore + 1;

/**
 * Calculate vagueness score for a claim (1-10)
 * Factors: specificity, named actors, dates, metrics
 * @param claimText - The claim text to analyze
 * @param length - Word count (optional override)
 * @returns Vagueness score 1-10 (10 = most vague)
 */
function calculateVagueness(claimText: string, length?: number): number {
  // implementation
}
```

### Error Handling

Always handle errors gracefully:

```typescript
// ✅ Good
try {
  const result = await analyzeClaimDeeply(claimText);
  setAnalysis(result);
} catch (error) {
  console.error('Analysis failed:', error);
  setError('Could not analyze claim. Please try again.');
}

// ❌ Bad
const result = await analyzeClaimDeeply(claimText); // No error handling!
```

### Performance

- **Memoize expensive components**: Use `React.memo()` when props don't change often
- **Lazy load** large components: `React.lazy()` and `Suspense`
- **Optimize lists**: Use `key` prop properly
- **Avoid unnecessary re-renders**: Use `useCallback()` for stable function references

---

## 🧪 Testing

### Jest & React Testing Library

We use **Jest** for unit tests and **React Testing Library** for component tests.

### Writing Tests

Create test file next to component:
- `src/components/ClaimCard.tsx`
- `src/components/ClaimCard.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ClaimCard } from './ClaimCard';

describe('ClaimCard', () => {
  it('should render claim text', () => {
    const claim = { id: '1', text: 'Test claim', vaguenessIndex: 5 };
    render(<ClaimCard claim={claim} onUpdate={() => {}} />);
    expect(screen.getByText('Test claim')).toBeInTheDocument();
  });

  it('should call onUpdate when edited', () => {
    const onUpdate = jest.fn();
    render(<ClaimCard claim={mockClaim} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText('Edit'));
    expect(onUpdate).toHaveBeenCalled();
  });
});
```

### Run Tests

```bash
# Run all tests
npm run test

# Run with watch mode
npm run test -- --watch

# Run with coverage
npm run test -- --coverage
```

### Test Coverage Goals

- Aim for **80%+ coverage** on critical paths
- Cover happy paths, error cases, and edge cases
- Test user interactions, not implementation details

---

## 📝 Commit Guidelines

Write **clear, descriptive commit messages**. They help future maintainers understand your changes.

### Format

```
type(scope): Subject line (50 chars)

Detailed explanation (72 chars per line).
Explain WHY, not WHAT—the code shows what changed.

Fixes #123 (Reference issue numbers)
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, missing semicolons)
- `refactor`: Code restructuring without behavior change
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Dependency updates, build config

### Examples

```bash
# ✅ Good
git commit -m "feat(claims): Add vagueness scoring algorithm

Uses NLP to assess claim specificity based on:
- Presence of numbers and dates
- Named actors/organizations
- Measurable outcomes

Implements heuristic when AI API unavailable.

Fixes #42"

# ✅ Good (simple fix)
git commit -m "fix(ui): Fix login button mobile styling

Fixes #120"

# ❌ Bad
git commit -m "fix stuff"
git commit -m "Update"
git commit -m "WIP"
```

---

## 🔀 Pull Request Process

### Before Submitting

1. **Sync with upstream**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests**:
   ```bash
   npm run test
   ```

3. **Check linting**:
   ```bash
   npm run lint
   ```

4. **Build for production** (to catch build errors):
   ```bash
   npm run build
   ```

### Open a PR

1. **Go to GitHub** and click "New Pull Request"
2. **Set base**: `main` branch
3. **Set compare**: Your feature branch
4. **Fill out the PR template** (auto-populated):

```markdown
## Description
What changes does this PR introduce?

## Type of Change
- [ ] 🐛 Bug fix
- [ ] ✨ New feature
- [ ] 📖 Documentation
- [ ] 🔄 Refactor

## Related Issues
Fixes #123

## Testing
How did you test this change?

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No new warnings/errors
```

### Code Review

- **Be receptive** to feedback
- **Explain decisions**: Why this approach?
- **Request changes**: Politely ask for clarification if reviewer feedback unclear
- **Re-request review** after making changes

### Merging

Once approved:
1. **Squash commits** (if many small commits):
   ```bash
   git rebase -i upstream/main
   ```
2. **Maintainer merges** your PR

---

## 🎯 Areas We Need Help

### 🔴 High Priority

- **Bug fixes**: Check [open issues](https://github.com/yourrepo/pap/issues)
- **Performance**: Optimize slow components, reduce bundle size
- **Testing**: Increase test coverage to 80%+
- **Documentation**: Clarify setup, API docs, architecture

### 🟡 Medium Priority

- **Features**: See [Roadmap](./README.md#-roadmap) for planned features
- **UI/UX**: Improve designs, accessibility (WCAG 2.1)
- **Refactoring**: Code quality improvements
- **Localization**: Translate to Nepali, Hindi, other languages

### 🟢 Lower Priority (Nice to Have)

- **Community**: Help in Discussions, review PRs
- **Marketing**: Content, social media
- **DevOps**: CI/CD improvements, deployment automation
- **Research**: Analyze prediction accuracy patterns

---

## 📞 Questions & Support

- **GitHub Discussions**: [Ask questions](https://github.com/yourrepo/pap/discussions)
- **GitHub Issues**: [Report bugs](https://github.com/yourrepo/pap/issues)
- **Email**: hello@predictionaccountability.org
- **Discord**: [Join our community](https://discord.gg/pap)
- **Twitter**: [@PAPofficial](https://twitter.com)

### Getting Help

- **Stuck on setup?** Open an issue with details
- **Unsure how to start?** Comment on good-first-issue
- **Technical questions?** Ask in GitHub Discussions
- **Want to pair program?** Reach out via email

---

## 🌟 Recognition

We appreciate all contributions! Contributors will be:

- 🏆 Listed in [CONTRIBUTORS.md](./CONTRIBUTORS.md)
- 📝 Mentioned in release notes
- 🔗 Linked from your GitHub profile
- ⭐ Featured in project highlights

---

## 📚 Additional Resources

- [README.md](./README.md) — Project overview
- [ABOUT.md](./ABOUT.md) — Vision and impact
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) — Technical design (when created)
- [API_DOCS.md](./docs/API_DOCS.md) — API reference (when created)
- [Tailwind CSS Docs](https://tailwindcss.com/docs/)
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🙏 Thank You!

Your contributions make PAP better. Whether it's code, ideas, or support—thank you for helping us build a more accountable world!

<div align="center">

**Let's hold predictions accountable together! 🚀**

</div>
