import sys,gemmi,tempfile,os
HERE=r"D:\Users\<user>\.devin\SEPIQ_2026\model"
sys.path.insert(0,HERE); sys.path.insert(0,HERE+r"\proxies")
import build_proxy_labels as P
for pdb,ag,vh,ea,ev in (("5MY6","A","B",21,24),("9MTX","B","A",31,27)):
    st=gemmi.read_structure(P.RAW+"\\"+pdb+".cif"); st.setup_entities(); st.remove_hydrogens()
    for c in (ag,vh):
        for r in st[0][c]: r.seqid=gemmi.SeqId(r.label_seq if r.label_seq else 0,' ')
    td=tempfile.mkdtemp(dir=r"C:\Temp\sepiq26\bench\pairs"); p=td+r"\p.pdb"; P.write_pair_pdb(st,ag,vh,p)
    s=P.run_vlt(p,td+r"\s.tsv"); print(pdb,sum(x['ID_chain']=='A' for x in s),sum(x['ID_chain']=='B' for x in s),'expected',ea,ev)
