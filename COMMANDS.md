# 🚀 Quick Start Commands

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Testing TypeScript

```bash
# Check for type errors
npx tsc --noEmit
```

## Common Tasks

### After making code changes
```bash
# Just save the file - Vite will hot reload automatically
```

### After pulling new changes (if using git)
```bash
npm install
npm run dev
```

### If something breaks
```bash
# Stop the server (Ctrl+C)
# Delete node_modules and reinstall
rm -rf node_modules
npm install
npm run dev
```

### Clear cache and restart
```bash
# Stop server (Ctrl+C)
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## Environment Setup

### Create .env file (do this once)
```bash
# Copy example
cp .env.example .env

# Then edit .env and add your Supabase credentials
```

### Update .env changes
```bash
# Stop server (Ctrl+C)
# Restart to pick up new env vars
npm run dev
```

## Git (Optional)

```bash
# Initialize repository
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: Hyrox Training Tracker MVP"

# Add remote (e.g., GitHub)
git remote add origin https://github.com/yourusername/hyrox-tracker.git

# Push
git push -u origin main
```

## Deployment (Future)

When ready to deploy, you can use:

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Supabase Hosting
- Follow Supabase documentation for hosting static sites

Remember to set environment variables in your hosting platform!

---

## 📝 Daily Workflow

1. Open VS Code
2. Open terminal
3. Run `npm run dev`
4. Open browser to `http://localhost:5173`
5. Make changes, save files
6. View changes instantly in browser
7. When done, press Ctrl+C in terminal

## 🆘 Problems?

### Port already in use
```bash
# Kill the process on port 5173
lsof -ti:5173 | xargs kill -9
npm run dev
```

### TypeScript errors
```bash
# Verify all types are correct
npx tsc --noEmit
```

### Supabase connection issues
- Check `.env` file exists
- Verify credentials are correct
- Check Supabase dashboard is accessible
- Restart dev server

---

**Happy Coding! 💻**
