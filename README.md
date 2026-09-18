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
as it **actually behaves**. It used to carry four places where data outlived
what a reader would expect — meeting-reminder records that survive account
deletion, draft copies kept in duplicate-request records, briefs and briefings
with no retention rule, and an export that omitted assistant conversations and
the sentences behind commitments. **All four are closed** (`orbit` PRs #42 and
#43), and the retention table and section 10 no longer disclose any of them.
What is left is not a disclosure problem but a timing one; see below.

**Version 1.1 no longer runs entirely ahead of production.** Two of the five
fixes the 18 September 2026 edits describe went live at 13:15Z that day
(`api:32e369a`, revision `purser-api-dev-00055-jjt`): `orbit` PR #42's export
and PR #43's retention rules, plus PR #50, which erases Slack conversation
state at account deletion and at disconnect. `curl /v1/health/version` returns
the deployed commit, so this is checkable rather than assumed.

Three are still open as a pull request in `orbit` and production does **not**
have them: the AI consent check moved ahead of the Gmail fetch, the unused
Slack `search:read` permission removed, and commitment extraction no longer
adding anything without your confirmation. Until those are deployed, the
passages describing them say how the app will behave rather than how it does,
which is exactly what the policy's own opening sentence promises not to do.
Publish after that deploy, or revert those three passages.

One passage now errs in the opposite direction and should be fixed before
publishing, though it is not a reason to delay: sections 9 and 10 still say
Slack conversation summaries are never deleted at disconnect or account
deletion and merely age out after 72 hours. Since PR #50 they are deleted with
the account and at disconnect, so the policy currently claims we keep more than
we do.

**Four things to settle before this goes public:**

1. **Deploy before publishing.** There is nothing left to accept: all four of
   the admissions above are closed in code and their rows and sentences are
   gone. (Section 10 still says account deletion does not withdraw your Sign
   in with Apple grant — that one is open, and needs the M-01 Apple client
   secret before it can be closed.) What remains is timing, and less of it
   than before: #42, #43 and #50 are deployed as of 18 September 13:15Z, and
   three fixes are still an open pull request. Publishing now would mean
   describing those three as done when the running API has not got them.
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
