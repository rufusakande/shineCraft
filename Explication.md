# Explication du code pour le site de vente en ligne ( ShineCraft )

Shinecraft est un site de vente en ligne de bijoux. 
- Il permet aux utilisateurs de trouver des bijoux adapter à leurs style trés facilement et de passer leurs commandes. 
- Il permet aussi aux administrateurs d'ajouter de nouveaux bijoux de les modifier ou de les supprimer et permet une gestion efficace du stock.

## Comment le code est écrit : 

- Page accueil ( index.php ) :
Cette page est la première qui s'affiche lorsqu'on vient sur le site. Les utilisateurs n'ont pas forcement d'être connecté avant de voir cette page. Cette page présente 03 produits les plus populaire et les utilisateurs peuvent cliquer sur chaque produit pour voir les détails sur ces produits ou aller sur la page catalogue pour voir plusieurs produits

- Page catalogue ( catalogue.php ) : 
cette page présente plusieurs produite avec des options de filtrage au niveaux des produits les plus vendu

- Page détails produit ( detailsProduits.php ) :
Cette page affiche les détails par rapport à un produit et permet de définir la quantité de produit que l'utilisateur veux acheter. En suite il peut cliquer sur ajouter au panier pour ajouter le produits au panier. Mais s'il n'est pas connecter, il serait rediriger vers la page de connexion et la quantité de produits choisi ainsi que l'id du produits seront passer en paramètre à l'url. Ainsi lorsqu'il se connecte il serait directement rediriger sur la page panier et le produit serais ajouter au panier. Dans le cas ou il n'a pas de compte, il peut cliquer sur inscription et s'inscrire en suite il serait rediriger vers la page panier.

- Page panier ( panier.php ) :
Cette page présente les produits ajoutés au panier et le total à payer pour tout ces produits. Pour accéder à cette page, on peut cliquer sur l'icone du panier dans le header ou ajouter un produit dans le panier en allant dans les détails du produits et en cliquant sur le bouton "ajouter au panier". Dans le cas ou on clique sur l'icone du panier, si l'utilisateur n'est pas connecté, il serait rediriger sur la page de connexion et il y à un paramètre qui est envoyé à la page de connexion "src=pn" cela permet de rediriger l'utilisateur sur la page panier une fois connecté ou inscris.	

