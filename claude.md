# Claude Development Guidelines

## Core Philosophy

Write code that is **correct first, clear second, fast third**. Optimise only with evidence. Prefer explicitness over cleverness. Code is read far more often than it is written.

---

## General Principles (All Languages)

- **No magic numbers** — name every constant meaningfully
- **Fail fast and loudly** — surface errors at the boundary; never swallow them silently
- **Small, focused units** — functions/components do one thing and do it well
- **Name things precisely** — `fetchUserById` not `getData`; `isLoading` not `flag`
- **Delete dead code** — don't comment it out; version control remembers
- **Comments explain *why*, not *what*** — the code shows what; the comment explains intent, trade-offs, or gotchas
- **No premature abstraction** — repeat once, abstract on the third occurrence (Rule of Three)

---

## Rust

### Idioms & Style

- Follow the [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/) for any library-facing code
- Use `clippy` (`cargo clippy -- -D warnings`) and `rustfmt` — no exceptions; CI must enforce both
- Prefer `snake_case` for variables/functions, `PascalCase` for types/traits, `SCREAMING_SNAKE_CASE` for constants
- Leverage the type system to make illegal states unrepresentable — model domain invariants in types, not runtime checks
- Prefer `impl Trait` in argument position and `-> impl Trait` for simple returns; use `Box<dyn Trait>` only when dynamic dispatch is genuinely needed
- Reach for iterators and combinators (`map`, `filter`, `fold`) over manual loops — they compose and signal intent
- Keep `unsafe` blocks **minimal, isolated, and documented** with a `// SAFETY:` comment explaining every invariant upheld

### Error Handling

- Use `Result<T, E>` for all fallible operations — never `unwrap()` or `expect()` in library or production code
- Define domain-specific error types; use `thiserror` for library errors, `anyhow` for application-layer errors
- Propagate errors with `?`; handle them at the boundary where you have enough context to act
- Reserve `panic!` for logic bugs (invariant violations), not for user or I/O errors

```rust
// ✅ Idiomatic error propagation
fn load_config(path: &Path) -> Result<Config, ConfigError> {
    let contents = fs::read_to_string(path)?;
    let config = toml::from_str(&contents)?;
    Ok(config)
}

// ❌ Never in production paths
let config = load_config(path).unwrap();
```

### Ownership & Borrowing

- Borrow (`&T`, `&mut T`) by default; clone only when ownership is genuinely needed
- Prefer passing slices (`&[T]`, `&str`) over references to `Vec<T>` or `String` in function signatures
- Avoid interior mutability (`RefCell`, `Mutex`) unless shared mutable state is unavoidable — design it out first
- Use `Arc<Mutex<T>>` only across threads; prefer message-passing (`mpsc`, `tokio::sync`) where possible

### Async

- Use `tokio` as the async runtime unless there is a strong reason not to
- Annotate async boundaries clearly; avoid mixing sync blocking calls inside async contexts — use `spawn_blocking` for CPU-heavy work
- Prefer structured concurrency — `JoinSet`, `tokio::select!` — over fire-and-forget tasks
- Cancel-safety matters: document whether an async function is cancel-safe

