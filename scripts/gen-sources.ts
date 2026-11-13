// Writes SOURCES.md, a human-readable version of the case library, from data/cases.
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadCases, loadMyths, ROOT } from './load';

const cases = loadCases().map((x) => x.c).sort((a, b) => a.title.localeCompare(b.title));
const myths = loadMyths();
const opened = cases.flatMap((c) => c.sources).filter((s) => s.accessed === 'opened').length;
const total = cases.flatMap((c) => c.sources).length;

let md = `# The Glass City — Sources\n\n`;
md += `Generated from \`data/cases/*.json\` and \`data/myths.json\`. Do not edit by hand; run \`npm run sources\`.\n\n`;
md += `- ${cases.length} cases, ${myths.length} myths\n- ${total} source links: ${opened} were opened and read by the researchers; ${total - opened} were seen only in search-result snippets (marked "snippet").\n- Facts are as of the date shown on each case.\n\n`;
md += `## Evidence labels\n\nDOCUMENTED, REPORTED, ALLEGED, CONTESTED, STATEMENT, WHAT-IF, FICTIONAL. See the About page in the site for definitions.\n\n`;
md += `Rule for settlements: when a government enforcer (FTC, DOJ, a state attorney general, a national regulator) obtains an order or settlement, the case is DOCUMENTED for the order and its terms, and the underlying conduct is described as "alleged". Private class-action settlements are ALLEGED.\n\n`;
md += `## Cases\n\n`;
for (const c of cases) {
  md += `### ${c.title}\n\n`;
  md += `**${c.label}** · ${c.date} · ${c.countries.join(', ')} · id \`${c.id}\`\n\n`;
  md += `${c.labelNote}\n\n`;
  md += `- **Collected:** ${c.collected}\n- **Inferred:** ${c.inferred}\n- **Done:** ${c.done}\n`;
  md += `- **Company response:** ${typeof c.companyResponse === 'string' ? 'None found.' : `${c.companyResponse.text}${c.companyResponse.source ? ` (${c.companyResponse.source})` : ''}`}\n`;
  md += `- **Outcome:** ${c.outcome.text}${c.outcome.date ? ` (${c.outcome.date})` : ''}\n- **Limits:** ${c.limits}\n\n`;
  md += `Sources:\n`;
  for (const s of c.sources) md += `- [${s.title}](${s.url}). ${s.publisher}. ${s.type}, ${s.accessed}${s.date ? `, ${s.date}` : ''}\n`;
  md += `\n`;
}
md += `## Myths\n\n`;
for (const m of myths) {
  md += `### ${m.claim}\n\n**${m.verdict}.** ${m.whatEvidenceShows}\n\n- Fair test: ${m.fairTest}\n- Would change our mind: ${m.wouldChangeOurMind}\n- Related cases: ${m.caseIds.map((i) => `\`${i}\``).join(', ')}\n\n`;
}
md += `## Credits\n\nThe Block Blast analysis is the work of Ayo Omolewa (https://ayoships.com/breakdowns/block-blast). The Stack Shift mini-game is our own original, simplified illustration, not a copy of any game.\n`;
writeFileSync(join(ROOT, 'SOURCES.md'), md);
console.log(`Wrote SOURCES.md (${cases.length} cases).`);
