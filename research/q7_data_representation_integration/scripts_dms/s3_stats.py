import pandas as pd, numpy as np
df=pd.read_pickle('df.pkl')
df['yes']=(df.label=='Yes'); df['not_']=(df.label=='Not')
g=df.groupby('Cluster')
c=pd.DataFrame({'n':g.size(),'n2':g.total.apply(lambda x:(x>=2).sum()),'n3':g.total.apply(lambda x:(x>=3).sum()),'n5':g.total.apply(lambda x:(x>=5).sum()),'yes':g.yes.sum(),'not':g.not_.sum(),'reads':g.total.sum()})
for col in ['n','n2','n3','n5']: print(col,'>=10:',(c[col]>=10).sum(),' >=30:',(c[col]>=30).sum())
print('clusters with >=10 members and >=1 Yes',((c.n>=10)&(c.yes>=1)).sum(),' >=3 Yes',((c.n>=10)&(c.yes>=3)).sum(),' >=10 Yes',(c.yes>=10).sum())
print('clusters with >=10 labelled(Yes+Not)',((c.yes+c['not'])>=10).sum())
print('Yes seqs in clusters n>=10:', c[c.n>=10].yes.sum(),'of',c.yes.sum())
print(c.sort_values('yes',ascending=False).head(8))
# singletons
print('seq with total==1',(df.total==1).mean(), 'total>=3',(df.total>=3).sum())
# purity: clusters with both Yes and Not
b=c[(c.yes>=1)&(c['not']>=1)]; print('clusters with both Yes and Not',len(b),'of clusters with any Yes',(c.yes>=1).sum())
c.to_pickle('clusters.pkl')
