# aforeday-site

The public website for **Aforeday**: home page, privacy policy, terms of use,
support, and imprint. Static HTML, one stylesheet, and one small script. No
build step. No third-party requests. Type is the Apple system font (SF Pro on
Apple devices) with Inter self-hosted under the SIL Open Font License
(`assets/fonts/`). Icons are inline SVG. `assets/site.js` only adds a header
hairline, reveal-on-scroll, the hero crossfade, and the document sidebar
marker. Every page reads with JavaScript off. No cookies, no storage, no
analytics.

The visual identity is Horizon, pre-dawn: indigo night `#070B16`, coral arc
`#E06A3C` to `#FFC48A` and back. The arc path is the Horizon mark at
viewBox `0 0 1000 200`: `M 36 132 Q 500 4 964 132`, stroke width 72.

Beyond explaining the product, the site is the **App Store listing**: a privacy
policy URL, a support URL, and a terms of use URL for the auto-renewable
subscriptions (Pro Monthly and Pro Annual, no free trial).

## Preview locally

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Then open http://127.0.0.1:4173.

## Before publishing

The privacy policy is **version 3.2, last updated 12 November 2026**. It
replaces version 3.1 (3 November 2026). Text AI is Amazon Nova 2 Lite
(`amazon.nova-2-lite-v1:0`) through the EU inference profile
`eu.amazon.nova-2-lite-v1:0`, called from `eu-central-1`. Spoken replies use
Amazon Polly in Frankfurt. Talk mode, evening close-out, Share capture, and
the connectors are described as switched off. Passages marked **TODO for
review** are the points the verified notes do not determine. Do not publish
version 3.2 until those notes are replaced.

A source comment in `privacy.html` asks counsel to review Amazon Bedrock’s and
Amazon Polly’s data-processing terms before the page claims that AWS does not
train on prompts or reply text, or how long AWS may retain them. That comment
is not shown on the page. The visible page says we do not keep the spoken-reply
audio and do not write it to our storage. It does not claim what AWS retains.

The usual rule stays: a site edit that describes an API change goes live only
after that change is deployed.

Two things to settle before this version goes public:

1. **Clear the TODOs**, then set the policy version on the service so accounts
   created before this date see the in-app notice once. Set that after the site
   is live, not before.
2. **Screenshots.** `assets/screens/*.webp` are the pre-dawn app screens, at
   660 and 1206 pixels wide. When the captures change, regenerate both sizes
   from the same source files.

**Contact address.** The site uses `contact@aforeday.com`. The app’s feedback
link and the API’s policy URL should point at the same address and at
`https://aforeday.com/privacy.html`.

Company legal details appear on the privacy policy, the terms, and the imprint
only.

## Publish on GitHub Pages

This repository is a GitHub Pages site. There is no Vercel, Netlify, or
Amplify configuration.

- `CNAME` is `aforeday.com`.
- `.nojekyll` is present so Pages serves the files as they are.
- Repository Settings › Pages: deploy from the branch that should be live
  (today, `main`), folder `/ (root)`.
- DNS for the apex is GitHub Pages’ A and AAAA records, and `www` is a CNAME
  to the GitHub Pages host. Enforce HTTPS once GitHub offers it.
- A domain verification TXT record stops anyone else claiming the name if the
  site is unpublished.

`google0dfee67e36e8eb99.html` is the Search Console ownership file. Leave it
in place.

## After it is live

1. **App Store Connect**: privacy policy `https://aforeday.com/privacy.html`,
   support `https://aforeday.com/support.html`, terms
   `https://aforeday.com/terms.html`.
2. **The app**: the privacy-policy link, the paywall’s terms link, and the
   feedback mail link should match this site.
3. **Production**: the privacy-policy version and effective time, after the
   TODOs are cleared and the site is live.
