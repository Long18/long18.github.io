# Suggested Commands for Development

## Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Type checking
npm run type-check

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Portfolio Management
```bash
# Extract portfolio data from legacy versions
npm run extract-portfolio

# Validate portfolio data
npm run validate-portfolio

# Check portfolio data
npm run portfolio:check

# Extract and validate portfolio data
npm run portfolio:extract
```

## Mobile Optimization
```bash
# Validate mobile enhancements
npm run mobile:validate

# Optimize images
npm run mobile:optimize

# Prepare for deployment
npm run deploy:prepare

# Build for deployment
npm run deploy:build
```

## Performance & Quality
```bash
# Run Lighthouse CI
npm run lighthouse

# Create new release
npm run release
```

## System Commands (macOS/Darwin)
```bash
# File operations
ls -la                    # List files with details
find . -name "*.tsx"      # Find TypeScript React files
grep -r "import" src/     # Search for imports in src
cd src/components         # Navigate to components

# Git operations
git status                # Check git status
git add .                 # Stage all changes
git commit -m "feat: add feature"  # Commit with conventional format
git push origin main      # Push to main branch

# Process management
ps aux | grep node        # Find Node.js processes
kill -9 <PID>            # Kill process by ID
```

## Deployment Commands
```bash
# Deploy to GitHub Pages
./deploy.sh

# Manual deployment steps
npm run deploy:build
git add .
git commit -m "Deploy portfolio"
git push origin main
```