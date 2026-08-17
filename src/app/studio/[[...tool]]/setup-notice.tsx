/**
 * Shown at /studio before a Sanity project has been connected.
 *
 * A blank screen or a stack trace here would be the worst possible first
 * impression of the CMS, so the route explains itself and gives the two
 * commands that finish the job.
 */
export function SetupNotice() {
  const steps = [
    {
      n: "01",
      title: "Create the project",
      body: "Run this once, from the project folder. It will open a browser to sign in, then ask you to name the project — call it Ink Hotels — and to choose a dataset; accept the default, production.",
      code: "npx sanity@latest init --env",
    },
    {
      n: "02",
      title: "Check what it wrote",
      body: "That command creates .env.local with the project id and dataset. Nothing else needs editing.",
      code: "NEXT_PUBLIC_SANITY_PROJECT_ID=…\nNEXT_PUBLIC_SANITY_DATASET=production",
    },
    {
      n: "03",
      title: "Fill it with the site as it stands",
      body: "Uploads the photographs and creates every room, experience, chapter and setting from the current website, in all five languages. Takes a few minutes. Needs a write token — create one at sanity.io/manage under API → Tokens, with Editor permission, and add it to .env.local as SANITY_API_TOKEN.",
      code: "npm run cms:seed",
    },
    {
      n: "04",
      title: "Reload this page",
      body: "The Studio appears here, already populated. Nothing on the public site changes until you edit something.",
      code: null,
    },
  ];

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#1A1512",
          color: "#FAF5EA",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          lineHeight: 1.6,
          padding: "clamp(2rem, 6vw, 5rem)",
        }}
      >
        <main style={{ maxWidth: "44rem", margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: "0.6875rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "#F5C97B",
              marginBottom: "1.5rem",
            }}
          >
            Ink Hotels · Content
          </p>

          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              lineHeight: 1.05,
              margin: "0 0 1.25rem",
              fontWeight: 500,
            }}
          >
            The CMS is built. It just needs a project to talk to.
          </h1>

          <p style={{ color: "rgba(250,245,234,0.75)", margin: "0 0 3rem" }}>
            Everything is in place — the schemas, this Studio, the migration.
            Connecting a Sanity project is the one step that needs an account,
            and takes about two minutes. The website is running normally in the
            meantime and will keep running on its built-in content until you
            choose to switch.
          </p>

          <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {steps.map((s) => (
              <li
                key={s.n}
                style={{
                  borderTop: "1px solid rgba(250,245,234,0.15)",
                  padding: "1.75rem 0",
                }}
              >
                <div style={{ display: "flex", gap: "1.25rem" }}>
                  <span
                    style={{
                      fontFamily: "ui-monospace, monospace",
                      fontSize: "0.8125rem",
                      color: "rgba(250,245,234,0.4)",
                      paddingTop: "0.2rem",
                    }}
                  >
                    {s.n}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2
                      style={{
                        fontSize: "1.125rem",
                        margin: "0 0 0.5rem",
                        fontWeight: 600,
                      }}
                    >
                      {s.title}
                    </h2>
                    <p
                      style={{
                        margin: "0 0 1rem",
                        color: "rgba(250,245,234,0.7)",
                        fontSize: "0.9375rem",
                      }}
                    >
                      {s.body}
                    </p>
                    {s.code && (
                      <pre
                        style={{
                          background: "rgba(250,245,234,0.06)",
                          border: "1px solid rgba(250,245,234,0.12)",
                          padding: "0.85rem 1rem",
                          margin: 0,
                          overflowX: "auto",
                          fontFamily: "ui-monospace, monospace",
                          fontSize: "0.8125rem",
                          color: "#F5C97B",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {s.code}
                      </pre>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <p
            style={{
              borderTop: "1px solid rgba(250,245,234,0.15)",
              paddingTop: "1.75rem",
              marginTop: 0,
              fontSize: "0.875rem",
              color: "rgba(250,245,234,0.55)",
            }}
          >
            Full detail in <code>README.md</code>, under “Content management”.
          </p>
        </main>
      </body>
    </html>
  );
}