### Testing

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_valid_input() { /* ... */ }

    #[test]
    fn rejects_empty_input() { /* ... */ }
}
```

- Unit tests live in a `mod tests` block inside the same file
- Integration tests live in `tests/`; they test the public API only
- Use `cargo nextest` for faster test runs in CI
- Test error paths as thoroughly as happy paths
- Use `proptest` or `quickcheck` for property-based tests on data-processing logic
- Avoid testing private implementation details — test behaviour, not internals

### Security

- Validate and sanitise **all** external input before use (files, env vars, network, CLI args)
- Prefer `std::path::Path` canonicalisation before any file access to prevent path traversal
- Never log secrets, tokens, or PII — use structured logging with redacted fields
- Audit dependencies with `cargo audit` in CI; pin `Cargo.lock` in applications
- Use `secrecy` or `zeroize` for sensitive data (passwords, keys) that must be cleared from memory

---

## Web Development (TypeScript / JavaScript)

### Idioms & Style

- **TypeScript always** — no plain `.js` files in new code; strict mode enabled (`"strict": true` in `tsconfig.json`)
- Use `ESLint` + `Prettier` — enforce in CI; no linting warnings in merged code
- Prefer `const` by default; `let` only when reassignment is necessary; never `var`
- Use named exports over default exports — easier to rename, easier to search
- Avoid `any` — use `unknown` and narrow it, or define the type properly
- Keep files small and cohesive — a file should export one primary concept

### React / UI Components

- **One component per file**; name the file identically to the component
- Components are pure when possible — derive display state from props/data, don't store what can be computed
- Lift state only as high as necessary; co-locate state with the component that owns it
- Prefer composition over prop-drilling — use context or component composition patterns
- Split UI from logic: custom hooks for data-fetching and side effects, components for rendering

```tsx
// ✅ Logic separated from rendering
function useUserProfile(id: string) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => { fetchUser(id).then(setUser); }, [id]);
  return user;
}

function UserProfile({ id }: { id: string }) {
  const user = useUserProfile(id);
  if (!user) return <Skeleton />;
  return <div>{user.name}</div>;
}
```

### Data Fetching & State

- Use a data-fetching library (`TanStack Query`, `SWR`) — do not hand-roll cache invalidation
- Colocate server state (remote data) with fetching hooks; keep client state local or in a lightweight store
- Never store derived data in state — compute it during render or with `useMemo`

### TypeScript Patterns

- Model domain state as discriminated unions — exhaustive `switch` catches missing cases at compile time
- Use `satisfies` to validate literal types without widening them
- Avoid type assertions (`as Foo`) — they silence the compiler; narrow properly instead
- Prefer `readonly` on arrays and object types to prevent accidental mutation

```ts
// ✅ Discriminated union — compiler enforces exhaustiveness
type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };
```

### Testing

- **Unit tests**: `Vitest` (or `Jest`) for pure functions and hooks (`@testing-library/react` for components)
- **Integration / E2E**: `Playwright` — test user journeys, not implementation details
- Follow **Arrange → Act → Assert** structure in every test
- Test what the user sees and does — avoid testing internal state or implementation
- Aim for high coverage of business logic; don't chase 100% coverage of boilerplate

```ts
// ✅ Tests behaviour, not internals
test("shows error message on failed login", async ({ page }) => {
  await page.goto("/login");
  await page.fill('[name="email"]', "bad@example.com");
  await page.fill('[name="password"]', "wrong");
  await page.click('[type="submit"]');
  await expect(page.getByRole("alert")).toContainText("Invalid credentials");
});
```

### Security (Web)

- **Never trust the client** — validate everything server-side regardless of client-side validation
- Sanitise all HTML inserted into the DOM — use a library (`DOMPurify`) when raw HTML is unavoidable
- Store tokens in `httpOnly` cookies, not `localStorage`
- Use `Content-Security-Policy`, `X-Frame-Options`, and `Referrer-Policy` headers
- Parameterise all database queries — never interpolate user input into SQL or query strings
- Rotate and expire secrets; never hardcode credentials — use environment variables and a secrets manager
- Run `npm audit` / `pnpm audit` in CI; treat high-severity advisories as blockers

---

## Git & Collaboration

- **Atomic commits** — one logical change per commit; the repo should build and pass tests at every commit
- Commit messages: imperative mood, concise subject line, body explaining *why* if non-obvious (`fix: validate empty input in login form`)
- Open small, focused PRs — easier to review, faster to ship
- All CI checks (lint, tests, audit) must pass before merge
- No force-pushing to shared branches

---

## CI/CD Checklist

| Check | Rust | Web |
|---|---|---|
| Format | `cargo fmt --check` | `prettier --check` |
| Lint | `cargo clippy -- -D warnings` | `eslint --max-warnings 0` |
| Tests | `cargo nextest run` | `vitest run` / `playwright test` |
| Security | `cargo audit` | `pnpm audit --audit-level high` |
| Types | — | `tsc --noEmit` |
