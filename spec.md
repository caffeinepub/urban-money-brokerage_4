# Urban Money Brokerage

## Current State
New project, no existing code.

## Requested Changes (Diff)

### Add
- Full brokerage records management system matching screenshots exactly
- Add New Brokerage form with fields: Serial Number (auto), Finance, Customer Name*, MCF*, Product*, Gross Amount, Net Amount, Loan Amount (optional), Brokerage Amt. Received Date (optional), Bank Amt. Received Date (optional), Remark (dropdown: Received/Pending)
- Buttons: Clear, Print (single record), Save Record
- All Records view with filter tabs (All, Received, Pending), Print All button
- Stats row: Total records, Received count, Pending count
- Table: Sr. No., Brok. Rcv Date, Bank Rcv Date, Finance, Customer Name, MCF, Product, Loan Amt, Gross Amt, Net Amt, Remark, Actions (edit, print, delete)
- Auto-calculated totals at bottom of table: Total Loan Amount, Total Gross Amount, Total Net Amount
- Navigation header with app name and record count

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend: BrokerageRecord type with all fields, CRUD operations, getAll/getByStatus queries
2. Frontend: Two-tab layout (Add New Brokerage, All Records), form with auto serial number, records table with filters, auto-calculated totals footer row
