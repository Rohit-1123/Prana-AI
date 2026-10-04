import { ArrowLeft, ShieldCheck, Lock } from "lucide-react";
import type { ReactNode } from "react";

// Replace with a monitored inbox before going public.
export const CONTACT_EMAIL = "privacy@pranaai.example";
const LAST_UPDATED = "4 October 2026";

export type LegalDoc = "privacy" | "security";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-light tracking-tight text-foreground">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-foreground/80 flex flex-col gap-3">{children}</div>
    </section>
  );
}

function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-left text-[13px] border-collapse min-w-[520px]">
        <thead>
          <tr>{head.map((h) => <th key={h} className="py-2 px-2 font-medium text-muted border-b border-border">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="align-top">
              {r.map((c, j) => <td key={j} className="py-2.5 px-2 border-b border-border/60">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const Status = ({ ok }: { ok: boolean }) => (
  <span className={ok ? "text-success" : "text-warning"}>{ok ? "In place" : "Planned"}</span>
);

function Privacy() {
  return (
    <>
      <p>
        This policy explains what PranaAI collects when you use this website, why, who it is shared with and the
        choices you have. It is written to meet India's Digital Personal Data Protection Act, 2023 (DPDP Act) and
        follows the GDPR's transparency principles for visitors outside India.
      </p>

      <Section title="1. The short version">
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          <li>You can use the dashboard, map, forecasts and Copilot without an account.</li>
          <li>We do not use advertising or analytics trackers, and we do not set cookies.</li>
          <li>We do not ask for or use your device location. Air quality is shown for fixed, public places in each city.</li>
          <li>Copilot questions are sent to our server and to our AI provider to generate an answer. Don't type personal or medical details into them.</li>
          <li>Your settings and chat history stay in your own browser. You can delete them at any time.</li>
        </ul>
      </Section>

      <Section title="2. What we process">
        <Table
          head={["Data", "Where it lives", "Why", "How long"]}
          rows={[
            ["Preferences: theme, language, units, time zone, recent searches", "Your browser (localStorage)", "Remember your settings", "Until you clear it"],
            ["Copilot conversations", "Your browser (localStorage)", "Show your chat history", "Until you delete a conversation or clear site data"],
            ["Copilot question, last few messages, and the air-quality readings on screen", "Sent to our server, then to Groq (AI provider)", "Generate the answer", "Not stored by our server beyond technical logs (below)"],
            ["IP address, time, requested URL, response status", "Server logs", "Security, abuse prevention (rate limiting), debugging", "Up to 180 days, then deleted"],
            ["Name, email, password hash (only if account features are enabled)", "Our database", "Sign-in for municipal staff accounts", "Until the account is deleted"],
          ]}
        />
        <p>Passwords are never stored in readable form; we keep only a salted bcrypt hash.</p>
      </Section>

      <Section title="3. Legal basis">
        <p>
          We process data with your consent when you choose to use the Copilot, and for legitimate uses permitted
          under Section 7 of the DPDP Act (keeping the service secure and working). We do not sell personal data or
          use it for profiling or advertising.
        </p>
      </Section>

      <Section title="4. Third parties">
        <Table
          head={["Provider", "What they receive", "Purpose"]}
          rows={[
            ["Groq, Inc. (USA)", "Copilot questions, recent messages, readings shown", "Large-language-model answers. Groq states API data is not used to train models."],
            ["Open-Meteo (Switzerland/EU)", "Coordinates of the fixed monitoring places only, from our server", "Air-quality (Copernicus CAMS) and weather data"],
            ["Esri (ArcGIS basemap tiles)", "Your IP address and the map area you view (loaded by your browser)", "Map background"],
            ["Google Fonts, unpkg CDN", "Your IP address (loaded by your browser)", "Fonts and map stylesheet"],
          ]}
        />
        <p>
          When data leaves India, it goes only to the providers listed above, for the purposes listed, as permitted
          by Section 16 of the DPDP Act.
        </p>
      </Section>

      <Section title="5. Your rights">
        <p>Under the DPDP Act (and the GDPR, where it applies) you can:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          <li>ask what personal data we hold about you and get a copy (access);</li>
          <li>have it corrected or completed (correction);</li>
          <li>have it erased, and withdraw consent at any time (erasure / withdrawal);</li>
          <li>nominate another person to exercise these rights for you (nomination);</li>
          <li>complain to us, and then to the Data Protection Board of India (grievance redressal).</li>
        </ul>
        <p>
          To delete what's on your device, clear this site's data in your browser settings, or delete conversations
          in the Copilot. For anything else, write to <a className="text-primary underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          We reply within 30 days.
        </p>
      </Section>

      <Section title="6. Children">
        <p>
          PranaAI is a general-audience information service. We don't knowingly collect personal data from children
          under 18. If you think a child has sent us personal data, contact us and we will delete it.
        </p>
      </Section>

      <Section title="7. Health and data disclaimer">
        <p>
          Air-quality values are computed from Copernicus CAMS model data using the CPCB National AQI method
          (24-hour averages). They are estimates for each area, not readings from official CPCB monitoring stations,
          and they can differ from station values. Copilot answers are general guidance, not medical advice. If you
          have symptoms, see a doctor.
        </p>
      </Section>

      <Section title="8. Changes">
        <p>If we change this policy, we will update the date at the top. Significant changes will be shown on the website.</p>
      </Section>
    </>
  );
}

function Security() {
  return (
    <>
      <p>
        How we protect PranaAI and its users. We design to the OWASP Application Security Verification Standard
        (ASVS) Level 1 and map our controls to the OWASP Top 10 below. This is a description of our practices, not a
        third-party certification.
      </p>

      <Section title="Controls in place">
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          <li><b>Encryption in transit:</b> production traffic is served over HTTPS only, with HTTP Strict Transport Security (HSTS).</li>
          <li><b>Security headers:</b> Content-Security-Policy, X-Frame-Options (DENY), X-Content-Type-Options, Referrer-Policy, Permissions-Policy and Cross-Origin-Opener-Policy on every response.</li>
          <li><b>Credentials:</b> passwords hashed with bcrypt; signed, expiring JWT session tokens; the signing key must be set before production starts.</li>
          <li><b>Abuse protection:</b> per-IP rate limits on sign-in, Copilot and data endpoints.</li>
          <li><b>Input validation:</b> every API request is schema-validated, with size and range limits.</li>
          <li><b>Restricted origins:</b> the API accepts browser requests only from approved front-end origins (CORS allow-list) and limits the allowed methods and headers.</li>
          <li><b>Secrets management:</b> API keys and secrets live in environment variables, never in source control.</li>
          <li><b>AI safety:</b> the Copilot answers only from the supplied readings, is told not to invent figures, holds no secrets in its prompt, and can't take actions on your behalf.</li>
          <li><b>Privacy by design:</b> no trackers, no cookies, no location access; preferences and chats stay on your device.</li>
        </ul>
      </Section>

      <Section title="OWASP Top 10 (2021) mapping">
        <Table
          head={["Risk", "How we address it", "Status"]}
          rows={[
            ["A01 Broken Access Control", "Role-based checks on protected API routes; JWT validated on every protected request", <Status key="s" ok />],
            ["A02 Cryptographic Failures", "HTTPS + HSTS; bcrypt password hashing; no sensitive data in the browser", <Status key="s" ok />],
            ["A03 Injection", "ORM-parameterised queries; schema validation; React output escaping; CSP", <Status key="s" ok />],
            ["A04 Insecure Design", "Least-data design; the AI only reads readings and can't take actions", <Status key="s" ok />],
            ["A05 Security Misconfiguration", "Security headers; restricted CORS; production refuses to start without a secret key", <Status key="s" ok />],
            ["A06 Vulnerable Components", "Pinned dependencies; automated dependency scanning (npm audit / pip-audit) in CI", <Status key="s" ok={false} />],
            ["A07 Identification & Auth Failures", "Rate-limited sign-in; expiring tokens; strong hashing", <Status key="s" ok />],
            ["A08 Software & Data Integrity", "Subresource Integrity on CDN stylesheets; lockfiles", <Status key="s" ok />],
            ["A09 Logging & Monitoring", "Request logs with request IDs; centralised alerting", <Status key="s" ok={false} />],
            ["A10 SSRF", "Server calls only fixed, allow-listed data providers; no user-supplied URLs", <Status key="s" ok />],
          ]}
        />
      </Section>

      <Section title="Regulatory alignment">
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          <li><b>DPDP Act, 2023 (India):</b> notice, consent, purpose limitation, data-principal rights and grievance redressal. See the <a className="text-primary underline" href="#/privacy">Privacy Policy</a>.</li>
          <li><b>CERT-In Directions (April 2022):</b> we keep logs for 180 days and report cyber incidents to CERT-In within 6 hours of discovery.</li>
          <li><b>IT Act, 2000 §43A and the SPDI Rules, 2011:</b> reasonable security practices for any sensitive personal data, such as passwords.</li>
          <li><b>ISO/IEC 27001 and NIST CSF 2.0:</b> used as reference frameworks for our security programme (not certified).</li>
        </ul>
      </Section>

      <Section title="Incident response">
        <p>
          If a breach affects personal data, we contain it, assess its impact, and notify affected users and the Data
          Protection Board of India without delay, as the DPDP Act requires. We also report to CERT-In within 6 hours.
        </p>
      </Section>

      <Section title="Responsible disclosure">
        <p>
          Found a vulnerability? Email <a className="text-primary underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with
          steps to reproduce it. Please don't access other people's data, degrade the service or publish the issue before
          we fix it. We'll acknowledge your report within 3 business days and won't take legal action against good-faith research.
        </p>
      </Section>
    </>
  );
}

export function LegalPage({ doc, onBack }: { doc: LegalDoc; onBack: () => void }) {
  const isPrivacy = doc === "privacy";
  return (
    <main className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-16">
      <button onClick={onBack} className="btn-ghost h-9 px-4 text-xs cursor-pointer inline-flex items-center gap-2">
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </button>
      <article className="glass-card mt-6 p-6 sm:p-10">
        <div className="eyebrow flex items-center gap-2">
          {isPrivacy ? <Lock className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
          Last updated {LAST_UPDATED}
        </div>
        <h1 className="mt-3 text-[clamp(2rem,5vw,3rem)] font-extralight tracking-[-0.03em]">
          {isPrivacy ? "Privacy Policy" : "Security & Compliance"}
        </h1>
        <nav className="mt-4 flex gap-4 text-xs" aria-label="Legal documents">
          <a href="#/privacy" className={isPrivacy ? "text-primary" : "text-muted hover:text-foreground"}>Privacy Policy</a>
          <a href="#/security" className={!isPrivacy ? "text-primary" : "text-muted hover:text-foreground"}>Security</a>
        </nav>
        <div className="mt-6 text-sm leading-relaxed text-foreground/80">{isPrivacy ? <Privacy /> : <Security />}</div>
      </article>
    </main>
  );
}
