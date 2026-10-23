# Senior PHP Laravel Developer Interview Guide (5+ Years)

## Easy Hinglish Explanations + Interview-Ready Answers

**Goal:** Concepts ko simple Hinglish mein samajhna, code ke saath
revise karna, aur interview mein clear answer dena.

**Source merge:** Aapke uploaded Notion export ke PHP questions +
coding-round examples + hamare pichhle response ke OOP, Laravel, SQL aur
senior-level scenarios.

**Video note:** Export mein do video links mile, lekin unke transcripts
yahan fetch nahi ho sake. Isliye neeche video ke naam par invented
transcript nahi diya gaya. Video resources end mein diye gaye hain.

------------------------------------------------------------------------

# PART 1 --- CORE PHP QUESTIONS

## 1. PHP kya hai? PHP ka full form kya hai?

**Simple Hinglish:** PHP ek server-side programming language hai. Jab
user website par form submit karta hai, PHP server par data process kar
sakti hai, database se baat kar sakti hai aur response bhej sakti hai.

PHP ka current full form **PHP: Hypertext Preprocessor** hai. Pehle iska
naam Personal Home Page tha.

**Interview answer:** PHP is a general-purpose server-side scripting
language widely used to build dynamic websites, APIs and web
applications. Laravel is a popular PHP framework.

## 2. Session kya hota hai?

**Simple Hinglish:** HTTP request apne aap purani request yaad nahi
rakhti. Session server-side data store karne mein help karta hai, jaise
login user ki session state. Browser mein aam taur par session ID wali
cookie rakhi jaati hai.

``` php
session_start();
$_SESSION['user_id'] = 25;
echo $_SESSION['user_id'];
```

**Yaad rakho:** Session data hamesha browser band karte hi delete ho, ye
guaranteed nahi hai. Expiry session configuration aur storage par depend
karti hai.

## 3. Cookie aur Session mein kya difference hai?

-   **Cookie:** Browser mein store hoti hai aur applicable requests ke
    saath server ko bheji ja sakti hai.
-   **Session:** Aam taur par server-side data hota hai; browser mein
    session ID cookie ho sakti hai.
-   Cookie user modify kar sakta hai, isliye cookie data ko bina
    verification trust mat karo.
-   Sensitive information plain cookie mein store mat karo.

## 4. Variable aur Constant mein difference?

``` php
$price = 100;
$price = 200; // allowed

define('TAX_RATE', 0.18);
// TAX_RATE ko dobara assign nahi kar sakte
```

Variable ki value badal sakti hai. Constant ek fixed named value hai.
PHP constants ko `define()` ya `const` se define kiya ja sakta hai.

## 5. `$message` aur `$$message` mein difference?

`$message` normal variable hai. `$$message` variable-variable syntax
hai: `$message` ki value ko doosre variable ka naam maana jaata hai.

``` php
$message = 'greeting';
$greeting = 'Hello';
echo $$message; // Hello
```

Dynamic variable names code ko confusing bana sakte hain, isliye routine
application code mein carefully use karein.

## 6. Kya PHP case-sensitive hai?

-   Variable names case-sensitive hain: `$name` aur `$Name` alag hain.
-   Function names aur class names PHP mein case-insensitive hote hain,
    lekin consistent casing best practice hai.
-   Constants case-sensitive hote hain.
-   Namespaces aur class names ko PSR-style casing mein consistent
    rakhein.

## 7. PHP ke data types kaun se hain?

PHP ke common types: `int`, `float`, `string`, `bool`, `array`,
`object`, `null`, aur `resource`. `callable` aur `iterable` jaise
pseudo-types/type declarations bhi milte hain.

``` php
$age = 26;             // int
$price = 10.5;         // float
$name = 'Aashish';     // string
$isActive = true;      // bool
$items = ['pen', 'book']; // array
$user = null;          // null
```

## 8. PHP variable naming rules?

Variable `$` se start hota hai. Uske baad naam letter ya underscore se
start hona chahiye; number se start nahi. Naam mein letters, numbers aur
underscores aa sakte hain. Spaces allowed nahi hote.

``` php
$userName = 'Aashish'; // valid
$_count = 5;           // valid
// $2name = 'x';       // invalid
```

## 9. `echo` aur `print` mein difference?

Dono output show karte hain. `echo` ek ya multiple arguments le sakta
hai aur value return nahi karta. `print` ek argument leta hai aur `1`
return karta hai. Performance ka difference aam taur par practical
optimization ka main concern nahi hota.

``` php
echo 'Hello', ' World';
print 'Hello';
```

## 10. `==` aur `===` mein difference?

`==` value compare karte waqt type conversion kar sakta hai. `===` value
aur type dono compare karta hai.

``` php
var_dump(10 == '10');  // true
var_dump(10 === '10'); // false
```

**Best practice:** Unexpected type conversion se bachne ke liye strict
comparison prefer karein.

## 11. `isset()`, `empty()` aur `array_key_exists()`?

-   `isset($x)`: variable/key exist kare aur value `null` na ho to true.
-   `empty($x)`: missing ya false-like values jaise `0`, `"0"`, `false`,
    `null`, `""` ke liye true.
-   `array_key_exists('x', $arr)`: key present hai ya nahi check karta
    hai, chahe value `null` ho.

``` php
$data = ['name' => null];
isset($data['name']);            // false
array_key_exists('name', $data); // true
```

## 12. `$x++` aur `++$x` mein difference?

Post-increment (`$x++`) pehle current value use karta hai, phir
increment hota hai. Pre-increment (`++$x`) pehle increment karta hai,
phir nayi value use hoti hai.

``` php
$x = 5;
$a = $x++; // $a = 5, $x = 6
$b = ++$x; // $x = 7, $b = 7
```

Complex expressions mein increment operators mix karne ke bajay separate
lines likhna zyada readable hai.

## 13. Type juggling aur type casting kya hai?

**Type juggling:** PHP context ke hisaab se type automatically convert
kar sakta hai.\
**Type casting:** Developer explicitly type convert karta hai.

``` php
echo '5' + 2;     // 7 (numeric conversion)
$number = (int) '42';
```

Untrusted input ko blindly cast karna validation ka replacement nahi
hai.

