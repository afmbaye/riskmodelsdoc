
---

## BRIEF MODELE

```
Fichier .pbix ouvert     : Vintage LD & WO.pbix]
Nom affiché              : Vintage LD & WO
Dernière MàJ (YYYY-MM-DD): [ex: 2025-11-01]
Fréquence                : Mensuelle
Catégories               : portfolio | collections | disbursement | par | wof 

Description (1-2 phrases, ce que le modèle fait) :
...

Cas d'usage (comment un analyste l'utilise, 2-3 phrases) :
...

Source(s) de données :
- VintageRecovery_2026-04-02.xlsx:
- LOS DISB.xlsx:
- Mapping_comite_technique.xlsx:
- mapping_region.xlsx:
- Mapping_Vintage.xlsx:
- VintageLD_MCBF_2026-04-01.csv:
- VintageLD_MCCI_2026-04-01.csv:
- VintageLD_MCDC_2026-04-01.csv:
- VintageLD_MCMG_2026-04-01.csv:
- VintageLD_MCML_2026-04-01.csv:
- VintageLD_MCNG_2026-04-01.csv:
- VintageLD_MCSN_2026-04-01.csv:


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
