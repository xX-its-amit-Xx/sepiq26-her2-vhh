# SEPIQ 2026 verbatim capture (exhibit log)

Custodian: worker sepiq_guideline_detail_about_pages_verbatim_capture_sequences_numbering_and_contradictions (queen q4_challenge_intelligence). Captured 2026-10-17 UTC (curl fetches ~00:31 UTC; server Date header of a later HEAD request: Sat, 17 Oct 2026 00:33:40 GMT).

Method: raw HTML fetched with curl (HTTP 200), saved to C:\Temp\sepiq26\raw\, converted to text by stripping script/style/svg and tags (C:\Temp\sepiq26\ext.py). Text below is the page text as extracted. Only alterations: (i) HTML table cells joined onto one line with " | " separators, (ii) empty placeholder bullets removed, (iii) KaTeX formulas appear twice (plain text plus LaTeX source) and both are kept. Sequence separators on /detail are U+2005 characters in the original.

## Exhibit register (chain of custody)

| Exhibit | URL | HTTP | Server Last-Modified | SHA-256 of raw file |
|---|---|---|---|---|
| E1 detail | https://sepiq.uk/detail | 200 | Tue, 01 Sep 2026 09:24:51 GMT | 7db1c041d2960f6ca871ccf1299fa6551dee11531b8099b55ca9c89b30ce877e |
| E2 guideline | https://sepiq.uk/guideline | 200 | Tue, 01 Sep 2026 09:24:56 GMT | 493a4b9c941097a3d8fea2439976fc4e21243344b988da65b88ed800918d44e8 |
| E3 about | https://sepiq.uk/about | 200 | Tue, 01 Sep 2026 09:24:43 GMT | c65e37a854e769a03bef1fe777931f7fec9a16a9a53836bdec74c94107ad8d8f |
| E4 home (context) | https://sepiq.uk/ | 200 | Tue, 01 Sep 2026 09:25:01 GMT | 5b56f4159f03d3ea24a9d7e4b3b93cdaa0d3629e7cd5f9c00a245aaee1555e9e |
| E5 HF dataset README | https://huggingface.co/datasets/sepiq-2026/SEPIQ-2026-training-data/resolve/main/README.md | 200 | n/a | a12e3a0530d9f58e83d6ba5551f2f57d346c5164211596fd79f89abe186924ad |
| E6 HF Space app.py | https://huggingface.co/spaces/sepiq-2026/SEPIQ-2026-Challenge/resolve/main/app.py | 200 | n/a | f1501d328bdd2a612d794b1ab8fdcf06ea59631a1fb154b19ed4778154fc90ac |
| E7 UniProt P04626 FASTA | https://rest.uniprot.org/uniprotkb/P04626.fasta | 200 | n/a | 544da5f05e6961a6a51f6fb7540d48b61f57cdfe5c8cfe4da455bb3118574cdb |

Note: static export; all four sepiq.uk pages carry Last-Modified 2026-09-01 09:24-09:25 GMT, so none changed after the 1 Sept deploy as of 2026-10-17.



---

# PAGE 1 of 3: https://sepiq.uk/detail
Fetched 2026-10-17 (UTC), sha256 7db1c041d2960f6ca871ccf1299fa6551dee11531b8099b55ca9c89b30ce877e

<<<BEGIN VERBATIM DETAIL>>>

- SEPIQ VHH-Epitope-Prediction Challenge 2026

HomeAboutDetailGuidelineBrandHomeAboutDetailGuidelineBrand
# SEPIQ 2026 Challenge targets, timeline, and dataset

## Targets

HER2 is a clinically important oncology target for diagnosis and therapy. For this season, we have released a ∼ 1.8M-scale human HER2 VHH dataset, AVIDa-hHER2, with access to read-level NGS data (including singleton reads) with a subset of sequences labeled as binder/non-binder using statistical analysis. While the large-scale HER2 VHH sequence dataset provides useful information on binding behavior at the sequence level, it does not directly include residue-level epitope annotations. As a high-resolution ground truth for blind evaluation, three HER2-VHH complexes selected from the HER2 repertoire have been resolved (each defining a distinct HER2-VHH interface) to provide atomically detailed interface annotations. These structures and all derived labels will be held out during the challenge and released only after completion.

For submission, the human HER2 residues should be numbered according to the full-length UniProt P04626 sequence, including the signal peptide. The HER2 antigen used in this experiment is an extracellular domain which may form dimers under experimental conditions. The full amino acid sequence of the HER2 antigen used in this experiment is described below:

MELAALCRWG10  LLLALLPPGA20  ASTQVCTGTD30  MKLRLPASPE40  THLDMLRHLY50  QGCQVVQGNL60  ELTYLPTNAS70  LSFLQDIQEV80  QGYVLIAHNQ90  VRQVPLQRLR100  IVRGTQLFED110  NYALAVLDNG120  DPLNNTTPVT130  GASPGGLREL140  QLRSLTEILK150  GGVLIQRNPQ160  LCYQDTILWK170  DIFHKNNQLA180  LTLIDTNRSR190  ACHPCSPMCK200  GSRCWGESSE210  DCQSLTRTVC220  AGGCARCKGP230  LPTDCCHEQC240  AAGCTGPKHS250  DCLACLHFNH260  SGICELHCPA270  LVTYNTDTFE280  SMPNPEGRYT290  FGASCVTACP300  YNYLSTDVGS310  CTLVCPLHNQ320  EVTAEDGTQR330  CEKCSKPCAR340  VCYGLGMEHL350  REVRAVTSAN360  IQEFAGCKKI370  FGSLAFLPES380  FDGDPASNTA390  PLQPEQLQVF400  ETLEEITGYL410  YISAWPDSLP420  DLSVFQNLQV430  IRGRILHNGA440  YSLTLQGLGI450  SWLGLRSLRE460  LGSGLALIHH470  NTHLCFVHTV480  PWDQLFRNPH490  QALLHTANRP500  EDECVGEGLA510  CHQLCARGHC520  WGPGPTQCVN530  CSQFLRGQEC540  VEECRVLQGL550  PREYVNARHC560  LPCHPECQPQ570  NGSVTCFGPE580  ADQCVACAHY590  KDPPFCVARC600  PSGVKPDLSY610  MPIWKFPDEE620      GACQ      HHHHHH\begin{gathered}MELAALCRWG^{10}\:\:	LLLALLPPGA^{20}\:\:	ASTQVCTGTD^{30}\:\:	MKLRLPASPE^{40}\:\:	\\
THLDMLRHLY^{50}\:\:	QGCQVVQGNL^{60}\:\:	ELTYLPTNAS^{70}\:\:	LSFLQDIQEV^{80}\:\:	\\
QGYVLIAHNQ^{90}\:\:	VRQVPLQRLR^{100}\:\:	IVRGTQLFED^{110}\:\:	NYALAVLDNG^{120}\:\: \\	DPLNNTTPVT^{130}\:\:	GASPGGLREL^{140}\:\:	QLRSLTEILK^{150}\:\:	GGVLIQRNPQ^{160}\:\: \\	LCYQDTILWK^{170}\:\:	DIFHKNNQLA^{180}\:\:	LTLIDTNRSR^{190}\:\:	ACHPCSPMCK^{200}\:\: \\	GSRCWGESSE^{210}\:\:	DCQSLTRTVC^{220}\:\:	AGGCARCKGP^{230}\:\:	LPTDCCHEQC^{240}\:\: \\	AAGCTGPKHS^{250}\:\:	DCLACLHFNH^{260}\:\:	SGICELHCPA^{270}\:\:	LVTYNTDTFE^{280}\:\: \\	SMPNPEGRYT^{290}\:\:	FGASCVTACP^{300}\:\:	YNYLSTDVGS^{310}\:\:	CTLVCPLHNQ^{320}\:\: \\	EVTAEDGTQR^{330}\:\:	CEKCSKPCAR^{340}\:\:	VCYGLGMEHL^{350}\:\:	REVRAVTSAN^{360}\:\: \\	IQEFAGCKKI^{370}\:\:	FGSLAFLPES^{380}\:\:	FDGDPASNTA^{390}\:\:	PLQPEQLQVF^{400}\:\: \\	ETLEEITGYL^{410}\:\:	YISAWPDSLP^{420}\:\:	DLSVFQNLQV^{430}\:\:	IRGRILHNGA^{440}\:\: \\	YSLTLQGLGI^{450}\:\:	SWLGLRSLRE^{460}\:\:	LGSGLALIHH^{470}\:\:	NTHLCFVHTV^{480}\:\: \\	PWDQLFRNPH^{490}\:\:	QALLHTANRP^{500}\:\:	EDECVGEGLA^{510}\:\:	CHQLCARGHC^{520}\:\: \\	WGPGPTQCVN^{530}\:\:	CSQFLRGQEC^{540}\:\:	VEECRVLQGL^{550}\:\:	PREYVNARHC^{560}\:\: \\	LPCHPECQPQ^{570}\:\:	NGSVTCFGPE^{580}\:\:	ADQCVACAHY^{590}\:\:	KDPPFCVARC^{600}\:\: \\	PSGVKPDLSY^{610}\:\:	MPIWKFPDEE^{620}\:\:\:\:\:\:GACQ\:\:\:\:\:\:HHHHHH\end{gathered}

The residues of each VHH clone should be numbered according to sequential indexing. This season, we are not adopting the Kabat, Chothia, or IMGT schemes. The sequences of the three VHH clones for the challenge are listed below:

>ONU11

MAQVQLQESG10  GGSVQAGGSL20  RLSCAASGRT30  LSGWVMGWFR40  QAPGKDRDFV50  AHLSGDTTAY60  AHSVKGRFTI70  SRDNAKDTVF80  LQMNSLKPED90  TGVYYCAARP100  LGSTWTEHPY110  WGQGTQVTVS120      S    HHHHHH\begin{gathered}MAQVQLQESG^{10}\:\:	GGSVQAGGSL^{20}\:\:	RLSCAASGRT^{30}\:\:	LSGWVMGWFR^{40}\:\:	\\
QAPGKDRDFV^{50}\:\:	AHLSGDTTAY^{60}\:\:	AHSVKGRFTI^{70}\:\:	SRDNAKDTVF^{80}\:\:	\\
LQMNSLKPED^{90}\:\:	TGVYYCAARP^{100}\:\:	LGSTWTEHPY^{110}\:\:	WGQGTQVTVS^{120}\:\:	\\
\:\:\:\:S\:\:\:\:	HHHHHH\end{gathered}

>ONU13

MAQVQLQESG10  GGLVQAGGSL20  RLSCTASERT30  FSIDYMGWYR40  QAPGKQREFV50  GTIEWNSGST60  GYGDSVKGRF70  TISRDNAKNT80  GYLQMNSLKP90  EDTAVYYCAA100  KYGSSRLWDY110  WGQGTQVTVS120  S    HHHHHH\begin{gathered}MAQVQLQESG^{10}\:\:	GGLVQAGGSL^{20}\:\:	RLSCTASERT^{30}\:\:	FSIDYMGWYR^{40}\:\:	\\
QAPGKQREFV^{50}\:\:	GTIEWNSGST^{60}\:\:	GYGDSVKGRF^{70}\:\:	TISRDNAKNT^{80}\:\: \\
GYLQMNSLKP^{90}\:\:	EDTAVYYCAA^{100}\:\:	KYGSSRLWDY^{110}\:\:	WGQGTQVTVS^{120}\:\:	\\
S\:\:\:\:HHHHHH\end{gathered}

>ONU23