## 14. `$x = 'true'; $y = true; echo $x == $y;` ka result?

PHP mein boolean comparison ke context mein non-empty string `'true'`
truthy hai, isliye loose comparison true hota hai aur `echo` aam taur
par `1` print karta hai. Strict comparison `$x === $y` false hai kyunki
types alag hain.

## 15. PHP references (`&`) kya hote hain?

Reference mein do variables ek hi value ko refer kar sakte hain.

``` php
$x = 10;
$y =& $x;
$y += 5;
echo $x; // 15
```

References powerful hain, lekin code samajhna mushkil bana sakte hain.
Unhe tabhi use karein jab actual need ho.

## 16. Reference ke baad `unset()` kya karta hai?

``` php
$original = 'Hello';
$alias =& $original;
unset($original);
echo $alias; // Hello
```

`unset($original)` variable name ko remove karta hai; is example mein
`$alias` ab bhi value access kar sakta hai. `unset()` file delete karne
ke liye nahi hai.

## 17. `break` aur `continue`?

-   `break`: loop ya switch se bahar nikalta hai.
-   `continue`: current loop iteration skip karke next iteration par
    jaata hai.
-   Nested loops mein `break 2` ya `continue 2` multiple levels ko
    affect kar sakte hain.

## 18. `for` aur `foreach`?

`for` tab useful hai jab counter/index aur stopping condition control
karni ho. `foreach` arrays aur iterables ke elements par iterate karne
ke liye clear aur convenient hota hai. `foreach` hamesha faster hai,
aisa universal rule nahi; readability aur actual measurement important
hain.

``` php
for ($i = 0; $i < 3; $i++) echo $i;

foreach (['a', 'b', 'c'] as $value) echo $value;
```

## 19. `include`, `require`, `include_once`, `require_once`?

`include` file na mile to warning deta hai aur execution aksar continue
hota hai. `require` failure par execution rok deta hai. `_once` versions
same file ko baar-baar include hone se bachate hain. Modern Laravel apps
mein Composer autoloading use hoti hai.

## 20. `unset()` aur `unlink()`?

`unset($variable)` variable ko unset karta hai. `unlink($path)`
filesystem se file delete karne ki koshish karta hai.

``` php
$value = 'test';
unset($value);

unlink('/path/to/file.txt');
```

File delete karne se pehle path, authorization aur expected file verify
karein.

## 21. `GET` aur `POST` mein difference?

`GET` ka usual purpose data retrieve karna hai; parameters aksar URL
mein hote hain. `POST` data submit karne ya operation initiate karne ke
liye common hai; payload request body mein hota hai. POST data URL mein
na dikhne se automatically secure nahi ho jaata---HTTPS phir bhi zaroori
hai.

## 22. `PUT` aur `PATCH` kya hain?

`PUT` aam taur par resource ko replace karne ke liye aur `PATCH` partial
update ke liye use hota hai. Properly designed `PUT` idempotent hota
hai: same request repeat karne se intended final state nahi badalti.

## 23. PHP errors ke main types?

-   **Parse/Syntax error:** code ka syntax galat.
-   **Warning:** problem hui, lekin execution continue ho sakta hai.
-   **Notice:** older PHP versions mein less severe issue ki report.
-   **Error/Throwable:** serious runtime problems, jaise type error ya
    undefined function ke liye `Error`.

Exact messages aur categories PHP version par depend karte hain.

## 24. PHP mein error reporting kaise enable karte hain?

Local development mein:

``` php
error_reporting(E_ALL);
ini_set('display_errors', '1');
```

Production mein errors users ko display nahi karne chahiye.
`display_errors=Off` rakhein aur secure logs mein record karein. Laravel
mein `APP_DEBUG=false` production ke liye important hai.

## 25. `include` aur `require` ka practical use?

Small PHP scripts mein reusable file load karne ke liye use hote hain.
Essential configuration ya required code ke liye `require` generally
suitable hai. Laravel mein class files ke liye manual includes ke bajay
Composer autoloading aur namespaces use karein.

## 26. PHP frameworks kaun se hain?

Laravel, Symfony, CodeIgniter, Yii, CakePHP aur Slim jaise frameworks.
Laravel mein routing, validation, ORM, queues, cache, middleware,
migrations aur testing ecosystem milta hai.

## 27. PEAR ka full form?

PEAR = **PHP Extension and Application Repository**. Yeh reusable PHP
components ka historical repository/framework hai. Modern PHP projects
mein Composer aur Packagist zyada common dependency-management tools
hain.

## 28. `urlencode()` aur `urldecode()`?

URL ke query parameter value ko encode/decode karne ke liye use ho sakte
hain. Whole URL ko blindly encode na karein; context ke mutabik
`urlencode()` ya `rawurlencode()` choose karein.

``` php
$value = 'hello world';
$encoded = urlencode($value); // hello+world
```

## 29. String se line breaks kaise remove karein?

``` php
$text = "Hello\r\nWorld\n";
$clean = str_replace(["\r", "\n"], '', $text);
```

Agar line breaks ko spaces se replace karna ho, replacement `''` ki
jagah `' '` dein. Data ka expected format samajh kar transformation
karein.

## 30. File extension kaise nikalein/remove karein?

``` php
$extension = pathinfo('report.pdf', PATHINFO_EXTENSION); // pdf
$name = pathinfo('report.pdf', PATHINFO_FILENAME);       // report
```

Filename ko manually `explode('.')` se handle karne ke bajay
`pathinfo()` readable option hai.

## 31. HTML tags kaise remove karein?

`strip_tags()` HTML tags remove kar sakta hai, lekin yeh complete HTML
sanitization ya XSS protection ka replacement nahi hai. Output context
ke hisaab se escaping karein; HTML render karte waqt appropriate
escaping use karein.

## 32. PHP file upload size kaise control hota hai?

Ek single universal default assume mat karein. Limits PHP configuration
(`upload_max_filesize`, `post_max_size`), web server/proxy limits aur
application validation par depend karti hain. Laravel mein file type,
size, authorization aur storage path validate karein.

## 33. PHP script execution time kaise badhate hain?

