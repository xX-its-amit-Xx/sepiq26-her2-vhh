"""Labels for every pool complex using the SAME functions/binary/settings as proxies/build_proxy_labels.py."""
import json,os,sys,csv,tempfile,collections
import gemmi
HERE=r"D:\Users\<user>\.devin\SEPIQ_2026\model"
sys.path.insert(0,HERE); sys.path.insert(0,HERE+r"\proxies")
import build_proxy_labels as P
import sepiq_common as sc
Bd=r"C:\Temp\sepiq26\bench"; RAW=Bd+r"\raw"
os.makedirs(Bd+r"\pairs",exist_ok=True); os.makedirs(Bd+r"\fasta",exist_ok=True)
pool=json.load(open(Bd+r"\stage3_unique.json"))
EXCL={'9TY2':'MBP fusion-tag binder','9WPI':'fluorescent-protein (TGP) tag binder','9W3F':'GPCR-T4L fusion construct','12PB':'MTCH2/UCP1 chimera construct','9BA0':'CB1-glycogen synthase fusion construct'}
rows_out=[];summ=[]
for r in pool:
    k=r['pdb']; ag,vh=r['ag_chain'],r['vhh_chain']
    st=gemmi.read_structure(RAW+f"\{k}.cif"); st.setup_entities(); st.remove_hydrogens()
    seqA3=None
    def ent(chain):
        sub=st[0][chain].get_polymer().subchain_id()
        for e in st.entities:
            if sub in e.subchains: return list(e.full_sequence)
    A3,V3=ent(ag),ent(vh)
    # strip any "(MSE)" style wrappers
    A3=[x.strip('()') for x in A3]; V3=[x.strip('()') for x in V3]
    assert len(A3)==r['ag_len'] and len(V3)==r['vh_len'],(k,len(A3),r['ag_len'],len(V3),r['vh_len'])
    # renumber to SEQRES index (label_seq) so VLT rnum == position in sequence
    auth={}
    for c in (ag,vh):
        for res in st[0][c]:
            if res.is_water(): continue
            if res.label_seq:
                auth[(c,res.label_seq)]=(res.seqid.num,res.seqid.icode.strip())
    # keep original for min dists
    import copy
    st2=st.clone()
    for c in (ag,vh):
        for res in st2[0][c]:
            res.seqid=gemmi.SeqId(res.label_seq if res.label_seq else 0,' ')
    td=tempfile.mkdtemp(dir=Bd+r"\pairs")
    pdb=Bd+f"\pairs\{k}_pair.pdb"
    P.write_pair_pdb(st2,ag,vh,pdb)
    sites=P.run_vlt(pdb,td+r"\sites.tsv")
    area={(x["ID_chain"],int(x["ID_rnum"])):float(x["area"]) for x in sites}
    ra,da,rv,dv=P.min_dists(st2,ag,vh)
    dA={x.seqid.num:da[i] for i,x in enumerate(ra)}; dV={x.seqid.num:dv[i] for i,x in enumerate(rv)}
    rsaA=P.isolated_rsa(pdb,"A"); rsaV=P.isolated_rsa(pdb,"B")
    seqV="".join(sc.ONE.get(x,'X') for x in V3)
    imgt,det=P.anarci_imgt(seqV)
    resolvedA={x.seqid.num for x in ra}; resolvedV={x.seqid.num for x in rv}
    rec=[]
    for ch,seq3,resolved,dist,rsa,cname in (("A",A3,resolvedA,dA,rsaA,ag),("B",V3,resolvedV,dV,rsaV,vh)):
        for i,rn in enumerate(seq3,1):
            res=i in resolved; a=area.get((ch,i),0.0); d=float(dist.get(i,99.0))
            au=auth.get((cname,i),("",""))
            rs=rsa.get(str(i)) if res else None
            rec.append([None,k,r['vhh_desc'][:30].replace(',',';'),ch,i,rn,int(res),cname,au[0] if res else "",au[1] if res else "",round(a,4),int(a>0),int(a>=5),int(d<4.0),round(d,3) if res else "","" if rs is None else round(rs,4),(imgt[i-1] if imgt and ch=="B" else "")])
    outside=[k_ for k_ in area if not (1<= k_[1] <= (len(A3) if k_[0]=="A" else len(V3)))]
    assert not outside,(k,outside)
    r['n_A_pos']=sum(x[11] for x in rec if x[3]=="A"); r['n_B_pos']=sum(x[11] for x in rec if x[3]=="B")
    r['n_A_resolved']=len(resolvedA); r['n_B_resolved']=len(resolvedV)
    r['n_A_pos_ge5']=sum(x[12] for x in rec if x[3]=="A"); r['n_B_pos_ge5']=sum(x[12] for x in rec if x[3]=="B")
    r['anarci_ok']=bool(imgt); r['x_in_antigen']=A3.count('UNK')+A3.count('X'); r['nonstd_A']=sorted(set(A3)-set(sc.ONE)); r['nonstd_B']=sorted(set(V3)-set(sc.ONE))
    r['_rec']=rec
    r['excluded']=EXCL.get(k,'')
    print(k,len(A3),len(V3),r['n_A_pos'],r['n_B_pos'],r['n_A_resolved'],r['n_B_resolved'],flush=True)
json.dump(pool,open(Bd+r"\stage4.json","w"))
