import json,re,collections
B=r"C:\Temp\sepiq26\bench"
M=json.load(open(B+r"\meta.json"))
def is_vhh(s):
    if not (95<=len(s)<=175): return False
    fr4=re.search(r"G.GT.{1,2}V.V",s)
    fr2=re.search(r"W[FYVI]R[QE]",s[15:60]) 
    c=len(re.findall("C",s))>=2
    # N-term region should hold the first Cys around 20-25 (allow tags)
    return bool(fr4 and fr2 and c)
st=collections.Counter(); rows=[]
for k,e in M.items():
    st['total']+=1
    pe=[p for p in e['polymer_entities'] if p['entity_poly']['rcsb_entity_polymer_type']=='Protein']
    ei=e['rcsb_entry_info']
    res=(ei['resolution_combined'] or [None])[0]
    meth=e['exptl'][0]['method']
    rel=e['rcsb_accession_info']['initial_release_date'][:10]
    v=[p for p in pe if is_vhh(p['entity_poly']['pdbx_seq_one_letter_code_can'])]
    other=[p for p in pe if p not in v]
    if len(pe)!=2: st['not_2_protein_entities']+=1; continue
    if len(v)!=1 or len(other)!=1: st['not_1vhh_1antigen_entity']+=1; continue
    st['2ent_1vhh']+=1
    if res is None or res>3.5 or meth not in('X-RAY DIFFRACTION','ELECTRON MICROSCOPY'): st['res_method_fail']+=1; continue
    st['res_ok']+=1
    a=other[0]; L=len(a['entity_poly']['pdbx_seq_one_letter_code_can'])
    if not 80<=L<=700: st['ag_len_fail']+=1; continue
    st['ag_len_ok']+=1
    rows.append(k)
print(st); print(len(rows))
json.dump(rows,open(B+r"\stage1.json","w"))