Configuration mein `max_execution_time` set kiya ja sakta hai; kuch
contexts mein `set_time_limit()` bhi use hota hai. Lekin time limit
badhana slow processing ka permanent solution nahi. Large
exports/imports ko queue/background job mein move karna often better
hota hai.

## 34. Constructor aur destructor kya hain?

`__construct()` object create hone par initialization ke liye chalta
hai. `__destruct()` object destruction/cleanup ke waqt chal sakta hai,
lekin exact timing par rely karna risky ho sakta hai.

``` php
class Report
{
    public function __construct(private string $name) {}

    public function getName(): string
    {
        return $this->name;
    }
}
```

## 35. Access modifiers: public, protected, private?

-   `public`: class ke bahar se bhi accessible.
-   `protected`: class aur subclasses ke scope mein accessible.
-   `private`: sirf us class ke andar accessible jahan define kiya gaya.

Encapsulation ke liye properties ko default public rakhne ke bajay
access ko carefully choose karein.

## 36. Inheritance kya hai?

Child class parent class ke accessible properties/methods inherit kar
sakti hai. PHP mein class inheritance `extends` se hoti hai.

``` php
class Animal {
    public function speak(): string { return 'Sound'; }
}
class Dog extends Animal {}
```

## 37. Kya PHP multiple inheritance support karta hai?

PHP class ek hi parent class `extend` kar sakti hai, lekin multiple
interfaces implement kar sakti hai aur multiple traits use kar sakti
hai. Interface contract batata hai; trait reusable method implementation
deta hai.

## 38. Traits kya hain?

Trait multiple unrelated classes mein methods reuse karne ka mechanism
hai. Trait class nahi hota aur object hierarchy ka substitute nahi hona
chahiye.

``` php
trait HasReference {
    public function referencePrefix(): string {
        return 'REF-';
    }
}
class Invoice {
    use HasReference;
}
```

## 39. Abstract class vs interface?

Interface contract define karta hai. Abstract class contract ke saath
shared implementation/state bhi de sakti hai. Class multiple interfaces
implement kar sakti hai lekin ek class extend karti hai.

## 40. OOP ke four pillars?

-   **Encapsulation:** data aur behavior ko ek unit mein rakhna.
-   **Abstraction:** unnecessary internal detail chhupana.
-   **Inheritance:** existing class se specialize behavior lena.
-   **Polymorphism:** same interface ke through different
    implementations use karna.

## 41. SOLID principles kya hain?

-   **S --- Single Responsibility:** ek class ka focused responsibility
    ho.
-   **O --- Open/Closed:** extension aasaan ho, stable code ko baar-baar
    modify na karna pade.
-   **L --- Liskov Substitution:** child implementation parent contract
    ko tod na de.
-   **I --- Interface Segregation:** chhote, focused interfaces.
-   **D --- Dependency Inversion:** high-level logic concrete class ke
    bajay abstraction par depend kare.

Example: checkout service `PaymentGateway` interface use kare; alag
gateways usko implement kar sakte hain.

## 42. Dependency Injection kya hai?

Class apni dependencies khud banane ke bajay bahar se receive karti hai.
Isse code loosely coupled aur testable hota hai.

``` php
class CheckoutService {
    public function __construct(private PaymentGateway $gateway) {}
}
```

Laravel service container interface ko concrete implementation se bind
karke dependency inject kar sakta hai.

## 43. Composition vs inheritance?

Inheritance ka relation "is-a" hota hai; composition ka relation "has-a"
ya delegated behavior hota hai. Checkout service ka payment gateway ko
dependency ke roop mein use karna composition hai. Independent behavior
change karna ho to composition often flexible hoti hai.

## 44. Design patterns ke examples?

-   Strategy: interchangeable payment provider/algorithm.
-   Factory: object create karna.
-   Adapter: external API ko internal contract mein wrap karna.
-   Observer/Event: kisi event par response dena.
-   Decorator: existing behavior ke around extra behavior add karna.
-   Repository: data access abstraction, jab actual project mein useful
    ho.

Har class ke liye interface/repository banana zaroori nahi; abstraction
ka real benefit hona chahiye.

## 45. PHP 8 ke important features?

Union types, named arguments, constructor property promotion, `match`,
nullsafe operator `?->`, enums (PHP 8.1), readonly properties (8.1),
readonly classes (8.2), intersection types (8.1) aur Fibers (8.1).
Interview mein feature ke saath apne project ka example bhi batayein.

------------------------------------------------------------------------

# PART 2 --- CODING ROUND / TRICKY PHP

## 46. `'5' + 2` ka output?

``` php
$x = '5';
$y = 2;
echo $x + $y; // 7
```

PHP numeric string ko number mein convert kar sakta hai. Isko type
juggling kehte hain. Real code mein input validation zaroori hai.

## 47. `$x = 5; echo $x++ + ++$x;` ka answer?

Simple breakdown: `$x++` expression mein purani value 5 use karta hai,
phir `$x` 6 hota hai. `++$x` phir 7 banata hai aur 7 use karta hai.
Expression ka result `5 + 7 = 12` hota hai. Readability ke liye aise
expressions ko separate statements mein likhna better hai.

## 48. References ka output?

``` php
$x = 10;
$y = &$x;
$y += 5;
echo $x + $y; // 30
```

Dono reference se linked hain; `$y` update karne par `$x` bhi 15 hota
hai. Final sum 15 + 15 = 30.

## 49. Reference assignment ke baad output kya hai?

``` php
$fruit = 'apple';
$basket =& $fruit;
$basket = 'banana';
echo $fruit; // banana
```

`$basket` aur `$fruit` linked reference hain.

## 50. `unset()` reference example?

``` php
$original = 'Hello';
$alias =& $original;
unset($original);
echo $alias; // Hello
```

Original variable name unset hua; alias abhi bhi value access karta hai.

## 51. Array mein least frequent number kaise find karein?

``` php
$numbers = [1,1,2,3,3,1,2,4,5,4,6,5,7,7];

$counts = array_count_values($numbers);
asort($counts); // frequency ascending, keys preserved

$leastFrequentNumber = array_key_first($counts);
echo $leastFrequentNumber; // 6 for this input
```

Is input mein `6` ek baar aata hai, baaki values zyada baar. Agar
multiple numbers ki same minimum frequency ho, to tie-breaking rule
define karein.

