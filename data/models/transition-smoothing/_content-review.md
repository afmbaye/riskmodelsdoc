# Content Review — Transition & Smoothing

> **Mode d'emploi :** Surécris directement les passages incorrects. Laisse ce qui est juste.
> Marque `[OK]` si un bloc est correct tel quel.
> Une fois rempli, dis-moi et je corrige les JSON.

---

## 1. VUE D'ENSEMBLE (overview.json)

### Description du modèle
```
FR : Tableau de bord mensuel analysant les transitions de qualité du portefeuille entre deux périodes
     via une matrice de transition PAR, et le lissage des décaissements, pour détecter précocement
     les contrats en dégradation avant qu'ils n'atteignent le stade de radiation.

EN : Monthly dashboard analyzing portfolio quality transitions between two periods via a PAR
     transition matrix, and disbursement smoothing, to early-detect contracts deteriorating
     before they reach write-off stage.
```
> ✏️ Correction :
 C'est un Outil d'analyse du lissage des décaissements et des transitions de PAR d'un mois à un autre
via une matrice de transition afin de garder un oeil sur la qualité du protefeuille 
---

### Cas d'usage (useCase)
```
FR : Permet de quantifier les mouvements inter-tranches PAR d'un mois à
     l'autre, d'identifier les filiales et segments affichant les taux de glissement les plus élevés,
     et d'initier des plans d'action ciblés pour réduire le passage en radiation (WOF). 

EN : Enables risk analysts to quantify inter-tranche PAR movements month over month, identify
     subsidiaries and segments with the highest roll rates, and initiate targeted action plans to
     reduce write-off migration. 
```
> ✏️ Correction :

---

### Onglets — descriptions
**1. Transition matrix**
```
FR : Matrice croisant les catégories de xPAR du mois précédent (lignes) et du mois courant (colonnes),
     quantifiant les flux entre chaque tranche de retard pour mesurer la dégradation
     ou l'amélioration du portefeuille.
EN : Matrix crossing previous month PAR categories (rows) and current month (columns), quantifying
     contract flows between each overdue bucket to measure portfolio deterioration or improvement.
```
> ✏️ Correction :

**2. Roll rate trend**
```
FR : Évolution temporelle des taux de transition entre catégories PAR, permettant de repérer les
     tendances de glissement sur plusieurs mois et d'anticiper les mouvements futurs du portefeuille.
EN : Time evolution of transition rates between PAR categories, enabling detection of roll rate
     trends over several months and anticipation of future portfolio movements.
```
> ✏️ Correction :

**3. Trend Smoothing**
```
FR : Analyse du lissage des décaissements mensuels distinguant les tendances structurelles des variations
     ponctuelles.
EN : Smoothed analysis of monthly disbursements distinguishing structural trends from one-off
     variations.
```
> ✏️ Correction :

**4. Closed category analysis - Subsidiaries**
```
FR : Analyse des contrats ayant quitté le portefeuille actif (remboursés, radiés ou restructurés)
     par filiale, pour évaluer les performances de résolution du risque à l'échelle géographique.
EN : Analysis of contracts that exited the active portfolio (repaid, written off or restructured)
     by subsidiary, to assess risk resolution performance at geographic level.
```
> ✏️ Correction :
Les contrats radiés ou restructurés ne sont pas consiféré Closed! Closed ce sont les crédits totalement remboursés! Corrige en conséquent sur tous les autres

**5. Closed category analysis - New Segment**
```
FR : Même analyse des catégories fermées ventilée par nouveau segment client (SME, Micro, Vanille,
     Agricole…), permettant d'identifier les typologies de clients les plus exposées aux sorties
     en défaut.
EN : Same closed category analysis broken down by new customer segment (SME, Micro, Vanilla,
     Agricultural…), identifying client typologies most exposed to default exits.
```
> ✏️ Correction :
Quand on parle de segment, c'est Nano, VSE, SE et SME/SME+ !! Et ca pour tous les modéles, corrige!  
---

## 2. VISUELS (visuals.json)

### Transition matrix

**Objectif**
```
FR : Visualiser les migrations de contrats entre les différentes catégories PAR d'un mois à l'autre,
     en montant (EUR) et en nombre de contrats, pour identifier les tranches à risque de glissement
     accéléré.
EN : Visualize contract migrations between PAR categories from one month to the next, by amount (EUR)
     and contract count, to identify buckets at risk of accelerated roll.
```
> ✏️ Correction :

