import pandas as pd, numpy as np, pyarrow.csv as pc, collections
df=pd.read_pickle('df.pkl')
seq={'ONU11':'QVQLQESGGGSVQAGGSLRLSCAASGRTLSGWVMGWFRQAPGKDRDFVAHLSGDTTAYAHSVKGRFTISRDNAKDTVFLQMNSLKPEDTGVYYCAARPLGSTWTEHPYWGQGTQVTVSS',
'ONU13':'QVQLQESGGGLVQAGGSLRLSCTASERTFSIDYMGWYRQAPGKQREFVGTIEWNSGSTGYGDSVKGRFTISRDNAKNTGYLQMNSLKPEDTAVYYCAAKYGSSRLWDYWGQGTQVTVSS',
'ONU23':'QVQLQESGGGLVQAGGSLRLSCAASGRTLSGAAMGWFRQAPGKEREFVAGISWSTSRTQYADSVKGRFTISRDNAKNTVFLQMNSLNAEDTAVYYCAADGRFYSDYVWSSPDEYAYWGQGTQVTVSS'}
byid=df.set_index('#ONU ID')
for k,s in seq.items():
    r=byid.loc[k] if k in byid.index else None
    print(k,'in table:',r is not None)
    if r is not None:
        print(' dataset seq matches (after strip MA/HHHHHH):', s in r.sequence, 'label',r.label,'total',r.total,'Cluster',r.Cluster,'clsize',r.Cluster_size,'tIE',r.target_IE_score,'bIE',r.background_IE_score)
    m=df[df.sequence.str.contains(s,regex=False)]; print(' exact seq rows',len(m),m['#ONU ID'].tolist()[:5])
    c=r.Cluster if r is not None else None
    if c:
        g=df[df.Cluster==c]; print(' cluster members',len(g),'total>=2',(g.total>=2).sum(),'Yes',(g.label=='Yes').sum(),'total>=3',(g.total>=3).sum())
