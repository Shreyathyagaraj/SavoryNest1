# Security Specification - MealMate

## Data Invariants
- An order must contain at least one item.
- A user cannot modify another user's profile.
- Only admins can modify food items or update order statuses.
- Order status can only be updated by admins.
- Users can only read their own orders.

## Identity Guards
- `isOwner(userId)`: `request.auth.uid == userId`
- `isAdmin()`: `exists(/databases/$(database)/documents/users/$(request.auth.uid)) && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true`

## Dirty Dozen Payloads
1. Create a food item as a non-admin. (Should fail)
2. Update an order's status as a non-admin. (Should fail)
3. Set `isAdmin: true` on own user profile. (Should fail)
4. Delete another user's order. (Should fail)
5. Create an order for another user. (Should fail)
6. Update a food item price to a negative value. (Should fail)
7. Inject a 2KB string as a food item name. (Should fail)
8. Read another user's shipping address. (Should fail)
9. Update `createdAt` field on an order. (Should fail)
10. Remove required fields from user profile on update. (Should fail)
11. Set `totalAmount` to 0 for a massive order. (Should fail)
12. Update an order after it has been delivered. (Should fail)

## Test Runner
The firestore.rules.test.ts file will verify these assertions.
