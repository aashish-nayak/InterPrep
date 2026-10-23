// Curated Question Bank & Adaptive Question Mapper for Mock Interview
// Types:
// 1. 'mcq': Multiple Choice Question (4 choices, correctIndex, explanation)
// 2. 'code': Interactive Coding Challenge (starterCode, solutionCode, task, expectedOutput)
// 3. 'open': Scenario / Architectural discussion (talking points guide, canonical answer)

export const CURATED_MCQS = {
  1: {
    type: 'mcq',
    options: {
      en: [
        'A server-side scripting language designed to process requests, interact with databases, and return HTML/JSON',
        'A client-side styling engine compiled directly into browser DOM trees',
        'A relational database management system created to replace MySQL in enterprise servers',
        'A desktop GUI compiler that generates Windows and Linux native binaries'
      ],
      hi: [
        'Server-side scripting language jo requests process karti hai, database se baat karti hai aur HTML/JSON deti hai',
        'Client-side browser engine jo direct browser DOM ko render karta hai',
        'Relational database engine jo MySQL ko replace karne ke liye banaya gaya tha',
        'Desktop GUI application compiler jo native binary files banata hai'
      ]
    },
    correctIndex: 0,
    explanation: {
      en: 'PHP (Hypertext Preprocessor) is an open-source server-side scripting language executed on the server before sending output to the browser.',
      hi: 'PHP ek server-side language hai jo server par execute hoti hai aur client browser ko processed HTML ya JSON response bhejti hai.'
    }
  },
  2: {
    type: 'mcq',
    options: {
      en: [
        'Data stored permanently on the client device inside IndexedDB',
        'Server-side storage of user state identified via a unique session ID cookie in the browser',
        'A temporary MySQL connection pool recycled per HTTP request',
        'Encrypted credentials cached in the router DNS cache'
      ],
      hi: [
        'Client device par IndexedDB mein store hone wala permanent data',
        'Server-side state storage jise browser session ID cookie ke zariye identify karta hai',
        'Ek temporary MySQL database connection pool',
        'Router DNS cache mein store hone wala encrypted authentication token'
      ]
    },
    correctIndex: 1,
    explanation: {
      en: 'HTTP is stateless. A session keeps state on the server (file/redis/database) while the client holds only an identifier cookie.',
      hi: 'HTTP stateless hota hai. Session server par data store karta hai aur user ke browser mein sirf ek session ID cookie rehti hai.'
    }
  },
  3: {
    type: 'mcq',
    options: {
      en: [
        'Cookies are stored on client browser and sent with requests; sessions store data on the server referenced by an ID',
        'Cookies are encrypted server files; sessions are client-side text files',
        'Cookies have no size limits; sessions are restricted to 4KB total memory',
        'Sessions expire immediately upon closing any tab; cookies never expire'
      ],
      hi: [
        'Cookie client browser mein store hoti hai aur requests ke saath jaati hai; Session data server par rehta hai',
        'Cookie encrypted server file hai; Session client text file hoti hai',
        'Cookie ka size unlimited hota hai; Session maximum 4KB ka ho sakta hai',
        'Session har tab close karne par turant delete ho jata hai'
      ]
    },
    correctIndex: 0,
    explanation: {
      en: 'Cookies reside on the client and are sent automatically in headers. Because clients can tamper with cookies, sensitive session data belongs on the server.',
      hi: 'Cookie browser mein hoti hai jise user modify kar sakta hai, isliye sensitive data hamesha server session mein rakhna chahiye.'
    }
  },
  4: {
    type: 'mcq',
    options: {
      en: [
        'Variables start with $ and can be modified; constants are defined once and cannot be changed during execution',
        'Constants start with $$; variables have no prefix in PHP 8',
        'Variables can only hold scalar strings; constants hold complex object instances',
        'Variables are globally scoped across requests; constants are strictly function-scoped'
      ],
      hi: [
        'Variable $ se shuru hote hain aur change ho sakte hain; Constant define hone ke baad change nahi ho sakte',
        'Constant $$ se shuru hote hain; variable bina prefix ke hote hain',
        'Variable sirf text store karte hain; constant objects store karte hain',
        'Variable global hote hain; constant sirf function ke andar kaam karte hain'
      ]
    },
    correctIndex: 0,
    explanation: {
      en: 'Variables are mutable and prefixed with `$`. Constants (via `const` or `define()`) cannot be reassigned once declared.',
      hi: 'Variables mutable hote hain aur unme $ lagta hai. Constants immutable hote hain aur script execution ke dauran change nahi ho sakte.'
    }
  },
  5: {
    type: 'mcq',
    options: {
      en: [
        'GET appends parameters in the URL query string; POST transmits payload in the HTTP request body',
        'GET is encrypted by SSL by default; POST sends plaintext over the wire',
        'GET has an unlimited payload size; POST is strictly capped at 2048 characters',
        'GET should be used for data modifications (INSERT/UPDATE); POST only for fetching data'
      ],
      hi: [
        'GET parameters URL mein bhejta hai; POST payload HTTP request body ke andar bhejta hai',
        'GET automatically encrypted hota hai; POST plaintext bhejta hai',
        'GET ka size unlimited hota hai; POST sirf 2048 characters tak restrict hota hai',
        'GET database update ke liye use hota hai; POST sirf data read karne ke liye'
      ]
    },
    correctIndex: 0,
    explanation: {
      en: 'GET is idempotent and visible in URL query strings (subject to URL length limits and caching). POST carries data in the message body, suitable for state-changing operations and sensitive inputs.',
      hi: 'GET URL query string mein data bhejta hai aur bookmark/cache ho sakta hai. POST body mein bhejta hai, jo sensitive data aur state changes ke liye behtar hai.'
    }
  },
  6: {
    type: 'mcq',
    options: {
      en: [
        'Double quotes parse variable interpolation ($var) and escape codes (\\n); single quotes treat text as literal strings',
        'Single quotes parse variables faster than double quotes',
        'Double quotes are deprecated in PHP 8.2 in favor of heredoc syntax',
        'Single quotes support variable interpolation ($name), while double quotes throw a syntax error'
      ],
      hi: [
        'Double quotes variable interpolation ($var) aur escape sequence (\\n) parse karte hain; single quotes text ko literal rakhte hain',
        'Single quotes variable ko double quotes se fast parse karte hain',
        'PHP 8.2 mein double quotes deprecate ho chuke hain',
        'Single quotes variable parse karte hain, double quotes nahi karte'
      ]
    },
    correctIndex: 0,
    explanation: {
      en: 'Double-quoted strings `"Hello $name\\n"` evaluate variables and escape sequences. Single-quoted strings `\'Hello $name\\n\'` are literal.',
      hi: 'Double quotes mein variables aur escape sequences evaluate hote hain, jabki single quotes string ko bilkul literal treat karta hai.'
    }
  },
  7: {
    type: 'mcq',
    options: {
      en: [
        'echo is a language construct with no return value and accepts multiple arguments; print always returns 1',
        'print is a function that can take multiple comma-separated arguments, while echo cannot',
        'echo is 10 times slower than print because of output buffering overhead',
        'print is deprecated in PHP 8.3 in favor of printf'
      ],
      hi: [
        'echo ka koi return value nahi hota aur multiple arguments le sakta hai; print hamesha 1 return karta hai',
        'print multiple arguments comma se le sakta hai, echo nahi le sakta',
        'echo print se 10 guna slow hota hai',
        'PHP 8.3 mein print deprecate ho gaya hai'
      ]
    },
    correctIndex: 0,
    explanation: {
      en: '`echo` does not return a value and can take comma-separated expressions. `print` behaves like an expression that always returns integer `1`, making it marginally slower.',
      hi: 'echo koi value return nahi karta aur multiple arguments le sakta hai. print hamesha 1 return karta hai isliye use expressions mein use kiya ja sakta hai.'
    }
  },
  8: {
    type: 'mcq',
    options: {
      en: [
        'include throws an E_WARNING and continues execution; require throws a fatal E_COMPILE_ERROR and stops the script',
        'require skips missing files silently, while include halts the application immediately',
        'include is for PHP files; require is only for HTML templates',
        'require loads the file into GPU memory; include loads it into CPU memory'
      ],
      hi: [
        'include missing file par Warning dekar script continue karta hai; require Fatal Error dekar script rok deta hai',
        'require missing file ko ignore karta hai, include script stop kar deta hai',
        'include sirf PHP files ke liye hota hai; require HTML templates ke liye',
        'require file ko GPU memory mein load karta hai'
      ]
    },
    correctIndex: 0,
    explanation: {
      en: 'Use `require` when the file is essential to the application flow (e.g. database config, autoloader), so it fails loudly if missing.',
      hi: 'Critical files ke liye require use karna chahiye taaki missing file hone par application turant stop ho aur undefined errors na aayein.'
    }
  },
  10: {
    type: 'mcq',
    options: {
      en: [
        '== performs loose equality with type juggling; === performs strict equality checking both value and data type',
        '=== converts both operands to string before comparison; == does not',
        '== checks object references in memory; === checks array keys',
        'There is no difference in PHP 8.0+'
      ],
      hi: [
        '== type conversion (juggling) karke value match karta hai; === value aur data type dono strictly check karta hai',
        '=== dono operands ko string mein badal kar compare karta hai',
        '== memory reference check karta hai; === sirf array keys check karta hai',
        'PHP 8.0 ke baad in dono mein koi farq nahi hai'
      ]
    },
    correctIndex: 0,
    explanation: {
      en: '`==` coerces types (e.g. `0 == "0"` is true). `===` checks both the type and the value without coercion (e.g. `0 === "0"` is false). Always prefer `===`.',
      hi: '== type conversion karta hai jabki === bina type badle check karta hai ki value aur type dono exact match hain ya nahi.'
    }
  },
  18: {
    type: 'mcq',
    options: {
      en: [
        'Pass by value creates an isolated copy; pass by reference (&) allows the function to modify the caller\'s original variable',
        'Pass by reference makes the variable read-only inside the function',
        'Pass by reference is deprecated in PHP 8 and replaced with global pointers',
        'Pass by value only works for arrays, while pass by reference only works for integers'
      ],
      hi: [
        'Pass by value copy banata hai; Pass by reference (&) function ko original variable modify karne ki permission deta hai',
        'Pass by reference variable ko function ke andar read-only bana deta hai',
        'Pass by reference PHP 8 mein khatam ho chuka hai',
        'Pass by value sirf arrays ke liye hota hai aur reference sirf numbers ke liye'
      ]
    },
    correctIndex: 0,
    explanation: {
      en: 'Prepending `&` to a parameter (`function foo(&$bar)`) binds the parameter to the original variable, so mutations affect the caller.',
      hi: 'Function parameter mein & lagane se original variable ka reference pass hota hai, jisse function ke andar ka change bahar bhi reflect hota hai.'
    }
  },
  36: {
    type: 'mcq',
    options: {
      en: [
        'public is accessible anywhere; protected is accessible within class and subclasses; private only within the declaring class',
        'private is accessible to all child classes; protected is strictly local to the method',
        'public variables cannot be inherited by subclasses',
        'protected methods can be called directly from outside the class instance'
      ],
      hi: [
        'public har jagah access hota hai; protected class aur child class mein; private sirf usi declaring class mein',
        'private child classes mein accessible hota hai; protected sirf function ke andar',
        'public variables child class inherit nahi kar sakti',
        'protected methods ko direct object instance se call kiya ja sakta hai'
      ]
    },
    correctIndex: 0,
    explanation: {
      en: 'Public = anywhere; Protected = defining class + subclasses; Private = declaring class only.',
      hi: 'Public sabhi jagah se accessible hai, Protected class aur uske subclasses mein, aur Private sirf usi class ke andar accessible hota hai.'
    }
  },
  37: {
    type: 'mcq',
    options: {
      en: [
        'Interfaces specify method signatures with no implementation (multiple allowed); abstract classes can have concrete methods and state (single inheritance)',
        'A class can implement only one interface, but extend multiple abstract classes',
        'Abstract classes cannot define constructor methods in PHP',
        'Interfaces allow defining protected and private properties'
      ],
      hi: [
        'Interface sirf method signatures define karta hai (multiple allowed); Abstract class concrete code aur state bhi rakh sakti hai (single inheritance)',
        'Ek class sirf ek interface implement kar sakti hai, lekin multiple abstract classes extend kar sakti hai',
        'Abstract class mein constructor nahi ho sakta',
        'Interface ke andar private aur protected properties allow hoti hain'
      ]
    },
    correctIndex: 0,
    explanation: {
      en: 'PHP supports single class inheritance (`extends`), but a class can implement multiple `interface`s. Abstract classes provide shared base code; interfaces guarantee public contracts.',
      hi: 'PHP mein ek class multiple interfaces implement kar sakti hai, par abstract class sirf ek hi extend kar sakti hai.'
    }
  },
  41: {
    type: 'mcq',
    options: {
      en: [
        'Traits allow horizontal code reuse across independent class hierarchies without multiple inheritance',
        'Traits are interfaces that can be instantiated with `new` keyword',
        'Traits replace dependency injection containers in Laravel',
        'Traits can only contain static database migration scripts'
      ],
      hi: [
        'Traits horizontal code reuse provide karte hain bina multiple inheritance ki zaroorat ke',
        'Traits aisi interfaces hain jinhe new keyword se instantiate kiya ja sakta hai',
        'Traits Laravel ke dependency injection ko replace karte hain',
        'Traits sirf database migration scripts store karne ke liye use hote hain'
      ]
    },
    correctIndex: 0,
    explanation: {
      en: 'Traits (`use HasApiTokens, Notifiable;`) share methods across different classes when class inheritance does not fit naturally.',
      hi: 'Traits classes ke beech methods share karne ka tarika hai, jisse unrelated classes bhi same helper methods use kar sakein.'
    }
  },
  61: {
    type: 'mcq',
    options: {
      en: [
        'Routes forward requests to controllers; Controllers coordinate models and return views or JSON responses',
        'Routes talk directly to the database; Controllers only store CSS styles',
        'Controllers define the URL paths; Routes validate SQL table schemas',
        'Routes compile Blade templates into WebAssembly binaries'
      ],
      hi: [
        'Routes incoming HTTP request ko controller tak bhejte hain; Controller logic process karke view ya JSON response return karta hai',
        'Routes direct database se connect hote hain; Controller sirf CSS files manage karta hai',
        'Controllers URL define karte hain; Routes SQL schema check karte hain',
        'Routes Blade templates ko WebAssembly mein compile karte hain'
      ]
    },
    correctIndex: 0,
    explanation: {
      en: 'Routes (in `routes/web.php` or `routes/api.php`) map HTTP verbs and paths to Controller actions, keeping URL design decoupled from business logic.',
      hi: 'Routes HTTP request ko receive karke sahi Controller method ko delegate karte hain jahan actual business logic execute hoti hai.'
    }
  },
  62: {
    type: 'mcq',
    options: {
      en: [
        'Middleware inspects, modifies, or filters incoming HTTP requests before reaching the controller (e.g. auth, CSRF, throttling)',
        'Middleware compiles PHP code into C++ machine code before deploying to production',
        'Middleware is a database table that stores user sessions permanently',
        'Middleware replaces the Apache/Nginx web server process'
      ],
      hi: [
        'Middleware HTTP requests ko controller tak pahunchne se pehle inspect aur filter karta hai (jaise Auth, CSRF, Rate Limiting)',
        'Middleware PHP code ko C++ machine code mein compile karta hai',
        'Middleware ek database table hai jo user sessions store karti hai',
        'Middleware web server process ko completely replace karta hai'
      ]
    },
    correctIndex: 0,
    explanation: {
      en: 'Middleware acts as a pipeline around your controllers. If a request lacks authentication or fails validation, middleware can short-circuit and redirect immediately.',
      hi: 'Middleware ek protective layer ki tarah kaam karta hai jo unauthorized requests ko controller tak jaane se pehle hi block kar deta hai.'
    }
  },
  64: {
    type: 'mcq',
    options: {
      en: [
        'Active Record pattern where each model class represents a database table and an instance represents a single row',
        'A raw query parser that bypasses PDO for direct socket connections',
        'A microservice framework that runs outside PHP on a Node.js daemon',
        'A frontend state management library for React and Vue'
      ],
      hi: [
        'Active Record pattern jisme model class database table ko aur uska instance ek single row ko represent karta hai',
        'Ek raw query parser jo direct socket connections use karta hai',
        'Ek Node.js daemon jo background mein chalta hai',
        'Frontend state management library'
      ]
    },
    correctIndex: 0,
    explanation: {
      en: 'Eloquent ORM maps database tables to PHP models with expressive relationship definitions (`hasMany`, `belongsTo`) and query builder integration.',
      hi: 'Eloquent Active Record pattern follow karta hai jisse database rows ko PHP objects ki tarah create, update aur query kiya ja sakta hai.'
    }
  },
  68: {
    type: 'mcq',
    options: {
      en: [
        'Executing 1 query for the parent records, then N separate queries in a loop for related records; solve using Eager Loading with()',
        'Writing 1 query that takes N milliseconds to execute in MySQL',
        'A hardware failure where N database connections fail simultaneously',
        'A loop that inserts N records without auto-increment IDs'
      ],
      hi: [
        'Parent records ke liye 1 query aur loop ke andar har record ke relation ke liye N queries chalana; ise eager loading with() se solve karte hain',
        'MySQL mein 1 aisi query chalana jo N milliseconds leti ho',
        'Database connections ka crash ho jana',
        'N records bina primary key ke insert karna'
      ]
    },
    correctIndex: 0,
    explanation: {
      en: 'When looping over `$posts` and accessing `$post->author`, lazy loading executes a query per post (N+1). Use `Post::with(\'author\')->get()` to solve it in 2 queries.',
      hi: 'Loop mein relation access karne par har row ke liye nayi query chalti hai. `with(\'relation\')` use karke sirf do queries mein saara data load ho jata hai.'
    }
  },
  93: {
    type: 'mcq',
    options: {
      en: [
        'INNER JOIN returns only matching rows from both tables; LEFT JOIN returns all rows from the left table plus matched rows from the right',
        'LEFT JOIN deletes rows that do not have a match in the right table',
        'INNER JOIN returns all rows from both tables regardless of match (cartesian product)',
        'There is no difference in MySQL InnoDB engine'
      ],
      hi: [
        'INNER JOIN sirf matching rows deta hai; LEFT JOIN left table ki saari rows deta hai chahe right table mein match ho ya na ho',
        'LEFT JOIN un rows ko delete kar deta hai jo right table mein nahi milti',
        'INNER JOIN bina condition ke cartesian product return karta hai',
        'MySQL InnoDB engine mein inka output same hota hai'
      ]
    },
    correctIndex: 0,
    explanation: {
      en: 'An INNER JOIN filters out records without matches. A LEFT JOIN keeps all records from the left table, filling unmatched right-side columns with NULL.',
      hi: 'INNER JOIN mein dono tables ka match hona zaroori hai. LEFT JOIN left table ke saare records preserve karta hai.'
    }
  },
  96: {
    type: 'mcq',
    options: {
      en: [
        'B-Tree indexes speed up WHERE filtering, sorting and JOINs, but add storage overhead and slow down INSERT/UPDATE writes',
        'Indexes guarantee that table data cannot be corrupted during server reboot',
        'Indexes convert all VARCHAR columns into INT columns automatically',
        'Indexes make write queries 100x faster by bypassing disk caching'
      ],
      hi: [
        'Index search (WHERE, JOIN, ORDER BY) ko fast karta hai, lekin INSERT/UPDATE ko thoda slow karta hai aur storage leta hai',
        'Index data corruption se bachata hai',
        'Index sabhi text columns ko number mein convert kar deta hai',
        'Index write queries ko fast karta hai'
      ]
    },
    correctIndex: 0,
    explanation: {
      en: 'Indexes allow the query engine to find rows without full table scans, but every INSERT, UPDATE or DELETE must also update the index tree.',
      hi: 'Index search queries ko speed-up karta hai par write operations par extra cost lagti hai kyunki index tree ko bhi update karna padta hai.'
    }
  }
};

