"""Cuts the marked policy draft down to what production has switched on.

    python3 -I tools/cut-policy.py <effective date text> <kept marker,...>

Reads privacy.html and terms.html as drafted with <!-- connector:NAME:start/end --> and
<!-- switch:NAME:start/end --> markers, keeps the marked text of the names given, drops the
rest, swaps in a switch's ":off" wording where it has one, and writes the pages in place.
Run it on a copy of the draft branch; the markers do not survive it.
"""
import re
import sys

KEEP = set(sys.argv[2].split(",")) if len(sys.argv) > 2 and sys.argv[2] else set()
DATE = sys.argv[1]
CONNECTORS = [
    ("outlook-calendar", "Outlook Calendar"), ("outlook-mail", "Outlook mail"), ("github", "GitHub"),
    ("linear", "Linear"), ("jira", "Jira"), ("asana", "Asana"), ("notion", "Notion"),
    ("hubspot", "HubSpot"), ("salesforce", "Salesforce"), ("slack", "Slack"), ("telegram", "Telegram"),
]


def cut(html: str) -> str:
    names = set(re.findall(r"<!-- (?:connector|switch):([A-Za-z_-]+):start -->", html))
    for name in sorted(names - KEEP, key=len, reverse=True):
        html = re.sub(
            rf"<!-- (?:connector|switch):{re.escape(name)}:start -->.*?<!-- (?:connector|switch):{re.escape(name)}:end -->",
            "", html, flags=re.S)
    # ":off" wording: used when its switch is dropped, deleted when it is kept.
    def off(m):
        return "" if m.group(1) in KEEP else m.group(2)
    html = re.sub(r"<!-- switch:([A-Za-z_-]+):off \(put this text[^)]*\): (.*?) -->", off, html, flags=re.S)
    html = re.sub(r"<!-- (?:connector|switch):[A-Za-z_-]+:(?:start|end) -->", "", html)
    # Empty lists and blank lines left behind.
    html = re.sub(r"<ul>\s*</ul>", "", html)
    html = re.sub(r"\n[ \t]*\n(?:[ \t]*\n)+", "\n\n", html)
    return html.replace("{{EFFECTIVE_DATE}}", DATE)


privacy = cut(open("privacy.html").read())
off_connectors = [label for key, label in CONNECTORS if key not in KEEP]
if off_connectors:
    listed = "; ".join(off_connectors)
    # Google Calendar's entry reads ", until Google has reviewed it (…)" since 27 October 2026.
    privacy, n = re.subn(
        r"(no data from any of them is read, received or stored: Gmail, by any route; Google Calendar[^;]*;)",
        lambda m: f"{m.group(1)} {listed};", privacy, count=1)
    assert n == 1, "the list of switched-off connectors was not found"
if not any(key in KEEP for key, _ in CONNECTORS):
    privacy = privacy.replace(
        "<p>In Settings › Connected accounts you can connect accounts you hold with other services.",
        "<p>No account with another service can be connected yet (section 5). This is how connecting "
        "will work: in Settings › Connected accounts you will be able to connect accounts you hold with other services.")
    privacy = re.sub(r"\s*<p>Where the service offers it, we also ask it to withdraw[^<]*</p>", "", privacy)
leftover = re.findall(r"<!-- (?:connector|switch):[^>]*-->|\{\{EFFECTIVE_DATE\}\}", privacy)
assert not leftover, leftover
open("privacy.html", "w").write(privacy)

terms = cut(open("terms.html").read())
assert "{{EFFECTIVE_DATE}}" not in terms and "<!-- connector:" not in terms
open("terms.html", "w").write(terms)
print("kept:", ", ".join(sorted(KEEP)) or "nothing", "| not available:", ", ".join(off_connectors))
