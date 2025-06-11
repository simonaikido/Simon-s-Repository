// 1. XSS via innerHTML with untrusted input
const output = document.getElementById('waffleOutput');
const query = window.location.search; // unsanitized user input
output.innerHTML = "<div>" + query + "</div>"; // ❌ XSS risk

// 2. Dangerous use of eval
const userInput = "alert('pwnd')";
eval(userInput); // ❌ eval = RCE risk

// 3. Insecure random generation
function getSessionToken() {
  return Math.random().toString(36); // ❌ not cryptographically secure
}

// 4. Hardcoded secret token
const stripeSecret = "sk_live_1234567890abcdef"; // ❌ detected by Gitleaks

// 5. Global variable pollution
isAdmin = true; // ❌ no var/let/const, leaks globally

// 6. Direct DOM manipulation with untrusted data
document.getElementById("waffleName").innerHTML = "<img src=x onerror=alert('bad waffle')>"; // ❌ XSS again

// 7. No input validation for user-controlled URL
const url = new URL(window.location.href);
fetch(url.searchParams.get("redirectTo")); // ❌ open redirect potential

// 8. Disabled SSL verification (simulated)
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"; // ❌ terrible idea

// AWS secret simulation
const awsSecret = "AKIAIOSFODNN7EXAMPLE"; // should trigger again

