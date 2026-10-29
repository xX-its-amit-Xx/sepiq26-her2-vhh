import pandas as pd, numpy as np, collections, json, pyarrow.csv as pc
from common import *
df=pd.read_pickle('df.pkl'); byid=df.set_index('#ONU ID')
out={}
for k in ['ONU11','ONU13','ONU23']:
    r=byid.loc[k]; s=r.sequence; L=len(s); lab=segment(s)
    g=df[(df.Cluster==r.Cluster)&(df.sequence.str.len()==L)&(df.total>=2)]
    arr=np.array([list(x) for x in g.sequence]); q=np.array(list(s))
    mism=(arr!=q).mean(0)
    # unweighted over uniq seqs; also exclude Hamming>8 (distant members)
    h=(arr!=q).sum(1); keep=h<=8
    mism2=(arr[keep]!=q).mean(0)
    # error-floor: FR median
    fr=[i for i,l in enumerate(lab) if l.startswith('FR')]
    floor=np.median(mism2[fr])
    print(k,'family n(total>=2,len match)',len(g),'kept(H<=8)',keep.sum(),'FR median mismatch',round(floor,4),'Hamming dist quantiles',np.percentile(h,[10,50,90]))
    regs={}
    for l in ['CDR1','CDR2','CDR3']:
        idx=[i for i,x in enumerate(lab) if x==l]
        regs[l]=[(i+1,s[i],round(float(mism2[i]),3)) for i in idx]  # challenge numbering = idx+1 (M=1)
        print(' ',l,' '.join(f'{p}{a}:{m:.3f}' for p,a,m in regs[l]))
    top=np.argsort(-mism2)[:10]; print('  top variable positions',[(int(i+1),s[i],round(float(mism2[i]),3),lab[i]) for i in top])
    out[k]={'n':int(len(g)),'floor':float(floor),'mism':[round(float(x),4) for x in mism2],'region':lab,'seq':s}
json.dump(out,open('onu_family_profiles.json','w'))
# competition counts
t=pc.read_csv(r'C:\Temp\sepiq26\q7_clonotype\NGS_read_count_table.csv').to_pandas().set_index('#ONU ID')
tot=t.sum(); print('cols',len(tot))
rpm=(t.loc[['ONU11','ONU13','ONU23']]/tot*1e6).T
rpm['colsum']=tot
pd.set_option('display.width',250); print(rpm.round(1).to_string())
