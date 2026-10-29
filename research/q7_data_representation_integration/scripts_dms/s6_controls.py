import numpy as np, pandas as pd, json
from sklearn.metrics import average_precision_score as aps
R=pd.read_csv('pdb_residues.csv'); prior=pd.read_pickle('prior.pkl')
from common import *
# recompute d (dist to CDR edge) per residue
ds=[]
for e,d in R.groupby('entry',sort=False):
    lab=d.region.tolist(); ks=keys(lab); ds+= [k[1] for k in ks]
R['d']=ds
rng=np.random.default_rng(1)
cdr3=prior[prior.region=='CDR3'].set_index('d').mism
def macro(Rb,sc):
    v=[]
    for e,d in Rb.groupby('entry'):
        y=d.contact.values
        if y.sum(): v.append(aps(y,sc(d)))
    return np.mean(v)
isc3=lambda d:(d.region=='CDR3').values
sc={'CDR3_uniform':lambda d:isc3(d)*1.0,
 'CDR3+tolerance_tiebreak(-mism)':lambda d:isc3(d)*(1-10*d.d.map(cdr3).fillna(0).values),
 'CDR3+centrality_tiebreak(d)':lambda d:isc3(d)*(1+0.1*d.d.values),
 'CDR3+edge_tiebreak(-d)':lambda d:isc3(d)*(1-0.1*d.d.values)}
pt={k:macro(R,f) for k,f in sc.items()}; print(pt)
# permutation null: shuffle the 7 CDR3 tolerance values across d
nulls=[]
for b in range(2000):
    perm=dict(zip(cdr3.index,rng.permutation(cdr3.values)))
    nulls.append(macro(R,lambda d:isc3(d)*(1-10*d.d.map(perm).fillna(0).values)))
nulls=np.array(nulls); print('perm null mean',nulls.mean(),'95%',np.percentile(nulls,[2.5,97.5]),'p(null>=obs)',(nulls>=pt['CDR3+tolerance_tiebreak(-mism)']).mean())
print(R[R.region=='CDR3'].groupby('entry').apply(lambda d:list(zip(d.d,d.contact))).to_string())
json.dump({'point':pt,'perm_null_mean':float(nulls.mean()),'perm_null_ci':np.percentile(nulls,[2.5,97.5]).tolist(),'p':float((nulls>=pt['CDR3+tolerance_tiebreak(-mism)']).mean())},open('controls.json','w'),indent=1)
