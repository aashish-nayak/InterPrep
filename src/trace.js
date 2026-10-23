// Only reviewed, standalone examples are instrumented. Custom PHP still runs normally.
export const traceIds = new Set([4,5,7,8,9,10,11,12,13,15,16,28,29,30,46,47,48,49,50,51,52,53,54,56,57,58,59,60,...Array.from({length:14},(_,i)=>111+i)]);
export function instrument(code) {
 const names=[...new Set([...code.matchAll(/\$([a-zA-Z_]\w*)/g)].map(m=>m[1]))];
 const lines=code.split('\n');
 const body=lines.map((line,index)=>{
  const n=index+1, clean=line.split('//')[0].trim();
  if(!clean)return line;
  const loop=line.match(/^(\s*)for\s*\(([^;]*);([^;]*);(.*)\)\s*\{\s*$/);
  if(loop)return `${loop[1]}for (${loop[2]}; __ip_condition(${n}, get_defined_vars(), (${loop[3]})); ${loop[4]}) {`;
  const condition=line.match(/^(\s*)if\s*\((.*)\)\s*\{\s*$/);
  if(condition)return `${condition[1]}if (__ip_condition(${n}, get_defined_vars(), (${condition[2]}))) {`;
  if(/^foreach\s*\(.*\)\s*\{$/.test(clean))return `${line}\n__ip_record(${n}, get_defined_vars(), 'iteration');`;
  if(clean==='} else {')return `__ip_record(${n}, get_defined_vars(), 'block');\n} else {\n__ip_record(${n}, get_defined_vars(), 'else');`;
  if(clean==='}')return `__ip_record(${n}, get_defined_vars(), 'block');\n${line}`;
  if(clean.endsWith(';'))return `${line}\n__ip_record(${n}, get_defined_vars(), 'statement');`;
  throw new Error(`This example cannot be traced safely at line ${n}. Run it without animation.`);
 }).join('\n');
 return `<?php
$__ip_names = json_decode('${JSON.stringify(names)}', true);
$__ip_frames = [];
$__ip_error = null;
function __ip_record($line, $variables, $phase, $condition = null) {
    if (count($GLOBALS['__ip_frames']) >= 600) throw new RuntimeException('Trace stopped at 600 steps. Use a smaller example.');
    $visible = array_intersect_key($variables, array_flip($GLOBALS['__ip_names']));
    $GLOBALS['__ip_frames'][] = ['line'=>$line, 'variables'=>json_decode(json_encode($visible), true), 'phase'=>$phase, 'condition'=>$condition, 'output'=>substr(ob_get_contents(),0,12000)];
}
function __ip_condition($line, $variables, $result) {
    __ip_record($line, $variables, 'condition', (bool)$result);
    return $result;
}
ob_start();
try {
${body}
} catch (Throwable $__ip_failure) {
    $__ip_error = $__ip_failure->getMessage();
}
$__ip_output = ob_get_clean();
echo json_encode(['steps'=>$__ip_frames, 'output'=>substr($__ip_output,0,100000), 'error'=>$__ip_error], JSON_INVALID_UTF8_SUBSTITUTE);
`;
}
export function explainStep(frame,code,lang){
 if(!frame)return lang==='hi'?'Run & visualize dabao. Phir har executed line, variable aur output ek saath dekho.':'Run the example, then watch each executed line, variable and output change together.';
 const line=code.split('\n')[frame.line-1]?.trim()||'';
 const hi=lang==='hi';
 if(frame.phase==='condition')return frame.condition?(hi?'Condition true hai. Is block ke andar execution continue hoga.':'The condition is true. Execution enters this block.'):(hi?'Condition false hai. Loop ya branch se aage badhenge.':'The condition is false. Execution moves past this loop or branch.');
 if(frame.phase==='iteration')return hi?'Agla item mila. Loop variables ki nayi values dekho.':'The next item is assigned to the loop variables.';
 if(frame.phase==='else')return hi?'If condition false thi, isliye else branch chali.':'The if condition was false, so the else branch runs.';
 if(frame.phase==='block')return hi?'Is block ka kaam poora hua. Loop hoga to condition phir check hogi.':'This block has finished. A loop checks its condition again before continuing.';
 if(/^(echo|print|var_dump|print_r)\b/.test(line))return hi?'Yeh line output mein value likhti hai. Console mein ab tak ka exact output dekho.':'This line writes to the output. The console shows exactly what has been produced so far.';
 if(/^unset\(/.test(line))return hi?'Variable ka naam hata diya. Baaki references apni value rakh sakte hain.':'The variable binding is removed. Other references can still retain the value.';
 if(/\+\+|--|\+=|-=/.test(line))return hi?'Variable update hua. Nayi value previous step se compare karo.':'The variable is updated. Compare its new value with the previous step.';
 if(/=&|=\s*&/.test(line))return hi?'Dono variable names ab same value ko refer karte hain.':'Both variable names now refer to the same value.';
 return hi?'Line execute ho gayi. Variables panel mein iske baad ki values hain.':'The line has executed. The variables panel shows their values after this statement.';
}
