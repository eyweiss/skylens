import { Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer
      className="border-t mt-auto"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
    >
      <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
        <span className="text-sm" style={{ color: "var(--muted)" }}>
          E. Weiss · Market &amp; Competitive Intelligence Leader
        </span>
        <a
          href="https://www.linkedin.com/in/weisseyal/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70"
          style={{ color: "var(--accent)" }}
        >
          <Linkedin className="w-4 h-4" />
          <span>LinkedIn</span>
        </a>
      </div>
    </footer>
  );
}
