import pandas as pd, numpy as np, json, re
df=pd.read_pickle('df.pkl')
ents=json.load(open(r'C:\Temp\sepiq26\q6\four.json'))
rx=re.compile(r'Y[YF]C(.{3,30}?)W[GA][QKR]G')
q={}
for e in ents:
    for p in e['polymer_entities']:
        if 'erbB' in p['rcsb_polymer_entity']['pdbx_description'] or 'protein-tyrosine' in p['rcsb_polymer_entity']['pdbx_description']: continue
        ch=p['rcsb_polymer_container_identifiers']['auth_asym_ids'][0] if 'rcsb_polymer_container_identifiers' in p else p['rcsb_polymer_entity_container_identifiers']['auth_asym_ids'][0]
        s=p['entity_poly']['pdbx_seq_one_letter_code_can']
        m=rx.search(s); q[e['rcsb_id']+'_'+ch]=(s,m.group(1) if m else None)
print({k:v[1] for k,v in q.items()})
u=df.dropna(subset=['cdr3']).groupby('cdr3').agg(n=('total','sum'),nseq=('total','size')).reset_index()
for k,(s,c) in q.items():
    L=len(c); sub=u[u.cdr3.str.len()==L]
    arr=np.array([list(x) for x in sub.cdr3]); qa=np.array(list(c))
    d=(arr!=qa).sum(1); i=np.argsort(d)[:5]
    print(k,c,'L',L,'n same-len',len(sub),'min Hamming',d[i[0]],[(sub.cdr3.iloc[j],int(d[j]),int(sub.nseq.iloc[j])) for j in i])
    # also full-seq near-identity via anchor-free ungapped on same-CDR3-length seqs with d<=4
