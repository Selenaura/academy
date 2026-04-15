#!/usr/bin/env bash
# Build a signed Android App Bundle (.aab) of Selene Academia for Play Store.
#
# Requirements (one-time):
#   - Android Studio + SDK installed, ANDROID_HOME exported
#   - JDK 17
#   - Keystore created with:
#       keytool -genkey -v -keystore selene-release.keystore \
#         -alias selene -keyalg RSA -keysize 2048 -validity 10000
#   - Environment variables set (e.g. in ~/.bashrc or Windows env vars):
#       SELENE_ACADEMIA_KEYSTORE_PATH   absolute path to .keystore file
#       SELENE_ACADEMIA_KEYSTORE_PASS   store password
#       SELENE_ACADEMIA_KEY_ALIAS       key alias (usually "selene")
#       SELENE_ACADEMIA_KEY_PASS        key password
#
# Usage:
#   ./scripts/build-android.sh
#   → outputs android/app/build/outputs/bundle/release/app-release.aab

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "▶ Syncing Capacitor (native ← web config)"
npx cap sync android

echo "▶ Writing signing config to local.properties (not committed)"
cat > android/local.properties <<EOF
RELEASE_STORE_FILE=${SELENE_ACADEMIA_KEYSTORE_PATH:?missing SELENE_ACADEMIA_KEYSTORE_PATH}
RELEASE_STORE_PASSWORD=${SELENE_ACADEMIA_KEYSTORE_PASS:?missing SELENE_ACADEMIA_KEYSTORE_PASS}
RELEASE_KEY_ALIAS=${SELENE_ACADEMIA_KEY_ALIAS:?missing SELENE_ACADEMIA_KEY_ALIAS}
RELEASE_KEY_PASSWORD=${SELENE_ACADEMIA_KEY_PASS:?missing SELENE_ACADEMIA_KEY_PASS}
EOF

echo "▶ Building release bundle (gradle)"
(cd android && ./gradlew bundleRelease)

AAB="android/app/build/outputs/bundle/release/app-release.aab"
if [ -f "$AAB" ]; then
  echo "✓ Build OK: $AAB"
  ls -lh "$AAB"
else
  echo "✗ AAB not found at $AAB"
  exit 1
fi

echo ""
echo "Next:"
echo "  1. Upload $AAB to Play Console → Internal testing"
echo "  2. After first upload, copy SHA-256 from Play Console and paste into"
echo "     public/.well-known/assetlinks.json (required for digital asset links)"
echo "  3. Redeploy web so assetlinks.json is served at https://academy.selenaura.com/.well-known/"
