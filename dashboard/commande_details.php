<?php
include("../connexionDB.php");

// Vérifier si un ID de commande est passé en paramètre
if (!isset($_GET['id']) || empty($_GET['id'])) {
    echo "Commande non trouvée.";
    exit;
}

$idCommande = intval($_GET['id']);

// Requête pour récupérer les infos de la commande + client
$sqlCommande = "SELECT c.id, c.date_commande, c.status, 
                       u.nom AS nom_client, u.email, u.numero
                FROM commande c
                JOIN clients u ON c.idUtilisateur = u.id
                WHERE c.id = ?";
$stmtCommande = $conn->prepare($sqlCommande);
$stmtCommande->bind_param("i", $idCommande);
$stmtCommande->execute();
$resultCommande = $stmtCommande->get_result();

if ($resultCommande->num_rows == 0) {
    echo "Commande non trouvée.";
    exit();
}

$commande = $resultCommande->fetch_assoc();

// Requête pour récupérer les produits commandés
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
    <title>Détails de la commande</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; padding: 0; }
        .container { max-width: 800px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px; }
        h2, h3 { text-align: center; }
        .detail { margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        table, th, td { border: 1px solid #ddd; }
        th, td { padding: 10px; text-align: center; }
        .btn { text-align: center; margin-top: 20px; }
        .btn a { text-decoration: none; background: #007bff; color: white; padding: 10px 15px; border-radius: 5px; }
        .btn a:hover { background: #0056b3; }
    </style>
</head>
<body>

<div class="container">
    <h2>Détails de la commande #<?= htmlspecialchars($commande['id']) ?></h2>

    <div class="detail"><strong>Nom du client :</strong> <?= htmlspecialchars($commande['nom_client']) ?></div>
    <div class="detail"><strong>Email :</strong> <?= htmlspecialchars($commande['email']) ?></div>
    <div class="detail"><strong>Téléphone :</strong> <?= htmlspecialchars($commande['numero']) ?></div>
    <div class="detail"><strong>Date de commande :</strong> <?= htmlspecialchars($commande['date_commande']) ?></div>
    <div class="detail"><strong>Statut :</strong> <?= htmlspecialchars($commande['status']) ?></div>

    <h3>Produits commandés</h3>
    <table>
        <thead>
            <tr>
                <th>Produit</th>
                <th>Prix Unitaire</th>
                <th>Quantité</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            <?php $total = 0; while ($produit = $resultProduits->fetch_assoc()) {  $total +=$produit['prix'] * $produit['quantite'];?>
                <tr>
                    <td><?= htmlspecialchars($produit['nomProduit']) ?></td>
                    <td><?= number_format($produit['prix'], 0, ',', ' ') ?> XOF</td>
                    <td><?= htmlspecialchars($produit['quantite']) ?></td>
                    <td><?= number_format($produit['prix'] * $produit['quantite'], 0, ',', ' ') ?> XOF</td>
                </tr>
            <?php } ?>
            <tr>
            <td colspan="3"><strong>Total</strong></td>
            <td><strong><?php echo $total; ?> XOF</strong></td>
        </tr>
        </tbody>
    </table>

    <div class="btn">
        <a href="commandes.php">Retour</a>
    </div>

    <?php if ($commande['status'] !== 'Validé') : ?>
        <div class="btn">
            <button id="validerCommande" data-id="<?= $commande['id'] ?>" style="background: green; color: white; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer;">
                Valider la commande
            </button>
        </div>
    <?php endif; ?>
</div>


<script>
document.addEventListener("DOMContentLoaded", function () {
    const boutonValider = document.getElementById("validerCommande");

    if (boutonValider) {
        boutonValider.addEventListener("click", function () {
            const commandeId = this.getAttribute("data-id");

            if (confirm("Voulez-vous vraiment valider cette commande ?")) {
                fetch("valider_commande.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: "id=" + commandeId
                })
                .then(response => response.text())
                .then(data => {
                    if (data === "success") {
                        alert("Commande validée avec succès !");
                        location.reload(); // Rafraîchir la page pour voir la mise à jour
                    } else {
                        alert("Erreur lors de la validation.");
                    }
                })
                .catch(error => console.error("Erreur:", error));
            }
        });
    }
});
</script>

</body>
</html>
