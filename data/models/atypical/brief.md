# Brief Modèle — Atypical

```
Fichier .pbix ouvert     : "AtypicalLoans model.pbix"
Nom affiché              : Atypical Loans
Dernière MàJ (YYYY-MM-DD): 2026-03-01
Fréquence                : Mensuelle
Catégories               : portfolio | disbursement | atypical

Description: Modéle pour identifier les différentes catégories de crédits atypiques définis. 
Il y'a plusieurs catégories d'atypiques (Installment Late, RenewaLoans, Delay, T24 variables, Restructured variables, ChangedGP, ....) et des sous catégories qu'on appelle variables atypiques


Cas d'usage 
Afin de tracker les tendances des crédits atypiques


Source(s) de données :
- Mapping_Atypical.xlsx
- Consolide_Atypica_Loansl&RenewalLoans_31-03-2026.xlsx
- Consolide_Atypica_Loansl&RenewalLoans_28-02-2026.xlsx
- Consolide_Atypica_Loansl&RenewalLoans_31-01-2026.xlsx
- Consolide_Atypica_Loansl&RenewalLoans_31-12-2025.xlsx
- Consolide_Atypica_Loansl&RenewalLoans_30-11-2025.xlsx
- Consolide_Atypica_Loansl&RenewalLoans_31-10-2025.xlsx
- Consolide_Atypica_Loansl&RenewalLoans_30-09-2025.xlsx
- Consolide_Atypica_Loansl&RenewalLoans_31-08-2025.xlsx
- Consolide_Atypica_Loansl&RenewalLoans_31-07-2025.xlsx
- Consolide_Atypica_Loansl&RenewalLoans_31-03-2025.xlsx
- Consolide_Atypica_Loansl&RenewalLoans_30-06-2025.xlsx
- Consolide_Atypica_Loansl&RenewalLoans_31-05-2025.xlsx
- Consolide_Atypica_Loansl&RenewalLoans_30-04-2025.xlsx
(Bref Historique d'autant nécessité de cette extraction)


Onglets :
1. Atypical Dashboard: Tableau de bord des différentes variables atypiques avec pour chacun, sur le mois choisi: Le montant décaissé, le % de décaissement sur le décaissement total du mois, le volume de GLP de la variable atypique, le % sur le GLP total, le nombre de crédit, le volume de PAR30 et le % sur le PAR30 du mois. Filtres: Reporting date, Atypical Category, Subsidiary, Atypical Category, Segment
2. Atypical trend: 4 graphiques en courbe et histogramme groupé: 
disbursement: Atypical Disb EUR & Atypical in total Disb Cur
# of contract: Atypical # of contracts & Atypical in total # Contract
GLP: Atypical GLP EUR & Atypical volume in total GLP
PAR30: Atypical GLP EUR & Atypical PAR 30+ % & PAR 30+ % (Ces 2 dernières sur l'axe Y de la ligne afin de comparer le % PAR total et le % de PAR de cet atypique )
Filtres: Atypical Category, Branch et Variables (Cette dernière défini la variable atypique à visualiser sur les 4 graphiques )

KPIs à documenter: 
Atypical Disb EUR current month
Atypical in total disb cur month
Atypical Disb # current month
Atypical GLP EUR
Atypical volume in total GLP
Atypical # of contracts
Atypical PAR 30+ %
PAR 30 Volume
(Les indicateurs en EUR sont aussi disponible en Local Currency |LC|)

Bonus point:
Catégories d'atypique
Clts financés n'ayant pas remb. 70% du pcdt credit
Clts ayant changé de GP
Clts ayant changé de GP ds le mois actuel
Nouveau clt dans le PAR 30
Clts renouvelés ayant un cumul +60 jrs de retard
Clts renouvelés ayant un maxOverdue +60 jrs de retard
Clts ayant 1 contrat
Clts ayant 2 contrat
Clts ayant 3 contrat
Credit orphelin
Credit paralléle
Premiere echeance en retard
Premiere echeance n'est jamais en retard
Premiere et deuxieme echeance en retard
Premiere et deuxieme ne sont jamais en retard
Premiere, deuxieme et troisieme echeance en retard
Premiere, deuxieme et troisieme echeance ne sont jamais en retard
Client de premier cycle dont la premiere echeance a été en retard
Client de premier cycle dont la premiere echeance est en retard ce mois
Clts ayant changé de date de maturité
Clts reechelonné
Clts restructuré
Clts décaissé et bloqué
Clt dont le CSD cassé
Exception dans T24
Clts ayant un avis negatif du risque
Clts rayé et renouvelé
Credit caution
Clt liquidé tôt
Clt liquidé tôt pour le credit prcdt
Clt validé par Tuneloan
Clt dont son garant est dans le PAR 30
Client financé ayant une augmentation + de 50% de capital
Client financé ayant une augmentation + de 80% de capital
Client financé ayant une augmentation + de 90% de capital
Clts renouvelés ayant un cumul +60 jrs de retard
Clients financés n'ayant pas remb. 70% du prcdt capital
Clients financés n'ayant pas remb. 60% du prcdt capital
