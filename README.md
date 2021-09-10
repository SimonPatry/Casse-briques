# Casse-brique

lien de test: https://simonpat.sites.3wa.io/developpement/JS/exercices/js/JS2.2-StartArkanoid/index.html

bases:
  * déplacements aux flèches uniquement
  * effets surprises (bonus et malus) toutes les  10 briques cassées
      - stopper/relancer la balle avec espace (lorsqu'elle deviens bleu)
      - agrandire/réduire la barre
      - grossir/réduire la balle
      - explosion aléatoire de briques
      - mur du bas fermé pendant un temps
     
## ex intro js

Premier projet plus avancé en js lors de ma formation de dev web à la 3W Academy
Le projet consistait a coder une balle ouvant se déplacer puis toucher des murs puis toucher des briques le tout avec une mécanique de "collisions" extrèmement basiques (coordonnées d'un carré autour de la balle communes à celles d'une brique).

J'ai poussé le projet plus loin en effectuant une refonte des collisions pour me rapprocher d'une phyique réaliste, en ajoutant les bonus listés au dessus
ainsi qu'en modifiant la durée de vie d'une brique et les couleurs.
(calcul d'intersection entre une droite et un cercle avec vérification sur chaques points de la droite)

Des problèmes de coollisions persistes de type "double collisions" dans les angles des briques, le projet n'ayant duré qu'une demi journée il était complexe tout de régler

P.S: le petit zombie est un bonus d'animation basique avec un système de rotation de sprites qui aurait du être réalisé en cours, mais pas le temps pour du zombieland alors je l'ai fait à côté :p
