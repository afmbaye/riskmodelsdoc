# Brief Modèle — Template

> **Comment utiliser ce fichier :**
> - **Option A** : Remplis ce fichier directement, puis dis à Claude "lis le brief et démarre"
> - **Option B** : Copie le bloc ci-dessous, remplis-le, colle-le dans le chat
>
> Claude se connectera automatiquement au MCP Power BI et créera tous les fichiers JSON sans poser de questions.

---

## BRIEF MODELE

```
Fichier .pbix ouvert     : [nom exact, ex: Vintage LD & WO.pbix]
Nom affiché              : [ex: Vintage LD & WO]
Dernière MàJ (YYYY-MM-DD): [ex: 2025-11-01]
Fréquence                : [Quotidienne | Mensuelle | Hebdomadaire]
Catégories               : [choisir parmi : portfolio | savings | collaterals | collections | disbursement | glp | par | wof | atypical | provisioning | transition | smoothing]

Description (1-2 phrases, ce que le modèle fait) :
...

Cas d'usage (comment un analyste l'utilise, 2-3 phrases) :
...

Source(s) de données :
- [nom exact fichier/dossier 1] : [description courte]
- [nom exact fichier/dossier 2] : [description courte]

Onglets (dans l'ordre exact d'apparition dans Power BI) :
1. [Nom exact] : [ce que cet onglet montre en 1 phrase]
2. [Nom exact] : [...]
3. ...

KPIs à documenter (noms exacts des mesures Power BI, exclure les "Somme de..." auto-générés) :
- [Mesure 1]
- [Mesure 2]
- ...
```

---

## Ce que Claude génère automatiquement (pas besoin de remplir)

| Élément | Généré comment |
|---------|----------------|
| Descriptions des tables | Inférées des noms de colonnes via MCP |
| Descriptions des colonnes | Inférées du nom + type de données |
| Formules DAX | Extraites directement du modèle via MCP |
| Explications des formules DAX | Rédigées par Claude à partir de la formule |
| Relations entre tables | Extraites via MCP |
| Étapes du processus de mise à jour | Template générique adapté au type de source |
| Filtres des visuels | Inférés des colonnes de dimension |
| "Comment lire ce visuel" | Généré à partir du nom de l'onglet et des KPIs |

---

## Catégories valides

| ID | Libellé |
|----|---------|
| `portfolio` | Portfolio |
| `savings` | Savings |
| `collaterals` | Collaterals |
| `collections` | Collections |
| `disbursement` | Disbursement |
| `glp` | GLP |
| `par` | PAR |
| `wof` | Write-offs (WOF) |
| `atypical` | Atypical |
| `provisioning` | Provisioning |
| `transition` | Transition |
| `smoothing` | Smoothing |

---

## Exemple rempli (Vintage Recovery)

```
Fichier .pbix ouvert     : Vintage Recovery.pbix
Nom affiché              : Vintage Recovery
Dernière MàJ (YYYY-MM-DD): 2025-10-03
Fréquence                : Mensuelle
Catégories               : portfolio, collections

Description :
Suivi mensuel des montants radiés (write-offs) et des recouvrements réalisés, par filiale,
pays et segment client. Ce modèle permet d'analyser les performances de recouvrement
sur les portefeuilles radiés et d'évaluer le taux de récupération des créances.

Cas d'usage :
Utilisez ce modèle pour suivre mensuellement les recouvrements réalisés sur les créances
radiées, identifier les filiales et segments avec les meilleurs taux de récupération,
et piloter les actions de recouvrement post-radiation.

Source(s) de données :
- Wof Recoveries - New Segment.csv : Fichier CSV mensuel contenant les montants radiés
  et recouvrements réalisés par entreprise, pays, devise et sous-segment.

Onglets :
1. Recovery Amounts : Vue d'ensemble des montants recouvrés et radiés par période,
   filiale et segment client.
2. Recovery Rates : Analyse des taux de recouvrement et leur évolution dans le temps
   par cohorte de radiation.

KPIs à documenter :
- AmountRecovered EUR
- AmountRecovered LC
```
