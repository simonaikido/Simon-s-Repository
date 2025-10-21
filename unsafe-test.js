+// 1) Hardcoded secret (Gitleaks / Secrets scan)
+const STRIPE_SECRET = "sk_test_FAKEKEY_abcdefghijklmnopqrstuvwx123456"; // ❌ secret in repo
+
+// 2) Dangerous eval (SAST: eval -> RCE)
+function runUserCode(code) {
+  // intentionally evaluate untrusted input
+  eval(code); // ❌ eval usage
+}
+
+// 3) Disabled TLS verification (SAST / insecure config)
+process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // ❌ disables TLS verification
+
+// 4) Weak randomness (crypto misuse)
+function sessionToken() {
+  // predictable token
+  return Math.random().toString(36).slice(2) + Date.now().toString(36); // ❌ non-crypto RNG
+}
+
+// 5) Unsafe network call using user input (open redirect / SSRF pattern)
+const http = require('http');
+function fetchFrom(query) {
+  // deliberately fetch whatever URL is provided — no validation
+  try {
+    http.get(query, res => {
+      // do nothing
+    }).on('error', () => {});
+  } catch (e) {}
+}
+
+// 6) Expose environment var (sensitive data exfiltration pattern)
+function dumpEnv() {
+  // read entire env and print (scanners flag exposure)
+  console.log(JSON.stringify(process.env));
+}
+
+// quick usage to make this f
