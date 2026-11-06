# HOANGGIA AI — Architecture Agents V1

Two planning-only Claude Code agents:
- `code-architect`: design new features in the existing codebase.
- `architecture-modernizer`: audit and plan incremental modernization.

## Usage
Open this repository with Claude Code, then request the appropriate agent by name:
- "Use code-architect to design [feature]; provide paths, ADR, data flow, test plan."
- "Use architecture-modernizer to audit [module]; provide evidence, phased migration and rollback."

## Safety and release gate
1. Agents inspect repository evidence; no write or shell tools.
2. Architecture proposals require human review.
3. Implementation occurs on a separate feature branch.
4. Run applicable lint, build, unit/integration and regression tests.
5. Preview and approve before merging or deploying.
6. Record actual test results; never report unexecuted tests as passing.

## Scope
These are Claude Code agent definitions, not active background services, a web dashboard, or a deployed AI runtime. Claude Code and an appropriate model subscription/runtime are required to invoke them.
