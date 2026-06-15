export function generateCIYaml(type: string): string {
  switch (type) {
    case "next":
      return nextCI();
    case "nest":
      return nestCI();
    case "fullstack":
      return fullstackCI();
    default:
      return nodeCI();
  }
}

function nodeCI(): string {
  return `name: Node CI
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
`;
}

function nextCI(): string {
  return `name: Next.js CI
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run lint
      - run: npm run build
`;
}

function nestCI(): string {
  return `name: NestJS CI
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - run: npm run test
`;
}

function fullstackCI(): string {
  return `name: Fullstack CI
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run lint
      - run: npm run build
      - run: npm run test
`;
}