## 52. Har vowel ka count kaise nikaalein?

``` php
$text = strtolower('Hello World, This is a PHP Program.');
$counts = ['a'=>0, 'e'=>0, 'i'=>0, 'o'=>0, 'u'=>0];

foreach (str_split($text) as $char) {
    if (array_key_exists($char, $counts)) {
        $counts[$char]++;
    }
}
print_r($counts);
```

Pehle lowercase karte hain, phir har character ko check karte hain. Is
example mein zero-count vowels bhi output mein rehte hain.

## 53. Associative array ko multidimensional array mein convert karein.

``` php
$data = ['x' => 'A', 'y' => 'B', 'z' => 'C'];
$output = [];

foreach ($data as $key => $value) {
    $output[] = [$key, $value];
}
print_r($output);
// [['x','A'], ['y','B'], ['z','C']]
```

Har key-value pair ko ek inner array banaya gaya hai.

## 54. Current time mein 5000 hours, 500 minutes, 50 seconds add karein.

``` php
$timestamp = time() + (5000 * 3600) + (500 * 60) + 50;
echo date('Y-m-d H:i:s', $timestamp);
```

Hours ko seconds mein convert karne ke liye `hours * 3600`, minutes ke
liye `minutes * 60`. Real applications mein timezone ke liye
`DateTimeImmutable`/Carbon use karna often clearer hai.

## 55. Palindrome check kaise karein?

``` php
function isPalindrome(string $text): bool {
    $text = strtolower(preg_replace('/[^a-z0-9]/i', '', $text));
    return $text === strrev($text);
}
var_dump(isPalindrome('Madam')); // true
```

Palindrome aage aur peeche se same hota hai. Unicode/multilingual text
ke liye mbstring-aware logic chahiye ho sakta hai.

## 56. String reverse kaise karein?

``` php
echo strrev('Laravel'); // levaraL
```

Simple ASCII strings ke liye kaafi hai. Unicode characters ke liye
`strrev()` byte-based behavior de sakta hai, isliye multibyte-safe
approach choose karein.

## 57. Array mein duplicate values kaise find karein?

``` php
$values = [1, 2, 2, 3, 4, 4];
$counts = array_count_values($values);
$duplicates = array_keys(array_filter($counts, fn($count) => $count > 1));
print_r($duplicates); // [2, 4]
```

## 58. String mein words count kaise karein?

``` php
$text = 'PHP makes web apps';
echo str_word_count($text); // 4
```

Yeh basic English-like text ke liye hai. Multilingual text ke liye
Unicode-aware tokenizer better ho sakta hai.

## 59. Do variables swap kaise karein?

``` php
$a = 10;
$b = 20;
[$a, $b] = [$b, $a];
```

Temporary variable wala method bhi bilkul valid hai. Readability ko
clever tricks se zyada preference dein.

## 60. Array ko ascending/descending kaise sort karein?

``` php
$numbers = [4, 1, 9, 2];
sort($numbers);  // ascending, numeric keys reindex
rsort($numbers); // descending, numeric keys reindex
```

Associative keys preserve karni hon to `asort()`/`arsort()` use karein.

------------------------------------------------------------------------

# PART 3 --- LARAVEL INTERVIEW QUESTIONS

## 61. Laravel request lifecycle explain karein.

Request `public/index.php` se enter hoti hai, Composer autoloader aur
Laravel bootstrap hote hain, middleware run hota hai, router route match
karta hai, controller/services/database ka kaam hota hai, phir response
middleware ke through client tak response jaata hai. Exact internals
Laravel version ke hisaab se vary kar sakte hain.

## 62. Service Container kya hai?

Laravel ka service container classes ki dependencies resolve aur inject
karta hai. Isse controller/service ko `new SomeClass()` karke dependency
banane ki zaroorat har jagah nahi hoti.

## 63. `bind()` aur `singleton()` mein difference?

`bind()` normal resolution par naya instance resolve karta hai.
`singleton()` container mein resolved instance reuse karta hai. Stateful
singleton ko long-running workers mein carefully design karein.

## 64. Service Provider kya karta hai?

Service Provider application services ko register aur bootstrap karne ki
jagah hai. `register()` mein container bindings aur `boot()` mein aise
setup kaam hote hain jo registered services par depend karte hain.

## 65. Middleware kya hai?

Middleware request ko controller tak pahunchne se pehle check/modify kar
sakta hai aur response par bhi kaam kar sakta hai. Examples:
authentication, rate limiting, tenant identification, logging.

## 66. Authentication vs Authorization?

Authentication = "Aap kaun hain?" Authorization = "Aapko kya karne ki
permission hai?" Login hona kisi aur user ka record edit karne ki
permission automatically nahi deta.

## 67. Sanctum vs Passport?

Sanctum SPA cookie authentication aur simple API tokens ke liye suitable
hai. Passport full OAuth 2.0 server functionality ke liye hai.
Requirements ke basis par choose karein.

## 68. Eloquent relationships kaun se hain?

`hasOne`, `hasMany`, `belongsTo`, `belongsToMany`, `hasManyThrough`, aur
polymorphic relations jaise `morphMany`. Relationship ke saath foreign
key, indexes, deletion behavior aur loading strategy bhi consider
karein.

## 69. N+1 query problem kya hai?

Pehle parent records ki ek query, phir har record ke liye related data
ki alag query chalna N+1 issue hai.

``` php
// Problematic
$orders = Order::all();
foreach ($orders as $order) echo $order->user->name;

// Eager load
$orders = Order::with('user')->get();
```

Query logs aur execution plans se confirm karein ke actual bottleneck
kya hai.

## 70. `with()`, `load()`, `whereHas()`?

-   `with()`: initial query workflow mein relation eager-load.
-   `load()`: models milne ke baad relation load.
-   `whereHas()`: related records ki condition ke basis par parent
    filter.

## 71. `find()`, `first()`, `get()`, `value()`?

`find($id)` primary key se model; `first()` first matching model ya
`null`; `get()` collection; `value('email')` first matching record ka
specific column value.

## 72. `create()`, `save()`, `update()`, `insert()`?

