import numpy as np
from sklearn.metrics import average_precision_score as ap
from scipy.stats import rankdata
rng=np.random.default_rng(0)
def complex_(n=600,k=3,prev=0.1):
    X=rng.uniform(0,60,(n,3))
    # epitope = residues within 9A of k centers
    cs=X[rng.choice(n,k,replace=False)]
    d=np.min(np.linalg.norm(X[:,None]-cs[None],axis=2),1)
    y=(d<np.quantile(d,prev)).astype(int)
    return X,y
def seeds(y,X,m=5,sig=1.0,share=0.6):
    # each seed: truth signal + shared (systematic) error + independent noise, with random mislocated "hit" probability
    sysn=rng.normal(0,sig,len(y))
    out=[]
    for _ in range(m):
        s=1.2*y+share*sysn+np.sqrt(1-share**2)*rng.normal(0,sig,len(y))
        out.append(s)
    return np.array(out)
def sm(X,s,r=8):
    D=np.linalg.norm(X[:,None]-X[None],axis=2); W=(D<r).astype(float); W/=W.sum(1,keepdims=True); return W@s
R={k:[] for k in ['single','mean_logit','mean_prob(sigmoid)','rank_avg','max','geomean','noisyOR','mono_exp','smooth8_of_mean','smooth8_blend','round2dec_ties']}
sig=lambda z:1/(1+np.exp(-z))
for t in range(300):
    X,y=complex_(); S=seeds(y,X)
    P=sig(S)
    R['single'].append(ap(y,S[0]))
    R['mean_logit'].append(ap(y,S.mean(0)))
    R['mean_prob(sigmoid)'].append(ap(y,P.mean(0)))
    R['rank_avg'].append(ap(y,np.mean([rankdata(s) for s in S],0)))
    R['max'].append(ap(y,P.max(0)))
    R['geomean'].append(ap(y,np.exp(np.log(P).mean(0))))
    R['noisyOR'].append(ap(y,1-np.prod(1-P,0)))
    R['mono_exp'].append(ap(y,np.exp(5*P.mean(0)))) # monotone of mean_prob
    m=S.mean(0); R['smooth8_of_mean'].append(ap(y,sm(X,m)))
    R['smooth8_blend'].append(ap(y,0.5*m+0.5*sm(X,m)))
    R['round2dec_ties'].append(ap(y,np.round(P.mean(0),1)))
for k,v in R.items(): print(f"{k:22s} {np.mean(v):.4f} +- {np.std(v)/np.sqrt(len(v)):.4f}")
print('prevalence ~0.10')