**Comment lire (howToRead)**
```
FR : Chaque ligne de la matrice représente une catégorie PAR du mois précédent, chaque colonne une
     catégorie du mois courant. La diagonale indique les contrats stables. Les cellules à droite de
     la diagonale signalent une dégradation (glissement vers un PAR plus élevé), celles à gauche
     une amélioration. Concentrez-vous sur les cellules Healthy → PAR 0-30 et PAR 30-60 → PAR 60-90
     pour détecter les dégradations naissantes.
EN : Each row represents a previous month PAR category, each column a current month category. The
     diagonal shows stable contracts. Cells to the right of the diagonal signal deterioration (roll
     to higher PAR), those to the left signal improvement. Focus on Healthy → PAR 0-30 and
     PAR 30-60 → PAR 60-90 cells to detect emerging deterioration.
```
> ✏️ Correction :

**Color coding**
```
FR : Les cellules de la matrice sont colorées via la mesure 'Trans Matrix mise en forme
     conditionnelle' : vert pour la diagonale (stable), orange pour les glissements modérés,
     rouge pour les glissements critiques.
EN : Matrix cells are colored via the 'Trans Matrix mise en forme conditionnelle' measure: green
     for the diagonal (stable), orange for moderate rolls, red for critical rolls.
```
> ✏️ Correction :

---

### Roll rate trend

**Objectif**
```
FR : Suivre l'évolution mensuelle des taux de transition entre catégories PAR pour identifier les
     tendances structurelles de dégradation et anticiper les périodes à risque.
EN : Track monthly evolution of transition rates between PAR categories to identify structural
     deterioration trends and anticipate at-risk periods.
```
> ✏️ Correction :

**Comment lire (howToRead)**
```
FR : Un taux de glissement (roll rate) en hausse d'un mois à l'autre sur une tranche donnée
     (ex. PAR 30-60 → PAR 60-90) signale une dégradation systémique qui nécessite une action
     immédiate. Un taux stable ou en baisse témoigne de l'efficacité des plans de recouvrement
     mis en place.
EN : A roll rate increasing month over month for a given bucket (e.g. PAR 30-60 → PAR 60-90)
     signals systemic deterioration requiring immediate action. A stable or declining rate
     demonstrates the effectiveness of collection plans in place.
```
> ✏️ Correction :

---

### Trend Smoothing

**Objectif**
```
FR : Analyser la tendance des décaissements mensuels après lissage, en éliminant les pics ponctuels
     liés aux effets de calendrier, afin de distinguer la croissance structurelle du portefeuille
     des variations conjoncturelles.
EN : Analyze the trend of monthly disbursements after smoothing, eliminating one-off peaks linked
     to calendar effects, to distinguish structural portfolio growth from cyclical variations.
```
> ✏️ Correction :

**Comment lire (howToRead)**
```
FR : La courbe lissée atténue les à-coups mensuels et met en évidence la tendance de fond des
     décaissements. Un écart important entre la courbe brute et la courbe lissée indique un mois
     atypique (campagne de décaissement, fin d'exercice). Utilisez cette vue pour valider les
     objectifs de décaissement et détecter des déviations par rapport à la trajectoire prévue.
EN : The smoothed curve attenuates monthly variations and highlights the underlying disbursement
     trend. A large gap between the raw and smoothed curves indicates an atypical month (disbursement
     campaign, year-end). Use this view to validate disbursement targets and detect deviations from
     the planned trajectory.
```
> ✏️ Correction :

---

### Closed category analysis - Subsidiaries

**Objectif**
```
FR : Analyser les contrats ayant quitté le portefeuille actif (catégories fermées : remboursés,
     radiés, restructurés) en les ventilant par filiale, pour identifier les entités gérant le
     mieux la résolution du risque.
EN : Analyze contracts that exited the active portfolio (closed categories: repaid, written off,
     restructured) broken down by subsidiary, to identify entities managing risk resolution most
     effectively.
```
> ✏️ Correction :

