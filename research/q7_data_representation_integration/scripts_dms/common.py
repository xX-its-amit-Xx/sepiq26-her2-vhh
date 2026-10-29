import re, numpy as np
RX_C=re.compile(r'L[SRTK]C..S'); RX_W=re.compile(r'W[FYV]RQ'); RX_F=re.compile(r'SVKG'); RX_3=re.compile(r'Y[YF]C(.{3,30}?)W[GA][QKR]G')
def segment(s):
    """return list of region labels per residue, or None. Approximate IMGT-like."""
    mc=RX_C.search(s); mw=RX_W.search(s)
    if not mc or not mw: return None
    c=mc.start()+2; w=mw.start()
    mf=RX_F.search(s,w); m3=RX_3.search(s)
    if not mf or not m3: return None
    f=mf.start()-3; c3s=m3.start(1); c3e=m3.end(1)
    c1s=c+4; c1e=w-2; c2s=w+15; c2e=f
    if not (c<c1s<c1e<=c2s<c2e<c3s<c3e): return None
    lab=[]
    for i in range(len(s)):
        if i<c1s: r='FR1'
        elif i<c1e: r='CDR1'
        elif i<c2s: r='FR2'
        elif i<c2e: r='CDR2'
        elif i<c3s: r='FR3'
        elif i<c3e: r='CDR3'
        else: r='FR4'
        lab.append(r)
    return lab
def keys(lab):
    """(region, dist-to-nearest-edge capped) per residue; FR use (region, min(dist from region start,..)) """
    n=len(lab); out=[]; i=0
    while i<n:
        j=i
        while j<n and lab[j]==lab[i]: j+=1
        for k in range(i,j):
            d=min(k-i,j-1-k)
            if lab[i].startswith('CDR'): out.append((lab[i],min(d,6)))
            else: out.append((lab[i],min(k-i,j-1-k,3)))
        i=j
    return out
