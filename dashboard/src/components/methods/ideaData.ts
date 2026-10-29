// Cross-domain transfers. Analogy, how-solved, verdict basis and kill test come from the king logs and the q9 files.
// The "fun" line is editorial colour written for this page; it contains no numbers.
export type Verdict = "holds" | "partly" | "breaks" | "untested";
export type Idea = {
  id: string;
  field: string;
  title: string;
  analogy: string;
  solved: string;
  verdict: Verdict;
  why: string;
  cheap: string;
  kill: string;
  fun: string;
  src: string[];
};

const KW = "research/_meta/king_world_KINGLOG.md";
const KI = "research/_meta/king_infer_KINGLOG.md";
const Q9 = "research/q9_serendipity_cross_domain/";

export const IDEAS: Idea[] = [
  {
    id: "consensus", field: "Structure prediction (CASP/CAPRI) and codebreaking",
    title: "Keep what repeats across many runs",
    analogy: "Each co-folding run is a noisy intercepted message. The contacts that show up again and again are the signal; the ones that appear once are noise.",
    solved: "CAPRI and CASP assessors learned that placing the binding site is all-or-nothing, so consensus over many models beat trusting one confidence score. Frequency analysis in codebreaking does the same with letter counts.",
    verdict: "partly",
    why: "Public benchmarks support the direction: Protenix-v1 improves from 36.0% to 47.7% correct complexes going from 1 to 80 seeds, and contact frequency over 100 AF3 seeds reached PR-AUC 0.58 versus 0.36 for an AF2 ensemble on antibodies. Nobody has run it on HER2 nanobodies yet.",
    cheap: "Run several seeds and engines on the two clean proxy complexes (9MTE, 9MTX) and score per-residue contact frequency.",
    kill: "If multi-seed consensus does not beat the contact map of the single best-ipTM model on PR-AUC on 9MTE/9MTX, abandon the ensemble. A second test: if split-half-shrunk consensus does not beat unshrunk mean contact, drop the shrinkage.",
    fun: "Turning a pile of disagreeing guesses into one honest probability map.",
    src: [KW, KI, "research/q5_structure_prediction_docking/alphafold3_openfold3_boltz2_chai1_protenix_nanobody_antigen_benchmarks_and_success_rates.json"],
  },
  {
    id: "decibans", field: "Cryptanalysis (decibans)",
    title: "Add up independent clues like a codebreaker",
    analogy: "Each clue (co-folding frequency, surface exposure, DiscoTope score, HER2 domain) is a weight of evidence. Codebreakers added log-odds in units called decibans.",
    solved: "Wartime codebreakers summed small independent pieces of evidence until a hypothesis crossed a threshold.",
    verdict: "partly",
    why: "The recipe is valid only if clues are independent, and clonal families of nanobodies break that. It was proposed, not run on the 1.8-million-row table.",
    cheap: "Sum standardised log-odds from three or four sources on the proxy set, after clustering correlated sources.",
    kill: "If the log-odds sum does not beat the best single source by at least 0.03 macro PR-AUC on the proxies, revert to the single best source.",
    fun: "A calibrated 0-to-1 output built the way Bletchley built confidence.",
    src: [KI, Q9 + "cryptanalysis_and_codebreaking_known_plaintext_and_crib_dragging_for_interface_inference.md"],
  },
  {
    id: "msa", field: "CASP history",
    title: "Change what the model is fed, not only how big it is",
    analogy: "Protein folding jumped when models were given evolutionary co-variation (the MSA), then distance maps, then trained end to end.",
    solved: "Contact precision rose from 47% (CASP12, best L/5) to above 70% (CASP13); AlphaFold2 reached a median GDT_TS of 92.4 at CASP14.",
    verdict: "partly",
    why: "A pseudo-alignment from real binder sequences marks the nanobody loops only, and gives identical profiles for ONU11 and ONU13. There is one antigen and no partner co-variation, so the idea dies for the antigen side and survives as a loop-variability map.",
    cheap: "Use the binder-derived variability map as a feature for the nanobody chain only.",
    kill: "If the map does not raise CDR-residue PR-AUC over a plain position prior, drop it.",
    fun: "Testing the user's own hypothesis in the field where it was born, and writing down honestly where it stops.",
    src: [Q9 + "casp_history_what_actually_changed_the_field_data_representation_msa_end_to_end.md", "research/q9_serendipity_cross_domain/_QUEEN_DIGEST.md"],
  },
  {
    id: "ecology-pu", field: "Ecology (species distribution models)",
    title: "Presence-only maps: we only ever see where binders touched",
    analogy: "Ecologists model where a species lives from sightings only, with no confirmed absences. Our residues are the same: known contacts, and everything else merely unlabelled.",
    solved: "MaxEnt, Poisson point-process models and PU learning are the same family; prevalence cannot be identified from presence-only data, so rankings and a prior are used.",
    verdict: "breaks",
    why: "The statistics map cleanly and clarify that prevalence does not matter for a rank-based per-complex score. But the presence-only prior itself scored only 0.04-0.05 average precision, and PU variants lowered PR-AUC in the NGS tests.",
    cheap: "Already done in simulation. Keep the null models (exposure-only, domain-only) as yardsticks.",
    kill: "PU/MaxEnt-style reweighting must beat plain logistic regression on grouped cross-validation. It did not, so it is parked.",
    fun: "Borrowing a toolbox from people who count birds, then using it to find out which of our assumptions were wrong.",
    src: [KI, KW, Q9 + "ecology_niche_modelling_and_species_distribution_with_presence_only_data.md"],
  },
  {
    id: "niche", field: "Ecology (niche overlap)",
    title: "Mask the part of HER2 that is already occupied",
    analogy: "A species cannot live where a competitor already sits. The patch of HER2 used when two HER2 molecules pair up is 'occupied', so a nanobody should avoid it.",
    solved: "Ecologists separate the fundamental niche (where it could live) from the realised niche (where it actually can).",
    verdict: "untested",
    why: "None of the four public HER2 nanobody epitopes overlap the roughly 51-residue dimer patch (mostly residues 221-351), which suggests it should help. No held-out run exists.",
    cheap: "Down-weight the dimer patch in the antigen prior and score on the four public nanobody complexes.",
    kill: "If it does not lower mean average precision over exposed residues, or hurts held-out AP, remove it.",
    fun: "Reading a protein surface like a landscape with territories.",
    src: [KW],
  },
  {
    id: "art", field: "Art conservation",
    title: "Restore the original panel: a position map for the nanobody loops",
    analogy: "A restorer works from where damage usually occurs. For nanobodies, certain loop positions touch the target far more often than others.",
    solved: "Conservators use a hand-set map of likely damage rather than inspecting every brushstroke.",
    verdict: "partly",
    why: "A position-based prior was reported at +0.17 to +0.33 PR-AUC above the base rate on HER2 nanobodies, and a simulated CDR prior reaches 0.644 against 0.204 random. Numbering used a home-made script that may be off by one, and the germline-versus-mutation question is untested.",
    cheap: "Redo numbering with ANARCI and score the position prior on the five HER2 nanobodies.",
    kill: "It must beat prevalence by at least +0.17 absolute PR-AUC; if not, fall back to a uniform, CDR3-weighted guess.",
    fun: "The easy half of the problem, solved by respecting where nanobodies usually grip.",
    src: [KW, "research/q6_epitope_ml_methods/residue_level_pr_auc_with_prevalence_0_1_calibration_ranking_and_aggregation_tricks.json"],
  },
  {
    id: "screening", field: "Healthcare screening",
    title: "A positive label is not proof: do the Bayes arithmetic",
    analogy: "A screening test with a low base rate gives mostly false alarms (the prosecutor's fallacy). The enrichment label behaves like such a test.",
    solved: "Clinicians convert a test result into a post-test probability using the base rate.",
    verdict: "untested",
    why: "The hive estimates about 27% positive predictive value at a 3% prior. The NGS data also carry no per-HER2-residue contrast, so this can only reweight the nanobody side.",
    cheap: "Use a simulated clone-enrichment proxy as a weighted signal on the proxy complexes.",
    kill: "If a PU-weighted use of the signal does not beat a uniform plus exposure prior by 0.02 macro PR-AUC under leave-one-complex-out, drop it.",
    fun: "Explaining to a machine what every doctor already knows about false positives.",
    src: [KW],
  },
  {
    id: "baserate", field: "Healthcare screening (base-rate lens)",
    title: "Always report lift over the base rate",
    analogy: "A score means little until you divide it by what random guessing gets.",
    solved: "Clinical papers report relative risk and number needed to treat, not raw accuracy.",
    verdict: "holds",
    why: "It already paid off: the organisers' 0.176 is only about 1.2 times the expected random score on its own proxy, and random reaches it 16% of the time.",
    cheap: "Report lift and a shuffle null next to every number.",
    kill: "If an arm's macro lift over the per-complex shuffle null is below about 1.5x on both clean proxies, do not submit it as the main candidate.",
    fun: "Deflating a headline number with one division.",
    src: [KI, "research/q6_epitope_ml_methods/antibinder_architecture_attention_epitope_extraction_and_why_it_scores_0_176.md"],
  },
  {
    id: "law", field: "Law of evidence",
    title: "Cutoff as standard of proof: a 'robust core' of residues",
    analogy: "A fact stands when it survives several standards of proof. A contact residue is robust if it survives many contact-area cutoffs.",
    solved: "Courts weigh evidence against thresholds rather than a single number.",
    verdict: "untested",
    why: "The area-weighted metric is cutoff-proof in principle, so the fraction of cutoffs or seeds passed can serve as a probability. Not yet compared with raw single-cutoff labels.",
    cheap: "Compute the fraction of cutoffs passed on the proxies and use it as the target.",
    kill: "If the consensus-of-cutoffs score does not give higher weighted PR-AUC than single-cutoff labels, discard it.",
    fun: "Putting residues on trial.",
    src: [KW],
  },
  {
    id: "walk", field: "Sports analytics (walk-forward testing)",
    title: "Only test on games played after the model stopped learning",
    analogy: "A fair backtest uses only matches after the training cutoff. Structures released after an engine's cutoff cannot have been memorised.",
    solved: "Sports models are scored forward in time, never on the past they trained on.",
    verdict: "untested",
    why: "9MTE and 9MTX (released 2025-11-19) are leakage-free proxies; older proxies may be memorised.",
    cheap: "Compare each arm's rank on 9MTE/9MTX with its rank on the older 5MY6/7QVK.",
    kill: "If the ranks disagree by more than a pre-set margin, treat the pre-cutoff gain as memorisation and discard it.",
    fun: "A time machine for honest scoring.",
    src: [KI],
  },
  {
    id: "luck", field: "Sports and leaderboards",
    title: "With three test cases, luck is a large part of winning",
    analogy: "A short season produces surprise champions. With n=3, small score gaps are noise.",
    solved: "Statisticians use bootstrap confidence intervals and hedge across entries.",
    verdict: "holds",
    why: "Simulation gives a macro PR-AUC standard deviation of roughly 0.024-0.06 at n=3; unrelated submissions need a gap of about 0.07-0.16 to separate. This is a property of the metric, not a method that can fail.",
    cheap: "Use the five-submission ladder as hedges and bootstrap locally.",
    kill: "If the local bootstrap intervals of two candidates overlap, submit the simpler one.",
    fun: "Playing the odds on purpose.",
    src: [KW, "research/q9_serendipity_cross_domain/_QUEEN_DIGEST.md"],
  },
  {
    id: "chain", field: "Forensics (chain of custody)",
    title: "Log every handoff of data like an exhibit",
    analogy: "Evidence is only as good as its documented path. A mismatched sequence or wrong numbering offset can ruin a good model.",
    solved: "Forensic labs track every transfer with a register.",
    verdict: "holds",
    why: "Already paid off: the audit caught a stale home page. Not a model idea, so it does not 'fail' in the scoring sense.",
    cheap: "A local validator that checks the file against the printed construct.",
    kill: "A submission file that mismatches the template sequences must fail the local check.",
    fun: "Being the detective of your own pipeline.",
    src: [KW],
  },
  {
    id: "music", field: "Music identification (Shazam)",
    title: "Match by repeating peaks, not by whole recordings",
    analogy: "Shazam matches a song through constellations of spectral peaks that survive noise. Per-position enrichment peaks that replicate across cluster halves might do likewise.",
    solved: "Peaks that repeat across noisy copies are kept; the rest is dropped.",
    verdict: "breaks",
    why: "Peaks did replicate (Jaccard 0.48-0.61, 75% in CDR columns), but the first test showed denoised peaks did not beat the plain variability prior.",
    cheap: "Already tried once; no further effort is planned.",
    kill: "Denoised peaks must raise CDR-residue PR-AUC over the variability prior. The first try said no.",
    fun: "Humming a protein into a phone.",
    src: [KI],
  },
  {
    id: "translate", field: "Linguistics (translation alignment)",
    title: "Learn a dictionary between two languages without a dictionary",
    analogy: "Nanobody sequences and HER2 surface patches as two languages to align.",
    solved: "Unsupervised alignment works when each language is large and the two have similar structure, using thousands of paired examples or a seed dictionary.",
    verdict: "breaks",
    why: "There is one HER2 sequence against 1e5-1e6 nanobodies, and only a few hundred binder labels. The premise fails; the practical lesson, a nanobody language-model paratope head, survives (literature PR-AUC about 0.65-0.70, unverified).",
    cheap: "Train a paratope head on language-model embeddings with clustered splits.",
    kill: "If it does not beat the CDR position prior on held-out clusters, use the prior.",
    fun: "Failing in an instructive way and keeping the useful leftover.",
    src: [Q9 + "linguistics_and_translation_alignment_unsupervised_correspondence_between_two_languages.md"],
  },
  {
    id: "blind", field: "Other blind challenges",
    title: "What actually won Netflix, Kaggle and DREAM",
    analogy: "Winners often changed the information fed in (new features, prior knowledge) and blended models, rather than only enlarging one model.",
    solved: "Netflix was won by a blend plus new temporal features, with a margin of 0.00001 RMSE and a tie broken by 20 minutes. DREAM synergy was won with prior-knowledge features. Roelofs 2019 found little overfitting across 120 Kaggle competitions, with tiny test sets as outliers.",
    verdict: "partly",
    why: "'Representation not model size' survives only in restricted form. AlphaFold2 is the counterexample: an end-to-end model won CASP14 by a wide margin.",
    cheap: "Blend a structure-based prior with the nanobody-side prior, calibrated per complex.",
    kill: "If the blend does not beat the best single arm on the clean proxies, ship the single arm.",
    fun: "Learning from people who won by 20 minutes.",
    src: [Q9 + "other_blind_challenge_wins_by_data_representation_netflix_kaggle_casp_dream_and_what_they_share.md"],
  },
];

