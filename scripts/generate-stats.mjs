// Generates ledger-styled stats SVGs for the profile README.
// Runs in GitHub Actions with the built-in GITHUB_TOKEN.

const LOGIN = "badal8381";
const TOKEN = process.env.GITHUB_TOKEN;
if (!TOKEN) throw new Error("GITHUB_TOKEN not set");

const C = {
  paper: "#F4F5F2",
  ink: "#1A2330",
  soft: "#57606E",
  faint: "#8A919C",
  rule: "#D9DAD2",
  credit: "#1E6B4E",
  debit: "#9E3B2F",
};
const MONO = "'SFMono-Regular','IBM Plex Mono',Consolas,'Courier New',monospace";
const SANS = "'Segoe UI',system-ui,-apple-system,sans-serif";

const query = `{
  user(login: "${LOGIN}") {
    followers { totalCount }
    pullRequests { totalCount }
    issues { totalCount }
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      totalPullRequestReviewContributions
      contributionCalendar { totalContributions }
    }
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
      totalCount
      nodes {
        stargazerCount
        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
          edges { size node { name color } }
        }
      }
    }
  }
}`;

const res = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: {
    Authorization: `bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query }),
});
const json = await res.json();
if (json.errors) throw new Error(JSON.stringify(json.errors));
const u = json.data.user;

const stars = u.repositories.nodes.reduce((s, r) => s + r.stargazerCount, 0);
const cc = u.contributionsCollection;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

// ---------- stats card ----------
const rows = [
  ["Contributions (past year)", cc.contributionCalendar.totalContributions],
  ["Commits (past year)", cc.totalCommitContributions],
  ["Pull requests (all time)", u.pullRequests.totalCount],
  ["Code reviews (past year)", cc.totalPullRequestReviewContributions],
  ["Issues (all time)", u.issues.totalCount],
  ["Stars earned · own repos", stars],
  ["Followers", u.followers.totalCount],
];

const RW = 520;
const rowH = 27;
const top = 64;
const RH = top + rows.length * rowH + 24;

const statRows = rows
  .map(([label, value], i) => {
    const y = top + i * rowH;
    return `
  <text x="28" y="${y}" font-family="${SANS}" font-size="13.5" fill="${C.ink}">${esc(label)}</text>
  <line x1="28" y1="${y + 8}" x2="${RW - 28}" y2="${y + 8}" stroke="${C.rule}" stroke-width="1"/>
  <text x="${RW - 28}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="13.5" font-weight="600" fill="${C.credit}">${value.toLocaleString("en-IN")}</text>`;
  })
  .join("");

const statsSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${RW}" height="${RH}" viewBox="0 0 ${RW} ${RH}" role="img" aria-label="GitHub statistics for ${LOGIN}">
  <rect x="0.5" y="0.5" width="${RW - 1}" height="${RH - 1}" rx="4" fill="${C.paper}" stroke="${C.rule}"/>
  <text x="28" y="32" font-family="${MONO}" font-size="11" letter-spacing="2" fill="${C.soft}">JOURNAL · GITHUB ACTIVITY</text>
  <line x1="28" y1="42" x2="${RW - 28}" y2="42" stroke="${C.ink}" stroke-width="2"/>
  ${statRows}
  <g transform="translate(${RW - 96},${RH - 34}) rotate(-6)">
    <rect x="0" y="-14" width="72" height="22" rx="2" fill="none" stroke="${C.debit}" stroke-width="1.6"/>
    <text x="36" y="1" text-anchor="middle" font-family="${MONO}" font-size="9.5" letter-spacing="2.5" fill="${C.debit}">POSTED</text>
  </g>
</svg>`;

// ---------- languages card ----------
const langTotals = new Map();
for (const repo of u.repositories.nodes) {
  for (const e of repo.languages.edges) {
    const cur = langTotals.get(e.node.name) || { size: 0, color: e.node.color };
    cur.size += e.size;
    langTotals.set(e.node.name, cur);
  }
}
const SKIP = new Set(["Jupyter Notebook", "HTML", "CSS", "SCSS"]);
const langs = [...langTotals.entries()]
  .filter(([name]) => !SKIP.has(name))
  .sort((a, b) => b[1].size - a[1].size)
  .slice(0, 6);
const totalSize = langs.reduce((s, [, v]) => s + v.size, 0);

const LW = 520;
const lTop = 64;
const lRowH = 30;
const LH = lTop + langs.length * lRowH + 20;
const barX = 190;
const barMax = LW - barX - 90;

const langRows = langs
  .map(([name, v], i) => {
    const y = lTop + i * lRowH;
    const pct = (v.size / totalSize) * 100;
    const w = Math.max(3, (pct / 100) * barMax);
    return `
  <text x="28" y="${y}" font-family="${SANS}" font-size="13" fill="${C.ink}">${esc(name)}</text>
  <rect x="${barX}" y="${y - 11}" width="${barMax}" height="12" rx="2" fill="${C.rule}" opacity="0.5"/>
  <rect x="${barX}" y="${y - 11}" width="${w.toFixed(1)}" height="12" rx="2" fill="${v.color || C.credit}"/>
  <text x="${LW - 28}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="12.5" fill="${C.soft}">${pct.toFixed(1)}%</text>`;
  })
  .join("");

const langsSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${LW}" height="${LH}" viewBox="0 0 ${LW} ${LH}" role="img" aria-label="Most used languages for ${LOGIN}">
  <rect x="0.5" y="0.5" width="${LW - 1}" height="${LH - 1}" rx="4" fill="${C.paper}" stroke="${C.rule}"/>
  <text x="28" y="32" font-family="${MONO}" font-size="11" letter-spacing="2" fill="${C.soft}">LEDGER · LANGUAGES BY CODE SIZE (OWN REPOS, NO FORKS)</text>
  <line x1="28" y1="42" x2="${LW - 28}" y2="42" stroke="${C.ink}" stroke-width="2"/>
  ${langRows}
</svg>`;

import { mkdir, writeFile } from "node:fs/promises";
await mkdir("assets", { recursive: true });
await writeFile("assets/stats.svg", statsSvg);
await writeFile("assets/langs.svg", langsSvg);
console.log("Wrote assets/stats.svg and assets/langs.svg");
