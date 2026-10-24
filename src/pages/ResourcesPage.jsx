import React from 'react';
import { Library, ExternalLink, FileText, BookMarked, Info } from 'lucide-react';
import { GlowCard } from '../components/lightwind/glow-card';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import CheatSheets from '../components/CheatSheets';

export default function ResourcesPage() {
  const resources = [
    {
      file: 'updated-guide.md',
      title: 'Updated Senior Developer Guide',
      desc: '125 structured questions, coding challenges, and concise Hindi/English explanations.',
      badge: 'Primary Curriculum',
    },
    {
      file: 'original-questions.md',
      title: 'Original PHP, Laravel & MySQL Collection',
      desc: 'The original reference archive, preserved with supplemental real-world topics.',
      badge: 'Archive Reference',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Interactive Emergency Cheat Sheets */}
      <CheatSheets />

      {/* Source Reference Archives */}
      <div className="space-y-6 pt-4 border-t border-hairline">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            <span>Source Reference</span>
            <span>•</span>
            <span>Curated Notes</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
            Original Curriculum Archives
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-xl">
            Both foundational interview guides inform this study workspace. The complete underlying markdown documents are preserved here for reference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map(res => (
            <a
              key={res.file}
              href={`/sources/${res.file}`}
              target="_blank"
              rel="noreferrer"
              className="group block"
            >
              <GlowCard className="p-6 h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {res.badge}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                      {res.title}
                      <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {res.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="font-mono">/sources/{res.file}</span>
                  <span className="text-primary font-medium group-hover:translate-x-0.5 transition-transform">
                    Open Markdown →
                  </span>
                </div>
              </GlowCard>
            </a>
          ))}
        </div>

        {/* Content Editorial Note Card */}
        <Card className="p-6 space-y-3 border-l-4 border-l-primary bg-secondary/30">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Info className="h-4 w-4 text-primary" />
            A Note on Curriculum Material & Adaptations
          </div>
          <div className="text-xs text-muted-foreground space-y-2 leading-relaxed">
            <p>
              Study explanations are adapted, not verbatim translations. Conflicting or outdated claims in older sources have been verified against current PHP 8.3 & Laravel 11 official documentation.
            </p>
            <p>
              <strong>Technical Note on Increment Operators:</strong> Mixed increment expressions ($x = $x++ + ++$x) are explained using separated statements because PHP does not define a general evaluation order across sub-expressions.
            </p>
          </div>
          <a
            href="https://www.php.net/manual/en/language.operators.precedence.php"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline pt-1"
          >
            Official PHP Operator Precedence Reference <ExternalLink className="h-3 w-3" />
          </a>
        </Card>
      </div>
    </div>
  );
}
