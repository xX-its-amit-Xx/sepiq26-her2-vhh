import json,collections
B=r"C:\Temp\sepiq26\bench"
M=json.load(open(B+r"\meta.json")); A=json.load(open(B+r"\anarci.json"))
def vhh_ok(p):
    a=A.get(p['rcsb_id']); s=p['entity_poly']['pdbx_seq_one_letter_code_can']
    if not a or a['chains']!=['H']: return False
    return len(s)<=200 and len(s)-(a['end']-a['start']+1)<=60 and (a['end']-a['start']+1)>=100
def antibody_like(p):
    a=A.get(p['rcsb_id']); return bool(a)
st=collections.Counter(); keep=[]
st['candidates']=len(M)
for k,e in M.items():
    pe=[p for p in e['polymer_entities'] if p['entity_poly']['rcsb_entity_polymer_type']=='Protein']
    if len(pe)!=2: st['f1_not_exactly_2_protein_entities']+=1; continue
    st['2_protein_entities']+=1
    v=[p for p in pe if vhh_ok(p)]
    if len(v)!=1: st['f2_not_exactly_1_vhh_entity']+=1; continue
    ag=[p for p in pe if p is not v[0]][0]
    if antibody_like(ag): st['f3_antigen_is_antibody_like']+=1; continue
    st['1vhh_+_nonantibody_antigen']+=1
    ei=e['rcsb_entry_info']; res=(ei['resolution_combined'] or [None])[0]; meth=e['exptl'][0]['method']
    if res is None or res>3.5 or meth not in('X-RAY DIFFRACTION','ELECTRON MICROSCOPY'): st['f4_resolution_or_method']+=1; continue
    st['res<=3.5']+=1
    L=len(ag['entity_poly']['pdbx_seq_one_letter_code_can'])
    if not 80<=L<=700: st['f5_antigen_len_not_80_700']+=1; continue
    st['antigen_80_700']+=1
    ups=[r['database_accession'] for r in ag['rcsb_polymer_entity_container_identifiers'].get('reference_sequence_identifiers') or [] if r['database_name']=='UniProt']
    desc=ag['rcsb_polymer_entity']['pdbx_description']
    if 'P04626' in ups or 'erbb2' in desc.lower() or 'receptor tyrosine-protein kinase erbb-2' in desc.lower(): st['f6_HER2']+=1; continue
    if k in ('5MY6','7QVK','9MTE','9MTX','8GZ5'): st['f6_proxy']+=1; continue
    st['after_her2_proxy_exclusion']+=1
    keep.append(k)
for k,v in st.items(): print(k,v)
json.dump(keep,open(B+r"\stage1.json","w"))
