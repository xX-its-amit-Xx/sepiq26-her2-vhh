import json,sys
from anarci import anarci
M=json.load(open(r"C:\Temp\sepiq26\bench\meta.json"))
seqs={}
for k,e in M.items():
    pe=[p for p in e['polymer_entities'] if p['entity_poly']['rcsb_entity_polymer_type']=='Protein']
    if len(pe)!=2: continue
    for p in pe: seqs[p['rcsb_id']]=p['entity_poly']['pdbx_seq_one_letter_code_can']
print(len(seqs),flush=True)
items=list(seqs.items()); out={}
for i in range(0,len(items),100):
    b=items[i:i+100]
    res=anarci(b,scheme="imgt",allowed_species=None)
    for (n,s),num,det in zip(b,res[0],res[1]):
        if num is None: out[n]=None; continue
        d=det[0]; out[n]={'ndom':len(det),'chains':[x.get('chain_type') for x in det],'chain':d.get('chain_type'),'start':d['query_start'],'end':d['query_end'],'evalue':d.get('evalue'),'species':d.get('species')}
    print(i,flush=True)
json.dump(out,open(r"C:\Temp\sepiq26\bench\anarci.json","w"))
