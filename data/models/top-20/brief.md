# Brief Modèle — TOP 20

```
Fichier .pbix ouvert     : TOP 20 Model.pbix
Nom affiché              : TOP 20
Dernière MàJ (YYYY-MM-DD): [ex: 2026-03-02]
Fréquence                : Mensuelle
Catégories               : Disbursement, GLP, PAR, WOF 

Description (1-2 phrases, ce que le modèle fait) :
Il permet de voir le TOP20 de clients, contrats, agences ou DAO dans plusieurs catégories (Décaissements, Encours (GLP), PAR0, PAR30, WOF, No payment since disbursement). Chaque onglet est dédié à une catégorie

Cas d'usage (comment un analyste l'utilise, 2-3 phrases) :
Il permet de voir l'exposition au top

Source(s) de données :
Atypical_Loans_V2_2026-01-01 (1).xlsx
Atypical_Loans_V2_2026-02-01.xlsx
Consolide_2025-12-31_2026-01-31.xlsx
Default Probability - Get client's credit score.xlsx
mapping _Région agence.xlsx
Mapping_TOP 20.xlsx
MCBF_Collateral_Loans - 2026-02-01 14-05-00.csv
MCCI_Collateral_Loans - 2026-02-01 14-05-00.csv
MCDC_Collateral_Loans - 2026-02-01 14-05-00.csv
MCMG_Collateral_Loans - 2026-02-03 14-30-00.csv
MCML_Collateral_Loans - 2026-02-01 14-05-00.csv
MCNG_Collateral_Loans - 2026-02-01 14-05-00.csv
MCSN_Collateral_Loans - 2026-02-01 14-05-00.csv
VintageRecovery_2026-02-02.xlsx


Onglets (dans l'ordre exact d'apparition dans Power BI) :
1. Disbursement
3. Charts disbursement
4. GLP
5. Charts GLP
6. PAR 0
7. PAR 30
8. PAR 90
9. No payment since disb.
10. WOF

KPIs à documenter (noms exacts des mesures Power BI, exclure les "Somme de..." auto-générés) :
- Durée residuelle
- CCDAmount-EUR
- Tot Disb_EUR
- Sum of ExecutionValueEUR
- Tot GLP_EUR
- PAR 0+_Vol_EUR
- PAR 0+ %
- Ratio de liquidation
- PAR 30+_Volume_Due_EUR
- PAR 30+ %_Due
- PAR 90+_Vol_EUR
- PAR 90+ %
- Total_Amount_WOEuro
- Principal amount lost EUR CUR
- Ratio de liquidation_atWOFF
- NbOverduedays before WOF
```
