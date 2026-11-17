/**
 * Page transition. A template remounts on every navigation, so this CSS
 * animation replays per page. CSS (not JS) keeps first paint unblocked.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}
