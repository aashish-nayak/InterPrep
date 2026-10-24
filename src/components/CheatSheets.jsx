import React, { useState } from 'react';
import { FileText, Copy, Check, Printer, Sparkles, BookOpen, Database, Code2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';

export const CHEAT_SHEETS = [
  {
    id: 'php8',
    title: 'PHP 8.x Modern Syntax',
    category: 'PHP',
    icon: Code2,
    badge: 'PHP 8.0 - 8.3',
    sections: [
      {
        heading: 'Constructor Property Promotion',
        code: `// Old verbose syntax
class User {
    public string $name;
    public function __construct(string $name) { $this->name = $name; }
}

// PHP 8 promoted syntax
class User {
    public function __construct(public string $name, public readonly int $id) {}
}`
      },
      {
        heading: 'Nullsafe Operator & Coalescing',
        code: `// Safe navigation without nested isset()
$country = $user?->getAddress()?->getCountry() ?? 'Default';

// Matches expressions (strict type, returns value)
$message = match ($statusCode) {
    200, 201 => 'Success',
    404      => 'Not Found',
    500      => 'Server Error',
    default  => 'Unknown'
};`
      },
      {
        heading: 'Named Arguments & Union Types',
        code: `// Named arguments (skip optional defaults)
setcookie(name: 'auth_token', value: $token, secure: true, httponly: true);

// Union & Intersection types
function processPayment(int|float $amount): string|false { ... }`
      }
    ]
  },
  {
    id: 'laravel',
    title: 'Laravel Eloquent & Performance',
    category: 'Laravel',
    icon: BookOpen,
    badge: 'Framework Mastery',
    sections: [
      {
        heading: 'Eliminating the N+1 Query Trap',
        code: `// BAD: 101 queries (1 for posts, 100 for authors)
$posts = Post::all();
foreach ($posts as $p) { echo $p->author->name; }

// GOOD: Exactly 2 queries using eager loading
$posts = Post::with('author')->get();

// Eager loading with condition filtering
$posts = Post::with(['comments' => fn($q) => $q->where('approved', true)])->get();`
      },
      {
        heading: 'Safe Memory Processing (Chunking & Cursors)',
        code: `// Processing 100,000 records without exceeding memory limit
User::chunkById(500, function ($users) {
    foreach ($users as $user) {
        $user->sendDailyDigest();
    }
});

// Lazy Collection Cursor (single model memory hydration)
foreach (User::cursor() as $user) { ... }`
      },
      {
        heading: 'Database Transactions & Locks',
        code: `use Illuminate\\Support\\Facades\\DB;

DB::transaction(function () use ($fromUser, $toUser, $amount) {
    // Pessimistic locking (prevents race condition / double spend)
    $sender = User::where('id', $fromUser->id)->lockForUpdate()->first();
    $sender->decrement('balance', $amount);
    $toUser->increment('balance', $amount);
}, attempts: 3);`
      }
    ]
  },
  {
    id: 'sql',
    title: 'MySQL Indexing & Interview Rules',
    category: 'Database',
    icon: Database,
    badge: 'High Performance',
    sections: [
      {
        heading: 'Leftmost Prefix Rule for Composite Indexes',
        code: `-- If index is created as INDEX(status, created_at, user_id):
-- USE INDEX:
SELECT * FROM orders WHERE status = 'completed';
SELECT * FROM orders WHERE status = 'completed' AND created_at > '2024-01-01';

-- CANNOT USE INDEX (skips leading column):
SELECT * FROM orders WHERE created_at > '2024-01-01';`
      },
      {
        heading: 'Covering Index ("Using index")',
        code: `-- A covering index satisfies the query entirely from index memory,
-- completely skipping reading data pages from disk (Zero Table Lookups)!
CREATE INDEX idx_user_email_status ON users(email, status);

-- This query runs 10x - 100x faster:
SELECT email, status FROM users WHERE email = 'test@example.com';`
      },
      {
        heading: 'EXPLAIN Plan Quick Evaluation Reference',
        code: `-- Type Hierarchy (Best to Worst):
-- const    -> Primary key lookup (1 row) [FASTEST]
-- eq_ref   -> Unique index join
-- ref      -> Non-unique index lookup
-- range    -> Index range scan (BETWEEN, >, <, IN)
-- index    -> Full index scan
-- ALL      -> Full Table Scan [SLOWEST - Add Index immediately!]`
      }
    ]
  }
];

export default function CheatSheets() {
  const [activeSheetId, setActiveSheetId] = useState('php8');
  const [copiedSection, setCopiedSection] = useState(null);

  const activeSheet = CHEAT_SHEETS.find(s => s.id === activeSheetId) || CHEAT_SHEETS[0];

  const handleCopy = (code, index) => {
    navigator.clipboard?.writeText(code);
    setCopiedSection(index);
    setTimeout(() => setCopiedSection(null), 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-hairline bg-card/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Fast-Access Reference</span>
            <span>•</span>
            <span>Pre-Interview Refresh</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Emergency Interview Cheat Sheets
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Concise, single-page printable reference guides for syntax, Eloquent optimizations, and indexing rules.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-lg border border-hairline">
          {CHEAT_SHEETS.map(sheet => {
            const Icon = sheet.icon;
            const active = sheet.id === activeSheetId;
            return (
              <button
                key={sheet.id}
                onClick={() => setActiveSheetId(sheet.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                  active
                    ? "bg-bg text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{sheet.category}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Cheat Sheet Card */}
      <div className="rounded-xl border border-hairline bg-card p-6 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-hairline pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <activeSheet.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {activeSheet.title}
              </h3>
              <Badge variant="outline" className="text-[10px] mt-0.5">
                {activeSheet.badge}
              </Badge>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="text-xs h-8"
          >
            <Printer className="h-3.5 w-3.5 mr-1.5" />
            Print Sheet
          </Button>
        </div>

        {/* Sections List */}
        <div className="grid grid-cols-1 gap-6">
          {activeSheet.sections.map((sec, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <span className="text-primary">•</span>
                  <span>{sec.heading}</span>
                </h4>
                <button
                  onClick={() => handleCopy(sec.code, idx)}
                  className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copiedSection === idx ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-500" />
                      <span className="text-emerald-500">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3.5 rounded-lg bg-bg border border-hairline font-mono text-xs text-foreground overflow-x-auto whitespace-pre">
                {sec.code}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
