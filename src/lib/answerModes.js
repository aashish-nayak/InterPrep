// Helper to generate 30-Second Interview Pitches and Deep Architecture breakdowns
// for any interview question in InterPrep.

const TOPIC_PITCHES = {
  php: {
    tag: 'Spoken Pitch',
    elevatorTip: 'Speak with confidence: state definition in sentence 1, main benefit in sentence 2, and PHP 8.x modern note in sentence 3.'
  },
  oop: {
    tag: 'Design Philosophy Pitch',
    elevatorTip: 'Focus on maintainability, loose coupling, contracts over concrete classes, and SOLID principles.'
  },
  laravel: {
    tag: 'Architectural Pitch',
    elevatorTip: 'Explain lifecycle flow: Request -> Router -> Middleware -> Controller -> Eloquent -> Response.'
  },
  sql: {
    tag: 'Database Engineering Pitch',
    elevatorTip: 'Highlight performance, B-tree indexes, ACID compliance, and query cost optimization.'
  },
  scenarios: {
    tag: 'Senior Leader Pitch',
    elevatorTip: 'Frame answers around trade-offs, scalability, operational reliability, and team velocity.'
  },
  coding: {
    tag: 'Algorithm & Code Pitch',
    elevatorTip: 'State time complexity (O(N)), space complexity (O(1)), and edge cases (empty inputs, type bounds).'
  },
  patterns: {
    tag: 'Logic & Loops Pitch',
    elevatorTip: 'Explain the outer loop boundary (rows) and inner loop condition (columns/characters).'
  }
};

// Specialized 30s Pitches and Deep Architecture insights for key flagship questions
export const SPECIALIZED_ANSWERS = {
  1: {
    pitch: {
      en: "PHP is a server-side, interpreted scripting language specifically engineered for web development. When a client sends an HTTP request, the web server passes it to PHP-FPM, which executes the script, queries databases or external services, and returns dynamic HTML or JSON. In modern PHP 8.x, it features JIT compilation, strict types, and async capabilities.",
      hi: "PHP ek server-side scripting language hai jo web development ke liye design ki gayi hai. Jab client HTTP request bhejta hai, server PHP-FPM ke zariye code execute karta hai, database se data fetch karta hai aur dynamic HTML ya JSON response bhejta hai. PHP 8.x mein JIT compiler aur strict typing isse fast aur reliable banate hain."
    },
    deep: {
      en: "Under the hood, PHP uses the Zend Engine. PHP code is tokenized into AST (Abstract Syntax Tree), compiled into opcodes, and executed in the Zend VM. With OPcache enabled, compiled opcodes stay in shared memory, skipping parsing on subsequent requests. PHP 8 added tracing JIT, which compiles hot opcodes directly into native machine CPU instructions.",
      hi: "Zend Engine PHP ko chalaata hai. Code pehle tokens aur AST mein convert hota hai, phir opcodes mein compile hokar Zend VM mein execute hota hai. OPcache ki madad se ye opcodes shared memory mein cache ho jaate hain. PHP 8 mein Tracing JIT direct machine code generate karta hai jisse CPU-intensive tasks dramatically fast ho jaate hain."
    }
  },
  2: {
    pitch: {
      en: "A session is a server-side mechanism to maintain user state across stateless HTTP requests. When a user logs in, the server generates a unique session ID, stores the session data (in Redis, Memcached, or files), and sends only the session ID back to the browser in an HttpOnly cookie.",
      hi: "Session ek server-side feature hai jo stateless HTTP par user ka state yaad rakhta hai. Login hone par server ek unique Session ID banata hai, user data server memory/Redis mein rakhta hai, aur browser ko sirf ek secure HttpOnly cookie bhejta hai."
    },
    deep: {
      en: "Sessions solve HTTP statelessness. PHP writes session data via serialized files (default `/tmp/sess_*`) or customized Redis handlers (`session.save_handler = redis`). Because file-based sessions acquire an exclusive file lock (`session_start()`), concurrent AJAX requests from the same user can serialize and block unless `session_write_close()` is explicitly invoked.",
      hi: "PHP default roop se disk par session files lock karta hai. Jab tak request khatam nahi hoti, usi user ki dusri concurrent AJAX requests block ho sakti hain. Enterprise production mein Redis cluster use karke locking latency avoid ki jaati hai aur `session_write_close()` call karke lock jaldi release kiya jaata hai."
    }
  },
  3: {
    pitch: {
      en: "Cookies are client-side text files stored in the browser (limited to 4KB) and sent with every HTTP request in headers. Sessions store data securely on the server with virtually unlimited size, linking to the client only through an identifier cookie (`PHPSESSID`). Never store passwords or tokens in unencrypted cookies.",
      hi: "Cookies user ke browser mein store hoti hain (max 4KB) aur har request ke saath server par jaati hain. Sessions server par store hote hain (unlimited size) aur secure hote hain. Browser ke paas sirf ek session ID cookie rehti hai. Sensitive data hamesha session mein rakhna chahiye."
    },
    deep: {
      en: "Security boundaries: Cookies are vulnerable to XSS if not marked `HttpOnly`, and CSRF if missing `SameSite=Lax/Strict` and `Secure` attributes. Sessions protect the payload from client tampering, but are vulnerable to Session Fixation and Session Hijacking unless `session_regenerate_id(true)` is invoked immediately upon authentication.",
      hi: "Cookie security ke liye `HttpOnly`, `Secure` aur `SameSite` flags zaroori hain taaki XSS aur CSRF attacks na ho sakein. Sessions ko hijack hone se bachane ke liye login ke turant baad `session_regenerate_id(true)` chalana mandatory best-practice hai."
    }
  },
  69: { // N+1 Problem
    pitch: {
      en: "The N+1 problem happens when fetching a parent record with 1 query, and then fetching each related child record inside a loop with N additional queries. For 100 posts, that is 101 database queries! We fix it by eager loading relationships using Eloquent's `with('relation')`, reducing it to exactly 2 queries.",
      hi: "N+1 problem tab aati hai jab parent records 1 query se aate hain aur loop ke andar har child record ke liye alag query chalti hai. Agar 100 posts hain toh 101 queries ho jayengi! Isko theek karne ke liye hum Eloquent ka eager loading `with('relation')` use karte hain, jisse sirf 2 queries mein sara data aa jata hai."
    },
    deep: {
      en: "Eloquent eager loading executes `SELECT * FROM posts` followed by `SELECT * FROM authors WHERE id IN (...)`. In memory, Eloquent pairs authors to post models using foreign key maps. For nested relations, use `with(['comments.user'])`. In Laravel 9+, enable `Model::preventLazyLoading(!app()->isProduction())` to throw exceptions during development whenever an accidental N+1 occurs.",
      hi: "Eloquent under the hood `WHERE IN (...)` query chalata hai aur memory mein foreign keys match karke models hydrate karta hai. Laravel mein strict safety ke liye `Model::preventLazyLoading()` enable kar sakte hain jo local development mein N+1 aate hi error throw karke alert kar deta hai."
    }
  },
  74: { // Service Container
    pitch: {
      en: "The Laravel Service Container is a dependency injection container and the heart of the framework. It manages class dependencies and instantiation. Instead of manually using `new Service()`, you type-hint the interface in a controller or job, and the container automatically resolves and injects the dependency using PHP reflection.",
      hi: "Laravel Service Container framework ka dil hai jo dependency injection handle karta hai. Manually `new Class()` likhne ke bajaye aap controller constructor mein interface type-hint karte hain, aur container automatic reflection ke zariye dependencies resolve karke inject kar deta hai."
    },
    deep: {
      en: "Under the hood, `Illuminate\\Container\\Container` inspects class constructors using `ReflectionClass` and `ReflectionParameter`. If a parameter is an interface, it checks bindings registered via `bind()` (new instance every time) or `singleton()` (cached instance). It recursively resolves nested dependencies down the dependency tree.",
      hi: "Container PHP Reflection API se constructor parameters check karta hai. Agar interface bound hai toh provider bindings (`bind` ya `singleton`) se concrete implementation nikalta hai aur recursive resolution karke final object return karta hai."
    }
  }
};

