import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="py-16 text-center max-w-md mx-auto space-y-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto">
        <BookOpen className="h-6 w-6" />
      </div>
      <h1 className="text-2xl font-bold text-foreground">Page Not Found</h1>
      <p className="text-xs text-muted-foreground">
        The route you requested doesn't exist or has moved. Return to the Study Room to resume your interview prep.
      </p>
      <Link to="/learn">
        <Button size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Study Room
        </Button>
      </Link>
    </div>
  );
}
