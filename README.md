# purser-site

The public website for **Purser AI**: home page, privacy policy, terms of use,
support and imprint. Plain static HTML and one stylesheet, with no build step,
no scripts, no web fonts and no third-party requests.

It has two jobs beyond explaining the product:

1. **Google OAuth verification** for the restricted `gmail.readonly` scope. Google
   requires a home page that accurately describes the app, and a privacy policy on
   the same verified domain that says how Google user data is accessed, used,
   stored and shared, and that the app complies with the Limited Use requirements.
   The home page's "What Purser does with your Google data" section and the
   privacy policy's Google section exist for that review.
2. **App Store listing**: Apple requires a privacy policy URL, a support URL and,
   for auto-renewable subscriptions, a terms of use (EULA) URL.

## Preview locally

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Then open http://127.0.0.1:4173.

## Before publishing

The privacy policy was written from a code audit of the API commit deployed on
17 September 2026 (`6282a17`), fact by fact. It therefore describes the product
as it **actually behaves**, including four places where data outlives what a
reader would expect. Those disclosures are in the retention table and section 10:
meeting-reminder records that survive account deletion, draft copies kept in
duplicate-request records, briefs and briefings with no retention rule, and an
export that omits assistant conversations and the sentences behind commitments.

**Four things to settle before this goes public:**

1. **Fix or accept the disclosures.** Tasks are queued in the `orbit` repository
   to close all four. When they land, delete the matching rows and sentences here
   — the policy gets shorter and stronger. Publishing first is possible; it just
   means publishing those admissions.
2. **Legal review.** Counsel should read `privacy.html` and `terms.html`. Two
   sentences need their confirmation in particular: that Google does not use
   Vertex AI input to train its models (section 5 — this states our contractual
   position with Google, not something the code can prove), and the liability
   clause in the terms.
3. **Back the access claim in section 11.** It says we do not read your mail or
   calendar except in narrow cases. That is a promise the company must be able to
   evidence: the IAM review and written access policy are still open in
   `docs/security/SECRETS_MANAGEMENT.md` and the CASA package.
4. **The name.** `purser.app` belongs to an unrelated UK payments company. Get a
   view on the "Purser" name before the site and the Google consent screen go
   public under it, and choose the domain with that in mind.

Also note, unrelated to this site but blocking the store listing it links to:
`APPLE_ROOT_CERTS_BASE64` is unset in production, so every StoreKit transaction
is rejected and no subscription can grant an entitlement (M-12).

**Contact addresses.** The site uses `hello@neurotech-ai.de`; the app's
Settings › feedback link uses `support@neurotech-ai.de`. Once the new domain has
mailboxes, switch both to the same address in one change.

## Publish on GitHub Pages with the new domain

1. Create a **public** GitHub repository (GitHub Pages on a private repository
   needs a paid plan) and push this folder to its `main` branch.
2. Repository Settings › Pages: deploy from branch `main`, folder `/ (root)`.
3. Same page, **Custom domain**: enter the domain and save. Do this *before*
   changing DNS; GitHub commits a `CNAME` file for you.
4. At the domain registrar, add:
   - apex `A` records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
     `185.199.111.153`
   - apex `AAAA` records: `2606:50c0:8000::153`, `2606:50c0:8001::153`,
     `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - `www` `CNAME` to `<github-user>.github.io`
   - **no wildcard records** (GitHub warns they invite domain takeover)
5. GitHub account Settings › Pages › **Verify** the domain (a TXT record). This
   stops anyone else claiming it if the site is ever unpublished.
6. Back in the repository's Pages settings, tick **Enforce HTTPS** once offered
   (up to 24 hours).

## After it is live

1. **Google Search Console**: verify the domain (DNS TXT) with an account that is
   Owner or Editor on the `purser-orbit-dev` Google Cloud project.
2. **Google Auth Platform › Branding** (project `purser-orbit-dev`): app name,
   logo (`assets/icon-512.png`, downscaled to 120×120), home page
   `https://<domain>/`, privacy policy `https://<domain>/privacy.html`, terms
   `https://<domain>/terms.html`, authorized domain `<domain>`.
3. **App Store Connect** (Purser AI): privacy policy, support and terms URLs.
4. **The app**, in the `orbit` repository:
   - `apps/ios/Purser/Screens/PaywallScreen.swift` — privacy link, and the "Terms"
     link, which currently opens the imprint instead of the terms
   - `apps/ios/Purser/Screens/SettingsScreen.swift` — the feedback mailto
   - `docs/product/APP_STORE_METADATA.md` and `docs/compliance/CASA_PACKAGE.md` —
     the URL tables
5. Submit for Google verification from **Google Auth Platform › Verification
   Center** (publish the app from Testing to In production first). Until that is
   approved, Google expires every tester's Gmail and Calendar access after seven
   days.