`create()` mass assignment se Eloquent model create karta hai; `save()`
model insert/update karta hai; `update()` model ya query ke context par
depend karta hai; query builder ka `insert()` direct insert karta hai
aur model instance return nahi karta. Query-level bulk operations
individual Eloquent model events run nahi karte.

## 73. Mass assignment vulnerability kya hai?

Client se aayi saari fields ko directly model mein pass karne par
sensitive fields bhi set ho sakti hain.

``` php
$data = $request->validate([
    'name' => ['required', 'string', 'max:255'],
    'email' => ['required', 'email'],
]);
$user = User::create($data);
```

Validated fields aur `$fillable`/`$guarded` ka use karein.
`request()->all()` ko blindly model mein pass na karein.

## 74. Form Request kya hai?

Form Request validation aur authorization rules ko controller se
separate karta hai. Isse controller clean aur validation
reusable/testable hoti hai.

## 75. Database transaction kaise use hoti hai?

``` php
DB::transaction(function () use ($data) {
    $order = Order::create($data);
    Payment::create([
        'order_id' => $order->id,
        'status' => 'pending',
    ]);
});
```

Exception transaction se escape kare to rollback hota hai. External
payment API ka side effect database rollback se undo nahi hota.

## 76. Jobs aur queues kya hain?

Heavy work ko HTTP request se bahar background mein process karna.
Examples: email, Excel export, bulk import, webhook processing.

``` php
GenerateReportJob::dispatch($reportId);
```

Retry, backoff, timeout, failed jobs aur idempotency samajhna zaroori
hai.

## 77. Events, Listeners, Observers?

Event batata hai "kuch hua"; listener event par response deta hai;
observer model lifecycle events (`created`, `updated`, `deleted`) handle
karta hai. Critical workflows mein transaction commit aur reliable
delivery consider karein.

## 78. Laravel cache kya hai?

Frequently reused data ko cache mein rakhkar repeated
database/computation work reduce karna.

``` php
$products = Cache::remember(
    'active-products',
    now()->addMinutes(10),
    fn () => Product::where('active', true)->get()
);
```

Cache invalidation, TTL, stale data aur key design important hain.

## 79. API Resource kya hai?

API Resource model ko controlled JSON response mein transform karta hai.
Isse database schema aur public API response alag rehte hain aur
sensitive fields expose hone ka risk kam hota hai.

## 80. Soft delete vs hard delete?

Hard delete row ko physically remove karta hai. Soft delete `deleted_at`
set karta hai aur normal Eloquent queries se row ko hide karta hai.
Retention/privacy rules aur unique constraints bhi consider karein.

## 81. Laravel API ko secure kaise karenge?

Authentication, authorization/policies, validation, rate limiting,
HTTPS, safe file uploads, secrets management, SQL injection prevention,
secure error responses, aur sensitive logs se bachna. API response mein
private fields expose na karein.

## 82. Laravel app slow ho to kya karenge?

Pehle measure karein: slow endpoint, query logs, N+1, execution plan,
indexes, external API latency, response size. Phir measured fix apply
karein---query optimization, appropriate caching, pagination,
queues---and result dobara measure karein.

## 83. Laravel tests kaise likhenge?

Unit tests business logic ko isolate karte hain; feature tests HTTP
request aur app behavior test karte hain; integration tests
components/services ka interaction. Laravel factories, `actingAs()`,
HTTP assertions, queue/mail fakes aur database test helpers use kiye ja
sakte hain.

------------------------------------------------------------------------

# PART 4 --- SQL / MYSQL QUESTIONS

## 84. `WHERE` vs `HAVING`?

`WHERE` rows ko grouping se pehle filter karta hai. `HAVING` grouped
results/aggregate condition filter karta hai.

``` sql
SELECT department_id, COUNT(*) AS total
FROM employees
WHERE status = 'active'
GROUP BY department_id
HAVING COUNT(*) > 5;
```

## 85. `INNER JOIN` vs `LEFT JOIN`?

`INNER JOIN` sirf matching rows deta hai. `LEFT JOIN` left table ki
saari rows deta hai, aur unmatched right side ke columns `NULL` hote
hain.

## 86. `UNION` vs `UNION ALL`?

`UNION` duplicate rows eliminate karta hai. `UNION ALL` duplicates ko
preserve karta hai aur deduplication work nahi karta.

## 87. `DELETE`, `TRUNCATE`, `DROP`?

`DELETE` rows remove karta hai aur `WHERE` support karta hai. `TRUNCATE`
table ke saare rows remove karta hai; MySQL mein yeh DDL operation hai
aur generally implicit commit karta hai. `DROP` table structure hi
remove karta hai. Inhe interchangeable na samjhein.

## 88. Index kya hai?

Index data ko efficiently find karne mein help karta hai. Index reads ko
speed up kar sakta hai, lekin disk space aur writes ka cost hota hai.
Actual query pattern aur `EXPLAIN` dekh kar index choose karein.

## 89. Composite index mein column order important kyun hai?

Index `(customer_id, status)` generally `customer_id` alone aur dono
columns ke lookup ko support kar sakta hai; sirf `status` query ko same
tarah support nahi karega. Isse leftmost-prefix principle kehte hain.

## 90. Primary/clustered index vs secondary index in InnoDB?

InnoDB clustered index ke leaf pages mein row data hota hai, usually
primary key ke order par. Secondary index indexed values aur primary key
store karta hai; full row ke liye additional lookup lag sakta hai.

## 91. Normalization kya hai?

Database tables ko aise organize karna ki unnecessary duplication aur
update anomalies kam hon. 1NF: atomic values; 2NF: non-key attributes
poore candidate key par depend hon; 3NF: inappropriate transitive
dependencies avoid hon. Performance ke liye kabhi measured
denormalization bhi ki ja sakti hai.

## 92. ACID properties?

Atomicity: transaction as a unit succeed/fail. Consistency:
constraints/invariants preserve hon. Isolation: concurrent transactions
controlled hon. Durability: committed data database guarantees ke
mutabik persist kare.

## 93. Deadlock kya hai?

Do transactions ek dusre ke locks ka wait kar rahi hoti hain. Isse
bachne ke liye locks consistent order mein lein, transaction short
rakhein, indexes sahi rakhein, aur recognized deadlock par safe retry
karein.

