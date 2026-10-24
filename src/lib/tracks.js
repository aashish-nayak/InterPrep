// Curated Job-Ready Interview Tracks for InterPrep

export const INTERVIEW_TRACKS = [
  {
    id: 'all',
    title: 'All Curriculum',
    short: 'All',
    badge: '137 Questions',
    description: 'The complete bilingual interview bank across all 7 technical topics.',
    filter: (q) => true
  },
  {
    id: 'crash48',
    title: '48-Hour Crash Course',
    short: '⚡ 48h Crash',
    badge: 'High Priority',
    color: 'amber',
    description: 'The top 30 non-negotiable questions most frequently asked in technical screenings.',
    filter: (q) => [
      1, 2, 3, 4, 5, 7, 9, 11, 14, 21, 25, 33, 40, 47, 50, 
      60, 69, 70, 72, 74, 78, 80, 85, 90, 95, 100, 105, 112, 120, 125
    ].includes(q.id)
  },
  {
    id: 'junior',
    title: 'Junior Backend Developer',
    short: 'Junior (0-2 Yrs)',
    badge: 'Foundations',
    color: 'emerald',
    description: 'Syntax essentials, PHP 8 type coercion, basic OOP, array/string manipulation and CRUD SQL.',
    filter: (q) => q.category === 'php' || q.category === 'coding' || (q.category === 'sql' && q.id <= 95)
  },
  {
    id: 'senior',
    title: 'Senior Laravel Architect',
    short: 'Senior (5+ Yrs)',
    badge: 'Advanced',
    color: 'purple',
    description: 'Dependency injection, service container internals, N+1 resolution, queues, transactions and system trade-offs.',
    filter: (q) => q.category === 'laravel' || q.category === 'scenarios' || q.category === 'oop' || [69, 70, 72, 74, 75, 78, 80].includes(q.id)
  },
  {
    id: 'database',
    title: 'SQL & Database Specialist',
    short: 'SQL Master',
    badge: 'Database',
    color: 'blue',
    description: 'Complex JOINs, B-Tree indexes, transaction isolation levels, EXPLAIN execution plans, and schema design.',
    filter: (q) => q.category === 'sql' || [88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102].includes(q.id)
  }
];

export function getQuestionsForTrack(questions, trackId) {
  const track = INTERVIEW_TRACKS.find(t => t.id === trackId) || INTERVIEW_TRACKS[0];
  return questions.filter(track.filter);
}
