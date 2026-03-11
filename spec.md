# Urban Money Brokerage

## Current State
App has a form to add brokerage records and a records table. Two bugs:
1. "Failed to save record" - backend uses List API incorrectly (List is immutable in mo:core)
2. Serial number mismatch - nextSerialNumber counter doesn't account for deletions (12 records but shows #14)

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- Backend: Replace List with Buffer for proper mutable storage
- Backend: getNextSerialNumber() returns records.size() + 1 (not independent counter)
- Frontend: Ensure optional values are passed correctly to Candid

### Remove
- Independent nextSerialNumber counter from backend state

## Implementation Plan
1. Regenerate backend using Buffer instead of List, fix serial number logic
2. Regenerate frontend hooks to match new backend API
3. Ensure serial display matches actual record count