// Curated interactive coding challenges with live execution
export const CURATED_CODE_CHALLENGES = {
  46: {
    type: 'code',
    task: {
      en: 'Inspect or edit the snippet below to observe PHP type juggling in arithmetic addition.',
      hi: 'Neeche diye snippet ko execute karke dekhein ki PHP type juggling kaise kaam karta hai.'
    },
    starterCode: `<?php\n$x = '5';\n$y = 2;\necho "Result: " . ($x + $y) . "\\n";\necho "Type: " . gettype($x + $y);\n`,
    expectedOutput: 'Result: 7\nType: integer',
    hint: {
      en: 'PHP automatically coerces the numeric string "5" into an integer 5 during arithmetic addition.',
      hi: 'Arithmetic plus (+) hone par PHP numeric string "5" ko integer 5 mein convert kar deta hai.'
    }
  },
  47: {
    type: 'code',
    task: {
      en: 'Run this pre/post increment expression to see why splitting into explicit statements is safer.',
      hi: 'Pre/post increment ko run karein aur dekhein ki explicit statements kyu zaroori hain.'
    },
    starterCode: `<?php\n$x = 5;\n$a = $x++; // returns 5, then $x becomes 6\n$b = ++$x; // $x becomes 7, then returns 7\necho "Sum of separated: " . ($a + $b) . "\\n";\necho "Final x: " . $x;\n`,
    expectedOutput: 'Sum of separated: 12\nFinal x: 7',
    hint: {
      en: 'Post-increment ($x++) yields original value before incrementing; pre-increment (++$x) increments first.',
      hi: '$x++ pehle purani value return karta hai phir badhata hai; ++$x pehle value badhata hai phir return karta hai.'
    }
  },
  48: {
    type: 'code',
    task: {
      en: 'Execute this reference assignment snippet. What is the final value of $x + $y?',
      hi: 'Reference assignment code run karke check karein ki $x + $y ka final output kya banta hai.'
    },
    starterCode: `<?php\n$x = 10;\n$y = &$x;\n$y += 5;\necho "x: " . $x . "\\n";\necho "y: " . $y . "\\n";\necho "Sum: " . ($x + $y);\n`,
    expectedOutput: 'x: 15\ny: 15\nSum: 30',
    hint: {
      en: '$y points to the same memory slot as $x. Changing $y also mutates $x.',
      hi: '$y aur $x same memory space share karte hain. $y ko badlane se $x bhi badal jata hai.'
    }
  },
  50: {
    type: 'code',
    task: {
      en: 'Run the ternary vs null coalescing comparison to see how uninitialized variables behave.',
      hi: 'Ternary aur null coalescing (??) ka output execute karke compare karein.'
    },
    starterCode: `<?php\n$val = null;\necho ($val ?? 'default') . "\\n";\n\n$empty = '';\necho ($empty ? 'truthy' : 'falsy') . "\\n";\necho ($empty ?? 'was-null') . "\\n";\n`,
    expectedOutput: 'default\nfalsy\n',
    hint: {
      en: '?? checks isset() and not null; ternary checks truthiness (empty string is falsy).',
      hi: '?? sirf null check karta hai, jabki ternary empty string ko bhi falsy maanta hai.'
    }
  },
  111: {
    type: 'code',
    task: {
      en: 'Generate a 4x4 solid square of asterisks (*) using nested loops.',
      hi: 'Nested loops use karke 4x4 asterisks (*) ka solid square print karein.'
    },
    starterCode: `<?php\n$n = 4;\nfor ($i = 1; $i <= $n; $i++) {\n    for ($j = 1; $j <= $n; $j++) {\n        echo "*";\n    }\n    echo "\\n";\n}\n`,
    expectedOutput: '****\n****\n****\n****',
    hint: {
      en: 'The outer loop handles lines, and the inner loop outputs stars across each column.',
      hi: 'Outer loop rows control karta hai aur inner loop har row mein 4 taare print karta hai.'
    }
  },
  112: {
    type: 'code',
    task: {
      en: 'Print a right-angled triangle of height 4 with asterisks.',
      hi: 'Height 4 ka right-angled triangle print karein.'
    },
    starterCode: `<?php\n$n = 4;\nfor ($i = 1; $i <= $n; $i++) {\n    for ($j = 1; $j <= $i; $j++) {\n        echo "*";\n    }\n    echo "\\n";\n}\n`,
    expectedOutput: '*\n**\n***\n****',
    hint: {
      en: 'Notice the inner loop condition: $j <= $i.',
      hi: 'Inner loop ki condition $j <= $i hoti hai.'
    }
  },
  113: {
    type: 'code',
    task: {
      en: 'Print an inverted right-angled triangle starting with 4 stars.',
      hi: 'Inverted right-angled triangle print karein jo 4 stars se shuru hota hai.'
    },
    starterCode: `<?php\n$n = 4;\nfor ($i = $n; $i >= 1; $i--) {\n    for ($j = 1; $j <= $i; $j++) {\n        echo "*";\n    }\n    echo "\\n";\n}\n`,
    expectedOutput: '****\n***\n**\n*',
    hint: {
      en: 'The outer loop counts backwards from $n down to 1.',
      hi: 'Outer loop $n se 1 tak decrement karta hai.'
    }
  },
  114: {
    type: 'code',
    task: {
      en: 'Print a pyramid triangle with leading spaces and asterisks.',
      hi: 'Pyramid pattern print karein jisme spaces aur stars aligned ho.'
    },
    starterCode: `<?php\n$n = 4;\nfor ($i = 1; $i <= $n; $i++) {\n    echo str_repeat(" ", $n - $i);\n    echo str_repeat("*", (2 * $i) - 1);\n    echo "\\n";\n}\n`,
    expectedOutput: '   *\n  ***\n *****\n*******',
    hint: {
      en: 'Each row has ($n - $i) spaces followed by (2 * $i - 1) stars.',
      hi: 'Har row mein ($n - $i) spaces aur (2 * $i - 1) stars hote hain.'
    }
  }
};

