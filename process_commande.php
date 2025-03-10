<?php
    include("connexionDB.php");
    session_start();

    $idUtilisateur = $_SESSION['user_id']; // ID de l'utilisateur connecté

    // Étape 1 : Créer une nouvelle commande
    $sql = "INSERT INTO commande (idUtilisateur) VALUES (?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $idUtilisateur);
    $stmt->execute();
    $idCommande = $stmt->insert_id; // Récupérer l'ID de la commande créée

    // Étape 2 : Récupérer les produits du panier de l'utilisateur
    $sql = "SELECT idProduit, quantite FROM panier WHERE idUtilisateur = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $idUtilisateur);
    $stmt->execute();
    $result = $stmt->get_result();

    // Étape 3 : Insérer chaque produit dans la table details_commande
    while ($row = $result->fetch_assoc()) {
        $idProduit = $row['idProduit'];
        $quantite = $row['quantite'];

        $sqlInsert = "INSERT INTO details_commande (idCommande, idProduit, quantite) VALUES (?, ?, ?)";
        $stmtInsert = $conn->prepare($sqlInsert);
        $stmtInsert->bind_param("iii", $idCommande, $idProduit, $quantite);
        $stmtInsert->execute();
    }

    // Étape 4 : Vider le panier après la commande
    $sqlDelete = "DELETE FROM panier WHERE idUtilisateur = ?";
    $stmtDelete = $conn->prepare($sqlDelete);
    $stmtDelete->bind_param("i", $idUtilisateur);
    $stmtDelete->execute();

    echo "Commande passée avec succès !";
    header("Location: detailsCommandes.php?id=" . $idCommande);
exit();
?>