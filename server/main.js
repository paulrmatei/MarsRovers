const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  path: '/ws',
  serveClient: false,
  // socket.io did not allow cors - this helped me connect the socket.io client
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('connection!');
});

/**
 * @typedef {'offline'|'thinking'|'sleeping'|'moving'|'waiting'|'drilling'} RoverState
 *
 * @type {Array<{name: string, state: RoverState}>}
 */
const rovers = [
  { name: 'spirit', state: 'offline' },
  { name: 'opportunity', state: 'offline' },
  { name: 'curiosity', state: 'offline' },
];

/** @type {ReadonlyArray<RoverState>} */
const states = Object.freeze([
  'offline',
  'thinking',
  'sleeping',
  'moving',
  'waiting',
  'drilling',
]);

// Allow cross origin requests
app.use('*', (_req, res, next) => {
  res
    .header('Access-Control-Allow-Origin', '*')
    .header('Access-Control-Allow-Methods', 'GET, POST')
    .header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/rovers', (_req, res) => res.json(rovers).end());

app.post('/add-rover/:name', (req, res) => {
  if (!req.params.name) {
    res.status(400).end();
    return;
  }

  rovers.push({ name: req.params.name, state: 'offline' });
  res.status(201).end();
});

setInterval(function emit_rovers() {
  io.emit('/rovers', rovers);
}, 1000);

// all other traffic
app.get('/*', (_req, res) => res.status(404).end());

// randomize state
setInterval(function randomize_state() {
  const currentStateIndex = () =>
    Math.round(Math.random() * (states.length - 2)) + 1;
  rovers
    .filter((r) => r.name !== 'spirit' && r.name !== 'opportunity')
    .forEach((r) => (r.state = states[currentStateIndex()]));
}, 1000);

http.listen(4444, () => console.log('listening on *:4444'));
