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

            //connexion à la base de données
            include("../connexionDB.php");

            $sql = "SELECT * FROM produits ORDER BY id DESC";
            $results = $conn->query($sql);
        ?>

        <section>
            <a href="ajouterProduits.php"><button>Ajouter un produit</button></a>
            <div class="container2">
                <div class="box">
                    <div class="boxHeading">
                        <h3>Nos produits</h3>
                        <div class="filtre filtreMobile">
                            <select name="filtre" id="filtre">
                                <option value="all">Tout</option>
                                <option value="colliers">Nouveaux</option>
                                <option value="bracelets">Les plus vendus</option>
                            </select>
                        </div>
                    </div>
                    <div class="infos">
                        <table>
                            <thead>
                                <tr>
                                    <td>
                                        ..
                                    </td>
                                    <td>Nom</td>
                                    <td>Catégorie</td>
                                    <td>Quantité en stock</td>
                                    <td>Prix (FCFA)</td>
                                    <td>Actions</td>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                    if($results->num_rows > 0) {
                                        while($row = $results->fetch_assoc()) {
                                            $photorec = unserialize($row['photos']);
                                            echo"
                                                <tr>
                                                <td class='img'>
                                                <img src=".$photorec[0]." alt=''>
                                                </td>
                                                <td>".$row['nomProduit']."</td>
                                                <td>".$row['categorie']."</td>
                                                <td>".$row['quantite']."</td>
                                                <td>".$row['prix']."FCFA</td>
                                                <td><a href='detailsProduits.php?idProduit=".$row['id']."'><button>Détails</button></a></td>
                                            </tr>
                                            ";
                                        }
                                    }else {
                                        echo "<tr><td>Aucune donnée disponible</td></tr>";
                                    }
                                    $conn->close();
                                ?> 
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <script src="../assets/js/menuDashboard.js"></script>
</body>
</html>