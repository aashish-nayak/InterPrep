// Spaced Repetition & Daily 10 Algorithm
// Implements a local-first Leitner-inspired review queue and habit streak tracker.

const STORAGE_KEY = 'interprep_spaced_repetition_v1';

function getTodayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getStreakData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { currentStreak: 1, lastActiveDate: getTodayString(), reviewedToday: [] };
    }
    const data = JSON.parse(raw);
    const today = getTodayString();
    
    // Check if streak is continued, broken, or today
    let streak = data.currentStreak || 1;
    let reviewedToday = Array.isArray(data.reviewedToday) ? data.reviewedToday : [];

    if (data.lastActiveDate !== today) {
      const last = new Date(data.lastActiveDate);
      const curr = new Date(today);
      const diffDays = Math.floor((curr - last) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Consecutive day
        streak += 1;
      } else if (diffDays > 1) {
        // Streak broken
        streak = 1;
      }
      reviewedToday = []; // reset for the new day
    }

    return {
      currentStreak: Math.max(1, streak),
      lastActiveDate: today,
      reviewedToday
    };
  } catch {
    return { currentStreak: 1, lastActiveDate: getTodayString(), reviewedToday: [] };
  }
}

export function recordQuestionReviewed(id) {
  try {
    const current = getStreakData();
    const today = getTodayString();
    const set = new Set(current.reviewedToday);
    set.add(Number(id));

    const updated = {
      currentStreak: current.currentStreak,
      lastActiveDate: today,
      reviewedToday: Array.from(set)
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return null;
  }
}

/**
 * Computes the smart "Today's 10" deck
 * Priority order:
 * 1. Questions marked 'review'
 * 2. Questions saved/bookmarked
 * 3. Unread/unvisited questions
 * 4. Mastered questions (for spaced retention)
 */
export function getDailyDeck(questions, progress = {}, saved = [], limit = 10) {
  if (!questions || !questions.length) return [];

  const reviewDue = [];
  const bookmarked = [];
  const unread = [];
  const mastered = [];

  for (const q of questions) {
    const status = progress[q.id];
    if (status === 'review') {
      reviewDue.push({ question: q, reason: 'Needs Review' });
    } else if (saved.includes(q.id) && !status) {
      bookmarked.push({ question: q, reason: 'Saved Question' });
    } else if (!status) {
      unread.push({ question: q, reason: 'New Concept' });
    } else if (status === 'learned') {
      mastered.push({ question: q, reason: 'Spaced Recall' });
    }
  }

  const selected = [];
  const seenIds = new Set();

  function addCandidates(list, max) {
    let count = 0;
    for (const item of list) {
      if (selected.length >= limit || count >= max) break;
      if (!seenIds.has(item.question.id)) {
        seenIds.add(item.question.id);
        selected.push(item);
        count++;
      }
    }
  }

  // 1. Take up to 4 questions needing review
  addCandidates(reviewDue, 4);
  // 2. Take up to 2 bookmarked questions
  addCandidates(bookmarked, 2);
  // 3. Take up to 3 fresh new questions
  addCandidates(unread, 3);
  // 4. Fill remainder with mastered spaced recall
  addCandidates(mastered, limit - selected.length);
  // 5. If still not full, grab any unread
  if (selected.length < limit) {
    addCandidates(unread, limit - selected.length);
  }

  return selected;
}
