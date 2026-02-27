# Brief Modèle — LLP

```
Fichier .pbix ouvert     : LLP Model.pbix
Nom affiché              : LLP
Dernière MàJ (YYYY-MM-DD): 2026-02-26
Fréquence                : Mensuelle
Catégories               : provisioning

Description:
Modéle de suivi du Loan Loss Portfolio en conformité avec IFRS et donc le cout du crédit et les ratio de risques financier

Cas d'usage :
Permet de suivre le cout du crédit et le ratio de couverture du défaut, les ratios de crédits non performants, l'estimation du LLP, ...

Source(s) de données :
- Data_LLP.xlsx: Tableau avec les données recus de la finance et nos données calculés issues du modéles PAR 30+12mNWO 
- Consolide_2025-12-31_2026-01-31.xlsx
- Mapping LLP.xlsx
- Photos pays\


Onglets (dans l'ordre exact d'apparition dans Power BI) :
1. LLP Dashboard
2. Coverage ratio PAR 30 || PAR 90
3. Cost of Risk Vol
4. Component Cost of Risk
5. Financial Risk Ratio Trend
6. Net Charge-Off (NCO) Ratio
7. LLP estimated

KPIs à documenter (noms exacts des mesures Power BI, exclure les "Somme de..." auto-générés) :
- Loan loss provision_EUR
- Write off_EUR
- Recovery  from loans written off_EUR
- Coverage ratio PAR 30
- Coverage ratio PAR 90
- PAR 30 (Volume)
- PAR 90 (Volume)
- LL Reserve_BSA0220

```
