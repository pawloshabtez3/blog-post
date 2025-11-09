# Setting Up CI/CD with GitHub Actions

This guide explains how to set up continuous integration and deployment using GitHub Actions and Vercel.

## Overview

The CI/CD pipeline automatically:
- Runs linting and type checking on every push and PR
- Builds the application to verify it compiles
- Deploys preview environments for pull requests
- Deploys to production when code is merged to main

## Prerequisites

- GitHub repository with your Inkflow code
- Vercel account connected to your repository
- Vercel project already created

## Setup Steps

### 1. Get Vercel Credentials

You need three pieces of information from Vercel:

#### Get Vercel Token

1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Give it a name (e.g., "GitHub Actions")
4. Set scope to "Full Account"
5. Click "Create"
6. Copy the token (you won't see it again!)

#### Get Vercel Organization ID

1. Go to [Vercel Settings](https://vercel.com/account)
2. Copy your "Organization ID" (or "Team ID" if using a team)

#### Get Vercel Project ID

1. Go to your project in Vercel
2. Go to Settings
3. Copy the "Project ID"

### 2. Add GitHub Secrets

1. Go to your GitHub repository
2. Click "Settings" > "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Add the following secrets:

| Secret Name | Value | Description |
|------------|-------|-------------|
| `VERCEL_TOKEN` | Your Vercel token | From step 1 |
| `VERCEL_ORG_ID` | Your organization ID | From step 1 |
| `VERCEL_PROJECT_ID` | Your project ID | From step 1 |

### 3. Enable GitHub Actions

1. Go to your repository's "Actions" tab
2. If prompted, click "I understand my workflows, go ahead and enable them"
3. The workflow should now run automatically on push and PR

## Workflow Behavior

### On Pull Request

When you create or update a pull request:

1. **Lint Job**: Runs ESLint and TypeScript type checking
2. **Build Job**: Builds the application to verify it compiles
3. **Deploy Preview Job**: Deploys a preview environment to Vercel

The preview URL will be posted as a comment on the PR.

### On Push to Main

When code is merged to the main branch:

1. **Lint Job**: Runs ESLint and TypeScript type checking
2. **Build Job**: Builds the application
3. **Deploy Production Job**: Deploys to production on Vercel

## Customization

### Change Branch Name

If your main branch is named differently (e.g., `master`), update `.github/workflows/deploy.yml`:

```yaml
on:
  push:
    branches:
      - master  # Change this
  pull_request:
    branches:
      - master  # Change this
```

### Add Tests

If you add tests to your project, add a test job:

```yaml
test:
  name: Run Tests
  runs-on: ubuntu-latest
  needs: lint
  
  steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
```

Then update the `build` job to depend on `test`:

```yaml
build:
  name: Build Application
  runs-on: ubuntu-latest
  needs: [lint, test]  # Add test here
```

### Skip CI for Specific Commits

Add `[skip ci]` to your commit message to skip the workflow:

```bash
git commit -m "Update README [skip ci]"
```

## Troubleshooting

### Workflow Fails on Build

**Problem**: Build fails with "Environment variable not found"

**Solution**: The workflow uses dummy environment variables for build testing. If your build requires real values, you'll need to add them as GitHub secrets and reference them in the workflow.

### Vercel Deployment Fails

**Problem**: Deploy job fails with authentication error

**Solutions**:
- Verify `VERCEL_TOKEN` is correct and not expired
- Verify `VERCEL_ORG_ID` matches your organization
- Verify `VERCEL_PROJECT_ID` matches your project
- Check that the Vercel token has sufficient permissions

### Preview Deployment Not Showing

**Problem**: PR doesn't get a preview deployment

**Solutions**:
- Check the Actions tab for error messages
- Verify the workflow ran successfully
- Check Vercel dashboard for deployment status
- Ensure Vercel integration is connected to your repository

## Monitoring

### View Workflow Runs

1. Go to your repository's "Actions" tab
2. Click on a workflow run to see details
3. Click on individual jobs to see logs

### View Deployment Status

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. View deployment history and logs

## Disabling CI/CD

If you want to disable automatic deployments:

### Option 1: Disable Workflow

1. Go to repository "Actions" tab
2. Click on "Deploy to Vercel" workflow
3. Click the "..." menu
4. Select "Disable workflow"

### Option 2: Remove Workflow File

Delete `.github/workflows/deploy.yml` from your repository.

### Option 3: Use Vercel Git Integration Only

Remove the deploy jobs from the workflow but keep lint and build:

```yaml
# Remove these jobs:
# - deploy-preview
# - deploy-production
```

Vercel will still deploy automatically via its Git integration.

## Best Practices

1. **Protect Main Branch**: Require PR reviews and status checks before merging
2. **Use Preview Deployments**: Test changes in preview before merging
3. **Monitor Workflow Runs**: Check for failures and fix promptly
4. **Keep Secrets Secure**: Never commit secrets to the repository
5. **Update Dependencies**: Keep GitHub Actions and dependencies up to date

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Vercel GitHub Integration](https://vercel.com/docs/git/vercel-for-github)

## Support

If you encounter issues:

1. Check workflow logs in GitHub Actions tab
2. Check deployment logs in Vercel dashboard
3. Review this guide for common solutions
4. Open an issue in the repository
