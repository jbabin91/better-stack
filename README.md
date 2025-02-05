# Better Stack

## Getting Started

### Project Setup

1. Install dependencies

```sh
pnpm install
```

2. Set up Environment Variables

```sh
cp .env.example .env
cd apps/backend
ln -s ../../.env .env
cp .env.test.example .env.test
```

3. Start the database

```sh
pnpm db:up
```

### Development

```sh
pnpm dev
```

### Testing

Run tests

```sh
pnpm test
```
