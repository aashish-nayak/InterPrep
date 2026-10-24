export function selectQuestions(questions,{query='',category='all',savedOnly=false,saved=[],progress={},status='all'}={}) {
 const needle=query.trim().toLowerCase();
 return questions.filter(q=>(category==='all'||q.category===category)&&(!savedOnly||saved.includes(q.id))&&(status==='all'||(status==='unread'?!progress[q.id]:progress[q.id]===status))&&(!needle||[q.title.en,q.title.hi,q.answer.en,q.answer.hi].join(' ').toLowerCase().includes(needle)));
}
export function sampleQuestions(items,count,random=Math.random){
 const copy=[...items];
 for(let i=copy.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}
 return copy.slice(0,Math.min(count,copy.length));
}
export function readStore(storage){
 try{
 const data=JSON.parse(storage.getItem('interprep-v1')||'{}');
 const dedicatedKey=typeof storage.getItem==='function'?(storage.getItem('google_tts_api_key')||storage.getItem('gemini_api_key')):'';
 const googleTtsApiKey=(typeof data.googleTtsApiKey==='string'&&data.googleTtsApiKey.trim())||(typeof dedicatedKey==='string'&&dedicatedKey.trim())||'';
 const ttsVoiceName=['Kore','Aoede','Puck','Charon','Fenrir'].includes(data.ttsVoiceName)?data.ttsVoiceName:'Kore';
 const ttsGender=['FEMALE','MALE'].includes(data.ttsGender)?data.ttsGender:'FEMALE';
 const rawModel=typeof data.ttsModel==='string'&&data.ttsModel?data.ttsModel:'gemini-3.8-flash-tts';
 const ttsModel=rawModel==='gemini-3.8-flash'?'gemini-3.8-flash-tts':rawModel;
 return {
  lang:data.lang==='en'?'en':'hi',
  saved:Array.isArray(data.saved)?data.saved.filter(Number.isInteger):[],
  progress: data.progress&&typeof data.progress==='object'&&!Array.isArray(data.progress)?Object.fromEntries(Object.entries(data.progress).filter(([k,v])=>/^\d+$/.test(k)&&['learned','review'].includes(v))):{},
  history:Array.isArray(data.history)?data.history.filter(h=>h&&Number.isFinite(h.total)&&Number.isFinite(h.confident)&&typeof h.date==='string').slice(0,20):[],
  theme:['light','dark'].includes(data.theme)?data.theme:null,
  googleTtsApiKey,
  ttsVoiceName,
  ttsGender,
  ttsModel
 };
 }catch{return {lang:'hi',saved:[],progress:{},history:[],theme:null,googleTtsApiKey:'',ttsVoiceName:'Kore',ttsGender:'FEMALE',ttsModel:'gemini-3.8-flash-tts'};}
}
