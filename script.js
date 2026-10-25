// Nav turns solid after the hero
const nav=document.getElementById('nav');
const onScroll=()=>nav.classList.toggle('solid',scrollY>innerHeight*.6);
addEventListener('scroll',onScroll,{passive:true});onScroll();

// If a photo fails to load, hide it so the dark backdrop shows instead of a broken icon
document.querySelectorAll('img').forEach(i=>i.addEventListener('error',()=>{i.style.visibility='hidden'}));

// Savings estimate
const TARIFF=7, UNITS_PER_KW_MONTH=4.5*30*0.85, COST_PER_KW=55000;
const inr=n=>'₹ '+Math.round(n).toLocaleString('en-IN');
const bill=document.getElementById('bill');
function subsidy(kw){return Math.min(kw,2)*30000+Math.max(0,Math.min(kw,3)-2)*18000}
function calc(){
  const b=+bill.value, units=b/TARIFF;
  let kw=Math.max(1,Math.round(units/UNITS_PER_KW_MONTH*2)/2);
  const gen=kw*UNITS_PER_KW_MONTH;
  const covered=Math.min(gen,units);
  const yearSave=covered*TARIFF*12;
  const cost=Math.max(0,kw*COST_PER_KW-subsidy(kw));
  const pay=yearSave?cost/yearSave:0;
  billOut.textContent=inr(b);
  rKw.textContent=kw+' kW';
  rSave.textContent=inr(yearSave);
  rCost.textContent=inr(cost);
  rPay.textContent=pay.toFixed(1)+' years';
  draw(b*12,yearSave,cost);
}
function draw(yearBill,save,cost){
  // 10-year cumulative spend: keep paying the bill vs. solar cost + remaining bill
  const W=600,H=120,pad=4,max=yearBill*10;
  let a='',s='';
  for(let y=0;y<=10;y++){
    const x=pad+(W-2*pad)*y/10;
    a+=(y?'L':'M')+x+' '+(H-pad-(H-2*pad)*(yearBill*y)/max)+' ';
    s+=(y?'L':'M')+x+' '+(H-pad-(H-2*pad)*Math.min(max,cost+(yearBill-save)*y)/max)+' ';
  }
  bars.innerHTML=
    `<path d="${a}" fill="none" stroke="#4A6068" stroke-width="2.5" stroke-dasharray="5 5"/>`+
    `<path d="${s}" fill="none" stroke="#F0A202" stroke-width="3.5"/>`+
    `<text x="8" y="14" font-size="12" fill="#4A6068">Keep paying the bill (10 years)</text>`+
    `<text x="8" y="30" font-size="12" fill="#B87500" font-weight="600">Go solar</text>`;
}
bill.addEventListener('input',calc);calc();

// Contact form (demo: no backend)
form.addEventListener('submit',e=>{
  e.preventDefault();
  const n=form.name, p=form.phone;
  const okN=n.value.trim().length>1, okP=/^[6-9]\d{9}$/.test(p.value.replace(/\D/g,'').slice(-10));
  n.classList.toggle('bad',!okN);p.classList.toggle('bad',!okP);
  if(!okN||!okP){msg.textContent='Please enter your name and a 10-digit mobile number.';return}
  msg.textContent='Thanks, '+n.value.trim().split(' ')[0]+'. We will call you within one working day.';
  form.reset();
});
