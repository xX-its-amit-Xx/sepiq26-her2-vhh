import json, urllib.request, sys, os
B=r"C:\Temp\sepiq26\bench"
ids=json.load(open(B+r"\cand_2023-06-01.json"))
Q="""query($ids:[String!]!){entries(entry_ids:$ids){rcsb_id
 rcsb_accession_info{initial_release_date}
 exptl{method}
 rcsb_entry_info{resolution_combined polymer_entity_count_protein polymer_entity_count deposited_polymer_entity_instance_count}
 polymer_entities{rcsb_id
  entity_poly{pdbx_seq_one_letter_code_can rcsb_entity_polymer_type pdbx_strand_id}
  rcsb_polymer_entity{pdbx_description}
  rcsb_polymer_entity_container_identifiers{entity_id auth_asym_ids asym_ids reference_sequence_identifiers{database_name database_accession}}
  rcsb_cluster_membership{cluster_id identity}
  rcsb_entity_source_organism{ncbi_scientific_name}
 }}}"""
out={}
for i in range(0,len(ids),50):
    b=ids[i:i+50]
    req=urllib.request.Request("https://data.rcsb.org/graphql",json.dumps({"query":Q,"variables":{"ids":b}}).encode(),{"Content-Type":"application/json"})
    r=json.load(urllib.request.urlopen(req,timeout=120))
    if "errors" in r: print(r["errors"][:1])
    for e in r["data"]["entries"] or []:
        if e: out[e["rcsb_id"]]=e
    print(i,len(out),flush=True)
json.dump(out,open(B+r"\meta.json","w"))
