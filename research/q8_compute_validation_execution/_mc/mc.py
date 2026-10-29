import numpy as np, sys
rng=np.random.default_rng(1)
def ap(y,s):
    o=np.argsort(-s,kind='stable'); y=y[o]; tp=np.cumsum(y); k=np.arange(1,len(y)+1)
    P=y.sum()
    return 0.0 if P==0 else float((tp/k*y).sum()/P)
def sim(N,prev,dA,dB,rho,patch):
    # positives come in patches of ~6; patch id used for clusters
    y=np.zeros(N,int); pid=np.arange(N)//8  # 8-residue blocks as spatial clusters
    npatch=int(np.ceil(N*prev/6)); starts=rng.choice(N-6,npatch,replace=False)
    for s in starts: y[s:s+6]=1
    y=y[:N]
    pz=rng.normal(size=pid.max()+1)[pid]*patch      # shared patch-level noise
    e=rng.normal(size=N); eA=e; eB=rho*e+np.sqrt(1-rho**2)*rng.normal(size=N)
    return y,pid,pz+eA+dA*y,pz+eB+dB*y
def macro(ys,sa,sb):
    return np.mean([ap(y,a) for y,a in zip(ys,sa)]),np.mean([ap(y,b) for y,b in zip(ys,sb)])
def boot(ys,pids,sa,sb,B,mode):
    d=[]
    for _ in range(B):
        da=[];
        # same resample indices for all antibodies (as in guideline) -> index resample per complex
        a=[];b=[]
        if mode=='complex':
            idx=rng.integers(0,3,3); 
            for i in idx: a.append(ap(ys[i],sa[i])); b.append(ap(ys[i],sb[i]))
        else:
            for y,pid,x,z in zip(ys,pids,sa,sb):
                if mode=='residue': ii=rng.integers(0,len(y),len(y))
                else:
                    u=np.unique(pid); ch=rng.choice(u,len(u)); 
                    ii=np.concatenate([np.where(pid==c)[0] for c in ch])
                a.append(ap(y[ii],x[ii])); b.append(ap(y[ii],z[ii]))
        d.append(np.mean(b)-np.mean(a))
    return np.percentile(d,[2.5,97.5])
def run(prev,N,dA,gap,rho,patch,mode,nsim=150,B=300):
    hit=0;gaps=[];pa=[]
    for _ in range(nsim):
        ys=[];pids=[];sa=[];sb=[]
        for k in range(3):
            y,p,a,b=sim(N,prev,dA,dA+gap,rho,patch); ys.append(y);pids.append(p);sa.append(a);sb.append(b)
        ma,mb=macro(ys,sa,sb); gaps.append(mb-ma); pa.append(ma)
        lo,hi=boot(ys,pids,sa,sb,B,mode)
        hit+= lo>0
    return np.mean(pa),np.mean(gaps),np.std(gaps),hit/nsim
if __name__=='__main__':
    for prev in (0.12,):
        for rho in (0.6,):
          for patch in (0.0,0.7):
            for mode in ('residue','patch'):
              for gap in (0.0,0.3,0.5,0.8):
                r=run(prev,330,1.2,gap,rho,patch,mode)
                print(f"prev={prev} rho={rho} patchsd={patch} boot={mode} dprime_gap={gap}: PRAUC_A={r[0]:.3f} dPRAUC={r[1]:.3f} SD_true_gap={r[2]:.3f} power={r[3]:.2f}",flush=True)
    # complex-level bootstrap with n=3
    for gap in (0.0,0.5,0.8):
        r=run(0.12,330,1.2,gap,0.6,0.7,'complex'); print(f"complex-boot gap={gap}: dPRAUC={r[1]:.3f} power={r[3]:.2f}",flush=True)
