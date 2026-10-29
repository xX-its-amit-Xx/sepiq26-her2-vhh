"""Shared constants and helpers for the SEPIQ 2026 modeling lane (CPU only).

Facts used here and where they come from
- Antigen construct: UniProt P04626 residues 1-624 (signal peptide 1-22 included, "GACQ" = native 621-624)
  followed by His6 -> 630 residues (research/_meta/sepiq_verbatim.md, /detail page; q4 digest fact 1).
- VHH clones: sequential numbering, 1 = first printed residue (M). Printed lengths 127/127/135 including His6.
- Template row counts are NOT retrievable (HF dataset is gated). A byte-count fit of the three published template
  sizes (8,757 / 8,757 / 8,853 bytes) is consistent with chain A = 618 rows + chain B = 127/127/135 rows
  (computed value is 1 byte short in both cases, so this is an inference, not a fact). See README.
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(ROOT, "data")
RESEARCH = os.path.join(os.path.dirname(ROOT), "research")
VERBATIM = os.path.join(RESEARCH, "_meta", "sepiq_verbatim.md")

CLONES = ["ONU11", "ONU13", "ONU23"]
HEADER = ["chain", "seqNum", "resName", "prediction"]
ANTIGEN_CONSTRUCT_LEN = 630      # P04626 1-624 + His6
ANTIGEN_NATIVE_LEN = 624
INFERRED_TEMPLATE_A_ROWS = 618   # inferred from file sizes, unverified
SIGNAL_PEPTIDE = 22

THREE = {"A": "ALA", "R": "ARG", "N": "ASN", "D": "ASP", "C": "CYS", "Q": "GLN", "E": "GLU", "G": "GLY",
         "H": "HIS", "I": "ILE", "L": "LEU", "K": "LYS", "M": "MET", "F": "PHE", "P": "PRO", "S": "SER",
         "T": "THR", "W": "TRP", "Y": "TYR", "V": "VAL"}
ONE = {v: k for k, v in THREE.items()}


def load_p04626():
    s = "".join(open(os.path.join(DATA, "P04626.fa")).read().split())
    s = re.sub(r"^>.*", "", s)
    assert s.startswith("MELAALCRWG") and len(s) == 1255, len(s)
    return s


def _parse_verbatim_clone(text, clone):
    """Read the clone's residues from the /detail page capture (first plain-text rendering, numbered in blocks of 10)."""
    m = re.search(r">%s\s*\n\s*\n(.*?)\n" % clone, text)
    line = m.group(1)
    line = line.split("\\begin")[0]
    seq = "".join(re.findall(r"[A-Z]+", line))
    return seq


def load_constructs():
    """Return dict with antigen_seq (630), clones {name: seq} straight from the verbatim capture."""
    p = load_p04626()
    antigen = p[:ANTIGEN_NATIVE_LEN] + "HHHHHH"
    assert antigen[620:624] == "GACQ" and len(antigen) == ANTIGEN_CONSTRUCT_LEN
    text = open(VERBATIM, encoding="utf8").read()
    clones = {c: _parse_verbatim_clone(text, c) for c in CLONES}
    exp = {"ONU11": 127, "ONU13": 127, "ONU23": 135}
    for c in CLONES:
        assert len(clones[c]) == exp[c], (c, len(clones[c]))
        assert clones[c].endswith("HHHHHH"), c
    return {"antigen": antigen, "clones": clones}


def expected_residues(clone):
    """{(chain, seqNum): one-letter} for the full printed construct of this clone."""
    c = load_constructs()
    d = {("A", i + 1): aa for i, aa in enumerate(c["antigen"])}
    d.update({("B", i + 1): aa for i, aa in enumerate(c["clones"][clone])})
    return d


def tag_positions(clone):
    """Residues that are expression tags (must be predicted 0): antigen His6 625-630, VHH C-terminal His6."""
    c = load_constructs()
    nb = len(c["clones"][clone])
    return {("A", i) for i in range(625, 631)} | {("B", i) for i in range(nb - 5, nb + 1)}


def template_rows(clone, antigen_rows=INFERRED_TEMPLATE_A_ROWS):
    """Row set we write for a submission (the inferred template: A 1..618, B all)."""
    c = load_constructs()
    rows = [("A", i, THREE[c["antigen"][i - 1]]) for i in range(1, antigen_rows + 1)]
    rows += [("B", i, THREE[aa]) for i, aa in enumerate(c["clones"][clone], start=1)]
    return rows