/**
 * Returns formatted content for a given question based on depth mode
 * @param {object} question - Question object from questions.json
 * @param {'standard' | 'pitch' | 'deep'} mode - Answer depth mode
 * @param {'en' | 'hi'} lang - Language code
 */
export function getAnswerForMode(question, mode, lang = 'en') {
  if (!question) return '';
  if (mode === 'standard') {
    return question.answer?.[lang] || question.answer?.en || '';
  }

  const specialized = SPECIALIZED_ANSWERS[question.id];
  if (specialized && specialized[mode]?.[lang]) {
    return specialized[mode][lang];
  }

  // Fallback synthetic high-grade pitch or architectural deep-dive
  const topicMeta = TOPIC_PITCHES[question.category] || TOPIC_PITCHES.php;
  const rawText = (question.answer?.[lang] || question.answer?.en || '').trim();
  
  // Extract key sentences
  const cleanSentences = rawText
    .replace(/```[\s\S]*?```/g, '') // remove code blocks
    .split(/(?<=[.!?])\s+/)
    .filter(s => s.trim().length > 15);

  if (mode === 'pitch') {
    const firstTwo = cleanSentences.slice(0, 2).join(' ');
    if (lang === 'hi') {
      return `**🎯 30-Second Interview Pitch (${topicMeta.tag}):**\n\n${firstTwo || rawText}\n\n> 💡 **Interview Tip:** ${topicMeta.elevatorTip}`;
    }
    return `**🎯 30-Second Interview Pitch (${topicMeta.tag}):**\n\n${firstTwo || rawText}\n\n> 💡 **Interviewer Pro-Tip:** ${topicMeta.elevatorTip}`;
  }

  if (mode === 'deep') {
    if (lang === 'hi') {
      return `**🔬 Deep Architectural Breakdown:**\n\n${rawText}\n\n**Underlying Mechanics & Trade-offs:**\n- **Memory & Execution:** Runtime allocation and lifecycle impact.\n- **Scalability:** How this behaves when handling high-concurrency production requests.\n- **Production Best Practice:** Always profile queries/memory usage before pushing to production.`;
    }
    return `**🔬 Deep Architectural Breakdown:**\n\n${rawText}\n\n**Underlying Mechanics & Trade-offs:**\n- **Memory & Lifecycle:** Evaluates stack vs heap allocation and lifecycle lifetime across requests.\n- **Scalability & Concurrency:** Eliminates blocking I/O bottlenecks and optimizes cache hit ratios.\n- **Production Best Practice:** Enforce strict typing and test against edge-case volumetric loads.`;
  }

  return rawText;
}
