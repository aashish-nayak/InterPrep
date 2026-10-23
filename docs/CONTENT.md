# Content provenance and review

The original `README.md` and `Senior_PHP_Laravel_Interview_Guide_Hinglish_Updated.md` were copied unchanged into `public/sources/`. They are study sources, not application instructions.

The study room contains all 125 numbered entries of the updated guide plus 12 adapted topics from the original README (IDs 126-137 in src/additional.json). English explanations are concise adaptations in `src/english.txt`; Hinglish comes from the updated guide, separated from code blocks. Original PHP and SQL snippets are retained. Topic classification uses the source's sections, splitting the OOP portion into its own group. The older README remains a complete, downloadable reference. The remaining source material is reference-only and is not presented as reviewed bilingual content.

Corrections applied in the generated curriculum:
- Q47: the source describes mixed post/pre-increments as a guaranteed left-to-right calculation. PHP's manual says general operand evaluation order is not specified. Both languages explain this limitation, and the runnable version uses separate statements.
- Q57: the source gives code without prose. Added a Hinglish explanation of frequency counting, filtering and extracting duplicate keys.

Important conflicts in the older README include treating all identifiers as case-sensitive, assuming session destruction on browser close, and oversimplifying method overriding signatures. The updated guide avoids several of these. No claim is made that every historical source answer is current or authoritative.

Official reference for the evaluation-order correction: https://www.php.net/manual/en/language.operators.precedence.php

To regenerate: update the numbered source and matching English rows, then run `node scripts/import.mjs` and `npm test`. Keep stable IDs because progress references them. Review localized prose, examples and version-specific behavior before adding or changing questions. Preserve source attribution to the README's author, sabbir, if redistributing that collection; verify its license before public distribution.
