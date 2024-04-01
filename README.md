# README

A useful react hook wrapping XMLCclRequest to make it easier to access lifecycle state and data in a React component.

Example usage:

```tsx
const { data, errors, loading } = useCcl<CoolData>('A_FAKE_PRG', ['abc', 123], {
  pollInterval,
});
```
