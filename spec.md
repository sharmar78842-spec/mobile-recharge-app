# Mobile Recharge App

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Mobile prepaid recharge form (enter phone number, select operator, select plan)
- Recharge plan listing (popular plans with price and validity)
- Recharge history per user (stored in backend)
- Demo recharge flow (no real payment, simulated success)

### Modify
- N/A

### Remove
- N/A

## Implementation Plan

### Backend
- Store recharge history records: phone number, operator, plan, amount, date, status
- APIs: submit recharge, get recharge history

### Frontend
- Home screen with recharge form (phone number input, operator selector, plan selector)
- Plan cards showing amount, validity, and description
- Confirm and "Pay" button (demo only, no real payment)
- Success screen after recharge
- Recharge history page showing past transactions
