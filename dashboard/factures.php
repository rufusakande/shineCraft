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
            include("nav.php")
        ?>

        <section>
            <div class="container2">
                <div class="box">
                    <div class="boxHeading">
                        <h3>Factures</h3>
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
                                    <td>Produits</td>
                                    <td>Nom client</td>
                                    <td>Quantité en stock</td>
                                    <td>Prix (FCFA)</td>
                                    <td>Status</td>
                                    <td>Actions</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="img">
                                        <img src="../assets/images/produits1.webp" alt="">
                                    </td>
                                    <td>Perle de minuit</td>
                                    <td>Alban</td>
                                    <td>5</td>
                                    <td>180000FCFA</td>
                                    <td>Etablie</td>
                                    <td><a href="#"><button>Détails</button></a></td>
                                </tr>
                                <tr>
                                    <td class="img">
                                        <img src="../assets/images/produits2.webp" alt="">
                                    </td>
                                    <td>Mystique de lune</td>
                                    <td>Jeanne</td>
                                    <td>9</td>
                                    <td>800000FCFA</td>
                                    <td>Etablie</td>
                                    <td><a href="#"><button>Détails</button></a></td>
                                </tr>
                                <tr>
                                    <td class="img">
                                        <img src="../assets/images/produits3.webp" alt="">
                                    </td>
                                    <td>Soleil d'or</td>
                                    <td>Jean</td>
                                    <td>3</td>
                                    <td>300000FCFA</td>
                                    <td>Etablie</td>
                                    <td><a href="#"><button>Détails</button></a></td>
                                </tr>
                                <tr>
                                    <td class="img">
                                        <img src="../assets/images/produits4.webp" alt="">
                                    </td>
                                    <td>Collier des E</td>
                                    <td>Doe</td>
                                    <td>7</td>
                                    <td>560000FCFA</td>
                                    <td>Etablie</td>
                                    <td><a href="#"><button>Détails</button></a></td>
                                </tr>
                                <tr>
                                    <td class="img">
                                        <img src="../assets/images/produits5.webp" alt="">
                                    </td>
                                    <td>Papillon</td>
                                    <td>Alex</td>
                                    <td>5</td>
                                    <td>300000FCFA</td>
                                    <td>Etablie</td>
                                    <td><a href="#"><button>Détails</button></a></td>
                                </tr>
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