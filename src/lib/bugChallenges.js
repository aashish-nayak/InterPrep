// Real-World "Spot the Bug" Debugging Challenges for Technical Interviews

export const BUG_CHALLENGES = [
  {
    id: 'bug-1',
    title: 'The Silent Foreach Reference Corruption',
    difficulty: 'Medium',
    category: 'PHP Core',
    scenario: 'A developer used a reference in a foreach loop to double values, followed by another loop. In production, the last element mysteriously gets corrupted with the second-to-last value! Find and fix the bug.',
    buggyCode: `<?php
$numbers = [1, 2, 3];

// Loop 1: Double every element using reference
foreach ($numbers as &$val) {
    $val = $val * 2;
}
// BUG: $val is still referencing $numbers[2]!

// Loop 2: Read each value
foreach ($numbers as $val) {
    // Overwrites $numbers[2] sequentially during iteration!
}

echo "Result: " . implode(", ", $numbers);
`,
    expectedOutput: 'Result: 2, 4, 6',
    hint: 'References created in foreach loops do not automatically scope-die. What happens to $val after Loop 1 finishes?',
    fixExplanation: 'Always call unset($val); immediately after a reference loop, or avoid references by using array_map() or index assignment $numbers[$k].',
    validator: (output) => output.includes('Result: 2, 4, 6')
  },
  {
    id: 'bug-2',
    title: 'Numeric Array Keys Wiped by array_merge()',
    difficulty: 'Medium',
    category: 'PHP Arrays',
    scenario: 'We are mapping user role IDs to permissions. But after merging defaults with custom overrides, all numeric role IDs are reset to 0, 1, 2, breaking all permission lookups!',
    buggyCode: `<?php
$defaultRoles = [
    101 => 'viewer',
    102 => 'editor',
    103 => 'moderator'
];

$customOverrides = [
    102 => 'senior_editor',
    104 => 'admin'
];

// BUG: array_merge() re-indexes all numeric keys from 0!
$merged = array_merge($defaultRoles, $customOverrides);

foreach ($merged as $roleId => $name) {
    echo "ID: $roleId => $name\\n";
}
`,
    expectedOutput: 'ID: 101 => viewer\nID: 102 => senior_editor\nID: 103 => moderator\nID: 104 => admin',
    hint: 'Check PHP docs on array_merge vs array_replace() or the + array union operator for numeric keys.',
    fixExplanation: 'array_merge() renumbers numeric keys starting from zero. To preserve numeric keys, use array_replace() or $customOverrides + $defaultRoles.',
    validator: (output) => output.includes('ID: 101 => viewer') && output.includes('ID: 102 => senior_editor') && output.includes('ID: 104 => admin')
  },
  {
    id: 'bug-3',
    title: 'Uncaught Null Property Access (Fatal Crash)',
    difficulty: 'Easy',
    category: 'PHP 8.x',
    scenario: 'When querying users without a verified company address, this function throws a Fatal Error: "Call to a member function getCity() on null". Modernize it with PHP 8 syntax.',
    buggyCode: `<?php
class Address {
    public function getCity(): string { return "Bengaluru"; }
}

class User {
    public ?Address $address = null;
    public function getAddress(): ?Address { return $this->address; }
}

$user = new User();

// BUG: Throws fatal error because getAddress() returns null
$city = $user->getAddress()->getCity();

echo "User City: " . $city;
`,
    expectedOutput: 'User City: Not Provided',
    hint: 'Use PHP 8.0 nullsafe operator (?->) and null coalescing operator (??).',
    fixExplanation: 'Use $user?->getAddress()?->getCity() ?? "Not Provided" to safely navigate nullable object graphs.',
    validator: (output) => output.includes('User City: Not Provided')
  },
  {
    id: 'bug-4',
    title: 'Loose Comparison Security Trap',
    difficulty: 'Hard',
    category: 'Security & Types',
    scenario: 'This authentication token and role check allows unprivileged accounts with ID "0" or malicious string hashes to pass authorization checks. Make the check strictly secure.',
    buggyCode: `<?php
$userRole = '0'; // User input
$adminRole = 0;   // Integer 0 in legacy DB

// BUG: In legacy loose comparison, '0' == 0 was true, 
// and in_array() without true flag behaves loosely!
$allowed = ['admin', 'superadmin'];

function isSuperAdmin($role) {
    // BUG: loose comparison can lead to unexpected type juggling
    if ($role == 0) {
        return "Bypassed!";
    }
    return "Denied";
}

echo "Auth Status: " . isSuperAdmin($userRole);
`,
    expectedOutput: 'Auth Status: Denied',
    hint: 'Use strict comparison (===) and validate type or use explicit string checks.',
    fixExplanation: 'Always use strict equality === and strict in_array($needle, $haystack, true) to prevent type juggling bypasses.',
    validator: (output) => output.includes('Auth Status: Denied')
  },
  {
    id: 'bug-5',
    title: 'Pass-by-Value Function Mutation Failure',
    difficulty: 'Easy',
    category: 'Functions & Scope',
    scenario: 'The sanitizePayload function cleans up whitespace and strips tags, but the original payload remains untrimmed and raw. Fix the function so the modified array reflects in the caller.',
    buggyCode: `<?php
$input = [
    'username' => '   john_doe   ',
    'email' => '  john@example.com  '
];

// BUG: $data is passed by value, mutations are discarded on return
function sanitizePayload($data) {
    foreach ($data as $k => $v) {
        $data[$k] = trim($v);
    }
}

sanitizePayload($input);

echo "Cleaned: [" . $input['username'] . "] (" . $input['email'] . ")";
`,
    expectedOutput: 'Cleaned: [john_doe] (john@example.com)',
    hint: 'Either pass by reference using &$data or return the sanitized array and reassign.',
    fixExplanation: 'PHP passes arrays by value (copy-on-write). To mutate in-place, pass by reference: function sanitizePayload(&$data), or return the transformed array.',
    validator: (output) => output.includes('Cleaned: [john_doe] (john@example.com)')
  }
];
