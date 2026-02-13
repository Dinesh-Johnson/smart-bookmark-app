#!/bin/bash

# Smart Bookmark App - Pre-Launch Verification Script
# Run this to verify your setup is correct

echo "=== Smart Bookmark App - Verification ==="
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "✗ Node.js not found. Please install Node.js from https://nodejs.org"
    exit 1
fi
echo "  Node.js version: $(node --version)"
echo ""

# Check npm
echo "✓ Checking npm..."
if ! command -v npm &> /dev/null; then
    echo "✗ npm not found. Please install npm"
    exit 1
fi
echo "  npm version: $(npm --version)"
echo ""

# Check if node_modules exists
echo "✓ Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "✗ node_modules not found. Running 'npm install'..."
    npm install
fi
echo "  Dependencies installed ✓"
echo ""

# Check .env.local
echo "✓ Checking environment variables..."
if [ ! -f ".env.local" ]; then
    echo "✗ .env.local not found!"
    echo "  Please create .env.local with:"
    echo "  NEXT_PUBLIC_SUPABASE_URL=your_url"
    echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key"
    exit 1
fi

# Check if env vars are set
if grep -q "your_supabase_url_here" .env.local; then
    echo "✗ Please update NEXT_PUBLIC_SUPABASE_URL in .env.local"
    exit 1
fi

if grep -q "your_supabase_anon_key_here" .env.local; then
    echo "✗ Please update NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    exit 1
fi

echo "  Environment variables found ✓"
echo ""

# Check if src directory exists
echo "✓ Checking project structure..."
if [ ! -d "src" ]; then
    echo "✗ src directory not found!"
    exit 1
fi
echo "  Project structure looks good ✓"
echo ""

# Verify key files exist
echo "✓ Verifying key files..."
required_files=(
    "src/lib/supabase.ts"
    "src/lib/auth.ts"
    "src/lib/bookmarks.ts"
    "src/app/page.tsx"
    "src/app/login/page.tsx"
    "src/components/AddBookmarkForm.tsx"
    "package.json"
    "tailwind.config.js"
)

all_good=true
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "✗ Missing file: $file"
        all_good=false
    fi
done

if [ "$all_good" = true ]; then
    echo "  All required files found ✓"
else
    exit 1
fi
echo ""

# Try to build
echo "✓ Building project..."
if npm run build > /dev/null 2>&1; then
    echo "  Build successful ✓"
else
    echo "✗ Build failed. Run 'npm run build' for details"
    exit 1
fi
echo ""

echo "=== ✅ All checks passed! ==="
echo ""
echo "Next steps:"
echo "1. Make sure you've set up Supabase (see GETTING_STARTED.md)"
echo "2. Run: npm run dev"
echo "3. Visit: http://localhost:3000"
echo "4. Sign in with Google and test!"
echo ""
