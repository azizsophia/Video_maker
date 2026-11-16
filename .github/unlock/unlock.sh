#!/usr/bin/env bash
# The app source in payload.enc is encrypted. This machine makes a one-time
# key pair, publishes only the public half on its own branch, and waits for
# the owner to send the passphrase encrypted to it. The private half never
# leaves this machine, so nobody reading this public repo can open the file.
set -euo pipefail
name=$1
OPENSSL=openssl
[ -x /opt/homebrew/opt/openssl@3/bin/openssl ] && OPENSSL=/opt/homebrew/opt/openssl@3/bin/openssl
[ -x /usr/local/opt/openssl@3/bin/openssl ] && OPENSSL=/usr/local/opt/openssl@3/bin/openssl
work="$RUNNER_TEMP/unlock"; mkdir -p "$work"; chmod 700 "$work"
$OPENSSL genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:3072 -out "$work/k.pem" 2>/dev/null
$OPENSSL pkey -in "$work/k.pem" -pubout -out "$work/pub.pem"
branch="keys-$name-$GITHUB_RUN_ID"
git init -q "$work/repo"; cd "$work/repo"
git checkout -q -b "$branch"
cp "$work/pub.pem" pub.pem
git add pub.pem; git -c user.name=ci -c user.email=ci@example.invalid commit -qm "public key for $name"
git push -q "https://x-access-token:${GH_TOKEN}@github.com/${GITHUB_REPOSITORY}" "HEAD:refs/heads/$branch"
echo "Waiting for the passphrase on $branch"
for i in $(seq 1 180); do
  sleep 10
  if git fetch -q "https://github.com/${GITHUB_REPOSITORY}" "$branch" 2>/dev/null && git cat-file -e FETCH_HEAD:key.enc 2>/dev/null; then
    git show FETCH_HEAD:key.enc | base64 -d > "$work/key.enc"; break
  fi
done
[ -s "$work/key.enc" ] || { echo "::error::No passphrase arrived"; exit 1; }
$OPENSSL pkeyutl -decrypt -inkey "$work/k.pem" -pkeyopt rsa_padding_mode:oaep -pkeyopt rsa_oaep_md:sha256 -in "$work/key.enc" -out "$work/pass"
mkdir -p "$GITHUB_WORKSPACE/src"
$OPENSSL enc -d -aes-256-cbc -pbkdf2 -iter 200000 -pass "file:$work/pass" -in "$GITHUB_WORKSPACE/payload.enc" | tar -xz -C "$GITHUB_WORKSPACE/src"
rm -rf "$work"
echo "Unlocked"
