# anz-tech-test

## CURL commands for testing

### /tokenize

```bash
curl -X POST http://localhost:3000/tokenize \
  -H "Content-Type: application/json" \
  -d '["4111-1111-1111-1111", "4444-3333-2222-1111", "4444-1111-2222-3333"]'
```

### /detokenize

```bash
curl -X POST http://localhost:3000/detokenize \
  -H "Content-Type: application/json" \
  -d '["<replace>"]'
```
