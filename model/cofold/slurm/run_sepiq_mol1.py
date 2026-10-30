import json,re,subprocess,sys,time,os
from pathlib import Path
R=Path("/scratch/<user>/sepiq26"); M1=Path("/scratch/<user>/engines/mol1")
OUT=R/"mol1_out"; OUT.mkdir(exist_ok=True)
names=["9MTE_27A05","9MTX_29E09","9MTE_47D05","ONU23","ONU11","ONU13"]
seeds=[101,102,103]
for n in names:
    t=(R/"inputs_msa"/f"{n}.yaml").read_text()
    ch=re.findall(r"id: (\w)\n\s+sequence: (\w+)\n\s+msa: (\S+)",t)
    assert len(ch)==2,n
    d=OUT/n
    if (d/"DONE").exists(): print("skip",n,flush=True); continue
    d.mkdir(exist_ok=True)
    seqs=[{"proteinChain":{"sequence":s,"count":1,"id":[i],"unpairedMsaPath":str(R/m)}} for i,s,m in ch]
    jp=d/f"{n}.json"; jp.write_text(json.dumps([{"name":n,"modelSeeds":seeds,"sequences":seqs}]))
    cmd=["mol","pred","-i",str(jp),"-o",str(d/"raw"),"--load_checkpoint_path",str(M1/"data/checkpoint/mol-1-base.pt"),
         "--seeds",",".join(map(str,seeds)),"--sample","5","--step","200","--cycle","20","--dtype","bf16",
         "--use_msa","true","--use_template","false","--use_rna_msa","false"]
    t0=time.time(); r=subprocess.run(cmd); print("TIMING",n,"rc",r.returncode,"wall",round(time.time()-t0),flush=True)
    if r.returncode==0: (d/"DONE").write_text("ok")
print("ALL_DONE")
