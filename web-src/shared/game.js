// Shared rules preserve the original scoring and question bank.
export function tokens(expression) {
  const compact = expression.replace(/\s/g, '');
  const result = compact.match(/\d+|[+x÷-]/g) || [];
  if (result.join('') !== compact || result.length % 2 !== 1 || result.some((v,i) => i%2 ? !/^[+x÷-]$/.test(v) : !/^\d+$/.test(v))) throw new Error('Invalid expression');
  return result;
}
export function evaluate(expression) {
  const values = tokens(expression); const reduced = [Number(values[0])];
  for (let i=1;i<values.length;i+=2) {
    const op=values[i], n=Number(values[i+1]);
    if (op==='x') reduced[reduced.length-1]*=n;
    else if(op==='÷') reduced[reduced.length-1]/=n;
    else reduced.push(op,n);
  }
  let result=reduced[0];
  for(let i=1;i<reduced.length;i+=2) result+=reduced[i]==='+'?reduced[i+1]:-reduced[i+1];
  return result;
}
export function operationOrder(display) {
  return [...display.map((t,i)=>['x','÷'].includes(t)?i:-1).filter(i=>i>=0),...display.map((t,i)=>['+','-'].includes(t)?i:-1).filter(i=>i>=0)];
}
export class Game {
  constructor(bank, random=Math.random) { this.bank=bank; this.random=random; this.round=0;this.problem=0;this.points=0;this.unlocked=0;this.confirmed=[];this.badges=[];this.done=false;this.prepare(); }
  prepare() {
    if(this.done) return;
    this.expressions=this.bank[this.round][this.problem];
    // Keep each number intact and choose placements with distinct audible signatures.
    this.displays=this.expressions.map(tokens);
    const candidates=this.displays.map(display=>{
      const count=18-display.length;
      const offset=Math.floor(this.random()*count);
      return Array.from({length:count},(_,i)=>(i+offset)%count);
    });
    const starts=[], orders=[], signatures=new Set();
    const place=piano=>{
      if(piano===this.displays.length)return true;
      for(const start of candidates[piano]){
        const order=operationOrder(this.displays[piano]).map(i=>i+start);
        const signature=order.join(',');
        if(signatures.has(signature))continue;
        starts[piano]=start;orders[piano]=order;signatures.add(signature);
        if(place(piano+1))return true;
        signatures.delete(signature);
      }
      return false;
    };
    if(!place(0))throw new Error('Question cannot provide distinct sound answers');
    this.starts=starts;this.orders=orders;
    this.remaining=this.orders.map(o=>[...o]);this.credited=this.orders.map(()=>new Set()); this.correct=Math.floor(this.random()*3);
  }
  key(piano,index) {
    if(this.done)return false;
    const ok=this.remaining[piano][0]===index;
    if(ok){
      this.remaining[piano].shift();
      if(!this.credited[piano].has(index)){this.points+=this.scoring?.correctKey??10;this.credited[piano].add(index);}
    }else{
      this.points-=this.scoring?.wrongKey??10;
      this.remaining[piano]=[...this.orders[piano]];
    }
    return ok;
  }
  answer(index,numeric) {
    if(this.done) return null;
    const ok=index===this.correct;
    const bonus=ok && String(numeric).trim()!=='' && Math.abs(Number(numeric)-evaluate(this.expressions[index]))<1e-9;
    this.points+=ok?50:-50;if(bonus)this.points+=11;this.badges[this.problem]=ok;
    const before=this.unlocked;this.unlocked=Math.min(4,Math.max(this.unlocked,Math.floor(Math.max(0,this.points)/100)));
    this.problem++;
    if(this.problem===this.bank[this.round].length) { this.problem=0;this.round++; if(this.round===this.bank.length)this.done=true;else this.badges=[]; }
    this.prepare();return {ok,bonus,unlocked:this.unlocked>before};
  }
  confirm(index,text) { if(index>=this.unlocked || !text.trim() || this.confirmed[index]) return false;this.confirmed[index]=true;this.points+=3;return true; }
}
