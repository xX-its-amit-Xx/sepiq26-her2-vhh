// Every row is transcribed from the round-1 research JSON files named in `src`.
// "unverified" means the hive file itself marks the number as snippet-only or not opened.
export type Category = "Co-folding" | "Docking" | "Epitope predictor" | "Language model" | "Paratope predictor" | "Baseline" | "Prior / null";
export type Row = {
  category: Category;
  method: string;
  best: string;
  test: string;
  leakage: string;
  licence: string;
  status: "opened" | "partly unverified" | "unverified" | "our simulation";
  src: string;
};

const Q5 = "research/q5_structure_prediction_docking/";
const Q6 = "research/q6_epitope_ml_methods/";
const COF = Q5 + "alphafold3_openfold3_boltz2_chai1_protenix_nanobody_antigen_benchmarks_and_success_rates.json";
const DOCK = Q5 + "nanobody_antigen_docking_haddock_clusp_zdock_rosetta_and_ai_augmented_docking.json";
const PARA = Q5 + "paratope_prediction_methods_for_nanobodies_and_cdr_only_focus.json";
const EPI = Q6 + "b_cell_epitope_predictors_bepipred3_discotope3_sema_abepitope_state_and_limits.json";
const PLM = Q6 + "protein_and_antibody_language_models_esm_ablang_nanobert_iglm_embeddings_for_interfaces.json";
const PRA = Q6 + "residue_level_pr_auc_with_prevalence_0_1_calibration_ranking_and_aggregation_tricks.json";
const NOLIC = "not recorded in the hive file";

