import pyarrow.csv as pc, pandas as pd, numpy as np, re, time, json, collections
t0=time.time()
P=r'C:\Temp\sepiq26\q7_clonotype\AVIDa-hHER2.csv'
t=pc.read_csv(P,convert_options=pc.ConvertOptions(include_columns=['#ONU ID','total','target_IE_score','background_IE_score','label','binary_label','Cluster','Cluster_size','sequence'],
  column_types={'binary_label':__import__('pyarrow').float64()}))
df=t.to_pandas(); print(len(df), time.time()-t0)
print(df.label.value_counts(dropna=False).to_dict())
rx=re.compile(r'Y[YF]C(.{3,30}?)W[GA][QKR]G')
def cdr3(s):
    m=rx.search(s); return m.group(1) if m else None
df['cdr3']=df.sequence.map(cdr3)
print('cdr3 found',df.cdr3.notna().mean(), 'unique cdr3',df.cdr3.nunique())
df.to_pickle(r'C:\Temp\sepiq26\q7_dms\df.pkl')
print('Cluster nunique',df.Cluster.nunique())
cs=df.Cluster.value_counts(); print('clusters>=10:',(cs>=10).sum(),'>=50',(cs>=50).sum(),'>=100',(cs>=100).sum())
print(df.groupby('label').total.describe())
print('time',time.time()-t0)
