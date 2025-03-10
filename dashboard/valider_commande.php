<?php
include("../connexionDB.php");

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["id"])) {
    $idCommande = intval($_POST["id"]);
    $dateActuelle = date("Y-m-d H:i:s");

    // Mettre à jour le statut de la commande en "Validé"
    $sql = "UPDATE commande SET status = 'Validé' WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $idCommande);

    if ($stmt->execute()) {
        // Récupérer les produits de la commande
        $sqlProduits = "SELECT idProduit, quantite FROM details_commande WHERE idCommande = ?";
        $stmtProduits = $conn->prepare($sqlProduits);
        $stmtProduits->bind_param("i", $idCommande);
        $stmtProduits->execute();
        $resultProduits = $stmtProduits->get_result();

        while ($produit = $resultProduits->fetch_assoc()) {
            $idProduit = $produit["idProduit"];
            $quantite = $produit["quantite"];

            // Mettre à jour nb_vendus (+1) et date_vendus (date actuelle)
            $sqlUpdateProduit = "UPDATE produits SET qte_vendus = qte_vendus + $quantite, date_vendus = ? WHERE id = ?";
            $stmtUpdateProduit = $conn->prepare($sqlUpdateProduit);
            $stmtUpdateProduit->bind_param("si", $dateActuelle, $idProduit);
            $stmtUpdateProduit->execute();
        }

        echo "success";
    } else {
        echo "error";
    }

    $stmt->close();
}
?>
