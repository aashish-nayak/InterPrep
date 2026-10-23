import { instrument } from './trace.js';
self.onmessage=async ({data})=>{
 const {code,trace=false}=typeof data==='string'?{code:data}:data;
 try{
 const { PHP, loadPHPRuntime, setPhpIniEntries } = await import('@php-wasm/universal');
 const { getPHPLoaderModule } = await import('@php-wasm/web-8-3');
 const php=new PHP(await loadPHPRuntime(await getPHPLoaderModule()));
 await setPhpIniEntries(php,{html_errors:'0',memory_limit:'64M'});
 self.postMessage({type:'running'});
 const response=await php.run({code:trace?instrument(code):(code.trimStart().startsWith('<?php')?code:`<?php\n${code}`)});
 if(trace){const result=JSON.parse(response.text);self.postMessage({type:result.error?'error':'done',...result});}
 else{const output=(response.text+(response.errors?'\n'+response.errors:'')).slice(0,100000);self.postMessage({type:response.exitCode===0?'done':'error',output:output||'(Execution completed with no output)'});}
 }catch(error){self.postMessage({type:'error',output:String(error.message||error),error:String(error.message||error)});}
};
