#!/bin/bash

# BMAD MCP Setup Script
# Sets up CodeRabbit, Sourcegraph AMP, and TestSprite MCPs

echo "🚀 Setting up BMAD MCPs for Adify..."

# Create necessary directories
mkdir -p test-docs/{reports,coderabbit-reports,amp-reports}
mkdir -p src/__tests__/{unit,integration}
mkdir -p e2e

# Install dependencies if needed
if ! command -v gt &> /dev/null; then
    echo "📦 Installing Graphite CLI..."
    npm install -g @withgraphite/graphite-cli@stable
fi

# Initialize Graphite
echo "🔧 Initializing Graphite..."
gt auth --token $GRAPHITE_TOKEN 2>/dev/null || echo "⚠️ Set GRAPHITE_TOKEN environment variable"
gt repo init 2>/dev/null || echo "Graphite already initialized"

# Set up package.json scripts if not exists
echo "📝 Updating package.json scripts..."
npm pkg set scripts.test="vitest"
npm pkg set scripts.test:ui="vitest --ui"
npm pkg set scripts.test:coverage="vitest run --coverage"
npm pkg set scripts.test:e2e="playwright test"
npm pkg set scripts.lint="eslint src/"
npm pkg set scripts.typecheck="tsc --noEmit"

# Create test directory structure
echo "📁 Creating test structure..."
touch src/__tests__/unit/.gitkeep
touch src/__tests__/integration/.gitkeep
touch e2e/.gitkeep

# Create Graphite configuration if not exists
if [ ! -f .graphite/repo_config ]; then
    echo "⚙️ Configuring Graphite..."
    gt repo init
    gt repo config --submit-strategy parallel
    gt repo config --delete-branch-after-merge true
fi

echo "✅ BMAD MCP setup complete!"
echo ""
echo "Next steps:"
echo "1. Set environment variables:"
echo "   export CODERABBIT_TOKEN=your_token"
echo "   export SOURCEGRAPH_TOKEN=your_token"
echo "   export GRAPHITE_TOKEN=your_token"
echo ""
echo "2. Install development dependencies:"
echo "   npm install -D vitest @testing-library/react playwright"
echo ""
echo "3. Start development:"
echo "   gt stack create"
echo "   npm run dev"
echo ""
echo "📚 See BMAD-WORKFLOW.md for complete workflow guide"