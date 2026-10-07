import React, { useEffect, useMemo, useState } from "react";
import { Play, Pause, RotateCcw, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import "./App.css";

export default function App(){
 const [vs,setVs]=useState(60),[vb,setVb]=useState(90),[delay,setDelay]=useState(10),[time,setTime]=useState(0),[running,setRunning]=useState(false),[showEq,setShowEq]=useState(false);
 const lead=vs*delay, catchT=vb>vs?lead/(vb-vs):Infinity, total=Number.isFinite(catchT)?delay+catchT:delay+30;
 const bt=Math.max(0,time-delay), sd=vs*time, bd=time<delay?0:vb*bt, caught=Number.isFinite(catchT)&&bt>=catchT;
 const phase=time===0?'ready':time<delay?'younger':caught?'caught':'chase';
 const maxD=Math.max(vs*total,100), pct=d=>Math.min(94,5+d/maxD*88), fmt=n=>Number.isInteger(n)?n:n.toFixed(1);
 useEffect(()=>{if(!running)return;const id=setInterval(()=>setTime(v=>{const n=Math.min(v+.25,total);if(n>=total)setRunning(false);return n}),120);return()=>clearInterval(id)},[running,total]);
 useEffect(()=>{setTime(0);setRunning(false);setShowEq(false)},[vs,vb,delay]);
 const msg=useMemo(()=>phase==='ready'?'まず弟が家から出発します。兄は家で待っています。':phase==='younger'?`弟だけが先に歩いています。兄の出発まであと ${fmt(delay-time)} 分。`:phase==='chase'?'兄が自転車で出発！ 歩いている弟を後ろから追いかけます。':'追いついた！ 2人の家からの道のりが同じになりました。',[phase,delay,time]);
 return <main><section className="wrap"><header><small>中学1年 方程式の利用</small><h1>弟が先に出発！ 自転車の兄が追いかける</h1><p>弟が先に進み、あとから兄が追いかけて追いつく流れを動かして確かめよう。</p></header>
 <div className="card problem">弟は家から歩いて毎分 <b>{vs}m</b> で進みます。<br/><b>{delay}分後</b>、兄が自転車で毎分 <b>{vb}m</b> で追いかけます。<h2>兄は出発してから何分後に弟に追いつく？</h2></div>
 <div className="controls"><Control label="弟の速さ（m/分）" v={vs} set={setVs} min={20} max={100} step={10}/><Control label="兄の速さ（m/分）" v={vb} set={setVb} min={30} max={140} step={10}/><Control label="弟が先に歩く時間（分）" v={delay} set={setDelay} min={1} max={20} step={1}/></div>
 <div className="card"><div className="top"><div><span>弟が家を出発してから</span><strong>{fmt(time)} 分</strong>{time>=delay&&<b className="blue">兄が出発してから {fmt(bt)} 分</b>}</div><div className="buttons"><button onClick={()=>setRunning(!running)} disabled={!Number.isFinite(catchT)}>{running?<Pause/>:<Play/>}{running?'一時停止':time===0?'弟スタート':caught?'終了':'つづける'}</button><button className="secondary" onClick={()=>{setTime(0);setRunning(false)}}><RotateCcw/>最初にもどす</button></div></div>
 <div className={'status '+phase}>{msg}</div>
 <div className="scene"><div className="house">🏠<em>家・スタート</em></div><div className="road r1"/><div className="road r2"/>
 <motion.div className="walker" animate={{left:`${pct(sd)}%`}} transition={{duration:.12,ease:'linear'}}><motion.div className="walkicon" animate={running?{rotate:[-5,5,-5]}:{rotate:0}} transition={{duration:.42,repeat:running?Infinity:0}}><span>🚶</span></motion.div><label>弟 →</label></motion.div>
 <motion.div className="cyclist" animate={{left:`${pct(bd)}%`}} transition={{duration:.12,ease:'linear'}}><div className={time<delay?'waiting':''}><div className="bike">🚴</div><label>兄 →</label></div>{time<delay&&<i>まだ家で待つ</i>}</motion.div></div>
 <input className="timeline" type="range" min="0" max={total} step=".25" value={time} onChange={e=>{setRunning(false);setTime(+e.target.value)}}/>
 <div className="meters"><div>🚶 <b>弟</b><strong>{fmt(sd)} m</strong><span>家からずっと歩いている</span></div><div>🚴 <b>兄</b><strong>{fmt(bd)} m</strong><span>{time<delay?'まだ出発していない':`出発してから ${fmt(bt)} 分`}</span></div></div>{caught&&<div className="success"><CheckCircle2/>追いついた！ 2人の家からの道のりが同じになった。</div>}</div>
 <div className="card"><h2>追いついた瞬間を式にする</h2><div className="key">追いついたときは <b>兄の道のり ＝ 弟の道のり</b></div><button className="eqbtn" onClick={()=>setShowEq(!showEq)}>{showEq?'式をかくす':'方程式を見る'}</button>{showEq&&Number.isFinite(catchT)&&<div className="equation"><p>兄が出発してから x 分後とする</p><p>{vb}x ＝ {lead} ＋ {vs}x</p><p>({vb-vs})x ＝ {lead}</p><p className="answer">x ＝ {fmt(catchT)}</p><small>答え：兄が出発してから <b>{fmt(catchT)}分後</b></small></div>}</div>
 </section></main>}
function Control({label,v,set,min,max,step}){return <div className="control"><b>{label}</b><strong>{v}</strong><input type="range" min={min} max={max} step={step} value={v} onChange={e=>set(+e.target.value)}/></div>}
