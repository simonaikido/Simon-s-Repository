// 1. Hardcoded secret token (should trigger Gitleaks)
const githubToken = "ghp_FAKE1234567890tokengoeshere"; // ❌ hardcoded token

// 2. XSS vulnerability via innerHTML
const params = new URLSearchParams(window.location.search);
const name = params.get("name");
document.getElementById("profile").innerHTML = "<h1>" + name + "</h1>"; // ❌ XSS

// 3. Use of eval (Remote Code Execution risk)
const input = "console.log('bad idea')";
eval(input); // ❌ NEVER use eval with user input

// 4. Insecure random
function generateCode() {
  return Math.random().toString(36).substring(2, 10); // ❌ not secure
}

// 5. Open redirect
const redirect = params.get("next");
window.location.href = redirect; // ❌ open redirect

// 6. Global variable leakage
isAdmin = true; // ❌ no var/let/const

// 7. Disabled TLS validation (server-side risk)
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"; // ❌ insecure

// 8. Dangerous dynamic function
const code = "return 7 * 7";
const fn = new Function(code);
console.log(fn()); // ❌ just as bad as eval

// 9. No CSRF protection (simulated)
fetch("/api/delete-account", { method: "POST" }); // ❌ no auth/token
