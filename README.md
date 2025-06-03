# anz-tech-test

This project is a simple Node.js application that provides endpoints for tokenization and detokenization of credit card numbers. It uses an in-memory store to manage tokens and their corresponding credit card numbers.

## 🛠️ Tech stack

- Node.js (runtime)
- Fastify (web framework)
- TypeScript (type system)
- Jest (testing framework)
- Zod (validation library)
- LokiJS (in-memory database)

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/malinmalliyawadu/anz-tech-test.git
cd anz-tech-test

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Watch mode for active development
npm run test:watch

# Coverage report
npm run test:coverage

# Debug tests
npm run test:debug
```

## 📡 CURL commands for testing

### `/tokenize`

```bash
curl -X POST http://localhost:3000/tokenize \
  -H "Content-Type: application/json" \
  -d '["4111-1111-1111-1111", "4444-3333-2222-1111", "4444-1111-2222-3333"]'
```

### `/detokenize`

```bash
curl -X POST http://localhost:3000/detokenize \
  -H "Content-Type: application/json" \
  -d '["<replace>"]'
```
