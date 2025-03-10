<?php
include("connexionDB.php");
session_start();

if (!isset($_GET['id'])) {
    echo "Aucune commande trouvée.";
    exit();
}

$idCommande = $_GET['id'];
$idUtilisateur = $_SESSION['user_id'];

// Récupérer les infos de la commande
$sqlCommande = "SELECT c.id, c.date_commande, c.status, u.nom, u.email
                FROM commande c
                JOIN clients u ON c.idUtilisateur = u.id
                WHERE c.id = ? AND c.idUtilisateur = ?";
$stmtCommande = $conn->prepare($sqlCommande);
$stmtCommande->bind_param("ii", $idCommande, $idUtilisateur);
$stmtCommande->execute();
$resultCommande = $stmtCommande->get_result();

if ($resultCommande->num_rows == 0) {
    echo "Commande non trouvée.";
    exit();
}

$commande = $resultCommande->fetch_assoc();

// Récupérer les détails des produits commandés
$sqlProduits = "SELECT p.nomProduit, p.prix, d.quantite
                FROM details_commande d
                JOIN produits p ON d.idProduit = p.id
                WHERE d.idCommande = ?";
$stmtProduits = $conn->prepare($sqlProduits);
$stmtProduits->bind_param("i", $idCommande);
$stmtProduits->execute();
$resultProduits = $stmtProduits->get_result();

?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture - Commande #<?php echo $idCommande; ?></title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; }
        table { width: 80%; margin: auto; border-collapse: collapse; }
        th, td { border: 1px solid black; padding: 10px; text-align: left; }
        .btn { padding: 10px 20px; background: blue; color: white; border: none; cursor: pointer; text-decoration: none; }
    </style>
</head>
<body>

    <h2>Facture - Commande #<?php echo $idCommande; ?></h2>
    <p><strong>Date :</strong> <?php echo $commande['date_commande']; ?></p>
    <p><strong>Client :</strong> <?php echo $commande['nom']; ?> (<?php echo $commande['email']; ?>)</p>
    <p><strong>Statut :</strong> <?php echo ucfirst($commande['status']); ?></p>

    <h3>Produits commandés :</h3>
    <table>
        <tr>
            <th>Produit</th>
            <th>Prix Unitaire (€)</th>
            <th>Quantité</th>
            <th>Total (€)</th>
        </tr>
        <?php
        $total = 0;
        while ($produit = $resultProduits->fetch_assoc()) {
            $sousTotal = $produit['prix'] * $produit['quantite'];
            $total += $sousTotal;
            echo "<tr>
                    <td>{$produit['nomProduit']}</td>
                    <td>{$produit['prix']}</td>
                    <td>{$produit['quantite']}</td>
                    <td>{$sousTotal}</td>
                  </tr>";
        }
        ?>
        <tr>
            <td colspan="3"><strong>Total</strong></td>
            <td><strong><?php echo $total; ?> €</strong></td>
        </tr>
    </table>

    <br>
    <a href="genererFacture.php?id=<?php echo $idCommande; ?>" class="btn">Télécharger la facture (PDF)</a>

</body>
</html>