## 94. `COUNT(*)`, `COUNT(column)`, `COUNT(DISTINCT column)`?

`COUNT(*)` rows count karta hai. `COUNT(column)` non-NULL values count
karta hai. `COUNT(DISTINCT column)` unique non-NULL values count karta
hai.

## 95. `GROUP BY` vs `DISTINCT`?

`DISTINCT` duplicate result rows remove karta hai. `GROUP BY` rows ko
groups mein arrange karta hai, commonly `COUNT`, `SUM`, `AVG` jaise
aggregates ke liye.

## 96. Second-highest distinct salary kaise find karein?

``` sql
SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);
```

No second distinct salary ho to `NULL` aayega.

## 97. Duplicate emails kaise find karein?

``` sql
SELECT email, COUNT(*) AS occurrences
FROM users
WHERE email IS NOT NULL
GROUP BY email
HAVING COUNT(*) > 1;
```

Duplicates prevent karne ke liye data cleanup ke baad appropriate unique
constraint add karne par vichar karein.

## 98. Aise customers find karein jinhone order nahi diya?

``` sql
SELECT c.id, c.name
FROM customers c
WHERE NOT EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.customer_id = c.id
);
```

`LEFT JOIN ... WHERE o.id IS NULL` bhi common solution hai.

## 99. Offset vs keyset pagination?

Offset: `LIMIT 20 OFFSET 10000`; deep pages par rows skip karna
expensive ho sakta hai. Keyset pagination last seen key se continue
karti hai aur large sequential lists ke liye efficient ho sakti hai.

``` sql
SELECT id, created_at
FROM orders
WHERE id > 10000
ORDER BY id
LIMIT 20;
```

Stable ordering aur cursor ke liye unique tie-breaker zaroori hai.

## 100. `EXPLAIN` kya karta hai?

MySQL query ka expected execution plan dikhata hai: access method,
index, join order aur estimated rows. `EXPLAIN ANALYZE` supported
versions mein query execute karke actual execution details bhi deta hai;
production par use karte waqt care karein.

## 101. Subquery, CTE aur window function?

Subquery doosri query ke andar query hai. CTE (`WITH`) statement ke liye
named query result banata hai. Window function related rows par
calculation karta hai lekin individual rows preserve karta hai.

``` sql
SELECT customer_id, id,
       ROW_NUMBER() OVER (
           PARTITION BY customer_id
           ORDER BY amount DESC, id
       ) AS row_num
FROM orders;
```

------------------------------------------------------------------------

# PART 5 --- SENIOR-LEVEL REAL-WORLD SCENARIOS

## 102. Insurance provider API integrate kaise karenge?

Controller/Form Request validation aur authorization handle karega.
Dedicated service business workflow manage karegi. Provider adapter HTTP
calls, payload mapping, signing aur error mapping karega. Credentials
configuration/secret manager mein rahengi. Request IDs, operation
status, retries aur reconciliation rakhein.

## 103. JWS signing kya hai?

JWS (JSON Web Signature) message/payload ki integrity aur signer
verification ke liye digital signature format hai. Provider
specification ke mutabik algorithm, payload, headers aur keys use karni
chahiye. JWS ko encryption/JWE ke saath confuse na karein; signing ka
matlab payload necessarily secret nahi hota.

## 104. Large Excel export kaise banayenge?

Background queue job dispatch karein, records ko chunks/cursor mein
process karein, file storage mein save karein, progress/status maintain
karein aur ready hone par user ko notification/download link dein.
Memory use, authorization aur temporary-file cleanup plan karein.

## 105. Duplicate payment/policy request kaise rokenge?

Idempotency key/provider reference use karein, database unique
constraint add karein jahan suitable ho, concurrent requests ke liye
transaction/locking use karein, aur uncertain API outcomes ko provider
se reconcile karein. Sirf timeout dekhkar assume na karein ki payment
fail hua.

## 106. Local mein chalne wala API production mein fail ho to?

Deployment/version, environment variables, secrets, PHP extensions,
permissions, migrations, network, queue workers, cache aur provider
response check karein. Correlation ID aur sanitized logs se failure
layer isolate karein, fix karein aur regression test add karein.

## 107. WebSocket real-time feature kaise design karenge?

State change pehle authoritative store mein persist karein; phir
event/broadcast publish karein. Private channel authorization, reconnect
behavior, duplicate/out-of-order events aur missed updates recover karne
ka plan banayein. Client ko source of truth na samjhein.

## 108. Slow SQL production issue kaise investigate karenge?

Slow query identify karein, `EXPLAIN`/actual metrics dekhein, rows
examined, joins, filters, sort aur index usage inspect karein.
Representative data par targeted query/index change test karein aur
deploy ke baad latency compare karein.

## 109. Third-party API failures kaise handle karenge?

Timeouts, safe retries with backoff, response validation, correlation
IDs, circuit-breaking strategy where appropriate, idempotency and
reconciliation. Non-idempotent request ko blindly repeat na karein.

## 110. Senior developer ke taur par code quality kaise maintain karte hain?

Clear boundaries, dependency injection, focused classes, validation,
code review, automated tests, useful logging, safe configuration,
backward-compatible migrations aur measurable monitoring. Pattern use
karne ke liye pattern nahi---actual problem solve karne ke liye
abstraction use karein.

------------------------------------------------------------------------

# PART 6 --- INTERVIEW ANSWER FRAMEWORK

Technical question ka answer is order mein dein:

1.  **Definition:** Concept kya hai?
2.  **Example:** Chhota real example dein.
3.  **Use case:** Project mein kab use karenge?
4.  **Trade-off:** Limitation ya risk kya hai?
5.  **Testing/production:** Isko verify ya monitor kaise karenge?

Example --- N+1: " N+1 tab hota hai jab parent list ke baad har item ke
relation ke liye separate query chale. Eloquent mein `with()` se eager
load kar sakte hain. Lekin main query logs aur execution plan check
karke verify karunga ki actual query count aur latency improve hui."

------------------------------------------------------------------------

# PART 7 --- PHP PATTERN-BASED CODING QUESTIONS