MAQVQLQESG10  GGLVQAGGSL20  RLSCAASGRT30  LSGAAMGWFR40  QAPGKEREFV50  AGISWSTSRT60  QYADSVKGRF70  TISRDNAKNT80  VFLQMNSLNA90  EDTAVYYCAA100  DGRFYSDYVW110  SSPDEYAYWG120  QGTQVTVSSH130  HHHHH\begin{gathered}MAQVQLQESG^{10}\:\:	GGLVQAGGSL^{20}\:\:	RLSCAASGRT^{30}\:\:	LSGAAMGWFR^{40}\:\:	\\
QAPGKEREFV^{50}\:\:	AGISWSTSRT^{60}\:\:	QYADSVKGRF^{70}\:\:	TISRDNAKNT^{80}\:\:	\\
VFLQMNSLNA^{90}\:\:	EDTAVYYCAA^{100}\:\:	DGRFYSDYVW^{110}\:\:
SSPDEYAYWG^{120}\:\:	\\
QGTQVTVSSH^{130}\:\:	HHHHH\end{gathered}

## Timeline

Challenge timeline: submission (Sep 1–Oct 31, 2026), evaluation and results announcement (Dec 15, 2026). Organizers will extend the duration of the challenge in case of any delays or technical issues from the SEPIQ or Hugging Face side.

## Dataset generation

For the SEPIQ 2026 Competition, we constructed labeled immune-derived VHH repertoires following published protocols (IL-6 datasets in [Tsuruta et al., 2023]). Library Construction and Selection: One alpaca was immunized with wild-type (WT) human HER2. We generated two VHH libraries from blood samples via phage display [Bazan et al., 2012, Smith, 1985] using the pMES4 vector and performed one round of biopanning against HER2. Sequencing and Preprocessing: We performed next-generation sequencing (NGS; 105 paired reads per library), removed low-quality reads, translated DNA sequences to amino acids, and represented each unique VHH by its read count. Statistical Labeling: To identify binders, we compared VHH proportions before and after panning. We modeled the proportion change using the chi-squared test. For each VHH-target pair, we calculated p-values for each sublibrary in relation to the corresponding mother library. A VHH-target pair was labeled a "binder" if the VHH’s proportion increased upon panning relative to the corresponding mother library and the p-value was ≤ 0.05. Because these labels are derived from panning enrichment rather than direct biophysical measurements, we treat them as enrichment-derived binder/non-binder labels and will provide multiple-testing-aware metadata. Cryo-EM Structure Determination and Interface Annotation: Structural Cryo-EM data were obtained for three HER2-VHH complexes generated through the BINDS program. Protein complexes were vitrified, and three-dimensional reconstructions were obtained from aligned two-dimensional particle images. For each held-out complex, structure-quality indicators will be reported, including map resolution, model-validation statistics, and the confidence of interface annotations based on the fitted atomic model and local map density.

## VHH dataset and Cryo-EM ground truth

The AVIDa-hHER2 dataset includes: 1) Experimental Labels: A few hundred sequences can be labeled as binder/non-binder using statistical analysis, providing a supervised signal where available. 2) Sequence Diversity: The data captures immune-derived diversity across multiple sampling time points, reflecting the natural maturation of antibody responses. 3) Read-level resource: NGS read-level data (including singleton reads) can support representation learning and robustness analyses. The data has been uploaded as 'NGS_read_count_table.csv'. For more detailed information, please refer to the description on the Hugging Face. The held-out Cryo-EM ground truth will include: 1) Atomic-Level Annotations: Epitope and paratope residue identities are derived from atomic models refined against Cryo-EM density maps and used to define residue-level interface annotations. 2) Contact Mapping: Interface contact maps derived from the refined atomic models, defining the physical constraints of the antigen-antibody interaction. 3) Structural Diversity: Multiple HER2-VHH complexes enabling analysis of distinct binding modes and epitope usage. SEPIQ has permission to use all of the above datasets collected and provided by SEPIQ coorganizers: COGNANO Inc., The University of Osaka, and the BINDS program. All animal experiments on the alpacas were conducted in accordance with the KYODOKEN Institute for Animal Science Research and Development (Kyoto, Japan) and the ARRIVE (Animal Research: Reporting of In Vivo Experiments) guidelines.

## Baseline and code

Recently it has been shown that by training a transformer-based AntiBinder model on sequence data only with global binding labels and analyzing learned attention weights enables identification of epitope and paratope residues [Zhang et al., 2025]. As a baseline feasibility demonstration, we examined the AntiBinder model. Since the test set HER2 structures are held private until the end of the competition, to avoid data leakage, we train and evaluate the baseline models on similar publicly available data. As the ground truth antigen-antibody structure, we use the neutralizing VHH P17 in complex with SARS-CoV-2 spike receptor-binding domain (PDB ID: 8GZ5). For training, we use the public database of antigen-antibody interactions SAbDab-nano [Schneider et al., 2022], and the AVIDa-SARS-CoV-2 dataset [Tsuruta et al., 2023] released by COGNANO Inc. Both training datasets contain antibody and antigen sequence data, and binder/non-binder labels. The model trained on SAbDab-nano alone failed to predict binding for the 8GZ5 complex, resulting in epitope prediction performance comparable to the random baseline. In contrast, the model pretrained on AVIDa-SARS-CoV-2 and subsequently fine-tuned on SAbDab-nano correctly classified the complex as binding and achieved improved performance (Figure 2a). The best performance, corresponding to a PR-AUC of 0.176, is modest but above the expected performance of a random predictor. For 8GZ5, the fraction of epitope residues is 26/206 = 0.126, which provides an approximate expected PR-AUC for a random predictor. Considering the simplicity of the baseline method, these results suggest that pretraining on sequence-level binding data can provide useful signals for epitope prediction.

Figure 1: Performance of baseline models. a) The PR AUC scores achieved by random predictor and AntiBinder models trained using SAbDab-nano and AVIDa-SARS-CoV-2 sequence datasets.

To promote reproducibility and offer participants a clear starting point, we have released a lightweight, sequence-based baseline model. The Starter Kit is available as Jupyter Notebooks containing: 1) instructions on accessing the dataset on Hugging Face; 2) an example of simple pre-training/inference using the baseline model; 3) illustrative scripts for evaluating per-residue epitope predictions; and 4) instructions for training and fine-tuning common open-source models suitable for Track A. Training the AntiBinder model required ∼30 minutes on a single consumer-grade GPU (NVIDIA GeForce RTX 3090 Ti), demonstrating that the baseline is both fast and accessible.

## Contact

If participants have any questions or concerns, the SEPIQ support team is available via support email (info@cognano.co.jp). Due to the global distribution of the SEPIQ team, our organizers are available 24/7 for participant support.

Organizational aspects

## Protocol

We suggest the following steps for participation in Track A of the SEPIQ 2026 competition: 1) create a Hugging Face account and access the SEPIQ 2026 competition page; 2) carefully review the instructions on dataset access, submission format, evaluation, and allowed resources; 3) develop a model using the released training data and permitted public resources; and 4) upload Track A submissions to the SEPIQ/Hugging Face platform. The primary Track A submission is a per-antigen-residue epitope/paratope probability vector in CSV format. Track B will follow the standard CAPRI registration, target release, model submission, and assessment procedures. Track B submissions will therefore not be handled as standard SEPIQ/Hugging Face submissions unless otherwise agreed with the CAPRI team.

## Rules and Engagement

- Team limits: Maximum team size of 10.

- Submission Limits: To reduce leaderboard probing, each team will be allowed up to five Track A submissions. Track B submissions will follow the standard CAPRI submission rules.

- Eligibility: 1) (a) To participate in Track A, participants must have a registered Hugging Face account. Track B eligibility and registration will follow the standard CAPRI procedures; (b) 18 years old or have reached the age of majority in their jurisdiction. Exceptions are made only if the Competition Sponsor approves and receives the necessary parental/guardian permissions; (c) not a resident of Crimea, so-called Donetsk People’s Republic (DNR) or Luhansk People’s Republic (LNR), the Russian Federation, the Republic of Belarus, Cuba, Iran, Syria, or North Korea; and (d) an individual or a representative of an entity subject to trade sanctions or export controls imposed by Japan, Ukraine, the European Union, the United Kingdom, or the United States. 2) The Competition is open to residents worldwide, with the exception of those residing in the Russian Federation, the Republic of Belarus, Cuba, Iran, Syria, North Korea, or the occupied territories of Ukraine (including Crimea, the so-called Donetsk People’s Republic (DNR), and the so-called Luhansk People’s Republic (LNR)). Furthermore, individuals or entities subject to export controls or sanctions imposed by Japan, Ukraine, the European Union, the United Kingdom, or the United States are ineligible to enter. It is your responsibility to ensure that participation in a skills-based competition is legal under your local jurisdiction. The Competition Host reserves the right to withhold or provide alternative prizes to comply with local regulations. If a winner resides in a region where legal or logistical restrictions prevent the awarding of a prize, they will be deemed ineligible to receive it. 3) If you enter as a representative of a company, educational institution, or other legal entity, or on behalf of an employer, these rules bind both you individually and the entity you represent. By entering, you warrant that your employer or the entity has full knowledge of your participation and has provided explicit consent, including for the potential receipt of a Prize. You further guarantee that your participation does not violate any internal policies, non-disclosure agreements, or procedures of your employer or entity. 4) The Competition Sponsor reserves the right to verify the eligibility of any participant and to resolve any disputes at its sole discretion. Providing false or misleading information including, but not limited to, identity, residency, contact details, or ownership of rights, will result in immediate disqualification. The Sponsor may request proof of residency or identity at any stage of the Competition to ensure compliance with rules mentioned above.

- Data access and use: The provided VHH sequence data and evaluation data will be "accessible" (e.g., via streaming or loading) directly into the participants’ local environments or the provided computational environments. Ground Truth data will be kept private until the end of the submission evaluations.

- External Data Restrictions: The use of external data is strictly limited to "publicly available datasets" (e.g., PDB, SAbDab). The use of proprietary or private data is prohibited, as it severely compromises scientific reproducibility. Participants using external data are obligated to clearly state its source and license.

- Modeling Constraints and Reproducibility Obligations: There are no restrictions on the computational approaches (e.g., specific Deep Learning methods) used. For Track A, participants will be asked to provide sufficient documentation to support reproducibility of their submitted predictions, including model inputs, inference settings, and any public external data used. Track B will follow the standard CAPRI participation, submission, and assessment rules. Code submission will not be required for Track B.

- Open Source Obligation: We will encourage top-performing Track A teams to share their inference workflows and code, where possible, to promote transparency and reproducibility. Any code release will respect participants’ intellectual property and applicable institutional or company policies.

- Compulsory Licensing: Participants grant the SEPIQ organizers permission to use submitted Track A predictions for evaluation, leaderboard reporting, meta-evaluation, and academic publication of aggregate competition results. Track B data use and reporting will follow the standard CAPRI policies.

- Communication Rules: Organizers are available for 24/7 support via support email. In case of rules or deadline changes, organizers will communicate them on the SEPIQ Competition Page, website, and LinkedIn page.

## Competition promotion and incentives