// Generic distractor templates for automatic MCQ generation
const GENERIC_DISTRACTORS_EN = [
  'Handled directly in client browser memory and synchronized during DNS lookup',
  'Requires compiling PHP with experimental C extension flags in php.ini',
  'Throws a fatal compile-time syntax error under default PHP 8.2 settings',
  'Only works when MySQL query caching is globally enabled',
  'Bypasses the web server process and runs as an unbuffered daemon',
  'Deprecated in modern frameworks due to thread-safety restrictions in CLI mode'
];

const GENERIC_DISTRACTORS_HI = [
  'Browser memory mein store hota hai aur DNS lookup ke time sync hota hai',
  'php.ini mein experimental C extension flags on karna zaroori hai',
  'PHP 8.2 mein default compile-time syntax error deta hai',
  'Sirf tab kaam karta hai jab MySQL query cache enabled ho',
  'Web server ko bypass karke unbuffered daemon ki tarah chalta hai',
  'Modern frameworks mein thread-safety na hone ki wajah se recommend nahi kiya jata'
];

/**
 * Adapt any raw question from questions.json into an interactive format
 * @param {object} q Raw question
 * @param {string} requestedMode 'adaptive' | 'mcq' | 'code' | 'open'
 * @returns {object} Adapted question with interactive metadata
 */
