# Sempliqo Website

Production build: `npm run build`. Deploy the generated `dist/` directory to any static host with SPA fallback to `index.html`.

## Required brand assets

Place the supplied files in `public/` without changing their names:

- `sempliqo_combined_logo (1)(1).png`
- `extract_only_the_geometric_s_symbol_from_the_left_side_of_this_image._remove(1).png`

The interface has a text fallback for the full logo, but the supplied files are required for final brand-accurate deployment.

## Enquiry delivery

Set `VITE_CONTACT_ENDPOINT` to a secure server endpoint that validates the submitted JSON, rate-limits requests, scans attachments when attachment upload is enabled, and forwards approved enquiries to the configured CRM or email workflow. Without this variable, the UI runs in a demonstration success mode and does not transmit data.

Configure legal entity details, policy effective dates, contact details, response expectations, social URLs, production domain, and absolute sitemap URLs before launch. The static host must route unknown paths to `index.html` for React Router.