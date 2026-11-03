# aforeday-site

The public website for **Aforeday**: home page, privacy policy, terms of use,
support and imprint. Plain static HTML, one stylesheet and one small script,
with no build step and no third-party requests of any kind: the two typefaces
(Instrument Serif and Instrument Sans, SIL Open Font License) are served from
`assets/fonts/`, the icons are inline SVG, and `assets/site.js` only adds
reveal-on-scroll, the approval stepper and the document sidebar marker; every
page reads fully with JavaScript off. No cookies, no storage, no analytics.

It has one job beyond explaining the product: the **App Store listing**. Apple
requires a privacy policy URL, a support URL and, for auto-renewable
subscriptions, a terms of use (EULA) URL. Sign in with Google is live. Gmail
and Google Calendar connectors are built and switched off in production, so the
site describes them as unavailable.

## Preview locally

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Then open http://127.0.0.1:4173.

## Before publishing

The privacy policy (version 3.1, effective 3 November 2026) describes the
product as it **actually behaves** in production: Sign in with Apple or Google,
iPhone calendars and reminders, optional when-in-use location for leave-by
times (the position stays on the phone), the acting agent with approvals and
the undo window, a paid-only subscription through Apple, and no connected
accounts. Gmail, Google Calendar and the other connectors are listed under
"Not available yet". Hosting is Amazon Web Services in Frankfurt
(`eu-central-1`): ECS, RDS for PostgreSQL, ElastiCache and Secrets Manager.
AI is Amazon Nova 2 Lite on Amazon Bedrock, called from Frankfurt through the
EU cross-region inference profile (`eu.amazon.nova-2-lite-v1:0`). A source
comment in `privacy.html` marks the Bedrock data-processing terms for counsel;
that comment is not shown on the page.

The usual rule stays: a site edit that describes an API change goes live only
after that change is deployed.

Two things to settle before it goes public:

1. **Set the policy version on the service.** `PRIVACY_POLICY_VERSION=3.1` and
   `PRIVACY_POLICY_EFFECTIVE_AT=2026-11-03T00:00:00Z` on the production API
   (`docs/LAUNCH_CONFIG.md` §3), so accounts created before that date see the
   in-app notice once. Set them after the site is live, not before.
2. **Screenshots.** `assets/screens/*.webp` are the 6.9-inch App Store
   captures from `orbit` `docs/product/screenshots/6.9-inch/` (build 64, carrying
   the Aforeday name), resized to 660 and 1320 pixels wide with `cwebp`. When
   the captures change, regenerate both sizes from the same source files.

Legal review of the launch policy was waived as a launch gate by the owner
(D-120); the trademark screen of the new name (M-65) is the one legal item that
waiver kept. That waiver does not cover Amazon Bedrock’s data-processing terms.
The reminder is an HTML comment in `privacy.html`, not text on the page.

**Contact address.** The site uses `contact@aforeday.com` everywhere. The app's
Settings › feedback link and the API's policy URL must point at the same
address and at `https://aforeday.com/privacy.html` in the rename pull request.

## Publish on GitHub Pages with the new domain

1. Create a **public** GitHub repository (GitHub Pages on a private repository
   needs a paid plan) and push this folder to its `main` branch.
2. Repository Settings › Pages: deploy from branch `main`, folder `/ (root)`.
3. Same page, **Custom domain**: enter `aforeday.com` and save. Do this *before*
   changing DNS; GitHub commits a `CNAME` file for you.
4. At the domain registrar, add:
   - apex `A` records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
     `185.199.111.153`
   - apex `AAAA` records: `2606:50c0:8000::153`, `2606:50c0:8001::153`,
     `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - `www` `CNAME` to `asheryani.github.io`
   - **no wildcard records** (GitHub warns they invite domain takeover)
5. GitHub account Settings › Pages › **Verify** the domain (a TXT record). This
   stops anyone else claiming it if the site is ever unpublished.
6. Back in the repository's Pages settings, tick **Enforce HTTPS** once offered
   (up to 24 hours).

## After it is live

1. **App Store Connect** (Aforeday): privacy policy `https://aforeday.com/privacy.html`,
   support `https://aforeday.com/support.html`, terms
   `https://aforeday.com/terms.html`.
2. **The app**, in the `orbit` repository: `LegalLinks.privacyPolicy`, the
   paywall's Terms link, and the Settings › feedback mailto, all in the rename
   pull request (`docs/research/2026-10-20-aforeday-rename-plan.md`).
3. **Production**: `PRIVACY_POLICY_VERSION` and `PRIVACY_POLICY_EFFECTIVE_AT`
   as above.
4. Google sign-in is already described on the site. When Gmail or Google
   Calendar is switched on in production, update this site first so it names
   exactly what is read and kept.
