# Leakage-controlled post-2023-06 VHH-antigen benchmark (built 2026-10-25, CPU only)

Purpose: ~40 non-HER2 nanobody-antigen complexes to judge method choices (seed count, confidence weighting, shrinkage, gating) beyond the 3 HER2 proxies.
Hot data and raw mmCIF: `C:\Temp\sepiq26\bench\` (`labels.csv` uncompressed 1.2 MB, `labels_pool.csv`, `pairs\*.pdb`, `fasta\`). This folder holds the small tables, FASTA and code.

## Files
- `manifest.csv` core 40 (bench_id B01..B40, newest first). `manifest_pool.csv` all 88 antigen-/CDR3-unique complexes (in_core flag, filter_note).
- `labels.csv.gz` core labels, same 17-column schema as `proxies/proxy_labels.csv` (`proxy_id` = bench_id). Gzipped because the CSV is 1.2 MB (limit was 1 MB).
- `fasta/Bxx_PDB.fasta` chain A antigen, chain B VHH, `>protein|name=A` format of `cofold/fasta`. Sequences are the full RCSB entity sequences (SEQRES, canonical letters; tags and leaders included), the same convention as the proxies.
- `code/` scripts in run order.

## Construction (reproduce)
Candidates: `cand_2023-06-01.json` (1,889 IDs). Metadata via RCSB GraphQL (`fetch_meta.py`), ANARCI (venv `C:\Temp\sepiq26\venv`, run with `-I`) for numbering.
1. `anarci_scan.py`, `stage1.py` entry filters (counts below). VHH entity = one ANARCI heavy-chain (H) domain, domain >=100 aa, entity <=200 aa, <=60 non-domain residues (excludes Fab heavy chains, Fc fusions, scFv/diabodies = H+L/K hits). Entry must have exactly 2 protein entities (1 VHH, 1 antigen). Antigen must not itself hit ANARCI. Resolution <=3.5 A (X-ray or EM), antigen entity 80-700 aa, not ERBB2/P04626, not one of 5MY6/7QVK/9MTE/9MTX/8GZ5.
2. `stage2.py` downloads `files.rcsb.org/download/<id>.cif` (asymmetric unit). Interface = >=30 heavy-atom pairs within 4.5 A. Clean 1:1 pair = a VHH chain that touches exactly one antigen copy, and that antigen copy touched by exactly one VHH copy. If several qualify, the one with most contacts. Otherwise dropped.
3. `stage3.py` (CDR3 = IMGT 105-117 from ANARCI; its own selection is superseded) and `stage3b.py` clustering: antigen groups = same UniProt OR >=30% identity (Biopython local alignment, BLOSUM62, 11/1, identities / length of the shorter sequence; this is NOT mmseqs and is coverage-agnostic, so it can over-merge); RCSB's own 30% cluster ids came back null for these entries and were not used. CDR3 clusters: edit-distance identity >=0.8. Greedy newest-first (ties: better resolution): one complex per antigen group and none whose CDR3 is >=0.8 to an already kept one. Also records max identity of each antigen to HER2 (max 0.17) and VHH to proxy VHHs.
4. `stage4.py` labels: imports `proxies/build_proxy_labels.py` (`write_pair_pdb`, `run_vlt`, `min_dists`, `isolated_rsa`, `anarci_imgt`), Voronota-LT v1.1.497 (`C:\Temp\sepiq26\tools\vlt.exe`), `--restrict-contacts '[-a1 [-chain A] -a2 [-chain B]]' --write-sites-residue-level-to-file`, polymer standard amino acids only, no waters/ligands/glycans, no symmetry mates, pair isolated from all other chains. Residues renumbered to SEQRES index (label_seq_id), so `seqNum` = position in the FASTA; unresolved residues stay in the universe with `resolved=0`, label 0. Label = area>0 (`fact_gt0`); `fact_ge5`, `fact_d4` also given. Check: running this renumbering path on 5MY6 and 9MTX reproduces the proxy positives exactly (21/24 and 31/27).
5. `stage5.py` core selection: from the 88 unique complexes remove fusion/tag-binder constructs by judgment (9TY2 MBP, 9WPI TGP, 9W3F B2AR-T4L, 12PB MTCH2/UCP1 chimera, 9BA0 CB1-glycogen synthase) and antigens <50% resolved (9EGN, 36%); keep the 40 newest (release 2025-06-04 to 2026-10-21). Run `stage3b.py`, `stage5.py` with system Python (Biopython); others with the venv.

`classify.py` is an early regex VHH detector, superseded by ANARCI (kept for audit only).

## Funnel (from 1,889)
2 protein entities 467; exactly 1 VHH entity 383, minus 2 antibody-like antigens = 381; resolution/method 319; antigen 80-700 aa 244; minus ERBB2 (1, which is 9MTX) = 243 (9MTE has 3 protein entities and was dropped earlier; 5MY6, 7QVK, 8GZ5 are not in the candidate list); clean 1:1 pair 190 (53 failed; 82 of the 190 are multi-copy ASUs with a clean pair); unique antigen groups 88 (CDR3 dedupe removed 0 more); judgment exclusions 6 -> 82; core 40.

## Caveats
- All core entries were released after 2023-06-01 (Boltz-2 cutoff), but "released" is the RCSB initial release date, not the deposition date; none verified against Boltz-2 training sets, and homologs/same-VHH-family entries older than the cutoff can still exist.
- Entries with >2 protein entities (1,422) were excluded wholesale, including VHH+antigen+irrelevant partner cases; membrane-protein and GPCR/transporter antigens (many cryo-EM) are over-represented relative to HER2 (soluble ECD).
- Antigen base rates are higher than HER2's 0.03-0.055 mainly because antigens are smaller; compare per-complex with the null, not to the HER2 rate.
- Fusion-partner contacts in 28IY and 9QTO/9W89 natural-fusion or chimeric constructs were kept; check if relevant.
- Labels use the asymmetric unit only, as for the proxies.
