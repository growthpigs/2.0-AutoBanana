# Branch Protection Strategy for AutoBanana

## Current Stable Branch
- **Branch Name**: `stable-autobanana-v1`
- **Purpose**: Contains the working AutoBanana version with yellow theme
- **Status**: Protected and pushed to GitHub

## Best Practices to Avoid Version Confusion

### 1. Branch Naming Convention
```
stable-[feature]-v[number]    # For stable releases
feature/[description]          # For new features
fix/[issue]                   # For bug fixes
experiment/[description]      # For experimental changes
```

### 2. Never Work Directly on Main
- Always create a feature branch first
- Test thoroughly before merging
- Use pull requests for visibility

### 3. Regular Stable Snapshots
```bash
# When you have a working version you're happy with:
git checkout -b stable-[name]-v[number]
git add -A
git commit -m "stable: Description of working state"
git push origin stable-[name]-v[number]
```

### 4. Quick Recovery Commands
```bash
# List all branches with latest commit dates
git for-each-ref --sort=-committerdate refs/heads/ --format='%(committerdate:short) %(refname:short)'

# Switch to a stable branch
git checkout stable-autobanana-v1

# View differences between branches
git diff main..stable-autobanana-v1

# Cherry-pick specific commits if needed
git cherry-pick [commit-hash]
```

### 5. Deployment Strategy
```bash
# Deploy from stable branches only
vercel --prod --from stable-autobanana-v1

# Use preview deployments for testing
vercel --preview --from feature/new-feature
```

### 6. Emergency Recovery
If you accidentally overwrite your work:
1. Check git reflog: `git reflog`
2. Find the commit before the mistake
3. Create recovery branch: `git checkout -b recovery [commit-hash]`
4. Check stashes: `git stash list`
5. Check other branches: `git branch -a`

### 7. GitHub Protection Rules (Recommended)
Go to GitHub → Settings → Branches and add:
- Require pull request reviews before merging
- Dismiss stale pull request approvals
- Require status checks to pass
- Include administrators in restrictions
- Restrict who can push to matching branches

### 8. Pre-Push Checklist
- [ ] App runs locally without errors
- [ ] All features work as expected  
- [ ] No hardcoded API keys or secrets
- [ ] Branch name follows convention
- [ ] Commit message is descriptive
- [ ] Created stable snapshot if major milestone

## Current Working Branches
- `stable-autobanana-v1` - ✅ Latest stable AutoBanana (yellow theme)
- `main` - ⚠️ Currently has old Adify version (needs update)
- `responsive-ui-complete` - Previous AutoBanana version
- `feature/auto-analysis` - Experimental features

## Vercel Deployment
The app is configured to auto-deploy from the main branch. To deploy the stable version:
1. Either merge stable-autobanana-v1 to main
2. Or configure Vercel to deploy from stable-autobanana-v1
3. Or use manual deployment: `vercel --prod`