#!/bin/bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REGISTRY="look1976/neoteacher"
VERSION="${1:-$(date +%Y%m%d-%H%M%S)}"

if [ "$VERSION" = "latest" ]; then
  echo "⚠️  Version 'latest' is allowed, but timestamp tags are recommended."
fi

build_and_push() {
  local service="$1"
  local context="$2"
  local dockerfile="$3"
  local image="$REGISTRY:${service}-$VERSION"
  local alias_image="$REGISTRY:${service}-latest"

  echo "📦 Building: $image"
  # Use repo root as build context because Dockerfiles copy paths from repository root
  docker build -f "$PROJECT_DIR/$dockerfile" -t "$image" -t "$alias_image" "$PROJECT_DIR"

  echo "⬆️  Pushing: $image"
  docker push "$image"
  echo "⬆️  Pushing: $alias_image"
  docker push "$alias_image"
  echo "✅ Completed: $image and $alias_image"
  echo ""
}

if [ ! -f "$HOME/.docker/config.json" ]; then
  echo "⚠️  ~/.docker/config.json not found. Please run: docker login"
  echo ""
fi

echo "🔖 Using version tag: $VERSION"

echo "Building and pushing NeoTeacher backend and frontend images..."

build_and_push "backend" "backend" "backend/Dockerfile"
build_and_push "frontend" "frontend" "frontend/Dockerfile"

echo "🎉 All images pushed with version tags and latest aliases."

echo "Use tags like:"
 echo "  docker pull look1976/neoteacher:backend-$VERSION"
 echo "  docker pull look1976/neoteacher:frontend-$VERSION"
