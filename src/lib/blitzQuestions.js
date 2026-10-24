// 60-Second Output Prediction Blitz Questions
// Fast, tricky PHP output prediction challenges designed to build lightning-fast recall.

export const BLITZ_QUESTIONS = [
  {
    id: 'b1',
    code: `echo '0' == false ? 'true' : 'false';`,
    options: ['true', 'false', 'Fatal Error', 'null'],
    correct: 0,
    rationale: "In PHP loose comparison, string '0' evaluates to false boolean."
  },
  {
    id: 'b2',
    code: `echo '0' === false ? 'true' : 'false';`,
    options: ['true', 'false', 'Fatal Error', 'null'],
    correct: 1,
    rationale: "Strict comparison === checks both type (string vs bool) and value."
  },
  {
    id: 'b3',
    code: `$x = 5;\necho $x++ + ++$x;`,
    options: ['10', '11', '12', '13'],
    correct: 2,
    rationale: "$x++ yields 5 (then $x becomes 6). Then ++$x increments to 7 and yields 7. 5 + 7 = 12."
  },
  {
    id: 'b4',
    code: `echo empty('0') ? 'empty' : 'not';`,
    options: ['empty', 'not', 'Fatal Error', '1'],
    correct: 0,
    rationale: "In PHP, empty('0') returns true! '0' is considered falsy/empty."
  },
  {
    id: 'b5',
    code: `$a = [1 => 'a'];\n$b = [1 => 'b', 2 => 'c'];\n$res = $a + $b;\necho $res[1];`,
    options: ['a', 'b', 'c', 'Array'],
    correct: 0,
    rationale: "The array union operator + preserves existing keys from the left-hand array."
  },
  {
    id: 'b6',
    code: `echo strlen((string) null);`,
    options: ['0', '1', '4', 'Fatal Error'],
    correct: 0,
    rationale: "Casting null to string results in empty string '', whose length is 0."
  },
  {
    id: 'b7',
    code: `echo 2 <=> 5;`,
    options: ['-1', '0', '1', 'false'],
    correct: 0,
    rationale: "Spaceship operator returns -1 when left operand is less than right operand."
  },
  {
    id: 'b8',
    code: `$arr = ['a', 'b'];\n$arr[] = 'c';\necho count($arr);`,
    options: ['2', '3', '4', 'Error'],
    correct: 1,
    rationale: "Array append operator $arr[] pushes 'c' to index 2, making total count 3."
  },
  {
    id: 'b9',
    code: `echo (int) ('15 apples' + '5 oranges');`,
    options: ['20', '15', '0', 'Fatal Error in PHP 8'],
    correct: 0,
    rationale: "In PHP numeric string addition, leading numbers are coerced to integers (15 + 5 = 20)."
  },
  {
    id: 'b10',
    code: `echo null ?? 'default';`,
    options: ['null', 'default', 'empty', 'Error'],
    correct: 1,
    rationale: "Null coalescing operator ?? returns right-hand operand when left is null or undefined."
  },
  {
    id: 'b11',
    code: `$x = 10;\nfunction test() {\n    return isset($x) ? 'yes' : 'no';\n}\necho test();`,
    options: ['yes', 'no', 'Fatal Error', 'null'],
    correct: 1,
    rationale: "Variables declared outside a function have local scope inside and are not visible without 'global'."
  },
  {
    id: 'b12',
    code: `echo (bool) 'false' ? 'T' : 'F';`,
    options: ['T', 'F', 'null', '0'],
    correct: 0,
    rationale: "Non-empty string 'false' evaluates to boolean true! Only '' and '0' are falsy strings."
  }
];
