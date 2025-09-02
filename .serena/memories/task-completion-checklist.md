# Task Completion Checklist

## Before Committing Code
- [ ] **Linting**: Run `npm run lint` - fix all ESLint errors
- [ ] **Type Checking**: Run `npm run type-check` - fix all TypeScript errors
- [ ] **Testing**: Run `npm test` - ensure all tests pass
- [ ] **Build**: Run `npm run build` - ensure build succeeds
- [ ] **Performance**: Check Lighthouse scores (90+ performance, 95+ accessibility)

## Code Quality Checks
- [ ] **TypeScript**: All components properly typed
- [ ] **Imports**: Use @/ aliases for internal imports
- [ ] **Naming**: Follow PascalCase for components, camelCase for variables
- [ ] **Responsive**: Test on mobile, tablet, and desktop
- [ ] **Accessibility**: Proper ARIA labels and semantic HTML
- [ ] **Performance**: Optimize images and lazy load components

## Internationalization
- [ ] **Translations**: Add new strings to both en.json and vi.json
- [ ] **Language Switching**: Test language switcher functionality
- [ ] **Fallbacks**: Ensure fallback to English works

## Portfolio Updates
- [ ] **Data Validation**: Run `npm run portfolio:check`
- [ ] **Extraction**: Run `npm run portfolio:extract` if needed
- [ ] **Mobile Optimization**: Run `npm run mobile:validate`

## Deployment Preparation
- [ ] **Build Output**: Verify `out/` directory structure
- [ ] **Static Assets**: Ensure all assets are copied correctly
- [ ] **Legacy Versions**: Verify v1.0 and v2.0 are accessible
- [ ] **Games**: Test Unity WebGL games load properly

## Git Workflow
- [ ] **Conventional Commits**: Use proper commit message format
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation
  - `style:` for formatting
  - `refactor:` for code refactoring
  - `test:` for tests
  - `chore:` for maintenance
- [ ] **Branch**: Create feature branch if needed
- [ ] **Commit**: Stage and commit changes
- [ ] **Push**: Push to origin/main

## Final Verification
- [ ] **Local Testing**: Test on `http://localhost:3000`
- [ ] **Production Build**: Test production build locally
- [ ] **Deployment**: Run `./deploy.sh` for GitHub Pages
- [ ] **Live Site**: Verify changes on live site
- [ ] **Performance**: Run Lighthouse audit on live site