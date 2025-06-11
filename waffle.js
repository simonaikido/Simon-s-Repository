// 1. XSS via innerHTML with untrusted input
const output = document.getElementById('waffleOutput');
const query = window.location.search; // unsanitized user input
output.innerHTML = "<div>" + query + "</div>"; // ❌ XSS risk

// 2. Use of eval() with dynamic string
const userInput = location.hash.substring(1); // unsanitized
const result = eval("alert('" + userInput + "')"); // ❌ Arbitrary code exec

// 3. Insecure random - should use crypto
function getInsecureToken() {
  return Math.random().toString(36).substring(2); // ❌ Weak randomness
}

// 4. Insecure DOM event injection
document.getElementById('makeWaffle').addEventListener('click', function () {
  const waffleName = document.getElementById('waffleNameInput').value;
  document.getElementById('waffleOutput').innerHTML = `<h1>${waffleName}</h1>`; // ❌ XSS if input is not escaped
});

// 5. Global variable leak
dangerousStuff = "🚨 globally scoped"; // ❌ pollutes global scope

// 6. Securely load API key from environment variable
const apiKey = process.env.STRIPE_API_KEY; // ✅ Loaded securely

// 7. Insecure HTTP usage
fetch("http://insecure-waffle-api.com/submit", {
  method: "POST",
  body: JSON.stringify({ waffle: "Belgian" }),
}); // ❌ Plain HTTP is insecure

// 8. Disabled TLS certificate validation (for Node.js usage)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // ❌ Disables TLS validation

// 9. Overly permissive CORS header
const express = require('express');
const app = express();
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // ❌ Wildcard CORS
  next();
});

// 10. SQL injection-prone example (assuming backend context)
const userId = req.query.id;
db.query("SELECT * FROM users WHERE id = " + userId); // ❌ Unsanitized SQL input
