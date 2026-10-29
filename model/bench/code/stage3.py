import json,collections
from anarci import anarci
B=r"C:\Temp\sepiq26\bench"
M=json.load(open(B+r"\meta.json")); S2=json.load(open(B+r"\stage2.json"))
A=json.load(open(B+r"\anarci.json"))
def vhh_ok(p):
    a=A.get(p['rcsb_id']); s=p['entity_poly']['pdbx_seq_one_letter_code_can']
    return bool(a and a['chains']==['H'] and len(s)<=200 and len(s)-(a['end']-a['start']+1)<=60)
def ident(a,b):
    n,m=len(a),len(b)
    if not n or not m: return 0.0
    D=[[0]*(m+1) for _ in range(n+1)]
    for i in range(n+1): D[i][0]=i
    for j in range(m+1): D[0][j]=j
    for i in range(1,n+1):
        for j in range(1,m+1):
            D[i][j]=min(D[i-1][j]+1,D[i][j-1]+1,D[i-1][j-1]+(a[i-1]!=b[j-1]))
    # identity approximated: 1 - edit distance / max len
    return 1-D[n][m]/max(n,m)
rows=[]
for k,r in S2.items():
    if 'fail' in r: continue
    e=M[k]; pe=[p for p in e['polymer_entities'] if p['entity_poly']['rcsb_entity_polymer_type']=='Protein']
    v=[p for p in pe if vhh_ok(p)][0]; ag=[p for p in pe if p is not v][0]
    seq=v['entity_poly']['pdbx_seq_one_letter_code_can']
    res=anarci([("x",seq)],scheme="imgt",allowed_species=None)
    nm=res[0][0][0][0]
    cdr3="".join(aa for (pos,ins),aa in nm if 105<=pos<=117 and aa!='-')
    cl=[c['cluster_id'] for c in (ag['rcsb_cluster_membership'] or []) if c['identity']==30]
    ups=[x['database_accession'] for x in ag['rcsb_polymer_entity_container_identifiers'].get('reference_sequence_identifiers') or [] if x['database_name']=='UniProt']
    rows.append(dict(pdb=k,release=e['rcsb_accession_info']['initial_release_date'][:10],res=e['rcsb_entry_info']['resolution_combined'][0],
      method=e['exptl'][0]['method'],ag_desc=ag['rcsb_polymer_entity']['pdbx_description'],ag_uniprot=ups[0] if ups else '',ag_cluster30=cl[0] if cl else 'NA_'+k,
      ag_len=len(ag['entity_poly']['pdbx_seq_one_letter_code_can']),vh_len=len(seq),cdr3=cdr3,vhh_desc=v['rcsb_polymer_entity']['pdbx_description'],
      ag_org=(ag['rcsb_entity_source_organism'] or [{}])[0].get('ncbi_scientific_name',''),vhh_chain=r['vhh_chain'],ag_chain=r['antigen_chain'],
      n_vhh_copies=r['n_vhh_copies'],n_ag_copies=r['n_antigen_copies'],ag_seq=ag['entity_poly']['pdbx_seq_one_letter_code_can'],vh_seq=seq))
print(len(rows),len(set(r['ag_cluster30'] for r in rows)),len(set(r['ag_uniprot'] for r in rows)))
# union-find over antigen cluster30 / uniprot
par={}
def f(x):
    par.setdefault(x,x)
    while par[x]!=x: par[x]=par[par[x]]; x=par[x]
    return x
for r in rows:
    f('e'+r['pdb']); par[f('e'+r['pdb'])]=f('c'+r['ag_cluster30'])
    if r['ag_uniprot']: par[f('c'+r['ag_cluster30'])]=f('u'+r['ag_uniprot'])
for r in rows: r['ag_group']=f('e'+r['pdb'])
print('antigen groups',len(set(r['ag_group'] for r in rows)))
rows.sort(key=lambda r:(r['release'],-r['res']),reverse=True)
sel=[];used=set();dropped=[]
for r in rows:
    if r['ag_group'] in used: dropped.append((r['pdb'],'antigen_cluster_dup')); continue
    hit=[s for s in sel if ident(r['cdr3'],s['cdr3'])>=0.8]
    if hit: dropped.append((r['pdb'],'cdr3_dup_of_'+hit[0]['pdb'])); continue
    used.add(r['ag_group']); sel.append(r)
print('selected',len(sel),collections.Counter(d[1].split('_dup')[0][:9] for d in dropped))
json.dump(rows,open(B+r"\stage3_all.json","w")); json.dump(sel,open(B+r"\stage3_sel.json","w")); json.dump(dropped,open(B+r"\stage3_dropped.json","w"))
for r in sel: print(r['pdb'],r['release'],r['res'],r['method'][:4],r['ag_desc'][:35],r['ag_uniprot'],r['ag_len'],r['cdr3'])
