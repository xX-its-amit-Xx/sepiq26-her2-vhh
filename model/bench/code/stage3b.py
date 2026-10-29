import json,collections,csv
from Bio import Align
from Bio.Align import substitution_matrices
B=r"C:\Temp\sepiq26\bench"
rows=json.load(open(B+r"\stage3_all.json"))
al=Align.PairwiseAligner(); al.mode='local'; al.substitution_matrix=substitution_matrices.load('BLOSUM62'); al.open_gap_score=-11; al.extend_gap_score=-1
def ident(a,b):
    """identities in best local alignment / length of shorter sequence"""
    a=a.replace('X','A').replace('U','C'); b=b.replace('X','A').replace('U','C')
    aln=al.align(a,b)[0]
    ids=0
    for (s1,e1),(s2,e2) in zip(*aln.aligned):
        ids+=sum(1 for x,y in zip(a[s1:e1],b[s2:e2]) if x==y)
    return ids/min(len(a),len(b))
def ident_global(a,b):
    return ident(a,b)
# HER2 + proxy VHH references
her2="".join(l.strip() for l in open(r"D:\Users\<user>\.devin\SEPIQ_2026\model\data\P04626.fa") if not l.startswith('>'))
prox={}
for r in csv.DictReader(open(r"D:\Users\<user>\.devin\SEPIQ_2026\model\proxies\proxy_labels.csv")):
    if r['chain']=='B': prox.setdefault(r['proxy_id'],[]).append(r['resName'])
from Bio.SeqUtils import seq1
pv={k:"".join(seq1(x) for x in v) for k,v in prox.items()}
n=len(rows); par=list(range(n))
def f(x):
    while par[x]!=x: par[x]=par[par[x]]; x=par[x]
    return x
maxid=0
for i in range(n):
    for j in range(i):
        same_up=rows[i]['ag_uniprot'] and rows[i]['ag_uniprot']==rows[j]['ag_uniprot']
        if same_up or ident(rows[i]['ag_seq'],rows[j]['ag_seq'])>=0.30: par[f(i)]=f(j)
for i,r in enumerate(rows):
    r['ag_group']=f(i); r['id_to_HER2']=round(ident(r['ag_seq'],her2),3)
    r['max_vhh_id_to_proxies']=round(max(ident(r['vh_seq'],s) for s in pv.values()),3)
print('antigen groups',len(set(r['ag_group'] for r in rows)),'of',n)
print('max id to HER2',max(r['id_to_HER2'] for r in rows))
print('max vhh id to proxy',sorted(r['max_vhh_id_to_proxies'] for r in rows)[-3:])
def cid(a,b):  # CDR3 global identity 1 - edit/maxlen
    n,m=len(a),len(b)
    D=[[0]*(m+1) for _ in range(n+1)]
    for i in range(n+1): D[i][0]=i
    for j in range(m+1): D[0][j]=j
    for i in range(1,n+1):
        for j in range(1,m+1): D[i][j]=min(D[i-1][j]+1,D[i][j-1]+1,D[i-1][j-1]+(a[i-1]!=b[j-1]))
    return 1-D[n][m]/max(n,m)
rows.sort(key=lambda r:(r['release'],-r['res']),reverse=True)
sel=[];used=set();drops=[]
for r in rows:
    if r['ag_group'] in used: drops.append((r['pdb'],'antigen_cluster')); continue
    h=[s for s in sel if cid(r['cdr3'],s['cdr3'])>=0.8]
    if h: drops.append((r['pdb'],'cdr3_with_'+h[0]['pdb'])); continue
    used.add(r['ag_group']); sel.append(r)
print('unique set',len(sel),collections.Counter(d[1][:5] for d in drops))
json.dump(sel,open(B+r"\stage3_unique.json","w")); json.dump(drops,open(B+r"\stage3_drops.json","w"))
for r in sel: print(r['pdb'],r['release'],r['res'],r['method'][:4],r['ag_desc'][:38],'|',r['ag_len'],r['vh_len'],r['n_vhh_copies'],r['n_ag_copies'])
