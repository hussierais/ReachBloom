# Future ReachBloom backend

The current model is a workflow prototype. Browser roles and ownership IDs are editable and must never be trusted by a server. Replace localStorage/sessionStorage authority with server-owned records and authenticated sessions.

## Data and authorization

| Entity | Required server-owned data and access |
| --- | --- |
| Accounts | Verified email, securely hashed credentials, assigned roles, account state. Customer/owner registration must never grant administrator privileges. |
| Sessions | Secure cookies, expiry, logout invalidation, CSRF protection, rate limiting and server authentication. Login's selected account type does not determine privileges. |
| Businesses | Owner-management assignments, creator, category, location, profile, contact/hours, publication status and stable slug/ID. Public queries and direct routes return only Approved records. |
| Applications | Owner applicant ID, drafts, submitted details, timestamps, feedback and moderation state. Drafts and private application details are accessible only to the applicant and authorized administrators. |
| Products/services | Business ID, descriptions, optional price/currency, ordering, images. Each mutation verifies the authenticated user's management assignment to that business. |
| Images | Private upload validation, type/content/size checks, secure object storage, processing, ownership checks and lifecycle cleanup. Avoid executing uploaded HTML/SVG. |
| Ownership claims | Authenticated claimant, business ID, contact information, securely handled proof, review state, reviewer and reason. Only actual verification followed by approval grants access. |
| Review history | Append-only audit events with authenticated actor, action, reason and timestamp. Prevent clients forging or deleting history. |
| Saved/recent | Customer-owned records with access isolation, privacy controls and approved-only public projections. |

## Workflow rules

| From | To | Authorized actor |
| --- | --- | --- |
| Draft | Pending Review | Assigned owner submits |
| Pending Review | Approved / Changes Requested / Rejected | Administrator |
| Changes Requested / Rejected | Pending Review | Assigned owner resubmits |
| Approved | Suspended | Administrator, with reason |
| Suspended | Approved | Administrator reactivates |
| Approved | Pending Review | Assigned owner explicitly resubmits |
| New direct administrator listing | Approved | Administrator, audit recorded |
| Pending ownership claim | Approved / Rejected | Administrator following actual verification |

The frontend's Save Profile action preserves status; decide whether approved profile/product edits require separate change approval before backend rollout. Never allow the client to assign ownerId, creator, account role, moderation status or reviewer identity through profile payloads.

Use transactional claim approval to verify the listing remains claimable, assign management access once and resolve conflicting claims. Claims against suspended/unapproved or already assigned listings must be rejected. Do not grant management access merely because someone has filed a claim or entered a matching email.

## Production concerns

- Return meaningful validation/authorization errors; repeat all validation on the server.
- Prevent ID-based unauthorized reads/updates, SQL injection, XSS and mass assignment.
- Add safe content moderation, pagination, normalized location/category search and server-enforced publication filters.
- Store contact and verification documents under appropriate privacy and retention policies. The current demo requests fictional information and is not suitable for collecting real customer data.
- Add verified, consented phone/email/WhatsApp links only when legitimate business details exist.
- Implement actual registration, recovery and verification emails; do not reuse the public demo passphrase.
- Add server/API integration tests for every role, status transition, direct storefront route and simultaneous ownership claim. Hiding a button is never authorization.
- Define real upload, reporting, review and support workflows before accepting public applications. There are no APIs or credentials hidden in this frontend.
