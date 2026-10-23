# PARWiS presentation

Currently contains eleven slides: the opening, problem statement, BTL/lecture recap and disruption introduction, three Story time slides, a four-player comparison-selection example, a PARWiS algorithm walkthrough, the four disruption measures, the experiments, and a Questions closing slide. Further slides will be added individually after approval.

White background, black text, and locally bundled Computer Modern typography.

```sh
npm install
npm run dev
# Open http://localhost:5173/parwis-presentation/
```

**Right arrow / Space:** next slide or reveal. **Left arrow:** go back. **F:** toggle fullscreen. The arrow buttons provide the same navigation.

`npm run build` creates the production bundle.

The source paper and previous experiment files remain available as reference material.

Slide 2 reveals control of the next pairing, then noisy comparisons. Slide 3 advances in order: BTL centered with an animation; BTL moves to the top and its animation disappears; noisy knockout appears in the center and then moves left; duelling bandits appears in the center and then moves right; the bold “better than RUCB” sentence appears at the bottom center. The sentence then moves up and becomes “What do we mean by better?”, followed by questions about fewer comparisons and choosing the next pair, then an introduction to disruption. The lecture visuals follow `DA5453_Module_3_Course_Notes.pdf`, Sections 1.4 and 2.3.

The BTL visual is a continuously traversed sigmoid in log-strength difference. The knockout example repeats scripted noisy votes and majority advancement; the duelling example animates a seeded, 48-round trace of the simplified RUCB from the lecture notes. Each algorithm keeps looping after it moves to its parked position. Reduced-motion preferences show a static illustration.

Story time proceeds through the teammate disagreement and PARWiS punchline, one last challenger comparison, then both possible outcomes and their probability-weighted gradient norms. These use a generic objective f. The last slide starts with an animated illustrative loss surface for i winning; the next reveal moves it left and introduces j winning on the right. Both loop, and the next reveal gives the probability-weighted gradient-norm equation. The animation shows one common-step-size descent move, not full re-optimization. Particular objective comparisons are reserved for later.

The four-player example reveals illustrative chess ratings and synthetic prior game counts, then six disruption scores, the maximum (Carlsen–Harmon), and an animated game between the selected players. Scores use the authors’ regularized power_iter criterion with a common factor omitted, computed in `src/chessExample.js`; the formula stays off the slide. All six pairs are shown for intuition. PARWiS’s leader-based candidate restriction is reserved for a later explanation.

The chess cast uses generated illustrated portraits of Magnus Carlsen, Garry Kasparov, Vishy Anand, and fictional Beth Harmon. Heads gently move and change from focused to pleased for the selected pair; bodies and board pieces animate separately. Ratings and past results are hypothetical teaching inputs. The local portrait atlas is `public/chess-portraits.png`.

The PARWiS walkthrough executes one line per arrow press. Four ratings begin at 1500; Phase 1 uses three winner-stays comparisons, then becomes lighter while Phase 2 spends the remaining three comparisons. The current leader’s challengers are scored, the maximum is queried, and the recorded outcome feeds the next estimate. `src/parwisWalkthrough.js` computes the trace using phantom-node regularization and stationary estimates behind a generic `Estimate` step; outcomes are scripted, not sampled real games. The footnote reproduces the paper’s probability-weighted Markov stationarity-residual criterion (Appendix, objective 3), avoiding matrix-update details in the main algorithm.

The four-measure slide precedes experiments and reveals Exact, Log likelihood, Least squares, then Markov chain. It shows final expressions without derivations, including the Appendix’s logarithmic LS expression. Exact recomputes the spectral estimate; it does not introduce a fourth scalar loss. The paper defines the Markov criterion through stationarity and its probability-weighted residual, so the slide displays that target rather than inventing a scalar loss whose gradient need not give the stated criterion. Counts and optimum/regularization conventions are identified in the notes.

The earlier broad experiment plots remain implemented in `ExperimentsSlide.jsx`; its original four states were: dataset/setup overview; Figure 2 recovery plots for the disruption measures; Figure 3 recovery plots for the baselines; and Figure 3 ranking metrics with Synthetic/Jester/Netflix dataset buttons. Original plot crops are in `public/experiments/` with source notes in `SOURCE.md`. The summary identifies the extra Appendix datasets and the real-data-to-fitted-BTL evaluation setup. The original PDF plots are rendered directly with Poppler, not reconstructed from guessed points.

Live deck: https://saranath07.github.io/parwis-presentation/

Pushing `main` runs `.github/workflows/deploy.yml`, which builds with Node 22 and deploys `dist/` to GitHub Pages. The Vite base and public image URLs include `/parwis-presentation/`.

The current talk follows the dataset overview with four retro Netflix states: illustrated Tamil movie catalogue and synthetic ratings; rating-difference/logistic/spectral-BTL pipeline; a Bernoulli game oracle; then only PARWiS versus RUCB on Netflix recovery. The broader experiment comparisons are no longer in the linear presentation path. `public/netflix/SOURCE.md` records artwork, historical-logo, preprocessing and figure-digitization provenance. Two-series plotted values are approximate digitizations of Figure 3, not a fresh experiment; a button opens the original multi-baseline plot with error bars. The demo ratings are explicitly illustrative and are not claimed to be Netflix Prize records.
