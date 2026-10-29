/** Scoped styles for the challenge, hive and models pages (all classes prefixed ch-). Uses the shared CSS tokens. */
export default function ChStyles() {
  return (
    <style>{`
.ch-scroll{overflow-x:auto;max-width:100%;border:1px solid var(--hair);border-radius:8px;background:var(--panel)}
.ch-scroll table{min-width:34rem}
.ch-scroll th{font-family:var(--font-head);font-size:.8rem;color:var(--ink-2);background:var(--sunk)}
.ch-scroll td{vertical-align:top;font-size:.9rem}
.ch-row{display:flex;flex-wrap:wrap;gap:.4rem;margin:.6rem 0;align-items:center}
.ch-seg{display:inline-flex;border:1px solid var(--hair);border-radius:999px;overflow:hidden;background:var(--panel)}
.ch-seg button{font-family:var(--font-head);font-size:.8rem;padding:.25rem .7rem;border:0;background:transparent;color:var(--ink-2);cursor:pointer}
.ch-seg button[aria-pressed="true"]{background:var(--ink);color:var(--bg)}
.ch-lab{font-family:var(--font-head);font-size:.78rem;color:var(--ink-3)}
.ch-bar{height:.9rem;background:var(--sunk);border-radius:4px;position:relative;overflow:hidden}
.ch-bar i{position:absolute;left:0;top:0;bottom:0;background:var(--vhh);border-radius:4px}
.ch-bar i.her2{background:var(--her2)}
.ch-bar i.amber{background:var(--amber)}
.ch-bar b{position:absolute;top:0;bottom:0;width:2px;background:var(--ink)}
.ch-prog{height:.6rem;background:var(--sunk);border-radius:999px;overflow:hidden}
.ch-prog i{display:block;height:100%;background:var(--good);transition:width .2s}
.ch-day{display:flex;gap:.7rem;align-items:flex-start;border:1px solid var(--hair);border-radius:8px;background:var(--panel);padding:.6rem .8rem;margin:.5rem 0}
.ch-day.today{border-color:var(--her2);box-shadow:0 0 0 2px var(--her2-soft)}
.ch-day.done .ch-day-t{text-decoration:line-through;color:var(--ink-3)}
.ch-day input{width:1.15rem;height:1.15rem;margin-top:.25rem;accent-color:var(--vhh);flex:none}
.ch-day-body{min-width:0;flex:1}
.ch-day-h{font-family:var(--font-head);font-weight:600;font-size:.95rem}
.ch-day-d{font-size:.9rem;color:var(--ink-2);margin:.15rem 0;overflow-wrap:anywhere}
.ch-grid{display:grid;gap:.7rem;grid-template-columns:repeat(auto-fit,minmax(15rem,1fr))}
.ch-card{border:1px solid var(--hair);border-radius:8px;background:var(--panel);padding:.7rem .9rem;min-width:0}
.ch-card h3{margin:.1rem 0 .3rem;font-size:1.02rem}
.ch-card p{margin:.3rem 0;font-size:.92rem}
.ch-rung{border-left:4px solid var(--vhh)}
.ch-rung.s5{border-left-color:var(--amber)}
.ch-node{font-family:var(--font-head);font-size:.88rem;text-align:left;border:1px solid var(--hair);background:var(--panel);color:var(--ink);border-radius:8px;padding:.45rem .7rem;cursor:pointer;line-height:1.3}
.ch-node:hover{border-color:var(--vhh)}
.ch-node[aria-pressed="true"]{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.ch-node.emp{border-color:var(--her2);font-weight:700}
.ch-node.king{border-color:var(--vhh);font-weight:600}
.ch-tree{display:grid;gap:.9rem}
.ch-tree .top{display:flex;justify-content:center}
.ch-kings{display:grid;gap:.9rem;grid-template-columns:repeat(auto-fit,minmax(16rem,1fr))}
.ch-king{border:1px dashed var(--hair);border-radius:10px;padding:.7rem;display:grid;gap:.5rem;align-content:start;min-width:0}
.ch-queens{display:grid;gap:.4rem}
.ch-md{font-size:.95rem}
.ch-md h1{font-size:1.4rem}.ch-md h2{font-size:1.2rem;margin:1.2rem 0 .4rem}.ch-md h3{font-size:1.05rem}
.ch-md table{display:block;overflow-x:auto;max-width:100%}
.ch-md li{margin:.2rem 0}
.ch-md p,.ch-md li{overflow-wrap:anywhere}
.ch-panel{border:1px solid var(--hair);border-radius:10px;background:var(--panel);padding:.8rem 1rem;margin:1rem 0;min-width:0}
.ch-sev-high{color:var(--bad)}.ch-sev-med{color:var(--amber)}.ch-sev-low{color:var(--good)}
.ch-num{font-variant-numeric:tabular-nums;white-space:nowrap}
.ch-kv{display:grid;grid-template-columns:7rem 1fr;gap:.2rem .8rem;font-size:.92rem;margin:.3rem 0}
.ch-kv dt{font-family:var(--font-head);color:var(--ink-3);font-size:.8rem}
.ch-kv dd{margin:0;overflow-wrap:anywhere}
.ch-svg{width:100%;height:auto;display:block}
.ch-svg text{font-family:var(--font-head);fill:var(--ink-2);font-size:11px}
.ch-brow{display:grid;grid-template-columns:minmax(7rem,12rem) 1fr 5.5rem;gap:.5rem;align-items:center;margin:.35rem 0;font-size:.88rem}
.ch-brow span:first-child{overflow-wrap:anywhere}
@media (max-width:520px){.ch-kv{grid-template-columns:1fr}.ch-brow{grid-template-columns:1fr 4.5rem}.ch-brow .ch-bar{grid-column:1 / -1;order:3}}
`}</style>
  );
}