The SEPIQ challenge targets researchers at different levels and industries: university students and faculty, industry researchers in various fields. We engage people who are interested in (but not limited to) computational biology, bioinformatics, drug discovery, AI and ML. Publication Plan and Co-authorship Invitations: Following the competition, the SEPIQ management team will lead a "meta-evaluation" (cross-analyzing multiple submissions and results to extract new insights in AI drug discovery and AI immunology). Top-ranking teams from each track will be invited as Consortium Authors on the summary paper detailing this meta-evaluation. We will prepare a summary manuscript for submission to an appropriate venue in machine learning or computational biology. Prize Distribution Structure: The confirmed prize amounts for Track A are: 1st Place $3,000, 2nd Place $2,000, and 3rd Place $1,000. These awards are intended to recognize top-performing participants while emphasizing the scientific value and academic visibility of the challenge. Any recognition or prize structure for the associated Track B will be determined separately in coordination with CAPRI. Diversity and Inclusion: To promote diversity, we will reserve travel awards specifically for participants from underrepresented groups and promote our challenge among organizations like Black in AI, LatinX in AI, Women in Machine Learning (WiML), and Queer in AI.

## Resources

### Organizing team

SEPIQ is organized by a very diverse international team of researchers, data scientists, academics, and industry partners. Responsible for the SEPIQ platform, challenge organization, proposal development, baseline model, starter kit creation, and competition promotion: Ihor Neporozhnii, Oleksandra Ostapenko, Hiromitsu Harimoto, Anastasiia Ryzhkova, Dr. Cheng-Hao Liu, Dr. Kentaro Tomii, Teruki Honma. COGNANO Inc. operation and training data production: Dr. Hiroyuki Yamazaki, Ryota Maeda, Dr. Akihiro Imura. Structural ground truth Cryo-EM complexes production: Dr. Keiichi Namba, Kasai Kazuki, Dr. Tsuyoshi Inoue. Dr. Takashi Nagata and Dr. Kliment Olechnoviˇc advise on evaluation methodology, including interface annotation, residue-level epitope metrics, structural-bioinformatics consistency, and interpretation of Track A and Track B evaluation results. Website operation: Tomohisa Oda.

### Resources provided by organizers

SEPIQ organizers provide the following resources: 1) Starter Kit, which includes Jupyter Notebook with the baseline model and tutorial on dataset access; 2) Support Team, which is available for inquiries via info@cognano.co.jp; 3) monetary awards and, subject to sponsorship, limited travel support based on competition outcome.

## References

- The OpenFold3 Team. Openfold3-preview, 2025. URL https://github.com/aqlaboratory/openfold-3.

- Rui Yin and Brian G. Pierce. Evaluation of alphafold antibody–antigen modeling with implications for improving predictive accuracy. Protein Science, 33(1):e4865, 2024. doi: https://doi.org/10.1002/pro.4865. URL https://onlinelibrary.wiley.com/doi/abs/10.1002/pro.4865.

- Francis Gaudreault, Traian Sulea, and Christopher R Corbeil. Ai-augmented physics-based docking for antibody–antigen complex prediction. Bioinformatics, 41(4):btaf129, 04 2025. ISSN 1367-4811. doi: 10.1093/bioinformatics/btaf129. URL https://doi.org/10.1093/bioinformatics/btaf129.

- Fatima N. Hitawala and Jeffrey J. Gray. What does alphafold3 learn about antibody and nanobody docking, and what remains unsolved? mAbs, 17(1):2545601, 2025. doi: 10.1080/19420862.2025.2545601. URL https://doi.org/10.1080/19420862.2025.2545601. PMID: 40814020.

- Josh Abramson, Jonas Adler, Jack Dunger, Richard Evans, Tim Green, Alexander Pritzel, Olaf Ronneberger, Lindsay Willmore, {Andrew J.} Ballard, Joshua Bambrick, {Sebastian W.} Bodenstein, {David A.} Evans, {Chia Chun} Hung, Michael O’Neill, David Reiman, Kathryn Tunyasuvunakool, Zachary Wu, Akvil˙e Žemgulyt˙e, Eirini Arvaniti, Charles Beattie, Ottavia Bertolli, Alex Bridgland, Alexey Cherepanov, Miles Congreve, {Alexander I.} Cowen-Rivers, Andrew Cowie, Michael Figurnov, {Fabian B.} Fuchs, Hannah Gladman, Rishub Jain, {Yousuf A.} Khan, {Caroline M.R.} Low, Kuba Perlin, Anna Potapenko, Pascal Savy, Sukhdeep Singh, Adrian Stecula, Ashok Thillaisundaram, Catherine Tong, Sergei Yakneen, {Ellen D.} Zhong, Michal Zielinski, Augustin Žídek, Victor Bapst, Pushmeet Kohli, Max Jaderberg, Demis Hassabis, and {John M.} Jumper. Accurate structure prediction of biomolecular interactions with alphafold 3. Nature, 630(8016):493–500, June 2024. ISSN 0028-0836. doi: 10.1038/s41586-024-07487-w. Publisher Copyright: © The Author(s) 2024.

- Chai Discovery, Jacques Boitreaud, Jack Dent, Matthew McPartlon, Joshua Meier, Vinicius Reis, Alex Rogozhnikov, and Kevin Wu. Chai-1: Decoding the molecular interactions of life. bioRxiv, 2024. doi: 10.1101/2024.10.10.615955. URL https://www.biorxiv.org/content/early/2024/10/15/2024.10.10.615955.

- John Jumper, Richard Evans, Alexander Pritzel, Tim Green, Michael Figurnov, Olaf Ronneberger, Kathryn Tunyasuvunakool, Russ Bates, Augustin Žídek, Anna Potapenko, Alex Bridgland, Clemens Meyer, Simon A. A. Kohl, Andrew J. Ballard, Andrew Cowie, Bernardino Romera-Paredes, Stanislav Nikolov, Rishub Jain, Jonas Adler, Trevor Back, Stig Petersen, David Reiman, Ellen Clancy, Michal Zielinski, Martin Steinegger, Michalina Pacholska, Tamas Berghammer, David Silver, Oriol Vinyals, Andrew W. Senior, Koray Kavukcuoglu, Pushmeet Kohli, and Demis Hassabis. Applying and improving alphafold at casp14. Proteins: Structure, Function, and Bioinformatics, 89(12):1711–1721, 2021. doi: https://doi.org/10.1002/prot.26257. URL https://onlinelibrary.wiley.com/doi/abs/10.1002/prot.26257.

- Xiaoqiang Huang, Jun Zhou, Shuang Chen, Xiaofeng Xia, Y. Eugene Chen, and Jie Xu. Saaint-db: a comprehensive structural antibody database for antibody modeling and design. Acta Pharmacologica Sinica, 46(12):3365–3375, June 2025. doi: 10.1038/s41401-025-01608-5. URL https://www.nature.com/articles/s41401-025-01608-5#citeas.

- Constantin Schneider, Matthew I J Raybould, and Charlotte M Deane. Sabdab in the age of biotherapeutics: updates including sabdab-nano, the nanobody structure tracker. Nucleic Acids Research, 50(D1):D1368–D1372, 01 2022. ISSN 0305-1048. doi: 10.1093/nar/gkab1050. URL https://doi.org/10.1093/nar/gkab1050.

- James Dunbar, Konrad Krawczyk, Jinwoo Leem, Terry Baker, Angelika Fuchs, Guy Georges, Jiye Shi, and Charlotte M. Deane. Sabdab: the structural antibody database. Nucleic Acids Research, 42(D1):D1140–D1146, 01 2014. ISSN 0305-1048. doi: 10.1093/nar/gkt1043. URL https://doi.org/10.1093/nar/gkt1043.

- Kilment Olechnovič, Sergei Grudinin. Voronota-LT: Efficient, Flexible, and Solvent-Aware Tessellation-Based Analysis of Atomic Interactions. J Comput Chem. 2025 Jul 15;46(19):e70178. doi: 10.1002/jcc.70178.

- Sankar Basu and Björn Wallner. Dockq: A quality measure for protein-protein docking models. PLoS ONE, 11(8):e0161879, August 2016. doi: 10.1371/journal.pone.0161879. URL https://doi.org/10.1371/journal.pone.0161879.

- KeeleyW. Collins, Matthew M. Copeland, Guillaume Brysbaert, Shoshana J.Wodak, Alexandre M.J.J. Bonvin, Petras J. Kundrotas, Ilya A. Vakser, and Marc F. Lensink. Capri-q: The capri resource evaluating the quality of predicted structures of protein complexes. Journal of Molecular Biology, 436(17):168540, 2024. ISSN 0022-2836. doi: https://doi.org/10.1016/j.jmb.2024.168540. URL https://www.sciencedirect.com/science/article/pii/S0022283624001359. Computation Resources for Molecular Biology.

- Hirofumi Tsuruta, Hiroyuki Yamazaki, Ryota Maeda, Ryotaro Tamura, Jennifer N. Wei, Zelda E Mariet, Poomarin Phloyphisut, Hidetoshi Shimokawa, Joseph R. Ledsam, Lucy J Colwell, and Akihiro Imura. AVIDa-hIL6: A large-scale VHH dataset produced from an immunized alpaca for predicting antigen-antibody interactions. In Thirty-seventh Conference on Neural Information Processing Systems Datasets and Benchmarks Track, 2023. URL https://openreview.net/forum?id=BgY17iEnTb.

- Justyna Bazan, Ireneusz Całkosi´nski, and Andrzej Gamian. Phage display—a powerful ntechnique for immunotherapy. Human Vaccines Immunotherapeutics, 8(12):1817–1828, November 2012. doi:10.4161/hv.21703. URL https://doi.org/10.4161/hv.21703.

- George P. Smith. Filamentous fusion phage: novel expression vectors that display cloned antigens on the virion surface. Science, 228(4705):1315–1317, June 1985. doi: 10.1126/science.4001944. URL https://doi.org/10.1126/science.4001944.

- Kaiwen Zhang, Yuhao Tao, and Fei Wang. Antibinder: utilizing bidirectional attention and hybrid encoding for precise antibody-antigen interaction prediction. Briefings in Bioinformatics, 26(1): bbaf008, 01 2025. ISSN 1477-4054. doi: 10.1093/bib/bbaf008. URL https://doi.org/10.1093/bib/bbaf008.

## A Biography of all team members

- SEPIQ team responsible for SEPIQ platform, challenge organization, baseline model, and starting kits creation, and competition promotion:
- Ihor Neporozhnii is a PhD candidate and Research Assistant at the University of Toronto. His research is focused on accelerating the discovery of novel materials and medicines using machine learning and quantum chemistry.

- Oleksandra Ostapenko is a Data Scientist at COGNANO Inc., holding an MSc. in Physics from the University of British Columbia. Her work interests lie at the intersection of science, data, and real-world applications.

- Hiromitsu Harimoto is a PhD student at the Cambridge Stem Cell Institute, specializing in stem cell biology. His research focuses on understanding hematopoietic stem cells and their differentiation patterns, with an emphasis on how bone marrow niches influence cell fate.

- Anastasiia Ryzhkova is a clinical medical physicist with interests in dosimetry, biophysics, computational modeling, and radiation therapy. She obtained her MSc. in Physics from the Taras Shevchenko National University of Kyiv.

- Dr. Kentaro Tomii is a Professor at Artificial Intelligence Research Center, National Institute of Advanced Industrial Science and Technology.

- Teruki Honma is a Team Director, RIKEN Center for Integrative Medical Science.

- Dr. Cheng-Hao Liu is a postdoctoral fellow at Caltech, supervised by Prof. Frances Arnold specialising in chemistry and computer science.

- COGNANO Inc. supports training data production:
- Dr. Hiroyuki Yamazaki is the Chief of Hematology at Shizuoka City Shizuoka Hospital and a Data Scientist at COGNANO Inc. He aims to develop the fusion area between the life science field and the machine learning/IT fields.

