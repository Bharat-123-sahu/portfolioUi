const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');

const port = Number(process.env.PORT || 8080);
const apiTarget = parseApiTarget(process.env.API_TARGET || 'http://localhost:5000');
const publicDir = path.join(__dirname, 'www');

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function parseApiTarget(value) {
  try {
    const target = new URL(value);

    if (!['http:', 'https:'].includes(target.protocol)) {
      throw new Error('Unsupported API target protocol');
    }

    return target;
  } catch {
    return new URL('http://localhost:5000');
  }
}

function proxyRequest(clientRequest, clientResponse) {
  const transport = apiTarget.protocol === 'https:' ? https : http;
  const targetRequest = transport.request(
    {
      protocol: apiTarget.protocol,
      hostname: apiTarget.hostname,
      port: apiTarget.port || (apiTarget.protocol === 'https:' ? 443 : 80),
      path: clientRequest.url,
      method: clientRequest.method,
      headers: {
        ...clientRequest.headers,
        host: apiTarget.host,
        'x-forwarded-proto': 'http',
      },
    },
    (targetResponse) => {
      clientResponse.writeHead(
        targetResponse.statusCode || 502,
        targetResponse.headers,
      );
      targetResponse.pipe(clientResponse);
    },
  );

  targetRequest.on('error', () => {
    clientResponse.writeHead(502, { 'content-type': 'text/plain' });
    clientResponse.end('Bad Gateway');
  });

  clientRequest.pipe(targetRequest);
}

function serveFile(filePath, response) {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404, { 'content-type': 'text/plain' });
      response.end('Not Found');
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      'content-type': mimeTypes[extension] || 'application/octet-stream',
      'cache-control':
        filePath.endsWith('index.html') ? 'no-cache' : 'public, max-age=2592000',
    });
    response.end(content);
  });
}

http
  .createServer((request, response) => {
    if (request.url.startsWith('/api/') || request.url.startsWith('/uploads/')) {
      proxyRequest(request, response);
      return;
    }

    const requestedPath = decodeURIComponent(request.url.split('?')[0]);
    const safePath = path
      .normalize(requestedPath)
      .replace(/^(\.\.[/\\])+/, '')
      .replace(/^[/\\]/, '');
    const filePath = path.join(publicDir, safePath);

    fs.stat(filePath, (error, stats) => {
      if (!error && stats.isFile()) {
        serveFile(filePath, response);
        return;
      }

      serveFile(path.join(publicDir, 'index.html'), response);
    });
  })
  .listen(port, '0.0.0.0', () => {
    process.stdout.write(`Portfolio UI listening on http://0.0.0.0:${port}\n`);
  });