**Comment lire (howToRead)**
```
FR : Une filiale avec un taux de sortie élevé vers 'Remboursé' indique une bonne performance de
     recouvrement. Un taux de sortie élevé vers 'Radié' signale au contraire des difficultés
     structurelles. Comparez les filiales entre elles pour identifier les meilleures pratiques
     à diffuser.
EN : A subsidiary with a high exit rate to 'Repaid' indicates good collection performance. A high
     exit rate to 'Written off' signals structural difficulties. Compare subsidiaries to identify
     best practices to spread.
```
> ✏️ Correction :

---

### Closed category analysis - New Segment

**Objectif**
```
FR : Analyser les mêmes catégories fermées ventilées par nouveau segment client (SME, Micro,
     Vanille, Agricole...) pour identifier les profils de clients les plus exposés aux sorties
     en défaut ou en radiation.
EN : Analyze the same closed categories broken down by new customer segment (SME, Micro, Vanilla,
     Agricultural...) to identify client profiles most exposed to default or write-off exits.
```
> ✏️ Correction :

**Comment lire (howToRead)**
```
FR : Croisez cette vue avec la matrice de transition pour valider si la dégradation observée sur
     un segment est structurelle (visible sur plusieurs mois) ou ponctuelle. Un segment avec un
     fort taux de radiation et un fort taux d'absence de paiement dès le décaissement nécessite
     une révision des critères d'octroi.
EN : Cross-reference this view with the transition matrix to validate whether the deterioration
     observed on a segment is structural (visible over several months) or one-off. A segment with
     a high write-off rate and high no-payment-since-disbursement rate requires a revision of
     underwriting criteria.
```
> ✏️ Correction :

---

## 3. KPIs (kpis.json)

### Total LP previous month EUR
```
Description FR : Encours brut total du mois précédent exprimé en euros. Retourne vide si l'encours
                 est nul, afin d'éviter d'afficher des zéros non significatifs dans la matrice.
Description EN : Total gross outstanding balance from the previous month expressed in euros. Returns
                 blank when outstanding is zero to avoid non-significant zeros in the matrix.
```
> ✏️ Correction :

---

### Total LP previous month (LC)
```
Description FR : Encours brut total du mois précédent en devise locale. Utilisé pour les filiales
                 dont la devise de reporting n'est pas l'euro (ex. CDF pour la RDC).
Description EN : Total gross outstanding balance from the previous month in local currency. Used for
                 subsidiaries whose reporting currency is not the euro (e.g. CDF for DRC).
```
> ✏️ Correction :

---

### Total LP current month EUR
```
Description FR : Encours brut total du mois courant en euros. Retourne 0 (et non vide) pour
                 permettre le calcul des ratios de transition même lorsque la catégorie courante
                 est à zéro.
Description EN : Total gross outstanding balance for the current month in euros. Returns 0 (not
                 blank) to allow transition ratio calculations even when the current category is zero.
```
> ✏️ Correction :

---

### Total LP current month (LC)
```
Description FR : Encours brut total du mois courant en devise locale. Complémentaire au KPI EUR
                 pour les filiales dont la devise fonctionnelle n'est pas l'euro.
Description EN : Total gross outstanding balance for the current month in local currency. Complements
                 the EUR KPI for subsidiaries whose functional currency is not the euro.
```
> ✏️ Correction :

---

### % of LP previous month
```
Description FR : Part de l'encours d'une catégorie PAR du mois précédent rapportée à l'encours
                 total du portefeuille, toutes catégories confondues. Indique le poids initial de
                 chaque tranche avant migration.
Description EN : Share of a previous month PAR category outstanding relative to total portfolio
                 outstanding. Indicates the initial weight of each bucket before migration.
```
> ✏️ Correction :

---

### Nombre de ContractNumber
```
Description FR : Nombre de contrats dans la sélection courante. Permet de quantifier en volume
                 les flux de la matrice de transition, en complément de l'analyse en montant.
Description EN : Number of contracts in the current selection. Quantifies in volume the transition
                 matrix flows, complementing the amount-based analysis.
```
> ✏️ Correction :

---

### Nbre de client
```
Description FR : Nombre de clients distincts impactés dans la sélection. Mesure la concentration
                 du risque : un volume élevé sur peu de clients signale un risque de concentration.
Description EN : Number of distinct clients affected in the selection. Measures risk concentration:
                 a high volume on few clients signals concentration risk.
```
> ✏️ Correction :