export type Casp = { year: string; method: string; note: string; gain: "data" | "model" | "loss" | "both" | "n/a"; status: string };
export const CASP: Casp[] = [
  { year: "1994", method: "CASP1: threading / homology", note: "First blind assessment", gain: "n/a", status: "unverified" },
  { year: "~2000", method: "CASP4: Rosetta fragment assembly", note: "Fragments as building moves", gain: "data", status: "unverified" },
  { year: "2009", method: "Weigt: DCA", note: "Global Potts model of a sequence alignment", gain: "model", status: "unverified" },
  { year: "2011", method: "Morcos / Marks: DCA", note: "Coevolution contacts", gain: "model", status: "partly verified" },
  { year: "2012", method: "PSICOV", note: "Sparse inverse covariance", gain: "model", status: "unverified" },
  { year: "2016", method: "CASP12: coevolution + machine learning", note: "Best L/5 contact precision 47%", gain: "data", status: "verified" },
  { year: "2017", method: "RaptorX ResNet", note: "Top-L long-range precision 0.47 versus 0.21 for CCMpred", gain: "model", status: "verified" },
  { year: "2018", method: "CASP13: AlphaFold1", note: "Distogram; L/5 above 70%; 24 of 43 free-modelling targets at high accuracy", gain: "loss", status: "verified" },
  { year: "2020", method: "CASP14: AlphaFold2", note: "Median GDT_TS 92.4; 87 of 92 domains above 70", gain: "both", status: "verified" },
  { year: "2021", method: "MSA Transformer", note: "Masked language model over an alignment", gain: "model", status: "secondary" },
];
export const CASP_SRC = Q9 + "casp_history_what_actually_changed_the_field_data_representation_msa_end_to_end.json";
