---
name: css_vars_action_exports
description: CSS variable declaration typos and missing Redux action exports cause UI regression.
type: feedback
---

Rule: Validate CSS custom property declarations in `globals.css` and treat any missing `:root` (e.g. `::root`) as a critical styling regression.
**Why:** `var(--color-*)` usages without fallbacks fail when the variables are never defined, leading to inconsistent Antd button/sider styling.
**How to apply:** After any `globals.css` edits, verify the variable declarations use `:root` and that every `var(--X)` without fallback has a corresponding definition.

Rule: Treat Next.js build warnings like “Attempted import error: 'SOME_CONST' is not exported” as functional regressions (not just lint noise).
**Why:** Components dispatching missing/undefined Redux action types can break navigation (e.g., Login/Signup view switching) on mobile/desktop.
**How to apply:** After running `next build`, fail QA for any “Attempted import error” warnings; fix by exporting/handling the action constant or updating the component to dispatch the correct existing action.

