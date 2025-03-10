<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ShineCraft</title>
    <meta name="description" content="ShineCraft célèbre chaque moment précieux de votre vie avec des bijoux élégants et exquis, conçu pour illuminer vos instants les plus mémorables.">
    <link rel="stylesheet" href="../assets/css/accueil.css">
    <link rel="stylesheet" href="../assets/css/responsiveDashboard.css">
    <link rel="stylesheet" href="../assets/css/produits.css">
</head>
<body>
    <?php 
        // Démarrer une session
        session_start();
        if (!isset($_SESSION['user_id'])) {
            header("Location: authentification.php"); // Rediriger vers la page de connexion si non connecté
            exit();
        }
        include("header.php")
    ?>

    <main>
        <?php 
            include("nav.php");
            include "../connexionDB.php"; // Assurez-vous que la connexion à la base de données est bien incluse

            $filtre = isset($_GET['filtre']) ? $_GET['filtre'] : 'all';

            // Requête de base
            $sql = "SELECT c.*, cl.nom AS nom_client 
                    FROM commande c
                    JOIN clients cl ON c.idUtilisateur = cl.id";

            // Si le filtre est "Récent", on limite aux 10 dernières commandes
            if ($filtre == "recent") {
                $sql .= " ORDER BY c.date_commande DESC LIMIT 10";
            } else {
                $sql .= " ORDER BY c.date_commande DESC LIMIT 10";
            }

            $result = $conn->query($sql);
        ?>

        <section>
            <div class="container2">
            <div class="box">
                <div class="boxHeading">
                    <h3>Commandes</h3>
                    <div class="filtre filtreMobile">
                        <select name="filtre" id="filtre">
                            <option value="all" <?= ($filtre === 'all') ? 'selected' : ''; ?>>Tout</option>
                            <option value="recent" <?= ($filtre === 'recent') ? 'selected' : ''; ?>>Récent</option>
                        </select>
                    </div>
                </div>
                <div class="infos">
                    <table>
                        <thead>
                            <tr>
                            <td>ID Commande</td>
                            <td>Nom client</td>
                            <td>Statut</td>
                            <td>Date</td>
                            <td>Actions</td>
                            </tr>
                        </thead>
                        <tbody>
                            <?php while ($row = $result->fetch_assoc()) { ?>
                            <tr>
                                <td><?= $row['id'] ?></td>
                                <td><?= htmlspecialchars($row['nom_client']) ?></td>
                                <td><?= htmlspecialchars($row['status']) ?></td>
                                <td><?= $row['date_commande'] ?></td>
                                <td><a href="commande_details.php?id=<?= $row['id'] ?>"><button>Détails</button></a></td>
                            </tr>
                            <?php } ?>
                        </tbody>
                    </table>
                </div>
            </div>
            </div>
        </section>
    </main>

    <script src="../assets/js/menuDashboard.js"></script>
    <script>
        document.getElementById('filtre').addEventListener('change', function() {
            window.location.href = 'commandes.php?filtre=' + this.value;
        });
    </script>
</body>
</html>