export const ROWS: Row[] = [
  { category: "Co-folding", method: "AlphaFold3 (AF3)", best: "48.75% of cases DockQ >= 0.23 (FoldBench antibody-antigen); 31.6% on 60 nanobody cases, single seed", test: "n = 160 / n = 60", leakage: "Training cutoff 2021-09-30; later benchmark entries are post-cutoff", licence: NOLIC, status: "opened", src: COF },
  { category: "Co-folding", method: "Protenix-v1", best: "52.31% (FoldBench Ab-Ag, 5 seeds x 5 samples); 40.26% on 498 antibody cases, rising 36.0% (1 seed) to 47.7% (80 seeds)", test: "n = 160 / n = 498", leakage: "Cutoff 2022-2025 test set", licence: NOLIC, status: "opened", src: COF },
  { category: "Co-folding", method: "Boltz-2", best: "40.10% on 498 antibody cases (median 38.6%, best 50.4%)", test: "n = 498", leakage: "Overlaps Boltz-2 training data (stated in the hive file)", licence: NOLIC, status: "opened", src: COF },
  { category: "Co-folding", method: "Boltz-1", best: "23.3% on 60 nanobody cases, single seed", test: "n = 60", leakage: "Cutoff 2021-09-30", licence: NOLIC, status: "opened", src: COF },
  { category: "Co-folding", method: "Chai-1", best: "22.1% on 498 antibody cases; 15.0% on 60 nanobody cases", test: "n = 498 / n = 60", leakage: "Cutoff 2021-09-30 on the nanobody set", licence: NOLIC, status: "opened", src: COF },
  { category: "Co-folding", method: "OpenFold3", best: "No number extracted (figure only)", test: "not recorded", leakage: "not recorded", licence: NOLIC, status: "unverified", src: COF },
  { category: "Docking", method: "HADDOCK3 with true interface known (bound antigen)", best: "Top-1 correct 65%, top-10 87.5%", test: "n = 40 nanobody complexes", leakage: "Uses the answer as input, so not a blind result", licence: NOLIC, status: "partly unverified", src: DOCK },
  { category: "Docking", method: "HADDOCK3 loose interface (CDRs + epitope region +4 A)", best: "Top-1 30% bound / 17.5% unbound; top-10 55% / 42.5%", test: "n = 40", leakage: "Needs an epitope guess as input", licence: NOLIC, status: "partly unverified", src: DOCK },
  { category: "Docking", method: "HADDOCK3 blind (all surface)", best: "Top-1 7.5%, top-10 20%", test: "n = 40", leakage: "None stated", licence: NOLIC, status: "partly unverified", src: DOCK },
  { category: "Docking", method: "AF2-Multimer v2.3 (blind)", best: "Top-1 25%, top-10 27.5%", test: "n = 40", leakage: "Training-set overlap not stated", licence: NOLIC, status: "partly unverified", src: DOCK },
  { category: "Docking", method: "AF3 server, 25 models (blind)", best: "Top-1 32.5%, top-10 52.5%", test: "n = 40", leakage: "Training-set overlap not stated", licence: NOLIC, status: "partly unverified", src: DOCK },
  { category: "Docking", method: "ClusPro AbEMap-style contact frequency on AF3 (100 seeds, 500 models)", best: "Epitope PR-AUC 0.58 (ROC 0.82), versus 0.36 for an AF2 ensemble. Antibodies, not nanobodies", test: "n = 26 antibodies", leakage: "Sequence-only input, but AF3 may have seen the structures", licence: NOLIC, status: "partly unverified", src: DOCK },
  { category: "Epitope predictor", method: "DiscoTope-3.0 (AF2 input)", best: "PR-AUC 0.232, ROC-AUC 0.783 at 6.4% prevalence (about 3.6x random)", test: "24 antigens, 6,788 residues", leakage: "HER2 leak unknown, likely", licence: "Academic server; Creative Commons variant unverified", status: "opened", src: EPI },
  { category: "Epitope predictor", method: "BepiPred-3.0", best: "ROC-AUC 0.738 / 0.771 on two test sets; PR-AUC not reported", test: "5 and 15 antigens", leakage: "HER2 leak unknown, likely", licence: "Not stated on the DTU page", status: "opened", src: EPI },
  { category: "Epitope predictor", method: "SEMA 2.0", best: "ROC-AUC 0.744 (masked) / 0.777 (unmasked); PR-AUC not reported", test: "101 sequences", leakage: "HER2 leak unknown, likely", licence: "Ambiguous MIT notice", status: "opened", src: EPI },
  { category: "Epitope predictor", method: "AbEpiTope-1.0", best: "Residue-level numbers not reported; probably cannot take a VHH (needs VH+VL)", test: "1,730 complexes", leakage: "HER2 leak unknown, likely", licence: "Academic, non-commercial", status: "opened", src: EPI },
  { category: "Epitope predictor", method: "EpiPred", best: "No numbers extracted; historical", test: "45 complexes", leakage: "Unknown", licence: "Not stated", status: "unverified", src: EPI },
  { category: "Language model", method: "AntiBERTa2-CSSP", best: "Nanobody paratope PR-AUC 0.765 (AUROC 0.939) on the NbBench task", test: "NbBench paratope task", leakage: "Not assessed in the hive file", licence: "Not checked", status: "partly unverified", src: PLM },
  { category: "Language model", method: "AbLang (heavy)", best: "Paratope PR-AUC 0.756 (AUROC 0.933)", test: "NbBench paratope task", leakage: "Not assessed", licence: "Not checked", status: "partly unverified", src: PLM },
  { category: "Language model", method: "AntiBERTy", best: "Paratope PR-AUC 0.739 (AUROC 0.932)", test: "NbBench paratope task", leakage: "Not assessed", licence: "Not checked", status: "partly unverified", src: PLM },
  { category: "Language model", method: "nanoBERT", best: "Paratope PR-AUC 0.719 (AUROC 0.928)", test: "NbBench paratope task", leakage: "Not assessed", licence: "Not checked", status: "partly unverified", src: PLM },
  { category: "Language model", method: "ESM-2 650M", best: "Paratope PR-AUC 0.718 (AUROC 0.928)", test: "NbBench paratope task", leakage: "Not assessed", licence: "MIT for code; no separate weight licence stated", status: "partly unverified", src: PLM },
  { category: "Language model", method: "VHHBERT", best: "Paratope PR-AUC 0.695 (AUROC 0.921)", test: "NbBench paratope task", leakage: "Not assessed", licence: "Not checked", status: "partly unverified", src: PLM },
  { category: "Language model", method: "IgBert", best: "Paratope PR-AUC 0.687 (AUROC 0.921)", test: "NbBench paratope task", leakage: "Not assessed", licence: "MIT (HF model card)", status: "partly unverified", src: PLM },
  { category: "Language model", method: "AbLang-2", best: "Paratope PR-AUC 0.693 on a different benchmark (Paraplume/PECAN)", test: "PECAN-style set", leakage: "Not assessed", licence: "BSD-3-Clause", status: "partly unverified", src: PLM },
  { category: "Language model", method: "ProtT5", best: "Paratope PR-AUC 0.734 on the Paraplume/PECAN benchmark", test: "PECAN-style set", leakage: "Not assessed", licence: "Not verified", status: "partly unverified", src: PLM },
  { category: "Language model", method: "IgLM / ESM3 / ESM C 600M", best: "No paratope number extracted", test: "n/a", leakage: "n/a", licence: "IgLM academic non-commercial; ESM3 and ESM C 600M non-commercial (avoid)", status: "opened", src: PLM },
  { category: "Paratope predictor", method: "ParaDeep", best: "PR-AUC 0.805, ROC-AUC 0.959 on heavy chains (10.4% prevalence); nanobodies not evaluated", test: "n = 222", leakage: "Not assessed", licence: "GitHub repository; licence not recorded", status: "partly unverified", src: PARA },
  { category: "Paratope predictor", method: "Paragraph", best: "PR-AUC 0.696, ROC-AUC 0.934 (third-party aggregate on PECAN set); needs a structure", test: "PECAN set", leakage: "Not assessed", licence: NOLIC, status: "partly unverified", src: PARA },
  { category: "Paratope predictor", method: "ParaAntiProt", best: "PR-AUC 0.665, ROC-AUC 0.912 (search summary only)", test: "not recorded", leakage: "Not assessed", licence: "Unverified", status: "unverified", src: PARA },
  { category: "Paratope predictor", method: "Parapred", best: "PR-AUC 0.516, ROC-AUC 0.861 (heavy-chain blind test); no nanobody claim", test: "heavy-chain test", leakage: "Not assessed", licence: "README not reachable", status: "partly unverified", src: PARA },
  { category: "Paratope predictor", method: "NanoBERTa-ASP", best: "AUC 0.947 (nanobody only); PR-AUC only in figures", test: "not recorded", leakage: "Not assessed", licence: "Weights unverified", status: "unverified", src: PARA },
  { category: "Baseline", method: "AntiBinder (organiser baseline)", best: "0.176 PR-AUC on the organisers' 8GZ5 proxy; the paper reports no residue-level metric", test: "1 complex (26 of 206 residues)", leakage: "A shuffled guess reaches 0.176 about 16% of the time (mean random 0.147, SD 0.032)", licence: NOLIC, status: "our simulation", src: "research/q6_epitope_ml_methods/antibinder_architecture_attention_epitope_extraction_and_why_it_scores_0_176.md" },
  { category: "Prior / null", method: "Domain prior (which HER2 domain)", best: "PR-AUC 0.0905 (SD 0.052) at 3.97% prevalence, 25 true residues. Random: 0.049", test: "Simulated, 630-residue antigen", leakage: "None: a simple rule, not a trained model", licence: "n/a", status: "our simulation", src: PRA },
  { category: "Prior / null", method: "Surface exposure only (RSA)", best: "PR-AUC 0.0688 at 3.97% prevalence. Random: 0.049", test: "Simulated, 630-residue antigen", leakage: "None", licence: "n/a", status: "our simulation", src: PRA },
  { category: "Prior / null", method: "VHH CDR-position prior", best: "PR-AUC 0.644 (SD 0.101) versus 0.204 random on the VHH chain", test: "Simulated VHH chains", leakage: "None", licence: "n/a", status: "our simulation", src: PRA },
];

export const CATEGORIES: Category[] = ["Co-folding", "Docking", "Epitope predictor", "Language model", "Paratope predictor", "Baseline", "Prior / null"];
