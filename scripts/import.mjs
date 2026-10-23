import fs from 'node:fs';
const source = fs.readFileSync('public/sources/updated-guide.md','utf8');
const english = fs.readFileSync('src/english.txt','utf8').trim().split(/\r?\n/).map(line=>line.split('|'));
const sections = [...source.matchAll(/^## (\d+)\. (.+)\r?\n([\s\S]*?)(?=^## |^# |$(?![\s\S]))/gm)];
const questions = sections.map((m,i)=>{
 const id=Number(m[1]);
 const body=m[3].replace(/^-{5,}\s*$/gm,'').trim();
 const code=[...body.matchAll(/```\s*(php|sql)\s*\n([\s\S]*?)```/g)].map(c=>({language:c[1],text:c[2].trim()}));
 const explanation=body.replace(/```[\s\S]*?```/g,'').replace(/\*\*(Output[^*]*|PHP answer|Question):?\*\*/g,'').replace(/\n{3,}/g,'\n\n').trim();
 const category=id<=33?'php':id<=45?'oop':id<=60?'coding':id<=83?'laravel':id<=101?'sql':id<=110?'scenarios':'patterns';
 return {id,category,level:['laravel','sql','scenarios'].includes(category)?'Intermediate':'Foundation',title:{en:english[i]?.[0],hi:m[2].replace(/`/g,'')},answer:{en:english[i]?.[1],hi:explanation},code,source:'updated-guide'};
});
if(questions.length!==125 || english.length!==125 || questions.some(q=>!q.title.en||!q.answer.en)) throw Error('Incomplete curriculum');
questions[46].answer.hi='Is mixed expression ke operand evaluation order par depend mat karo. PHP generally order guarantee nahi karta. Alag statements likho: $a = $x++; phir $b = ++$x; phir echo $a + $b;. Agar $x pehle 5 tha, in separate statements ka output 12 hoga.';
questions[46].code=[{language:'php',text:'$x = 5;\n$a = $x++;\n$b = ++$x;\necho $a + $b;'}];
questions[56].answer.hi='Pehle array_count_values se har value ki frequency gino. Phir array_filter se count 1 se zyada wale entries rakho. Unki keys duplicate values hain: is example mein 2 aur 4.';
const additional=JSON.parse(fs.readFileSync('src/additional.json','utf8')).map(q=>({...q,level:'Intermediate',source:'original-questions'}));
fs.writeFileSync('src/questions.json',JSON.stringify([...questions,...additional],null,2));
console.log(`Imported ${questions.length} bilingual questions`);

