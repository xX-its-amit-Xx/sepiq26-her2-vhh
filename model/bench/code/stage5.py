import json,csv,os,gzip,statistics,collections
Bd=r"C:\Temp\sepiq26\bench"; D=r"D:\Users\<user>\.devin\SEPIQ_2026\model\bench"
os.makedirs(D,exist_ok=True)
pool=json.load(open(Bd+r"\stage4.json"))
pool.sort(key=lambda r:(r['release'],-r['res']),reverse=True)
for r in pool:
    r['ag_resolved_frac']=r['n_A_resolved']/r['ag_len']
    why=r['excluded']
    if not why and r['ag_resolved_frac']<0.5: why=f"antigen only {r['ag_resolved_frac']:.0%} resolved"
    if not why and (r['n_A_pos']<5 or r['n_B_pos']<5): why='<5 positives on a chain'
    r['filter_note']=why
elig=[r for r in pool if not r['filter_note']]
core=elig[:40]; cs={r['pdb'] for r in core}
for i,r in enumerate(core,1): r['bench_id']=f"B{i:02d}"
for r in pool:
    r['in_core']=int(r['pdb'] in cs)
    if r['pdb'] not in cs: r['bench_id']=''
print('pool',len(pool),'eligible',len(elig),'core',len(core))
hdr=["bench_id","pdb_id","release_date","resolution_A","method","antigen_name","antigen_uniprot","antigen_organism","vhh_name","antigen_chain_auth","vhh_chain_auth","antigen_len","vhh_len","antigen_resolved","vhh_resolved","n_pos_antigen","n_pos_vhh","base_rate_antigen","base_rate_vhh","n_pos_antigen_ge5","n_pos_vhh_ge5","vhh_cdr3_imgt","n_vhh_copies_asu","n_antigen_copies_asu","antigen_group","after_boltz2_cutoff_2023-06-01","in_core","filter_note"]
def man(r):
    return [r['bench_id'],r['pdb'],r['release'],r['res'] if isinstance(r['res'],int) else round(r['res'],3),r['method'],r['ag_desc'],r['ag_uniprot'],r['ag_org'],r['vhh_desc'],r['ag_chain'],r['vhh_chain'],r['ag_len'],r['vh_len'],r['n_A_resolved'],r['n_B_resolved'],r['n_A_pos'],r['n_B_pos'],round(r['n_A_pos']/r['ag_len'],4),round(r['n_B_pos']/r['vh_len'],4),r['n_A_pos_ge5'],r['n_B_pos_ge5'],r['cdr3'],r['n_vhh_copies'],r['n_ag_copies'],r['ag_group'],int(r['release']>='2023-06-01'),r['in_core'],r['filter_note']]
for name,rs in (("manifest.csv",core),("manifest_pool.csv",pool)):
    with open(f"{D}\{name}","w",newline="",encoding="utf-8") as f:
        w=csv.writer(f,lineterminator="\n"); w.writerow(hdr); w.writerows(man(r) for r in rs)
lh=["proxy_id","pdb_id","vhh_name","chain","seqNum","resName","resolved","auth_chain","auth_seq","icode","area","fact_gt0","fact_ge5","fact_d4","min_dist_A","rsa_isolated_chain","imgt"]
for r in core:
    for x in r['_rec']: x[0]=r['bench_id']
with open(Bd+r"\labels.csv","w",newline="") as f:
    w=csv.writer(f,lineterminator="\n"); w.writerow(lh)
    for r in core: w.writerows(r['_rec'])
print('labels bytes',os.path.getsize(Bd+r"\labels.csv"))
# pool labels (C: only)
with open(Bd+r"\labels_pool.csv","w",newline="") as f:
    w=csv.writer(f,lineterminator="\n"); w.writerow(lh)
    for r in pool:
        for x in r['_rec']: x[0]=r['bench_id'] or 'X_'+r['pdb']
        w.writerows(r['_rec'])
# fasta
for r in core:
    open(os.path.join(Bd,'fasta',r['bench_id']+'_'+r['pdb']+'.fasta'),'w').write(f">protein|name=A\n{r['ag_seq']}\n>protein|name=B\n{r['vh_seq']}\n")
# stats
for nm,rs in (("core",core),("pool",pool)):
    a=sorted(r['n_A_pos']/r['ag_len'] for r in rs); b=sorted(r['n_B_pos']/r['vh_len'] for r in rs)
    q=lambda v,p:v[int(p*(len(v)-1))]
    print(nm,len(rs),'antigen rate min/q25/med/q75/max/mean',round(a[0],3),round(q(a,.25),3),round(statistics.median(a),3),round(q(a,.75),3),round(a[-1],3),round(statistics.mean(a),3))
    print(nm,'vhh rate',round(b[0],3),round(statistics.median(b),3),round(b[-1],3),round(statistics.mean(b),3))
print('core release range',core[-1]['release'],core[0]['release'],'methods',collections.Counter(r['method'][:4] for r in core),'len range',min(r['ag_len'] for r in core),max(r['ag_len'] for r in core))
print('core with ag rate<=0.06:',sum(r['n_A_pos']/r['ag_len']<=0.06 for r in core))
print('filtered in pool:',[(r['pdb'],r['filter_note']) for r in pool if r['filter_note']])
print('rows core',sum(len(r['_rec']) for r in core))
print([ (r['bench_id'],r['pdb']) for r in core][:3],[r['pdb'] for r in core])