- Ryota Maeda is a Development Manager at COGNANO Inc., holding an MSc. in Life Science from Kyoto University. He makes large-scale labeled VHH datasets.

- Dr. Akihiro Imura is a COGNANO Inc. President, CEO, and Co-founder. His research areas include cancer, homeostasis, antibodies, genetic engineering, and cell biology.

- Tomohisa Oda is a Software Engineer at COGNANO Inc., started his career as a user interface designer and gained experience as a software engineer in a wide range of areas, from front-end to back-end design and development.

- The University of Osaka Team provides ground truth structural Cryo-EM complexes:
- Dr. Keiichi Namba is a Specially Appointed Professor at the Graduate School of Frontier Biosciences and JEOL YOKOGUSHI Research Alliance Laboratories, The University of Osaka. He specializes in structural biology and electron microscopy of biological macromolecular assemblies and bacterial flagellar motors. He supervised cryo-EM structural analysis of target complexes and provided resources.

- Kazuki Kasai is a Specially Appointed Researcher at the Graduate School of Frontier Biosciences and JEOL YOKOGUSHI Research Alliance Laboratories, The University of Osaka. He specializes in structural biology using cryo-EM. He acquired cryo-EM data and performed image analysis to solve the structures of the target complexes.

- Dr. Tsuyoshi Inoue is a Professor at the Graduate School of Pharmaceutical Sciences. His research interest is drug discovery with the theme of developing new modalities based on the structural biology method.

- SEPIQ evaluation methodology team:
- Dr. Takashi Nagata is an Associate Professor, Institute of Advanced Energy, Kyoto University. His research focuses on elucidating the functions and dysfunctions of proteins, DNA, RNA, and bioactive compounds associated with cancer, neurological disorders, and infectious diseases.

- Dr. Kliment Olechnoviˇc is a Senior Researcher at Vilnius University Life Sciences Center, specializing in developing novel, effective methods of structural bioinformatics.

## Acknowledgment

We thank Alexandre M.J.J. Bonvin and Marc Lensink for insightful discussions and the collaboration on the Track B CAPRI initiative. We also thank Stephen K. Burley, Mallory R. Tollefson, and Dima Kozakov for valuable discussions and the continuous support of the SEPIQ Competition. In addition, we thank Kaori Yurugi, Yasuko Imura, and Takatsugu Hirokawa for their assistance with organizing the SEPIQ Competition.

Join the ChallengeRead the Guideline

© 2026 SEPIQ

<<<END VERBATIM DETAIL>>>



---

# PAGE 2 of 3: https://sepiq.uk/guideline
Fetched 2026-10-17 (UTC), sha256 493a4b9c941097a3d8fea2439976fc4e21243344b988da65b88ed800918d44e8

<<<BEGIN VERBATIM GUIDELINE>>>

- SEPIQ VHH-Epitope-Prediction Challenge 2026

HomeAboutDetailGuidelineBrandHomeAboutDetailGuidelineBrand
# Guideline

## Abstract

Antigen-antibody interaction prediction remains a fundamental challenge in computational biology and AI-driven drug discovery. While recent machine learning approaches have enabled accurate single-chain protein structure prediction, modeling antigen-antibody interactions remains challenging because of extreme sequence diversity, evolutionary asymmetry, conformational flexibility, and, critically, the lack of large experimental datasets with functional labels and high-resolution structural supervision tailored to antigen-antibody interactions. As a result, existing models often fail to generalize beyond narrow benchmarks and curated structural complexes. We announce SEPIQ (Sequence-based Epitope Prediction Intelligent Query), a community challenge built around a large experimental dataset of immune-derived VHH nanobody sequences. SEPIQ comprises two complementary tracks: Track A, managed by SEPIQ, where participants submit per-antigen-residue epitope/paratope probabilities, and Track B, managed by CAPRI (Critical Assessment of PRediction of Interactions), where participants submit predicted antigen-VHH complex structures according to CAPRI procedures. A key strength of SEPIQ is the availability of high-resolution Cryo-EM ground truth for blind evaluation with a large-scale antigen-VHH interaction dataset. To ensure rigor, Cryo-EM structures and derived test labels will be held out during the challenge and released only after completion of the submission evaluation. The SEPIQ challenge aims to catalyze “Sequence-to-Structure Immunology” by testing a “folding from binding” hypothesis: large-scale binding-derived sequence data may contain statistical signatures of structural and functional constraints when combined with limited high-resolution structural ground truth.

## Introduction

Accurate epitope identification and prediction of antigen-antibody interactions are critical for drug discovery, as they enable therapeutic design, define mechanisms of action, and allow assessment of efficacy and potential off-target effects. Despite their importance, reliable prediction of antigen-antibody interactions remains a central and unresolved challenge in computational biology. Recent advancements in machine learning led to the development of methods that excel at single-chain protein structure prediction, yet they remain limited for antigen-antibody modeling due to repertoire-scale sequence diversity, evolutionary asymmetry at interfaces, limited cross-chain coevolutionary signal in MSAs, epitope conformational variability, and binder/non-binder discrimination across large experimental panels. As a result, state-of-the-art models (e.g., AlphaFold3, OpenFold3, Boltz-1, and Chai-1) achieve acceptable accuracy on only a minority of cases in antigen-antibody docking benchmarks (40%), in contrast to their much higher success rates on single-chain protein structure prediction (≈90%) [The OpenFold3 Team, 2025, Yin and Pierce, 2024, Gaudreault et al., 2025, Hitawala and Gray, 2025, Abramson et al., 2024, Discovery et al., 2024, Jumper et al., 2021]. One of the key limiting factors in improving model performance for antigen-antibody complexes is the scarcity of experimental data that provides sequence diversity, functional binding outcomes, and high-resolution structural ground truth. The two largest publicly available datasets of antigen-antibody complex structures, SAbDab and SAAINT-DB, are curated from entries in the Protein Data Bank (PDB) [Huang et al., 2025, Schneider et al., 2022, Dunbar et al., 2014]. According to SAbDab, as of July 2026, the PDB contained 9,775 antibody structures with antigens, which underscores the limited scale of structural supervision available for predicting antigen-antibody complexes. Antigen-VHH complexes are even rarer (SAbDab-nano reports 2,013 structures with antigen). To accelerate the progress in prediction of antigen-antibody interactions, we announce the open SEPIQ machine learning challenge and provide novel large-scale experimental sequence data to enable robust modeling of antigen-antibody complexes, together with high-quality structural ground truth for evaluation, with test labels held out for blind assessment.

The competition will feature two primary tracks at different resolutions: Track A (residue-level resolution; SEPIQ) asks participants to develop sequence-based models that predict epitope/paratope residues (as per-residue probabilities or binary labels) from VHH and antigen sequence inputs, enabling interface characterization even without explicit 3D complex modeling. Track B (atomic-level resolution; CAPRI) asks participants to predict antigen-antibody complex structures from VHH and antigen sequences. We believe that the SEPIQ challenge will encourage the development of novel sequence-based architectures and has the potential to establish a new research subfield at the intersection of machine learning, immunology, and structural biology, accelerating the discovery of new medicines. Based on the social media outreach and positive feedback from in-person presentations, we expect more than 100 participants from diverse backgrounds to take part in the SEPIQ challenge per a year. Conceptually, SEPIQ tests a “folding from binding” hypothesis: large-scale sequence-level binding data may provide weak but scalable information about structural and functional constraints at antigen-antibody interfaces. We present this as a testable hypothesis rather than a definitive claim, because high-resolution structural labels remain limited and are used only for blind evaluation.

### Tasks and application scenarios

This challenge involves antigen-antibody complexes containing novel epitopes and paratopes. Accurate prediction of epitope-paratope interactions can accelerate therapeutic nanobody discovery by reducing the need for costly wet-lab screening and structural characterization. Sequence-only methods are particularly valuable in settings where experimentally determined structures are unavailable.

Track A (residue-level resolution) asks participants to predict which residues on the antigen (epitope) and the antibody (paratope) form the binding interface of each antigen-VHH complex, using sequence input only. Compared to three-dimensional structural data, sequence-based data on antigen-antibody interactions can be acquired more extensively and at a lower cost. Such data will continue to accumulate at an accelerating rate. The primary objective of Track A is to explore the potential applications of these substantial sequence-based data on antigen-antibody interactions. However, there are no restrictions on the algorithms used to predict epitopes/paratopes for Track A. It is perfectly acceptable to predict epitopes/paratopes based on three-dimensional structure prediction (equivalent to Track B). The primary submission format is a per-residue epitope/paratope probability vector. Please refer to the section below for a more detailed explanation. AI models developed for Track A would be able to identify antigen-antibody interfaces directly from sequence data, enabling antibody design without experimental structural information. We demonstrate the possibility of solving the challenge with our lightweight baseline model, which is trained on a publicly available dataset, in the 'Baseline and code' section.

Track B (atomic-level resolution) asks participants to predict antigen-VHH complex structures from antigen and VHH sequences. This track will follow the established CAPRI framework for target release, model submission, and assessment. In this track, participants should submit predicted complex atomic structures. Please wait for a future announcement from CAPRI for a more detailed explanation. Although several existing models, including Boltz-1, Chai-1, and AlphaFold3, can predict antigen-antibody complex structures, their accuracy on this task remains limited. Improving these models would advance computational modeling of antigen-antibody interactions and accelerate drug development.

Although the tasks are highly challenging due to sparse experimental supervision and the complexity of immune recognition, recent advances in protein foundation models, geometric deep learning, and antibody structure prediction demonstrate that meaningful progress is achievable. The aim of this challenge is to make antibody drug discovery more efficient in the real world. As long as the answer is correct, we do not consider data leakage resulting from the use of publicly available data to be an issue.

### Submission format for prediction output

For each complex sequence, provide a table with chain names (chain A for the antigen, chain B for the VHH), residue sequence numbers, and amino acid residue names.

Participants must return tables formed by adding a column to each input table in csv format. The added column must contain values from 0 to 1 indicating the probability that the residue is part of the binding interface.

Example of output for the antigen: | chain | seqNum | resName | prediction | A | 1 | ALA | 0 | A | 2 | ILE | 0 | A | 3 | ASN | 0 | A | 4 | ALA | 0.95 | A | 5 | ALA | 0.91 | A | 6 | ARG | 0 | A | 7 | GLU | 0 | A | 8 | ASN | 0 | A | 9 | LEU | 0.59 | A | 10 | GLY | 0.15 | A | 11 | ALA | 0.17 | A | 12 | SER | 0 | B | 1 | MET | 0 | B | 2 | ALA | 0 | B | 3 | GLN | 0.87 | B | 4 | VAL | 0.21 | B | 5 | GLN | 0.74 | B | 6 | LEU | 0 | B | 7 | GLN | 0 | B | 8 | GLU | 0.47 | B | 9 | SER | 0.14 | B | 10 | GLY | 0 | B | 11 | GLY | 0 | B | 12 | GLY | 0

Participants may skip residues in their output — it will be assumed that the prediction is 0 for any omitted residue.

Example of shorter output for the antigen: | chain | seqNum | resName | prediction | A | 4 | ALA | 0.95 | A | 5 | ALA | 0.91 | A | 9 | LEU | 0.59 | A | 10 | GLY | 0.15 | A | 11 | ALA | 0.17 | B | 3 | GLN | 0.87 | B | 4 | VAL | 0.21 | B | 5 | GLN | 0.74 | B | 8 | GLU | 0.47 | B | 9 | SER | 0.14

The template CSV files for predictions have been uploaded to the Hugging Face repository.

