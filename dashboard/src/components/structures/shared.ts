import raw from "./data.json";

export type Region = "CDR1" | "CDR2" | "CDR3" | "framework";
export type Cx = {
  id: string;
  pdb: string;
  fmt: "pdb" | "cif";
  name: string;
  short: string;
  type: string;
  res: number;
  method: string;
  date: string;
  doi: string;
  her: string; // HER2 chain in the structure file
  vhh: string; // partner chain id(s) in the structure file
  off: number; // structure residue number minus UniProt number
  epi: number[]; // 4 A heavy-atom contact residues (UniProt numbering)
  epiV: number[]; // Voronota-LT contact residues (UniProt numbering)
  area: Record<string, number>; // Voronota-LT contact area per HER2 residue (A^2)
  doms: string[];
  nepi: number;
  nepiV: number;
  frac: number;
  seq?: string;
  cdr?: { CDR1: number[]; CDR2: number[]; CDR3: number[] };
  para?: Record<Region, number[]>; // structure residue numbers
  paraIdx?: Record<Region, number[]>; // positions in seq
  vhhResi?: Record<string, number>; // seq position -> structure residue number
};
export type Data = {
  complexes: Cx[];
  covN: number[]; // index 0 = UniProt 23
  covBinders: [number, number, string[]][];
  domains: [string, number, number][];
  patchUnion: number[];
  patchCore: number[];
  aaseq: string; // UniProt 23..652
  glyco: number[];
};
export const DATA = raw as unknown as Data;

/** Structure source folders (project relative, shown through the Source disclosure). */
export const SRC = {
  complexes: "research/q1_her2_biology/her2_public_complexes.json",
  coverage: "research/q1_her2_biology/her2_ecd_per_residue_antibody_coverage.json",
  arch: "research/q1_her2_biology/her2_ectodomain_architecture_domains_I_to_IV_and_structures_summary.json",
  dimer: "research/q1_her2_biology/erbb_family_dimerisation_signalling_and_adjacent_proteins_egfr_her3_her4.md",
  therapeutic: "research/q1_her2_biology/her2_therapeutic_antibodies_adcs_epitopes_trastuzumab_pertuzumab_margetuximab_and_binding_footprints.md",
  verbatim: "research/_meta/sepiq_verbatim.md",
  vhhGeom: "research/q2_vhh_immunology_structure/vhh_structure_framework_cdr_loops_cdr3_length_geometry_and_numbering_schemes.md",
};

export const COL = {
  dom: { I: "#4f8ef7", II: "#f2a93b", III: "#4fbf7a", IV: "#b872e0" } as Record<string, string>,
  gray: "#a9b4b6",
  vhh: "#12a3a8",
  epi: "#e2237a",
  epiV: "#f59abf",
  patch: "#ff8a1f",
  cdr1: "#2ec4b6",
  cdr2: "#3a86ff",
  cdr3: "#8338ec",
  fw: "#ffd23f",
  tras: "#f4a261",
  pert: "#7b6cd9",
  heat: ["#cfd8d6", "#f6dc8b", "#f1a94e", "#e2653b", "#c1263f", "#76103a"],
};

export const AA3: Record<string, string> = {
  A: "ALA", R: "ARG", N: "ASN", D: "ASP", C: "CYS", Q: "GLN", E: "GLU", G: "GLY", H: "HIS", I: "ILE",
  L: "LEU", K: "LYS", M: "MET", F: "PHE", P: "PRO", S: "SER", T: "THR", W: "TRP", Y: "TYR", V: "VAL",
};

export function domOf(u: number): string {
  for (const [d, a, b] of DATA.domains) if (u >= a && u <= b) return d;
  return "-";
}
export function aaAt(u: number): string {
  return DATA.aaseq[u - 23] ?? "X";
}
export function covAt(u: number): number {
  return DATA.covN[u - 23] ?? 0;
}
export function byId(id: string): Cx {
  const c = DATA.complexes.find((x) => x.id === id);
  if (!c) throw new Error("unknown complex " + id);
  return c;
}
export const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);

/** Compact residue list "10-14, 20" for display. */
export function ranges(a: number[]): string {
  const s = [...a].sort((x, y) => x - y);
  const out: string[] = [];
  let i = 0;
  while (i < s.length) {
    let j = i;
    while (j + 1 < s.length && s[j + 1] === s[j] + 1) j++;
    out.push(j > i ? `${s[i]}-${s[j]}` : `${s[i]}`);
    i = j + 1;
  }
  return out.join(", ");
}

/** The three challenge nanobodies, sequences verbatim from the challenge pages. CDR ranges follow the hive anchor-rule table (not ANARCI). */
export const ONU = [
  { name: "ONU11", seq: "MAQVQLQESGGGSVQAGGSLRLSCAASGRTLSGWVMGWFRQAPGKDRDFVAHLSGDTTAYAHSVKGRFTISRDNAKDTVFLQMNSLKPEDTGVYYCAARPLGSTWTEHPYWGQGTQVTVSSHHHHHH", cdr1: [28, 35], cdr2: [53, 59], cdr3: [97, 110] },
  { name: "ONU13", seq: "MAQVQLQESGGGLVQAGGSLRLSCTASERTFSIDYMGWYRQAPGKQREFVGTIEWNSGSTGYGDSVKGRFTISRDNAKNTGYLQMNSLKPEDTAVYYCAAKYGSSRLWDYWGQGTQVTVSSHHHHHH", cdr1: [28, 35], cdr2: [53, 61], cdr3: [99, 110] },
  { name: "ONU23", seq: "MAQVQLQESGGGLVQAGGSLRLSCAASGRTLSGAAMGWFRQAPGKEREFVAGISWSTSRTQYADSVKGRFTISRDNAKNTVFLQMNSLNAEDTAVYYCAADGRFYSDYVWSSPDEYAYWGQGTQVTVSSHHHHHH", cdr1: [28, 35], cdr2: [53, 61], cdr3: [99, 118] },
];

/** CDR3 span (1-based, inclusive) by one rule for every sequence: after the Cys that follows FR3 (Y-x-C), up to before the W of W-G-x-G. */
export function cdr3Span(seq: string): [number, number] | null {
  const m = /Y.C/.exec(seq.slice(80));
  const w = seq.search(/WG.G/);
  if (!m || w < 0) return null;
  const start = 80 + m.index + 3 + 1; // 1-based position after the Cys
  return [start, w];
}
