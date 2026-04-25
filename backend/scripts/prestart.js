const { execSync } = require('child_process');
const port = process.env.PORT || 3001;
try {
  const out = execSync('netstat -ano', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
  const line = out.split('\n').find(l => l.includes(`:${port}`) && l.includes('LISTENING'));
  if (line) {
    const pid = line.trim().split(/\s+/).pop();
    if (pid && /^\d+$/.test(pid)) {
      execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
      console.log(`[prestart] Processus ${pid} arrêté sur le port ${port}`);
    }
  }
} catch (_) { /* port libre ou OS non-Windows */ }