https://huggingface.co/datasets/sepiq-2026/SEPIQ-2026-training-data/tree/main

## Ground truth generation

Given an experimentally determined antigen-VHH complex structure, the interface will be described using the Voronota-LT method, which constructs Voronoi tessellation-based inter-atom contact surfaces and calculates their areas.

We will adopt the Voronota-LT software [Kliment et al., 2025] to calculate only the relevant contacts — that is, the contacts between the antigen and the VHH chains. Moreover, we can instruct Voronota-LT to summarize (aggregate) contact areas for each residue that has at least one relevant contact.

Let us illustrate the interface determination process using a known antigen-VHH structure from the Protein Data Bank (PDB).

Firstly, let us obtain the software:

# download the universal Voronota-LT version 1.1.479 executable
wget "https://github.com/kliment-olechnovic/voronota/releases/download/v1.29.4602/cosmopolitan_voronota-lt_v1.1.479.exe"
# rename the downloaded executable
mv cosmopolitan_voronota-lt_v1.1.479.exe voronota-lt
# set execute permission
chmod +x ./voronota-lt

Secondly, let us prepare an input structure — download and unzip the first assembly structure from the PDB entry 5F7L (https://www.rcsb.org/structure/5F7L):

wget "https://files.rcsb.org/download/5F7L-assembly1.cif.gz"
gunzip ./5F7L-assembly1.cif.gz

We note that in the downloaded structure there are two chains: chain A is the antigen, and chain B is the VHH.

Finally, let us run Voronota-LT to produce a table of residue-level binding site areas:

./voronota-lt --input "./5F7L-assembly1.cif" \
  --restrict-contacts '[-a1 [-chain A] -a2 [-chain B]]' \
  --write-sites-residue-level-to-file ./sites-residue-level.tsv

After that, the generated file sites-residue-level.tsv contains the binding site areas for all residues that participate in the interface: | rs_header | ID_chain | ID_rnum | ID_rname | area | arc_length | distance | count | rs | A | 102 | TYR | 26.2887 | 5.35143 | 3.25509 | 10 | rs | A | 103 | ALA | 5.81737 | 2.34553 | 3.9238 | 3 | rs | A | 104 | THR | 10.2041 | 1.92648 | 3.50697 | 3 | rs | A | 105 | GLN | 52.2302 | 6.67633 | 3.06804 | 31 | rs | A | 106 | CYS | 12.9647 | 0 | 2.69348 | 6 | rs | A | 116 | THR | 19.9032 | 6.73551 | 4.12098 | 13 | rs | A | 117 | SER | 12.8987 | 15.7238 | 4.87017 | 9 | rs | A | 119 | THR | 22.7757 | 11.912 | 3.51999 | 10 | rs | A | 121 | ILE | 15.189 | 7.36034 | 4.00473 | 3 | rs | A | 128 | TYR | 66.5253 | 20.6576 | 3.23458 | 34 | rs | A | 134 | THR | 50.6727 | 14.9325 | 2.83448 | 24 | rs | A | 135 | CYS | 2.61009 | 0 | 3.58477 | 3 | rs | A | 136 | SER | 39.7118 | 3.33127 | 2.52272 | 25 | rs | A | 137 | LEU | 53.1561 | 0 | 3.44333 | 35 | rs | A | 138 | ASN | 42.8299 | 5.52968 | 2.7755 | 25 | rs | A | 139 | ARG | 81.9165 | 19.6108 | 3.05166 | 43 | rs | A | 140 | TYR | 86.4117 | 17.5458 | 2.50269 | 39 | rs | A | 145 | TYR | 9.02516 | 5.71504 | 4.12956 | 5 | rs | A | 146 | GLY | 8.25783 | 2.21431 | 4.67829 | 4 | rs | A | 147 | PRO | 8.5554 | 0.783521 | 4.72983 | 5 | rs | A | 190 | SER | 9.85719 | 4.90913 | 4.31282 | 4 | rs | A | 191 | GLY | 15.6605 | 1.62435 | 4.07761 | 5 | rs | A | 192 | GLU | 2.93553 | 4.35852 | 5.05939 | 2 | rs | A | 241 | THR | 15.8578 | 6.29968 | 4.28125 | 7 | rs | A | 242 | ARG | 38.0833 | 24.4135 | 4.69196 | 14 | rs | A | 243 | VAL | 32.7166 | 18.5909 | 3.30051 | 9 | rs | A | 279 | TYR | 46.6128 | 3.07466 | 2.54624 | 28 | rs | A | 281 | SER | 43.2088 | 8.06525 | 2.49241 | 15 | rs | A | 282 | VAL | 11.9861 | 3.03489 | 3.59902 | 9 | rs | A | 283 | THR | 30.5658 | 7.36819 | 3.50735 | 16 | rs | A | 295 | ARG | 54.2229 | 21.4632 | 3.40346 | 24 | rs | B | 1 | GLN | 97.4462 | 18.6789 | 2.66855 | 57 | rs | B | 2 | VAL | 13.6402 | 2.62611 | 2.52272 | 8 | rs | B | 3 | GLN | 56.1574 | 21.8633 | 3.51999 | 19 | rs | B | 5 | GLN | 50.7106 | 26.0035 | 4.28125 | 22 | rs | B | 6 | GLU | 0.853008 | 1.11928 | 5.77592 | 1 | rs | B | 7 | SER | 8.57829 | 8.99021 | 5.43684 | 1 | rs | B | 26 | GLY | 24.476 | 11.6387 | 3.23458 | 7 | rs | B | 27 | SER | 23.1216 | 3.52698 | 3.94957 | 11 | rs | B | 28 | ILE | 2.73042 | 1.68464 | 4.77136 | 2 | rs | B | 29 | TYR | 99.7546 | 17.6416 | 2.49241 | 54 | rs | B | 30 | SER | 13.7472 | 6.48282 | 3.24403 | 5 | rs | B | 45 | HIS | 17.0975 | 8.7078 | 4.61964 | 9 | rs | B | 99 | SER | 14.3742 | 0 | 3.19291 | 4 | rs | B | 100 | ASP | 49.1928 | 8.82601 | 2.54624 | 23 | rs | B | 101 | ARG | 109.806 | 20.2009 | 2.97931 | 65 | rs | B | 102 | LEU | 13.9772 | 0.810522 | 3.74136 | 7 | rs | B | 103 | THR | 20.9277 | 7.30925 | 3.96832 | 9 | rs | B | 104 | ASP | 6.27695 | 6.1968 | 4.84443 | 2 | rs | B | 108 | CYS | 16.5484 | 6.77437 | 3.23494 | 5 | rs | B | 109 | GLU | 50.0274 | 12.2063 | 2.50269 | 19 | rs | B | 110 | ALA | 7.51728 | 0 | 3.85594 | 5 | rs | B | 111 | ASP | 47.5298 | 0 | 2.7755 | 28 | rs | B | 112 | TYR | 43.1371 | 1.95946 | 3.34279 | 27 | rs | B | 113 | TRP | 71.6285 | 19.3995 | 3.60848 | 46 | rs | B | 114 | GLY | 3.13616 | 5.68057 | 5.47438 | 3 | rs | B | 115 | GLN | 67.2589 | 33.2266 | 3.30051 | 24

From that table, we extract only the required columns (ID_chain, ID_rnum, ID_rname, area), rename them to (chain, seqNum, resName, weight) respectively, insert an additional fact column with all values set to 1 (because all reported residues are interface residues), and generate a table corresponding to the ground truth format:

{
echo "chain seqNum resName fact weight" | sed 's/\s\+/\t/g'
cat "./sites-residue-level.tsv" | tail -n +2 | awk '{print $2 "\t" $3 "\t" $4 "\t1\t" $5}'
} \
> "./positive_ground_truth.tsv"

This will produce a table of positive ground truth: | chain | seqNum | resName | fact | weight | A | 102 | TYR | 1 | 26.2887 | A | 103 | ALA | 1 | 5.81737 | A | 104 | THR | 1 | 10.2041 | A | 105 | GLN | 1 | 52.2302 | A | 106 | CYS | 1 | 12.9647 | A | 116 | THR | 1 | 19.9032 | A | 117 | SER | 1 | 12.8987 | A | 119 | THR | 1 | 22.7757 | A | 121 | ILE | 1 | 15.189 | A | 128 | TYR | 1 | 66.5253 | A | 134 | THR | 1 | 50.6727 | A | 135 | CYS | 1 | 2.61009 | A | 136 | SER | 1 | 39.7118 | A | 137 | LEU | 1 | 53.1561 | A | 138 | ASN | 1 | 42.8299 | A | 139 | ARG | 1 | 81.9165 | A | 140 | TYR | 1 | 86.4117 | A | 145 | TYR | 1 | 9.02516 | A | 146 | GLY | 1 | 8.25783 | A | 147 | PRO | 1 | 8.5554 | A | 190 | SER | 1 | 9.85719 | A | 191 | GLY | 1 | 15.6605 | A | 192 | GLU | 1 | 2.93553 | A | 241 | THR | 1 | 15.8578 | A | 242 | ARG | 1 | 38.0833 | A | 243 | VAL | 1 | 32.7166 | A | 279 | TYR | 1 | 46.6128 | A | 281 | SER | 1 | 43.2088 | A | 282 | VAL | 1 | 11.9861 | A | 283 | THR | 1 | 30.5658 | A | 295 | ARG | 1 | 54.2229 | B | 1 | GLN | 1 | 97.4462 | B | 2 | VAL | 1 | 13.6402 | B | 3 | GLN | 1 | 56.1574 | B | 5 | GLN | 1 | 50.7106 | B | 6 | GLU | 1 | 0.853008 | B | 7 | SER | 1 | 8.57829 | B | 26 | GLY | 1 | 24.476 | B | 27 | SER | 1 | 23.1216 | B | 28 | ILE | 1 | 2.73042 | B | 29 | TYR | 1 | 99.7546 | B | 30 | SER | 1 | 13.7472 | B | 45 | HIS | 1 | 17.0975 | B | 99 | SER | 1 | 14.3742 | B | 100 | ASP | 1 | 49.1928 | B | 101 | ARG | 1 | 109.806 | B | 102 | LEU | 1 | 13.9772 | B | 103 | THR | 1 | 20.9277 | B | 104 | ASP | 1 | 6.27695 | B | 108 | CYS | 1 | 16.5484 | B | 109 | GLU | 1 | 50.0274 | B | 110 | ALA | 1 | 7.51728 | B | 111 | ASP | 1 | 47.5298 | B | 112 | TYR | 1 | 43.1371 | B | 113 | TRP | 1 | 71.6285 | B | 114 | GLY | 1 | 3.13616 | B | 115 | GLN | 1 | 67.258

### An assessment-ready format of combined predictions and ground truth data

To prepare data for assessment is to join a prediction output table with its corresponding weighted ground truth table.

For missing rows in the prediction output table, set the "prediction" value to 0.

Example of a combined predictions and weighted ground truth table: | chain | seqNum | resName | prediction | fact | weight | A | 1 | ALA | 0 | 0 | 0 | A | 2 | ILE | 0 | 0 | 0 | A | 3 | ASN | 0 | 0 | 0 | A | 4 | ALA | 0.95 | 1 | 15.4 | A | 5 | ALA | 0.91 | 1 | 11.2 | A | 6 | ARG | 0 | 1 | 0.7 | A | 7 | GLU | 0 | 0 | 0 | A | 8 | ASN | 0 | 0 | 0 | A | 9 | LEU | 0.59 | 0 | 0 | A | 10 | GLY | 0.15 | 1 | 1.2 | A | 11 | ALA | 0.17 | 0 | 0 | A | 12 | SER | 0 | 0 | 0 | B | 1 | MET | 0 | 0 | 0 | B | 2 | ALA | 0 | 0 | 0 | B | 3 | GLN | 0.87 | 1 | 30.2 | B | 4 | VAL | 0.21 | 1 | 34.5 | B | 5 | GLN | 0.74 | 1 | 18.4 | B | 6 | LEU | 0 | 1 | 8.2 | B | 7 | GLN | 0 | 0 | 0 | B | 8 | GLU | 0.47 | 1 | 0.4 | B | 9 | SER | 0.14 | 0 | 0 | B | 10 | GLY | 0 | 0 | 0 | B | 11 | GLY | 0 | 0 | 0 | B | 12 | GLY | 0 | 0 | 0

## Predictor’s performance evaluation

### General considerations

The SEPIQ Track A challenge is a binary classification challenge. The methodologies for evaluating binary classification results are well known.

As per-residue predictions will be provided as real values from 0 to 1, a threshold can be applied to convert these real-valued predictions into integer predictions (either 0 or 1). The integer predictions can then be compared to the "fact" column values of the ground truth.

All comparisons can be summarized using four values:

- TP = the number of true positive predictions, i.e., the number of cases where fact = 1 and the integer prediction = 1

- FN = the number of false negative predictions, i.e., the number of cases where fact = 1 and the integer prediction = 0

- TN = the number of true negative predictions, i.e., the number of cases where fact = 0 and the integer prediction = 0

- FP = the number of false positive predictions, i.e., the number of cases where fact = 0 and the integer prediction = 1

These values can be used to calculate many different assessment measures, such as accuracy, balanced accuracy, F1 score, precision, recall, specificity, MCC, and the Jaccard index. Values from a confusion matrix can be calculated for every valid threshold and used to plot a curve. The area under the resulting curve summarizes the overall performance of a classifier.

The most popular types of such curves are:

- ROC (receiver operating characteristic) curve — represents the trade-off between the true positive rate (sensitivity) and the false positive rate (1 − specificity) across different thresholds.

- PR (precision–recall) curve — illustrates the trade-off between precision and recall across different thresholds.

### Measures of choice for SEPIQ

In antibody epitope prediction, target proteins typically consist of hundreds to thousands of amino acid residues, while the epitope comprises only about 10–20 residues. This creates a severe class imbalance, therefore we should consider several issues:

- we may not want to fix the decision threshold for converting real-valued predictions to integer (0 or 1) predictions;

- the ground truth data will likely be highly imbalanced — there will be many more non-interface residues than interface residues;

- we want to use weights (per-residue binding site area) in the assessment to put more emphasis on residues that are more involved in the interface.

The weights are non-zero only in cases where fact = 1 (i.e., the residue participates in the interface). Therefore, the weights can be naturally applied to TP and FN values.

This means that we can define a weighted version of the recall measure.

The standard recall formula is:

recall=TPTP+FNrecall=\frac{TP}{TP+FN}

where TP is the number of correctly recovered interface residues and (TP + FN) is the total number of interface residues.

However, we can replace:

- TP with TP_area — the total sum of the weights of the correctly recovered interface residues (i.e., the total recovered interface area), and

- (TP + FN) with P_area — the total sum of the weights of all interface residues (i.e., the total ground truth interface area).

Then the area-weighted recall formula becomes:

recallweighted=TPareaParearecall_{weighted}=\frac{TP_{area}}{P_{area}}

When we use the weighted recall together with the ordinary precision, we can calculate a weighted (area-informed) variation of the precision–recall curve and the corresponding area under the curve. Since PR-AUC (precision–recall area under the curve) is known to perform well with imbalanced data, two versions of PR-AUC (with and without weights) will be the primary evaluation measures for SEPIQ Track A.

### Ranking participants based on PR-AUC

The macro-average of the individual PR-AUCs of each antigen-VHH complex will be calculated. Since antibodies with larger epitope counts dominate, residues will not be pooled across all antibodies for a single PR-AUC calculation (micro-averaging).

Score=13∑k=13PR AUCk for Antibody k ∈ 1,2,3Score = \frac{1}{3}\sum_{k=1}^{3}PR\:AUC_k\:for\: Antibody\:k\:∈\:{1,2,3}

Because the held-out structural test set is limited in size, final rankings will be accompanied by per-complex metrics and uncertainty estimates. If the evaluation metrics for the participants are closely matched, a resampling-based cluster bootstrap test will be performed to assess ranking robustness and reduce the impact of outliers.

Amino acids:	i∈1,2,3,...,L for Sequence Length Li ∈ {1, 2, 3, . . . , L}\: for\: Sequence\: Length\: L

Ground Truth:	yk,i ∈ 0,1 for Antibody k ∈ 1,2,3y_{k,i}\: ∈\: {0,1}\: for\: Antibody\: k\: ∈\: {1,2,3}

Team A Predictions:	pA,k,i∈[0,1]p_{A, k, i} ∈ [0, 1]

Team B Predictions:	pB,k,i∈[0,1]p_{B, k, i} ∈ [0, 1]

Step 1: Compute Observed Scores

- Calculate PR-AUC for each antibody k for both Team A and Team B:

PR AUCA,k=PR AUC(yk,pA,k)PR AUCB,k=PR AUC(yk,pB,k)\begin{gathered}PR\:AUC_{A, k}= PR\:AUC(y_k, p_{A, k})\\
PR\: AUC_{B, k}= PR\: AUC(y_k, p_{B, k})\end{gathered}

- Compute Macro-Averages:

ScoreA=13∑k=13PR AUCA,k,  ScoreB=13∑k=13PR AUCB,kScore_A = \frac13\sum_{k=1}^{3}PR\: AUC_{A, k},\:\:	Score_B = \frac13\sum_{k=1}^{3}PR\: AUC_{B, k}

- Calculate observed delta:

ΔScoreobs=ScoreA−ScoreB\Delta Score_{obs} = Score_A-Score_B

Step 2: Bootstrap Resampling (B iterations, e.g., B = 2,000)

For b = 1, 2, . . . ,B:

- Resample Residue Indices with ReplacementDraw L indices randomly with replacement from {1, 2, . . . , L} to create index array Ib.

Use the exact same index set Ib across all antibodies and both teams to preserve pairing.

- Recompute Metrics on Resampled DataForm bootstrapped subset:	yk,Ib,pA,k,Ib,and pB,k,Iby_{k, I_b}, p_{A, k, I_b}, and\: p_{B, k, I_b}.

Recompute PR-AUC for each antibody k:

PR AUCA,k(b)=PR AUC(yk,Ib,pA,k,Ib)PR AUCB,k(b)=PR AUC(yk,Ib,pB,k,Ib)\begin{gathered}PR\: AUC_{A, k}^{(b)} = PR\: AUC(y_{k, I_b}, p_{A, k, I_b})\\
PR\: AUC_{B, k}^{(b)} = PR\: AUC(y_{k, I_b}, p_{B, k, I_b})\end{gathered}

Recompute Macro-Averages:	ScoreA(b) and ScoreB(b)Score_A^{(b)} \:and\: Score_B^{(b)}.

- Record Bootstrapped Difference:ΔScore(b)=ScoreA(b)−ScoreB(b)\Delta Score^{(b)} = Score_A^{(b)} - Score_B^{(b)}

Step 3: Statistical Significance Evaluation

Using the distribution of differences {ΔScore(1),...,ΔScore(B)\Delta Score^{(1)}, . . . , \Delta Score^{(B)}}:

- 95% Confidence Interval (Percentile Method):Sort Score(b) and locate the 2.5th and 97.5th percentiles.

Decision Rule: If the 95% Confidence Interval does NOT contain 0 (e.g., [0.012, 0.045]), the score difference between Team A and Team B is statistically significant (p

- Empirical p-value:p=2×min(∑b=1BI(ΔScore(b)≤0)B,∑b=1BI(ΔScore(b)≥0)B)p=2×min\Bigg(\frac{\sum_{b=1}^{B}I(\Delta Score^{(b)} ≤ 0)}{B}, \frac{ \sum_{b=1}^{B}I(\Delta Score^{(b)} ≥ 0)}{B}\Bigg)

#### Supplementary Information (For official information, please visit the CAPRI website)

The SEPIQ Track B challenge is a regression task with the goal of predicting structures of antigen-antibody complexes at the atomic level. Track B submissions will be evaluated through the established CAPRI assessment framework, including CAPRI-Q/DockQ-based measures. After optimal superimposition of predicted and ground-truth structures, the scoring procedure computes three key metrics: the root mean square deviation of ligand backbone atoms (L-RMSD), the backbone RMSD of all interface residues (i-RMSDbb), and the fraction of correctly predicted ligand–receptor contacts (fnat). These metrics are combined into a single composite score, DockQ, which ranges from 0 to 1 (see equation 1). Models with DockQ ≥ 0.80 are classified as high accuracy, while those with DockQ ≤ 0.23 are considered incorrect [Basu and Wallner, 2016]. The CAPRI-Q scoring protocol details are published by Collins et al. [2024]. The DockQ score and the CAPRI-Q scoring protocol offer a reliable and effective framework for evaluating predicted antigen-antibody atomic structures.

DockQ=13(fnat+11+(L−RMSDd1)2+11+(i−RMSDbbd2)2)DockQ = \frac{1}{3}\Bigg(f_{nat} + \frac{1}{1 + (\frac{L-RMSD}{d_1})^2} + \frac{1}{1+(\frac{i-RMSDbb}{d_2})^2}\Bigg)

Equation 1: Calculation of the continuous quality score which combines L-RMSD, i-RMSDbb, and fnat metrics. The scaling parameters d1 and d2 determine how fast large RMSD values can be scaled to zero (d1=8.5A˚ and d2=1.5A˚d_1 = 8.5 Å \:and\: d_2 = 1.5 Å).

Join the ChallengeSee the Details

© 2026 SEPIQ

<<<END VERBATIM GUIDELINE>>>



---

# PAGE 3 of 3: https://sepiq.uk/about
Fetched 2026-10-17 (UTC), sha256 c65e37a854e769a03bef1fe777931f7fec9a16a9a53836bdec74c94107ad8d8f

<<<BEGIN VERBATIM ABOUT>>>

- SEPIQ VHH-Epitope-Prediction Challenge 2026

HomeAboutDetailGuidelineBrandHomeAboutDetailGuidelineBrand
# About

## About SEPIQ

SEPIQ (Sequence-based Epitope Prediction Intelligent Query) is a London-based public organization dedicated to leading structure-based biopharmaceutical discovery. | Name | Sepiq | Identification | Chp Companies House 17026559 | Address | 12 New Fetter Lane, London EC4A 1JP, United Kingdom | Purpose | 72.19 Other research and experimental development on natural sciences and engineering

Join the ChallengeSee the Details

© 2026 SEPIQ

<<<END VERBATIM ABOUT>>>



---

# CONTEXT EXHIBIT: https://sepiq.uk/ (home page text)

<<<BEGIN VERBATIM HOME>>>
- SEPIQ VHH-Epitope-Prediction Challenge 2026

HomeAboutDetailGuidelineBrandHomeAboutDetailGuidelineBrandCall for Participation: SEPIQ VHH-Epitope-Prediction Challenge 2026

#  Unlock the Secrets of Antibody-Antigen Interactions with AI
We are excited to announce the SEPIQ VHH-Epitope-Prediction Challenge, scheduled to begin in June 2026. This challenge invites researchers, bioinformaticians, and AI practitioners to tackle a critical problem in structural biology: the blind prediction of antigen epitopes based on VHH antibody sequences.

Join the ChallengeSee the Details

## Challenge Overview:

- Goal: Predict epitopes for 3 specific VHH antibodies.

- Data Provided: Extensive sequence data with metadata for hundreds of thousands of VHH clones (both binders and non-binders) targeting the Her2 antigen. This dataset also includes competition data with known antibodies, which can be useful for epitope prediction.

- Evaluation: Binary assessment of amino acid residues in the antigen-antibody interface Track A (residue-level resolution; SEPIQ), where participants submit per-residue epitope/paratope probabilities, and Track B (atomic-level resolution; CAPRI), where participants submit predicted complex structures.

## Why Participate?

- Contribute to cutting-edge research in antibody design.

- Test your models against high-quality experimental ground truth.

Organized by: Epitope Prediction Challenge Committee, SEPIQ (London)

Co-organized by: CAPRI, OpenFold, AMED-BINDS and COGNANO, Inc.

Sponsors: To Be Confirmed

Join us in advancing the frontier of AI-driven drug discovery! | Challenge | Blind prediction of antigen epitopes based on the amino sequences of seven given VHH antibodies. | Provided Data | Sequence data(with metadata) for over a million VHH clones — both binders and non-binders — against the Her2 antigen. This dataset also includes competition data with known antibodies, which can be useful for epitope prediction. | Evaluation Metrics | Based on CAPRI standards; structural accuracy evaluated for both backbone and side chains using metrics such as DockQ. | Ground Truth | Cryo-EM structural analysis of Her2-VHH complexes, currently in progress. | Organizer | Epitope Prediction Challenge Committee, SEPIQ (London) | Co-organizer | CAPRI, OpenFold, AMED-BINDS and COGNANO, Inc. | Judging Panel | Multiple experts in structural biology and AI (under coordination) | Supporters / Endorsers | To Be Confirmed | Sponsors | To Be Confirmed | Foundation | London

Join the ChallengeSee the Details

## Timeline
Sept2026OctNovDec

- 1 Sept – 31 OctTrack A (Release of 1.8 million Her2 antibody clones)

- 16 SeptTrack B (CAPRI round begins)

- 1 Nov – 30 NovJudging and evaluation period

## FAQ

- What exactly is the prediction task?It involves predicting the 3D structure of the antigen-antibody complex (docking), not just identifying epitope residues. Evaluation will be based on structural accuracy (DockQ, etc.).

- What data will be provided?We will provide sequence data for VHH clones. Details on whether antigen structure (PDB) is provided or must be predicted will be released with the full guidelines.

- How will the ground truth be determined?Ground truth is based on Cryo-EM structures (target resolution 3.0 Å).

- Can we use tools like AlphaFold?Yes, existing tools are permitted. Specific rules on code submission will be provided.

## Co-Organizers






## Celebrate SEPIQ challenge

Download the Video

The performance by Markus Placci in SEPIQ Challenge Opening Ceremony in Kyoto on 28th March 2026

Join the ChallengeSee the Details

## Sponsors

### Gold
Coming soon

### Silver
Coming soon

### Bronze
Coming soon

### In-kind



## What is SEPIQ?

SEPIQ (Sequence-based Epitope Prediction Intelligent Query) is a London-based public organization dedicated to leading structure-based biopharmaceutical discovery.

Binary assessment of amino acid residues in the antigen-antibody interface

Track A (residue-level resolution; SEPIQ), where participants submit per-residue epitope/paratope probabilities, and Track B (atomic-level resolution; CAPRI), where participants submit predicted complex structures.

Learn MoreBrand

© 2026 SEPIQ
<<<END VERBATIM HOME>>>



---

# SEQUENCES (character-exact; parsed by code from the /detail plain-text lines; the LaTeX duplicate on the same page was cross-checked and gives identical residues)

## HER2 antigen construct (630 aa as printed) vs UniProt P04626 (ERBB2_HUMAN, 1255 aa)

Page numbering markers run 10..620 in blocks of 10, then separate groups GACQ and HHHHHH. Code check: every marker equals the actual residue count (no mismatches).

```
>HER2_construct (630 aa)
MELAALCRWGLLLALLPPGAASTQVCTGTDMKLRLPASPETHLDMLRHLYQGCQVVQGNLELTYLPTNASLSFLQDIQEVQGYVLIAHNQVRQVPLQRLRIVRGTQLFEDNYALAVLDNGDPLNNTTPVTGASPGGLRELQLRSLTEILKGGVLIQRNPQLCYQDTILWKDIFHKNNQLALTLIDTNRSRACHPCSPMCKGSRCWGESSEDCQSLTRTVCAGGCARCKGPLPTDCCHEQCAAGCTGPKHSDCLACLHFNHSGICELHCPALVTYNTDTFESMPNPEGRYTFGASCVTACPYNYLSTDVGSCTLVCPLHNQEVTAEDGTQRCEKCSKPCARVCYGLGMEHLREVRAVTSANIQEFAGCKKIFGSLAFLPESFDGDPASNTAPLQPEQLQVFETLEEITGYLYISAWPDSLPDLSVFQNLQVIRGRILHNGAYSLTLQGLGISWLGLRSLRELGSGLALIHHNTHLCFVHTVPWDQLFRNPHQALLHTANRPEDECVGEGLACHQLCARGHCWGPGPTQCVNCSQFLRGQECVEECRVLQGLPREYVNARHCLPCHPECQPQNGSVTCFGPEADQCVACAHYKDPPFCVARCPSGVKPDLSYMPIWKFPDEEGACQHHHHHH
```

In 10-residue blocks:

```
MELAALCRWG LLLALLPPGA ASTQVCTGTD MKLRLPASPE THLDMLRHLY QGCQVVQGNL ELTYLPTNAS LSFLQDIQEV QGYVLIAHNQ VRQVPLQRLR   [1-100]
IVRGTQLFED NYALAVLDNG DPLNNTTPVT GASPGGLREL QLRSLTEILK GGVLIQRNPQ LCYQDTILWK DIFHKNNQLA LTLIDTNRSR ACHPCSPMCK   [101-200]
GSRCWGESSE DCQSLTRTVC AGGCARCKGP LPTDCCHEQC AAGCTGPKHS DCLACLHFNH SGICELHCPA LVTYNTDTFE SMPNPEGRYT FGASCVTACP   [201-300]
YNYLSTDVGS CTLVCPLHNQ EVTAEDGTQR CEKCSKPCAR VCYGLGMEHL REVRAVTSAN IQEFAGCKKI FGSLAFLPES FDGDPASNTA PLQPEQLQVF   [301-400]
ETLEEITGYL YISAWPDSLP DLSVFQNLQV IRGRILHNGA YSLTLQGLGI SWLGLRSLRE LGSGLALIHH NTHLCFVHTV PWDQLFRNPH QALLHTANRP   [401-500]
EDECVGEGLA CHQLCARGHC WGPGPTQCVN CSQFLRGQEC VEECRVLQGL PREYVNARHC LPCHPECQPQ NGSVTCFGPE ADQCVACAHY KDPPFCVARC   [501-600]
PSGVKPDLSY MPIWKFPDEE GACQHHHHHH   [601-630]
```

- Residues 1-620 numbered on the page; GACQ = residues 621-624; HHHHHH = 625-630 (printed length 630).
- UniProt P04626 residues 621-624 are exactly "GACQ" (UniProt 625-632 is "PCPINCTH"). So the "C-terminal GACQ" is NOT an artificial tag; it is native P04626 sequence.
- Exact equality test: construct == P04626[1:624] + "HHHHHH" -> True. Offset between construct and P04626 numbering = 0 for residues 1-624 (signal peptide 1-22 included). The His tag is construct 625-630 and has no P04626 counterpart (P04626 625-630 = PCPINC).
- Non-standard characters: none.
- Construct ends at P04626 Q624. The pages do not state the expression range; HF dataset discussion #2 (2026-08-02, organiser reply) prints the same 630 aa as "the full amino acid sequence of the Her2 antigen used".

## ONU11 (127 aa as printed; page numbering 1..120, then S, then HHHHHH: 120 + S + His6 = 127 total)

```
>ONU11
MAQVQLQESGGGSVQAGGSLRLSCAASGRTLSGWVMGWFRQAPGKDRDFVAHLSGDTTAYAHSVKGRFTISRDNAKDTVFLQMNSLKPEDTGVYYCAARPLGSTWTEHPYWGQGTQVTVSSHHHHHH
```

```
MAQVQLQESG GGSVQAGGSL RLSCAASGRT LSGWVMGWFR QAPGKDRDFV AHLSGDTTAY AHSVKGRFTI SRDNAKDTVF LQMNSLKPED TGVYYCAARP   [1-100]
LGSTWTEHPY WGQGTQVTVS SHHHHHH   [101-127]
```

- Ends with ...WGQGTQVTVSSHHHHHH; non-standard characters: none; page markers consistent with actual counts.

## ONU13 (127 aa as printed; page numbering 1..120, then S, then HHHHHH: 120 + S + His6 = 127 total)

```
>ONU13
MAQVQLQESGGGLVQAGGSLRLSCTASERTFSIDYMGWYRQAPGKQREFVGTIEWNSGSTGYGDSVKGRFTISRDNAKNTGYLQMNSLKPEDTAVYYCAAKYGSSRLWDYWGQGTQVTVSSHHHHHH
```

```
MAQVQLQESG GGLVQAGGSL RLSCTASERT FSIDYMGWYR QAPGKQREFV GTIEWNSGST GYGDSVKGRF TISRDNAKNT GYLQMNSLKP EDTAVYYCAA   [1-100]
KYGSSRLWDY WGQGTQVTVS SHHHHHH   [101-127]
```

- Ends with ...WGQGTQVTVSSHHHHHH; non-standard characters: none; page markers consistent with actual counts.

## ONU23 (135 aa as printed; page numbering 1..130 where position 130 is the first H, then HHHHH: 129 VHH residues + His6 = 135 total)

```
>ONU23
MAQVQLQESGGGLVQAGGSLRLSCAASGRTLSGAAMGWFRQAPGKEREFVAGISWSTSRTQYADSVKGRFTISRDNAKNTVFLQMNSLNAEDTAVYYCAADGRFYSDYVWSSPDEYAYWGQGTQVTVSSHHHHHH
```

```
MAQVQLQESG GGLVQAGGSL RLSCAASGRT LSGAAMGWFR QAPGKEREFV AGISWSTSRT QYADSVKGRF TISRDNAKNT VFLQMNSLNA EDTAVYYCAA   [1-100]
DGRFYSDYVW SSPDEYAYWG QGTQVTVSSH HHHHH   [101-135]
```

- Ends with ...WGQGTQVTVSSHHHHHH; non-standard characters: none; page markers consistent with actual counts.

Cross-check: the HF Space (app.py, Tracks tab, E6) prints the same three sequences as one-line FASTA; identical to /detail character for character (compared by code).

Numbering is sequential, 1 = M. /detail verbatim: "The residues of each VHH clone should be numbered according to sequential indexing. This season, we are not adopting the Kabat, Chothia, or IMGT schemes."



---

# TRAINING DATA (HF dataset sepiq-2026/SEPIQ-2026-training-data) and SUBMISSION SCHEMAS

Access status: dataset is gated="manual". README.md is public (HTTP 200, 17,291 bytes, E5). The CSV files return HTTP 401 without approval, so exact dtypes and example rows of the CSVs could not be fetched directly. The schema below comes from the README (E5), the HF file-tree API, and the public starter notebook in the Space (vhh_dataset_tutorial.ipynb), whose saved outputs print the head of the data. No credential was used.

File list (HF API tree, bytes): .gitattributes 2,706; AVIDa-hHER2.csv 499,335,870 (LFS); LICENSE 0; NGS_read_count_table.csv 126,170,849 (LFS); README.md 17,291; prediction_template_ONU11.csv 8,757; prediction_template_ONU13.csv 8,757; prediction_template_ONU23.csv 8,853. Repo sha 3486f6aa50cc26d3b9f7d642ff8cad34c2c54b87, lastModified 2026-09-04T17:08:35Z, createdAt 2026-06-02, downloads 185, likes 27, license other.

Row count (README + notebook): 1,843,875 unique VHH sequences. Notebook 90/10 split: train 1,659,488 + validation 184,387 = 1,843,875 rows, 36 columns.

Columns printed by the notebook (36, in order): #ONU ID, total, Marin-NC1_37C-1st-B, Marin-NC2_37C-1st-B, Marin-NC2_4C-1st-B, Marin-NC3_C1_37C-2nd-B, Marin-NC3_C1_37C-2nd-C, Marin-NC3_C2_37C-2nd-B, Marin-NC3_C2_37C-2nd-C, Marin-Comparator_C1_37C-2nd-B, Marin-Comparator_C1_37C-2nd-C, Marin-Comparator_C2_37C-2nd-B, Marin-Comparator_C2_37C-2nd-C, Marin-Her2_37C-1st-B, Marin-Her2_C1_37C-2nd-B, Marin-Her2_C1_37C-2nd-C, Marin-Her2_C2_37C-2nd-B, Marin-Her2_C2_37C-2nd-C, Marin-Her2_RabMAb_C3_37C-1st-B, Marin-Her2_RabMAb_C3_4C-1st-B, Marin-Her2_Pertuzumab_C3_37C-1st-B, Marin-Her2_Pertuzumab_C3_4C-1st-B, Marin-Her2_Trastuzumab_C1_37C-1st-B, Marin-Her2_Trastuzumab_C1_4C-1st-B, Marin-Her2_Trastuzumab_C2_37C-1st-B, Marin-Her2_Trastuzumab_C2_4C-1st-B, Marin-Her2_Trastuzumab_C3_37C-1st-B, Marin-Her2_Trastuzumab_C3_4C-1st-B, background_IE_score, target_IE_score, label, binary_label, Cluster, #Cluster, Cluster_size, sequence.

Discrepancy: README names the columns `#ONU ID`, `Total`, `Sequence`, `Label`, `Binary Label`, `Background IE-score`, `Target IE-score`, `Cluster size`, while the notebook output shows `total`, `sequence`, `label`, `binary_label`, `background_IE_score`, `target_IE_score`, `Cluster_size`. The notebook output (an actual loaded frame) is the better guide for code; the README is prose.

Dtypes inferred from the notebook head (unverified; no df.info() printed): #ONU ID str; total int; Marin-* and IE-score columns float64 with NaN where a sublibrary was not run (sentinel -500.0 present); label str in {Yes, Not, noise, non-sig.}; binary_label float (1.0/0.0/NaN); Cluster str; #Cluster float; Cluster_size float; sequence str. Sequence length (notebook describe()): min 100, 25% 126, median 129, 75% 132, max 199, mean 129.04.

Example rows (notebook head): ONU1 total 23939 label noise binary NaN Cluster1 size 5378; ONU2 20137 Not 0.0 Cluster6 size 3287; ONU3 18117 Yes 1.0 Cluster38549 size 1345; ONU4 15965 noise NaN Cluster30 size 1535; ONU5 11007 Yes 1.0 Cluster4 size 3917. Sequence 1 (132 aa): MAQVQLQESGGGLVQAGGSLRLSCAASGGTVSTFDMGWFRQAPGKEREFVSRISWDHGTTRYADSVKGRFTISRDDAKNTVYLQLNSLKAEDTAVYYCARKRLYTSGTTRFDYDYWGQGTQVTVSSHHHHHH. Every printed sequence ends in HHHHHH.

Label rules (README, conditions 1-6): 1 target-IE >= 1.3 -> Not; 2 background IE <= -3 -> noise; 3 background negative and (background - target) > 2 -> Yes; 4 background negative but not 3 -> non-sig.; 5 background positive and target <= -1.3 -> Yes; 6 otherwise -> non-sig. IE-score = log10 of chi-square p-value, -500 substituted for -inf, diluted clones sign-flipped positive (lower = more likely binder). Clusters: USEARCH, 93% identity.

NGS_read_count_table.csv (126 MB): schema not visible without access; the notebook does not load it. AVIDa-hHER2.csv (499 MB) is the 36-column table the notebook loads (inferred, not proven).

Submission CSV schema (E6 + /guideline): columns chain, seqNum, resName, prediction. Chain A = HER2 antigen, chain B = VHH. prediction in [0,1]; omitted residues scored 0. The Space upload validator checks only that the header contains the four names (extra columns allowed; no value or row-count check), and requires all three files ONU11, ONU13, ONU23 in one upload; files are stored as <team>/<hf-user>/<UTC timestamp>/prediction_<clone>.csv in dataset sepiq-2026/SEPIQ-2026-submissions. The guideline example uses 3-letter resName and seqNum starting at 1 for both chains. Template files are 8,757 / 8,757 / 8,853 bytes; contents not retrievable (HTTP 401); row counts unverified (630 + 127/127/135 = 757/757/765 would be the full printed constructs incl. tags; not proven).

Ground-truth table format (guideline): chain, seqNum, resName, fact, weight (tab-separated; fact=1 for interface residues; weight = Voronota-LT residue contact area).


========== https://sepiq.uk/ (home page, text-extracted) ==========
 SEPIQ VHH-Epitope-Prediction Challenge 2026 SEPIQ Logo Home About Detail Guideline Brand Home About Detail Guideline Brand Call for Participation: SEPIQ VHH-Epitope-Prediction Challenge 2026 Unlock the Secrets of Antibody-Antigen Interactions with AI We are excited to announce the SEPIQ VHH-Epitope-Prediction Challenge , scheduled to begin in June 2026 . This challenge invites researchers, bioinformaticians, and AI practitioners to tackle a critical problem in structural biology: the blind prediction of antigen epitopes based on VHH antibody sequences. Join the Challenge See the Details Challenge Overview: Goal: Predict epitopes for 3 specific VHH antibodies. Data Provided: Extensive sequence data with metadata for hundreds of thousands of VHH clones (both binders and non-binders) targeting the Her2 antigen. This dataset also includes competition data with known antibodies, which can be useful for epitope prediction. Evaluation: Binary assessment of amino acid residues in the antigen-antibody interface Track A (residue-level resolution; SEPIQ), where participants submit per-residue epitope/paratope probabilities, and Track B (atomic-level resolution; CAPRI), where participants submit predicted complex structures. Why Participate? Contribute to cutting-edge research in antibody design. Test your models against high-quality experimental ground truth. Organized by: Epitope Prediction Challenge Committee, SEPIQ (London) Co-organized by : CAPRI, OpenFold, AMED-BINDS and COGNANO, Inc. Sponsors: To Be Confirmed Join us in advancing the frontier of AI-driven drug discovery! Challenge Blind prediction of antigen epitopes based on the amino sequences of seven given VHH antibodies. Provided Data Sequence data(with metadata) for over a million VHH clones — both binders and non-binders — against the Her2 antigen. This dataset also includes competition data with known antibodies, which can be useful for epitope prediction. Evaluation Metrics Based on CAPRI standards; structural accuracy evaluated for both backbone and side chains using metrics such as DockQ. Ground Truth Cryo-EM structural analysis of Her2-VHH complexes, currently in progress. Organizer Epitope Prediction Challenge Committee, SEPIQ (London) Co-organizer CAPRI, OpenFold, AMED-BINDS and COGNANO, Inc. Judging Panel Multiple experts in structural biology and AI (under coordination) Supporters / Endorsers To Be Confirmed Sponsors To Be Confirmed Foundation London Join the Challenge See the Details Timeline Sept 2026 Oct Nov Dec 1 Sept – 31 Oct Track A (Release of 1.8 million Her2 antibody clones) 16 Sept Track B (CAPRI round begins) 1 Nov – 30 Nov Judging and evaluation period FAQ What exactly is the prediction task? It involves predicting the 3D structure of the antigen-antibody complex (docking), not just identifying epitope residues. Evaluation will be based on structural accuracy (DockQ, etc.). What data will be provided? We will provide sequence data for VHH clones. Details on whether antigen structure (PDB) is provided or must be predicted will be released with the full guidelines. How will the ground truth be determined? Ground truth is based on Cryo-EM structures (target resolution 3.0 Å). Can we use tools like AlphaFold? Yes, existing tools are permitted. Specific rules on code submission will be provided. Co-Organizers Celebrate SEPIQ challenge Download the Video The performance by Markus Placci in SEPIQ Challenge Opening Ceremony in Kyoto on 28th March 2026 Join the Challenge See the Details Sponsors Gold Coming soon Silver Coming soon Bronze Coming soon In-kind What is SEPIQ? SEPIQ (Sequence-based Epitope Prediction Intelligent Query) is a London-based public organization dedicated to leading structure-based biopharmaceutical discovery. Binary assessment of amino acid residues in the antigen-antibody interface Track A (residue-level resolution; SEPIQ), where participants submit per-residue epitope/paratope probabilities, and Track B (atomic-level resolution; CAPRI), where participants submit predicted complex structures. Learn More Brand © 2026 SEPIQ 

========== CONTRADICTION RESOLUTION (q4 worker, 2026-10-17) ==========
1. Number of antibodies: home page overview says "Predict epitopes for 3 specific VHH antibodies" but a second block on the same page says "seven given VHH antibodies" (stale text). /detail lists exactly three sequences (ONU11, ONU13, ONU23) and /guideline's score formula runs k=1..3. RESOLVED: 3 held-out complexes (the 'seven' is a stale draft).
2. Metric: home page says 'Based on CAPRI standards ... DockQ' (stale / applies to Track B). /guideline: Track A primary measures = PR-AUC unweighted and area-weighted (weighted recall TP_area/P_area with ordinary precision), macro-average over 3 complexes, no pooling. /detail names PR-AUC only for the baseline (0.176 on 8GZ5) and never states the leaderboard metric. RESOLVED: PR-AUC macro (two variants) per /guideline; which of the two variants ranks the leaderboard is NOT stated (open).
3. Dates: home page 'scheduled to begin in June 2026' (HF dataset repo created 2026-06-02; opening ceremony Kyoto 28 Mar 2026); timeline graphic: 1 Sept-31 Oct Track A, 16 Sept Track B CAPRI round begins, 1-30 Nov judging; /detail: submission Sep 1-Oct 31 2026, evaluation and results announcement Dec 15 2026, organisers may extend. RESOLVED: June = original announced start; operative window Sep 1-Oct 31, judging in Nov, announcement Dec 15.
4. Bootstrap: /guideline text says 'resampling-based cluster bootstrap' but the algorithm given resamples RESIDUE INDICES (L indices with replacement, same index set across antibodies and teams), B=2000, percentile 95% CI, empirical p. It does not resample complexes. (Using one index set of length L across antibodies of different lengths is ill-defined as written.)
5. Home FAQ still says task = 3D docking evaluated with DockQ; /guideline says Track A is sequence/residue-level, Track B is structure.
