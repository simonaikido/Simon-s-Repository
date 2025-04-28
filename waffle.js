// 1. Directly setting innerHTML without sanitizing - XSS risk
const output = document.getElementById('waffleOutput');
output.innerHTML = "<img src=x onerror=alert('XSS!')>";

// 2. Using eval() - very dangerous!
const userInput = "2 + 2";
const result = eval(userInput); // eval can run BAD code

// 3. Insecure random function - predictability
function getRandom() {
  return Math.random(); // not cryptographically secure
}

// 4. Missing event listener sanitization
document.getElementById('makeWaffle').addEventListener('click', function() {
  const waffleName = "<script>alert('Bad Waffle!')</script>";
  document.getElementById('waffleOutput').innerHTML = waffleName;
});

// 5. Global variable leak - pollution