export function adaptQuestion(q, requestedMode = 'adaptive') {
  // 1. Check if an explicit curated code challenge exists
  if (CURATED_CODE_CHALLENGES[q.id]) {
    if (requestedMode === 'open') {
      return { ...q, type: 'open' };
    }
    return {
      ...q,
      ...CURATED_CODE_CHALLENGES[q.id],
      type: 'code'
    };
  }

  // 2. If question is in patterns or coding with executable PHP snippet, make it a code challenge
  const phpCode = q.code?.find(c => c.language === 'php')?.text;
  if (phpCode && (q.category === 'coding' || q.category === 'patterns' || requestedMode === 'code')) {
    if (requestedMode !== 'mcq' && requestedMode !== 'open') {
      return {
        ...q,
        type: 'code',
        task: {
          en: `Review, run, and experiment with the code for: "${q.title.en}"`,
          hi: `Code ko execute karke output verify karein: "${q.title.hi}"`
        },
        starterCode: phpCode.trimStart().startsWith('<?php') ? phpCode : `<?php\n${phpCode}`,
        solutionCode: phpCode,
        hint: {
          en: q.answer?.en?.slice(0, 150) + '...',
          hi: q.answer?.hi?.slice(0, 150) + '...'
        }
      };
    }
  }

  // 3. Check if question is a senior scenario (and mode is adaptive or open)
  if (q.category === 'scenarios' && requestedMode !== 'mcq' && requestedMode !== 'code') {
    return {
      ...q,
      type: 'open'
    };
  }

  // 4. Check if an explicit curated MCQ exists
  if (CURATED_MCQS[q.id]) {
    if (requestedMode === 'open') {
      return { ...q, type: 'open' };
    }
    return {
      ...q,
      ...CURATED_MCQS[q.id],
      type: 'mcq'
    };
  }

  // 5. If requestedMode is open, return open type
  if (requestedMode === 'open') {
    return { ...q, type: 'open' };
  }

  // 6. Intelligent auto-MCQ generator for any other question
  // Use first sentence of answer as the correct choice
  const cleanAnsEn = (q.answer?.en || '').split(/(?<=[.!?])\s+/)[0].replace(/[*`_]/g, '').trim();
  const cleanAnsHi = (q.answer?.hi || '').split(/(?<=[.!?\n])\s+/)[0].replace(/[*`_]/g, '').trim();

  const correctChoiceEn = cleanAnsEn.length > 10 ? cleanAnsEn : (q.answer?.en || 'Correct principle stated in standard documentation').slice(0, 140);
  const correctChoiceHi = cleanAnsHi.length > 10 ? cleanAnsHi : (q.answer?.hi || 'Standard documentation ke mutabiq sahi principle').slice(0, 140);

  // Pick 3 deterministic distractors based on question id
  const d1 = q.id % GENERIC_DISTRACTORS_EN.length;
  const d2 = (q.id + 2) % GENERIC_DISTRACTORS_EN.length;
  const d3 = (q.id + 4) % GENERIC_DISTRACTORS_EN.length;

  const rawOptionsEn = [
    correctChoiceEn,
    GENERIC_DISTRACTORS_EN[d1],
    GENERIC_DISTRACTORS_EN[d2],
    GENERIC_DISTRACTORS_EN[d3],
  ];

  const rawOptionsHi = [
    correctChoiceHi,
    GENERIC_DISTRACTORS_HI[d1],
    GENERIC_DISTRACTORS_HI[d2],
    GENERIC_DISTRACTORS_HI[d3],
  ];

  // Deterministically shuffle correct index so it's not always option 0 (A)
  const targetIndex = (q.id * 3) % 4;
  const optionsEn = [...rawOptionsEn];
  const optionsHi = [...rawOptionsHi];

  if (targetIndex !== 0) {
    [optionsEn[0], optionsEn[targetIndex]] = [optionsEn[targetIndex], optionsEn[0]];
    [optionsHi[0], optionsHi[targetIndex]] = [optionsHi[targetIndex], optionsHi[0]];
  }

  return {
    ...q,
    type: 'mcq',
    options: {
      en: optionsEn,
      hi: optionsHi,
    },
    correctIndex: targetIndex,
    explanation: {
      en: q.answer?.en || '',
      hi: q.answer?.hi || '',
    }
  };
}

/**
 * Filter and prepare questions based on user preferences
 */
export function prepareSessionQuestions(questions, { category = 'all', count = 5, mode = 'adaptive' } = {}) {
  let pool = questions.filter(q => category === 'all' || q.category === category);
  
  // If specific mode requested, filter appropriately
  if (mode === 'code') {
    const withCode = pool.filter(q => q.category === 'coding' || q.category === 'patterns' || (q.code && q.code.some(c => c.language === 'php')));
    if (withCode.length >= count) {
      pool = withCode;
    }
  } else if (mode === 'open') {
    const scenarios = pool.filter(q => q.category === 'scenarios');
    if (scenarios.length >= Math.min(count, scenarios.length) && scenarios.length > 0) {
      pool = scenarios;
    }
  }

  // Shuffle pool randomly
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  return selected.map(q => adaptQuestion(q, mode));
}