Pattern questions mein interviewer check karta hai ki aap loops, nested
loops, conditions aur spacing ko samajhte ho ya nahi. Har program ko
pehle paper par rows aur columns mein socho, phir PHP code likho.

**Basic rule:** - Outer loop (`$i`) decide karta hai kitni rows print
hongi. - Inner loop (`$j`) decide karta hai har row mein kitne
stars/numbers print honge. - `echo` same line par print karta hai;
`echo PHP_EOL` next line par le jaata hai. - Neeche ke examples
CLI/terminal output ke liye hain.

## 111. Solid square star pattern

**Question:** `n = 4` ke liye 4 × 4 stars print karo.

**Output:**

``` text
****
****
****
****
```

**PHP answer:**

``` php
$n = 4;

for ($i = 1; $i <= $n; $i++) {
    for ($j = 1; $j <= $n; $j++) {
        echo "*";
    }
    echo PHP_EOL;
}
```

**Easy explanation:** Outer loop 4 rows banata hai. Har row mein inner
loop 4 stars print karta hai.

## 112. Right-angled triangle star pattern

**Question:** Har next row mein ek extra star print karo.

**Output:**

``` text
*
**
***
****
```

**PHP answer:**

``` php
$n = 4;

for ($i = 1; $i <= $n; $i++) {
    for ($j = 1; $j <= $i; $j++) {
        echo "*";
    }
    echo PHP_EOL;
}
```

**Easy explanation:** Row 1 mein 1 star, row 2 mein 2 stars, aur isi
tarah. Inner loop ki limit `$i` hai, isliye stars badhte jaate hain.

## 113. Inverted right-angled triangle

**Question:** Pehli row mein 4 stars aur har next row mein ek star kam.

**Output:**

``` text
****
***
**
*
```

**PHP answer:**

``` php
$n = 4;

for ($i = $n; $i >= 1; $i--) {
    for ($j = 1; $j <= $i; $j++) {
        echo "*";
    }
    echo PHP_EOL;
}
```

**Easy explanation:** Outer loop 4 se 1 tak reverse chalta hai. Isliye
har row mein stars kam hote hain.

## 114. Number triangle

**Question:** Row number ke barabar numbers print karo.

**Output:**

``` text
1
12
123
1234
```

**PHP answer:**

``` php
$n = 4;

for ($i = 1; $i <= $n; $i++) {
    for ($j = 1; $j <= $i; $j++) {
        echo $j;
    }
    echo PHP_EOL;
}
```

**Easy explanation:** Inner loop ka `$j` 1 se current row number tak
chalta hai. Har row mein numbers dobara 1 se start hote hain.

## 115. Repeated row-number triangle

**Question:** Har row mein us row ka number repeat karo.

**Output:**

``` text
1
22
333
4444
```

**PHP answer:**

``` php
$n = 4;

for ($i = 1; $i <= $n; $i++) {
    for ($j = 1; $j <= $i; $j++) {
        echo $i;
    }
    echo PHP_EOL;
}
```

**Easy explanation:** Is baar print `$j` nahi, `$i` kar rahe hain. `$i`
current row number hai, isliye same number repeat hota hai.

## 116. Floyd's triangle

**Question:** Continuous counting numbers ko triangle shape mein print
karo.

**Output:**

``` text
1
2 3
4 5 6
7 8 9 10
```

**PHP answer:**

``` php
$n = 4;
$num = 1;

for ($i = 1; $i <= $n; $i++) {
    for ($j = 1; $j <= $i; $j++) {
        echo $num . " ";
        $num++;
    }
    echo PHP_EOL;
}
```

**Easy explanation:** `$num` loop ke bahar rakha hai, isliye har row ke
baad reset nahi hota. Har print ke baad `$num++` next number par le
jaata hai.

## 117. Pyramid star pattern

**Question:** Stars ko center mein pyramid shape mein print karo.

**Output:**

``` text
   *
  ***
 *****
*******
```

**PHP answer:**

``` php
$n = 4;

for ($i = 1; $i <= $n; $i++) {
    for ($space = 1; $space <= $n - $i; $space++) {
        echo " ";
    }

    for ($star = 1; $star <= (2 * $i - 1); $star++) {
        echo "*";
    }

    echo PHP_EOL;
}
```

**Easy explanation:** Har row mein pehle spaces print hote hain, phir
stars. Spaces kam hote hain aur stars 1, 3, 5, 7 ki tarah badhte hain.
`2 * $i - 1` odd numbers deta hai.

## 118. Inverted pyramid

**Question:** Sabse wide row se start karke ulta pyramid print karo.

**Output:**

``` text
*******
 *****
  ***
   *
```

**PHP answer:**

``` php
$n = 4;

for ($i = $n; $i >= 1; $i--) {
    for ($space = 1; $space <= $n - $i; $space++) {
        echo " ";
    }

    for ($star = 1; $star <= (2 * $i - 1); $star++) {
        echo "*";
    }

    echo PHP_EOL;
}
```

**Easy explanation:** Pyramid wale logic jaisa hi hai, bas outer loop
`$n` se 1 tak reverse chalta hai.

## 119. Diamond star pattern

**Question:** Pyramid aur inverted pyramid ko mila kar diamond banao.

**Output:**

``` text
   *
  ***
 *****
*******
 *****
  ***
   *
```

**PHP answer:**

``` php
$n = 4;

// Upper half
for ($i = 1; $i <= $n; $i++) {
    for ($space = 1; $space <= $n - $i; $space++) {
        echo " ";
    }
    for ($star = 1; $star <= (2 * $i - 1); $star++) {
        echo "*";
    }
    echo PHP_EOL;
}

// Lower half (top widest row repeat nahi karni)
for ($i = $n - 1; $i >= 1; $i--) {
    for ($space = 1; $space <= $n - $i; $space++) {
        echo " ";
    }
    for ($star = 1; $star <= (2 * $i - 1); $star++) {
        echo "*";
    }
    echo PHP_EOL;
}
```

**Easy explanation:** Pehla loop upper pyramid banata hai. Doosra loop
`n - 1` se start hota hai, taaki widest row do baar print na ho.

## 120. Hollow square pattern

**Question:** Square ki sirf boundary par stars print karo.

**Output:**

``` text
****
*  *
*  *
****
```

