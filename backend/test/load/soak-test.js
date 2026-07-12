const http = require('http');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data, latency: Date.now() }));
    }).on('error', reject);
  });
}

async function runSoakTest() {
  const duration = parseInt(process.env.SOAK_DURATION || '600');
  const interval = parseInt(process.env.SOAK_INTERVAL || '100');
  const startTime = Date.now();
  let totalRequests = 0;
  let errors = 0;
  let latencies = [];

  console.log(`Starting soak test: ${duration}s, interval: ${interval}ms`);
  console.log('');

  while (Date.now() - startTime < duration * 1000) {
    try {
      const start = Date.now();
      await makeRequest('/health');
      latencies.push(Date.now() - start);
      totalRequests++;
    } catch (err) {
      errors++;
      totalRequests++;
    }

    if (totalRequests % 100 === 0) {
      const elapsed = (Date.now() - startTime) / 1000;
      const avgLatency = latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0;
      const p99 = latencies.length > 0 ? latencies.sort((a, b) => a - b)[Math.floor(latencies.length * 0.99)] : 0;
      console.log(`[${elapsed.toFixed(0)}s] Requests: ${totalRequests} | Errors: ${errors} | Avg: ${avgLatency.toFixed(0)}ms | P99: ${p99}ms | RPS: ${(totalRequests / elapsed).toFixed(0)}`);
    }

    await new Promise(r => setTimeout(r, interval));
  }

  const elapsed = (Date.now() - startTime) / 1000;
  const avgLatency = latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0;
  const p50 = latencies.sort((a, b) => a - b)[Math.floor(latencies.length * 0.5)] || 0;
  const p95 = latencies[Math.floor(latencies.length * 0.95)] || 0;
  const p99 = latencies[Math.floor(latencies.length * 0.99)] || 0;

  console.log('');
  console.log('=== Soak Test Results ===');
  console.log(`Duration: ${elapsed.toFixed(0)}s`);
  console.log(`Total Requests: ${totalRequests}`);
  console.log(`Errors: ${errors} (${((errors / totalRequests) * 100).toFixed(2)}%)`);
  console.log(`Avg Latency: ${avgLatency.toFixed(0)}ms`);
  console.log(`P50 Latency: ${p50}ms`);
  console.log(`P95 Latency: ${p95}ms`);
  console.log(`P99 Latency: ${p99}ms`);
  console.log(`RPS: ${(totalRequests / elapsed).toFixed(0)}`);
}

runSoakTest().catch(console.error);
