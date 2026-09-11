# OctaByte Portfolio Dashboard

OctaByte portfolio dashboard with a Next.js client and an Express API. The API reads portfolio holdings, retrieves market data, and returns calculated portfolio metrics to the dashboard.

GitHub repository: [github.com/9346mukesh/OctaByte](https://github.com/9346mukesh/OctaByte)

## Prerequisites

- Node.js 20 or newer
- npm

## Local Development

Clone the repository and move into the project directory:

```bash
git clone https://github.com/9346mukesh/OctaByte.git
cd OctaByte
```

Install dependencies in both applications:

```bash
cd server
npm install

cd ../client
npm install
```

Start the API in one terminal:

```bash
cd server
npm run dev
```

The API starts at `http://localhost:4000`. Verify it with:

```bash
curl http://localhost:4000/health
```

Start the client in a second terminal:

```bash
cd client
npm run dev
```

Open `http://localhost:3000` in a browser. The client uses `http://localhost:4000` by default for API requests. To use another API URL, set `NEXT_PUBLIC_API_BASE_URL` before starting the client:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000 npm run dev
```

## Useful Commands

Run these commands from the relevant application directory:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server with reloads |
| `npm run lint` | Run ESLint |
| `npm run build` | Create a production build |
| `npm start` | Start the production build |

The server also supports `npm run convert:data` for converting portfolio source data.
