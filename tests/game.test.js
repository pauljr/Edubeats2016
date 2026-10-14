import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {Game,evaluate,operationOrder} from '../web/shared/game.js';
const sandbox={};vm.runInNewContext(fs.readFileSync('web/problems.js','utf8'),sandbox);const bank=sandbox.superProblems;
test('math precedence and legacy digit spacing use a parser, without eval',()=>{
 assert.equal(evaluate('1 8 + 1 7 - 1 6 ÷ 8'),33);assert.equal(evaluate('9 x 13 +13 - 3'),127);assert.equal(evaluate('8 ÷ 4 x 3 - 1'),5);assert.throws(()=>evaluate('alert(1)'));assert.deepEqual(operationOrder(['3','+','2','x','4','÷','2','-','1']),[3,5,1,7]);
});
test('entire original bank fits keyboards and ends cleanly after 76 questions',()=>{
 const game=new Game(bank,()=>0.4);let count=0;
 while(!game.done){game.displays.forEach((d,j)=>{assert.ok(d.length+game.starts[j]<=17);assert.ok(game.orders[j].every(i=>i>=0&&i<17));});game.answer(game.correct,evaluate(game.expressions[game.correct]));count++;}
 assert.equal(count,76);assert.equal(game.unlocked,4);assert.equal(game.round,19);assert.equal(game.answer(0,''),null);
});
test('incorrect answers, blank bonus answers, key order, and repeat confirmation',()=>{
 const game=new Game(bank,()=>0);assert.equal(game.key(0,game.orders[0][1]),false);assert.equal(game.points,-10);assert.equal(game.key(0,game.orders[0][0]),true);assert.equal(game.points,0);game.answer(1,'');assert.equal(game.points,-50);assert.equal(game.confirm(0,'verse'),false);
 while(game.unlocked===0)game.answer(game.correct,'');const before=game.points;assert.equal(game.confirm(0,' '),false);assert.equal(game.confirm(0,'Four lines'),true);assert.equal(game.confirm(0,'Four lines'),false);assert.equal(game.points,before+3);
});
test('every original question has exactly one audible answer, even with constant RNG',()=>{
 for(const random of [()=>0,()=>0.4,()=>0.999999,Math.random]){
  const game=new Game(bank,random);
  while(!game.done){
   const signatures=game.orders.map(order=>order.join(','));
   assert.equal(new Set(signatures).size,3);
   assert.equal(signatures.filter(s=>s===signatures[game.correct]).length,1);
   game.orders.forEach(order=>assert.equal(new Set(order).size,order.length));
   game.answer(game.correct,'');
  }
 }
});
test('multi-digit values remain whole on a single key',()=>{
 const game=new Game([[['1 5 + 4 - 3','13 + 8 - 9','1 2 + 8 - 7']]],()=>0);
 assert.deepEqual(game.displays[0],['15','+','4','-','3']);
});
test('wrong keys reset only the active piano and cannot farm replay rewards',()=>{
 const game=new Game(bank,()=>0);
 game.orders[1].forEach(i=>game.key(1,i));
 assert.equal(game.remaining[1].length,0);
 const first=game.orders[0][0];game.key(0,first);
 const score=game.points;
 const wrong=Array.from({length:17},(_,i)=>i).find(i=>!game.orders[0].includes(i));
 assert.equal(game.key(0,wrong),false);
 assert.equal(game.points,score-10);
 assert.deepEqual(game.remaining[0],game.orders[0]);
 assert.equal(game.remaining[1].length,0);
 const beforeReplay=game.points;assert.equal(game.key(0,first),true);assert.equal(game.points,beforeReplay);
});
