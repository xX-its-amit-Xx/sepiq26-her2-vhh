"""Download mmCIF, pick a clean 1:1 VHH-antigen pair in the asymmetric unit."""
import json,os,urllib.request,collections,sys
import gemmi, numpy as np
from scipy.spatial import cKDTree
sys.path.insert(0,r"D:\Users\<user>\.devin\SEPIQ_2026\model")
B=r"C:\Temp\sepiq26\bench"; RAW=B+r"\raw"; os.makedirs(RAW,exist_ok=True)
M=json.load(open(B+r"\meta.json")); A=json.load(open(B+r"\anarci.json")); keep=json.load(open(B+r"\stage1.json"))
STD=set("ALA ARG ASN ASP CYS GLN GLU GLY HIS ILE LEU LYS MET PHE PRO SER THR TRP TYR VAL".split())
def vhh_ok(p):
    a=A.get(p['rcsb_id']); s=p['entity_poly']['pdbx_seq_one_letter_code_can']
    return bool(a and a['chains']==['H'] and len(s)<=200 and len(s)-(a['end']-a['start']+1)<=60)
out={}; st=collections.Counter()
for k in keep:
    f=f"{RAW}\{k}.cif"
    if not os.path.exists(f):
        try: urllib.request.urlretrieve(f"https://files.rcsb.org/download/{k}.cif",f)
        except Exception as ex: out[k]={'fail':'download '+str(ex)}; continue
    st_=gemmi.read_structure(f); st_.setup_entities(); st_.remove_hydrogens()
    e=M[k]; pe=[p for p in e['polymer_entities'] if p['entity_poly']['rcsb_entity_polymer_type']=='Protein']
    v=[p for p in pe if vhh_ok(p)][0]; ag=[p for p in pe if p is not v][0]
    # auth chain ids from entity identifiers; map to model chains
    vch=v['rcsb_polymer_entity_container_identifiers']['auth_asym_ids']; ach=ag['rcsb_polymer_entity_container_identifiers']['auth_asym_ids']
    mod=st_[0]; names={c.name for c in mod}
    vch=[c for c in vch if c in names]; ach=[c for c in ach if c in names]
    def atoms(c):
        xs=[(a.pos.x,a.pos.y,a.pos.z) for r in mod[c] if r.name in STD and r.het_flag!='H' for a in r]
        return np.array(xs)
    X={c:atoms(c) for c in vch+ach}
    T={c:cKDTree(X[c]) for c in X if len(X[c])}
    def ncont(a,b): # number of atom pairs < 4.5 A
        if a not in T or b not in T: return 0
        return T[a].count_neighbors(T[b],4.5)
    N={(v_,a_):ncont(v_,a_) for v_ in vch for a_ in ach}
    TH=30  # atom pairs; below this = not a real interface
    vt={v_:[a_ for a_ in ach if N[(v_,a_)]>=TH] for v_ in vch}
    at={a_:[v_ for v_ in vch if N[(v_,a_)]>=TH] for a_ in ach}
    cand=[(N[(v_,vt[v_][0])],v_,vt[v_][0]) for v_ in vch if len(vt[v_])==1 and len(at[vt[v_][0]])==1]
    rec={'vhh_chains':vch,'antigen_chains':ach,'n_vhh_copies':len(vch),'n_antigen_copies':len(ach),'contacts':{f"{a}-{b}":n for (a,b),n in N.items() if n>=TH}}
    if not cand:
        rec['fail']='no clean 1:1 pair'+(' (no interface)' if not any(vt.values()) else ' (VHH touches >1 antigen copy or antigen touched by >1 VHH)')
        st['no_clean_pair']+=1
    else:
        cand.sort(reverse=True); _,v_,a_=cand[0]; rec['vhh_chain']=v_; rec['antigen_chain']=a_; st['ok']+=1
        if len(vch)>1 or len(ach)>1: st['ok_multicopy']+=1
    out[k]=rec
print(st)
json.dump(out,open(B+r"\stage2.json","w"),indent=0)
