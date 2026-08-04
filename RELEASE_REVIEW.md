# HomeStock release review

Last reviewed: 4 August 2026

## Classification

- Recommended status: private production / case study only.
- Public demo: not approved against the production database.
- Portfolio screenshots: synthetic data only.

## Privacy and access

- Inventory reads and writes require a Google account listed in `ADMIN_EMAILS`.
- Unapproved and signed-out visitors receive a private-access screen before any inventory query runs.
- Item and category writes independently verify administrator access on the server.
- Local screenshot mode uses synthetic inventory and remains read-only.
- PWA caching is limited to static shell assets and an offline page; inventory responses are never cached.
- The connected Vercel Blob store is public. Upload product-only images without private household details.

## Reliability

- Item and category deletion require user confirmation.
- Managed image uploads validate type and size and use randomized filenames.
- Failed item writes clean up newly uploaded managed blobs.
- Existing inventory data and image URLs are not changed by this review.

## Release checks

1. Run `npm run typecheck`.
2. Run `npm run build`.
3. Confirm a signed-out visitor cannot see inventory names, quantities, locations, or notes.
4. Confirm an approved Google account can view and manage inventory.
5. Confirm an unapproved Google account is denied.
6. Test create, edit, and delete with a disposable item and image.
7. Confirm the offline screen does not contain cached inventory data.

