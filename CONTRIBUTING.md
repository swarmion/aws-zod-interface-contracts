# aws-zod-interface-contracts Contributing Guide

Hi! We are really excited that you are interested in contributing to aws-zod-interface-contracts. Before submitting your contribution, please make sure to take a moment and read through the following guide:

## Repo Setup

The aws-zod-interface-contracts repo is a monorepo using pnpm workspaces. The package manager used to install and link dependencies must be [pnpm](https://pnpm.io/).

We recommend installing [ni](https://github.com/antfu/ni) to help switching between repos using different package managers. `ni` also provides the handy `nr` command which running npm scripts easier:

- `ni` is equivalent to `pnpm install`
- `nr test` is equivalent to `pnpm run test`

To develop and test `aws-zod-interface-contracts` package:

1. Run `pnpm install` in `aws-zod-interface-contracts`'s root folder

2. Run `pnpm run package` to build sources

3. Run `pnpm run test` to all the tests and lint checks

## Debugging

### VS Code

If you want to use break point and explore code execution you can use the ["Run and debug"](https://code.visualstudio.com/docs/editor/debugging) feature from vscode.

1. Add a `debugger` statement where you want to stop the code execution.

2. Click on the "Run and Debug" icon in the activity bar of the editor.

3. Click on the "Javascript Debug Terminal" button.

4. It will open a terminal, then type the test command: `pnpm run test`

5. The execution will stop and you'll use the [Debug toolbar](https://code.visualstudio.com/docs/editor/debugging#_debug-actions) to continue, step over, restart the process...

## Testing aws-zod-interface-contracts against external packages

You may wish to test your locally-modified copy of aws-zod-interface-contracts packages against another package that is using it. For pnpm, after building aws-zod-interface-contracts, you can use [`pnpm.overrides`](https://pnpm.io/package_json#pnpmoverrides). Please note that `pnpm.overrides` must be specified in the root `package.json` and you must first list the package as a dependency in the root `package.json`:

```json
{
  "dependencies": {
    "aws-zod-interface-contracts": "*"
  },
  "pnpm": {
    "overrides": {
      "aws-zod-interface-contracts": "link:../path/to/aws-zod-interface-contracts/packages/aws-zod-interface-contracts"
    }
  }
}
```

And re-run `pnpm install` to link the package.

## Pull Request Guidelines

- Checkout a topic branch from a base branch, e.g. `main`, and merge back against that branch.

- If adding a new feature:

  - Add accompanying test case.
  - Provide a convincing reason to add this feature. Ideally, you should open a suggestion issue first and have it approved before working on it.

- If fixing bug:

  - If you are resolving a special issue, add `(fix #xxxx[,#xxxx])` (#xxxx is the issue id) in your PR title for a better release log, e.g. `fix: update entities encoding/decoding (fix #3899)`.
  - Provide a detailed description of the bug in the PR. Live demo preferred.
  - Add appropriate test coverage if applicable.

- It's OK to have multiple small commits as you work on the PR - GitHub can automatically squash them before merging.

- Make sure tests pass!

- Commit messages must follow the [commit message convention](./.github/commit-convention.md) so that changelogs can be automatically generated.
