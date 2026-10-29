import numpy as np, pandas as pd, json, warnings
from Bio.PDB import PDBParser, MMCIFParser, NeighborSearch
from Bio.PDB.Polypeptide import three_to_index, is_aa
from sklearn.metrics import average_precision_score
from common import *
warnings.filterwarnings('ignore')
D=r'C:\Temp\sepiq26'
SPEC=[('5MY6',D+r'\vhh_pdb\5MY6.pdb','B',['A']),('7QVK',D+r'\vhh_pdb\7QVK.cif','BBB',['AAA']),
      ('9MTE_A',D+r'\vhh_pdb\9MTE.pdb','A',['C']),('9MTE_B',D+r'\vhh_pdb\9MTE.pdb','B',['C']),('9MTX',D+r'\vhh_pdb\9MTX.pdb','A',['B'])]
prior=pd.read_pickle('prior.pkl').set_index(['region','d'])
AA3={'ALA':'A','ARG':'R','ASN':'N','ASP':'D','CYS':'C','GLN':'Q','GLU':'E','GLY':'G','HIS':'H','ILE':'I','LEU':'L','LYS':'K','MET':'M','PHE':'F','PRO':'P','SER':'S','THR':'T','TRP':'W','TYR':'Y','VAL':'V'}
def load(p):
    return (MMCIFParser(QUIET=True) if p.endswith('cif') else PDBParser(QUIET=True)).get_structure('x',p)[0]
res={}; recs=[]
for name,p,vc,ac in SPEC:
    m=load(p); vh=[r for r in m[vc] if r.id[0]==' ' and r.get_resname() in AA3]
    ag=[a for c in ac for r in m[c] if r.id[0]==' ' for a in r if a.element!='H']
    ns=NeighborSearch(ag)
    seq=''.join(AA3[r.get_resname()] for r in vh); lab=segment(seq)
    ks=keys(lab)
    for i,r in enumerate(vh):
        cont=any(ns.search(a.coord,4.0) for a in r if a.element!='H')
        k=ks[i]; recs.append(dict(entry=name,i=i,resseq=r.id[1],aa=AA3[r.get_resname()],region=lab[i],contact=int(cont),
            mism=prior.loc[k,'mism'] if k in prior.index else np.nan, ent=prior.loc[k,'ent'] if k in prior.index else np.nan))
R=pd.DataFrame(recs); R.to_csv('pdb_residues.csv',index=False)
print(R.groupby('entry').agg(n=('i','size'),contacts=('contact','sum')).to_string())
print(R.groupby(['entry','region']).contact.sum().unstack(fill_value=0).to_string())
rng=np.random.default_rng(0)
def scores(d):
    return {'tol_only(-mism)':-d.mism.fillna(d.mism.median()).values,
            'tol_only(-ent)':-d.ent.fillna(d.ent.median()).values,
            'CDR3_uniform':(d.region=='CDR3').values.astype(float),
            'allCDR_uniform':d.region.str.startswith('CDR').values.astype(float),
            'tol_within_CDR3(-mism)':np.where(d.region=='CDR3',1.0-d.mism.fillna(0).values*10,0)}
def ap(y,s): return average_precision_score(y,s) if y.sum()>0 else np.nan
def macro(Rb):
    out={}
    for e,d in Rb.groupby('entry'):
        y=d.contact.values
        for k,s in scores(d).items(): out.setdefault(k,[]).append(ap(y,s))
    return {k:np.nanmean(v) for k,v in out.items()}
pt=macro(R); print('point macro AP',json.dumps(pt,indent=1))
print('base rate per entry', R.groupby('entry').contact.mean().round(3).to_dict(),'macro',R.groupby('entry').contact.mean().mean())
# per entry AP
rows=[]
for e,d in R.groupby('entry'):
    y=d.contact.values; r={'entry':e,'base':y.mean()}
    r.update({k:ap(y,s) for k,s in scores(d).items()}); rows.append(r)
pe=pd.DataFrame(rows); print(pe.round(3).to_string()); pe.to_csv('pdb_per_entry_ap.csv',index=False)
# two-level bootstrap: resample entries, then residues within
B=2000; boots=[]; ents=[d for _,d in R.groupby('entry')]
for b in range(B):
    idx=rng.integers(0,len(ents),len(ents)); parts=[]
    for j,i in enumerate(idx):
        d=ents[i]; r=d.iloc[rng.integers(0,len(d),len(d))].copy(); r['entry']=f'{i}_{j}'; parts.append(r)
    boots.append(macro(pd.concat(parts)))
Bt=pd.DataFrame(boots)
out={}
for k in Bt.columns:
    out[k]={'point':pt[k],'ci_lo':float(np.nanpercentile(Bt[k],2.5)),'ci_hi':float(np.nanpercentile(Bt[k],97.5))}
for k in ['tol_only(-mism)','tol_only(-ent)','tol_within_CDR3(-mism)','allCDR_uniform']:
    dlt=(Bt[k]-Bt['CDR3_uniform']).dropna(); out['delta_'+k+'_minus_CDR3uniform']={'point':pt[k]-pt['CDR3_uniform'],'ci_lo':float(np.percentile(dlt,2.5)),'ci_hi':float(np.percentile(dlt,97.5)),'frac_boot_gt0':float((dlt>0).mean())}
print(json.dumps(out,indent=1)); json.dump(out,open('pdb_bootstrap.json','w'),indent=1)
