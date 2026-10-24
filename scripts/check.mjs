import assert from 'node:assert/strict';
import fs from 'node:fs';
import {selectQuestions,sampleQuestions,readStore} from '../src/model.js';
const q=JSON.parse(fs.readFileSync('src/questions.json','utf8'));
const source=fs.readFileSync('public/sources/updated-guide.md','utf8');
const ids=[...source.matchAll(/^## (\d+)\./gm)].map(m=>+m[1]);
assert.deepEqual(q.filter(x=>x.source==='updated-guide').map(x=>x.id),ids);
assert.equal(q.filter(x=>x.source==='original-questions').length,JSON.parse(fs.readFileSync('src/additional.json','utf8')).length);
assert.equal(new Set(q.map(x=>x.id)).size,q.length);
for(const item of q){for(const lang of ['en','hi']){assert.ok(item.title[lang]?.length>3);assert.ok(item.answer[lang]?.length>30);}assert.ok(item.category);}
assert.ok(fs.readFileSync('public/sources/original-questions.md','utf8').includes('Interview Questions for Laravel'));
assert.equal(selectQuestions(q,{query:'N+1'}).some(x=>x.id===69),true);
assert.equal(selectQuestions(q,{query:'zzzz-no-match'}).length,0);
assert.deepEqual(selectQuestions(q,{savedOnly:true,saved:[1,12]}).map(x=>x.id),[1,12]);
assert.deepEqual(selectQuestions(q,{status:'learned',progress:{'1':'learned','2':'review'}}).map(x=>x.id),[1]);
assert.ok(selectQuestions(q,{category:'sql'}).every(x=>x.category==='sql'));
assert.equal(sampleQuestions(q,10).length,10);assert.equal(new Set(sampleQuestions(q,125).map(x=>x.id)).size,125);assert.deepEqual(sampleQuestions([],10),[]);
assert.equal(readStore({getItem:()=>'{broken'}).lang,'hi');
assert.deepEqual(readStore({getItem:()=>JSON.stringify({saved:[1,'oops'],progress:{'1':'learned','2':'garbage'},lang:'en'})}).saved,[1]);
assert.ok(q.find(x=>x.id===47).answer.en.includes('evaluation order'));
import {cleanTextForSpeech,getVoiceConfig,normalizeTtsModel,GEMINI_TTS_MODELS,getAudioCacheStats,clearAudioCache} from '../src/tts.js';
assert.equal(cleanTextForSpeech('Hello `PHP` **world**!'), 'Hello PHP world!');
assert.equal(getVoiceConfig({lang:'hi'}).languageCode, 'hi-IN');
assert.equal(getVoiceConfig({lang:'hi',gender:'FEMALE'}).voiceName, 'Kore');
assert.equal(getVoiceConfig({lang:'en',gender:'MALE'}).voiceName, 'Puck');
assert.equal(normalizeTtsModel('gemini-3.8-flash'), 'gemini-3.8-flash');
assert.equal(normalizeTtsModel(''), 'gemini-3.8-flash');
assert.equal(normalizeTtsModel('gemini-2.0-flash'), 'gemini-3.8-flash');
assert.ok(GEMINI_TTS_MODELS.length >= 1);
assert.equal(readStore({getItem:(k)=>k==='google_tts_api_key'?'my-test-key':null}).googleTtsApiKey, 'my-test-key');
assert.equal(readStore({getItem:()=>null}).ttsModel, 'gemini-3.8-flash');
assert.equal(readStore({getItem:()=>JSON.stringify({ttsModel:'gemini-3.8-flash'})}).ttsModel, 'gemini-3.8-flash');
const stats = await getAudioCacheStats();
assert.equal(typeof stats.count, 'number');
await clearAudioCache();

import { executeSql } from '../src/lib/sqlEngine.js';
const sqlTest = executeSql('SELECT email, COUNT(*) AS occurrences FROM users WHERE email IS NOT NULL GROUP BY email HAVING COUNT(*) > 1;');
assert.ok(sqlTest.rows.length >= 2, 'Duplicate emails query should return at least 2 rows');
assert.equal(sqlTest.columns.join(','), 'email,occurrences');

const sqlNoOrders = executeSql('SELECT c.id, c.name FROM customers c WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);');
assert.ok(sqlNoOrders.rows.length >= 2, 'Customers with no orders should return at least 2 rows');

console.log('CONTENT_AND_LOGIC_OK');