**PHP answer:**

``` php
$n = 4;

for ($i = 1; $i <= $n; $i++) {
    for ($j = 1; $j <= $n; $j++) {
        if ($i == 1 || $i == $n || $j == 1 || $j == $n) {
            echo "*";
        } else {
            echo " ";
        }
    }
    echo PHP_EOL;
}
```

**Easy explanation:** First row, last row, first column aur last column
boundary hain. In positions par star; baaki jagah space.

## 121. Alphabet triangle

**Question:** Har row mein A se current letter tak print karo.

**Output:**

``` text
A
AB
ABC
ABCD
```

**PHP answer:**

``` php
$n = 4;

for ($i = 1; $i <= $n; $i++) {
    for ($j = 0; $j < $i; $j++) {
        echo chr(65 + $j);
    }
    echo PHP_EOL;
}
```

**Easy explanation:** `chr(65)` ka result `A` hota hai, `chr(66)` ka
`B`. Isliye `65 + $j` se letters milte hain. Yeh example A--Z range ke
andar ke liye hai.

## 122. Reverse number triangle

**Question:** Har row mein numbers ko reverse order mein print karo.

**Output:**

``` text
1234
123
12
1
```

**PHP answer:**

``` php
$n = 4;

for ($i = $n; $i >= 1; $i--) {
    for ($j = 1; $j <= $i; $j++) {
        echo $j;
    }
    echo PHP_EOL;
}
```

**Easy explanation:** Outer loop row length ko 4 se 1 tak kam karta hai.
Inner loop har row mein 1 se current limit tak print karta hai.

## 123. Alternating 1 and 0 pattern

**Question:** Row aur column ke combination se 1/0 ka pattern banao.

**Output:**

``` text
1
01
101
0101
```

**PHP answer:**

``` php
$n = 4;

for ($i = 1; $i <= $n; $i++) {
    for ($j = 1; $j <= $i; $j++) {
        echo (($i + $j) % 2 === 0) ? "1" : "0";
    }
    echo PHP_EOL;
}
```

**Easy explanation:** `$i + $j` even ho to 1, odd ho to 0 print hota
hai. `% 2` remainder check karta hai.

## 124. Pascal's triangle (basic version)

**Question:** Pascal's triangle print karo, jahan har number pichhli row
ke do numbers ka sum hota hai.

**Output (`n = 5`):**

``` text
    1
   1 1
  1 2 1
 1 3 3 1
1 4 6 4 1
```

**PHP answer:**

``` php
$n = 5;

for ($i = 0; $i < $n; $i++) {
    for ($space = 0; $space < $n - $i - 1; $space++) {
        echo " ";
    }

    $value = 1;
    for ($j = 0; $j <= $i; $j++) {
        echo $value . " ";
        $value = intdiv($value * ($i - $j), $j + 1);
    }
    echo PHP_EOL;
}
```

**Easy explanation:** Har row ka pehla number 1 hota hai. Formula se
next number calculate hota hai. `intdiv()` integer division karta hai.
Bade `n` ke liye integer overflow ka dhyan rakhein.

## 125. Pattern ko function mein convert karo

**Question:** Reusable function banao jo kisi bhi positive size ka right
triangle print kare.

**PHP answer:**

``` php
function printTriangle(int $n): void
{
    if ($n < 1) {
        throw new InvalidArgumentException("Size must be at least 1");
    }

    for ($i = 1; $i <= $n; $i++) {
        echo str_repeat("*", $i) . PHP_EOL;
    }
}

printTriangle(5);
```

**Easy explanation:** Pattern logic ko function mein rakhne se code
reuse ho sakta hai. Input validate karna bhi achhi habit hai.

## Pattern questions solve karne ka shortcut

1.  Output ko row-by-row dekho: total rows kitni hain?
2.  Har row mein stars/numbers kitne hain?
3.  Kya spaces chahiye? Agar haan, spaces ka loop alag banao.
4.  Kya value row number (`$i`), column number (`$j`) ya running
    variable (`$num`) se aati hai?
5.  `n = 1`, `n = 2` aur `n = 4` par test karo.
6.  Exact spaces important ho sakte hain, isliye output ko code block
    mein compare karo.

**Practice without looking at answers:** hollow triangle, right-aligned
triangle, X pattern, butterfly pattern, multiplication-table pattern,
aur number pyramid khud implement karo.

------------------------------------------------------------------------

# PART 8 --- VIDEO RESOURCES FROM YOUR NOTION PAGE

1.  [PHP Tricky Interview Questions \| Coding
    Kalakar](https://www.youtube.com/watch?v=81j-wlwAmKY)
2.  [PHP Technical Round Interview Question Part
    1](https://www.youtube.com/watch?v=hkEGHGbwLIk&list=PLSVkvZFafGa8AQHMW1OtZTeZ37iWvqbm7)
3.  [Programming with Vishal --- Pattern Programs
    playlist](https://www.youtube.com/playlist?list=PLWCLxMult9xeJDGBLLGbY0AcgnkjfFFTK)
4.  [Programming with Vishal --- Pattern practice
    page](https://programmingwithvishal.com/demo/pattern/)

**Transcript limitation:** These URLs were listed in the exported Notion
page, but video transcripts were not available in the export and could
not be fetched directly here. The guide therefore explains the questions
actually present in your notes and adds the previous interview topics;
it does not claim to be a word-for-word video transcript.

------------------------------------------------------------------------

# FINAL REVISION CHECKLIST

-   [ ] PHP variables, types, `==` vs `===`, references, loops, errors
-   [ ] Arrays, strings, file handling, sessions/cookies
-   [ ] OOP, interfaces, abstract classes, traits, SOLID, dependency
    injection
-   [ ] Laravel lifecycle, service container, middleware, providers
-   [ ] Eloquent relations, N+1, mass assignment, validation
-   [ ] Queues, events, cache, transactions, API security, tests
-   [ ] SQL joins, grouping, subqueries, indexes, `EXPLAIN`
-   [ ] Deadlocks, ACID, pagination, window functions
-   [ ] One real project architecture explanation
-   [ ] One performance bug, one production incident, one integration
    challenge
-   [ ] Practise coding each snippet without looking at the answer
