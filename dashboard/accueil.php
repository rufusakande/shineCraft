<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ShineCraft</title>
    <meta name="description" content="ShineCraft célèbre chaque moment précieux de votre vie avec des bijoux élégants et exquis, conçu pour illuminer vos instants les plus mémorables.">
    <link rel="stylesheet" href="../assets/css/accueil.css">
    <link rel="stylesheet" href="../assets/css/responsiveDashboard.css">
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
        ?>

        <section>
            <div class="container1">
                <div class="box">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-check" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
                    </svg>
                    <div class="texte">

                    <?php 

                            // 1️⃣ Récupérer le nombre total de commande
                            $sqlTotal = "SELECT COUNT(*) AS total_commande FROM commande WHERE status='Payé'";
                            $resultTotal = $conn->query($sqlTotal);
                            $rowTotal = $resultTotal->fetch_assoc();
                            $totalCommande = $rowTotal['total_commande'];

                            // 2️⃣ Récupérer le nombre de commande ajoutés cette semaine
                            $sqlNouveaux = "SELECT COUNT(*) AS nouvelle_commande 
                                            FROM commande 
                                            WHERE WEEK(date_commande) = WEEK(NOW()) 
                                            AND YEAR(date_commande) = YEAR(NOW())
                                            AND status='Payé'";
                            $resultNouveaux = $conn->query($sqlNouveaux);
                            $rowNouveaux = $resultNouveaux->fetch_assoc();
                            $nouveauxCommande = $rowNouveaux['nouvelle_commande'];

                            // 3️⃣ Calcul du pourcentage de nouveaux clients
                            $pourcentage = ($totalCommande > 0) ? round(($nouveauxCommande / $totalCommande) * 100, 2) : 0;

                            // 4️⃣ Affichage des résultats
                            echo "
                                <p>Commande en cours</p>
                                <h2>". $totalCommande ."</h2>
                                <p>Aujourd'hui  <span>+". number_format($pourcentage, 2) ."%</span></p>
                                ";
                        ?>
                    </div>
                </div>
                <div class="box">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-truck" viewBox="0 0 16 16">
                        <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
                    </svg>
                    <div class="texte">
                        <p>Produits à livrés</p>
                        <h2>24</h2>
                        <p>Aujourd'hui  <span>+45%</span></p>
                    </div>
                </div>
                <div class="box">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people" viewBox="0 0 16 16">
                        <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>
                    </svg>
                    <div class="texte">
                        <?php 
                            // Connexion à la base de données (assurez-vous que $conn est bien initialisé)

                            // 1️⃣ Récupérer le nombre total de clients
                            $sqlTotal = "SELECT COUNT(*) AS total_clients FROM clients";
                            $resultTotal = $conn->query($sqlTotal);
                            $rowTotal = $resultTotal->fetch_assoc();
                            $totalClients = $rowTotal['total_clients'];

                            // 2️⃣ Récupérer le nombre de clients ajoutés cette semaine
                            $sqlNouveaux = "SELECT COUNT(*) AS nouveaux_clients 
                                            FROM clients 
                                            WHERE WEEK(date_creation) = WEEK(NOW()) 
                                            AND YEAR(date_creation) = YEAR(NOW())";
                            $resultNouveaux = $conn->query($sqlNouveaux);
                            $rowNouveaux = $resultNouveaux->fetch_assoc();
                            $nouveauxClients = $rowNouveaux['nouveaux_clients'];

                            // 3️⃣ Calcul du pourcentage de nouveaux clients
                            $pourcentage = ($totalClients > 0) ? ($nouveauxClients / $totalClients) * 100 : 0;

                            // 4️⃣ Affichage des résultats
                            echo "
                                <p>Nos clients</p>
                                <h2>". $totalClients ."</h2>
                                <p>Nouveaux  <span>+". number_format($pourcentage, 2) ."%</span></p>
                                ";
                        ?>
                        
                    </div>
                </div>
                <div class="box">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-receipt-cutoff" viewBox="0 0 16 16">
                        <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5M11.5 4a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z"/>
                        <path d="M2.354.646a.5.5 0 0 0-.801.13l-.5 1A.5.5 0 0 0 1 2v13H.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1H15V2a.5.5 0 0 0-.053-.224l-.5-1a.5.5 0 0 0-.8-.13L13 1.293l-.646-.647a.5.5 0 0 0-.708 0L11 1.293l-.646-.647a.5.5 0 0 0-.708 0L9 1.293 8.354.646a.5.5 0 0 0-.708 0L7 1.293 6.354.646a.5.5 0 0 0-.708 0L5 1.293 4.354.646a.5.5 0 0 0-.708 0L3 1.293zm-.217 1.198.51.51a.5.5 0 0 0 .707 0L4 1.707l.646.647a.5.5 0 0 0 .708 0L6 1.707l.646.647a.5.5 0 0 0 .708 0L8 1.707l.646.647a.5.5 0 0 0 .708 0L10 1.707l.646.647a.5.5 0 0 0 .708 0L12 1.707l.646.647a.5.5 0 0 0 .708 0l.509-.51.137.274V15H2V2.118z"/>
                    </svg>
                    <div class="texte">
                    <?php 
                        // 1️⃣ Récupérer le nombre total de produits vendus
                        $sqlTotal = "SELECT SUM(qte_vendus) AS totalVente FROM produits";
                        $resultTotal = $conn->query($sqlTotal);
                        $rowTotal = $resultTotal->fetch_assoc();
                        $totalVente = $rowTotal['totalVente'] ?? 0; // Si NULL, on met 0

                        // 2️⃣ Récupérer le nombre de produits vendus aujourd'hui
                        $sqlAujourdHui = "SELECT SUM(qte_vendus) AS nouvelleVente 
                                        FROM produits 
                                        WHERE DATE(date_vendus) = CURDATE()";
                        $resultAujourdHui = $conn->query($sqlAujourdHui);
                        $rowAujourdHui = $resultAujourdHui->fetch_assoc();
                        $nouvelleVente = $rowAujourdHui['nouvelleVente'] ?? 0;

                        // 3️⃣ Calcul du pourcentage de ventes d'aujourd'hui
                        $pourcentage = ($totalVente > 0) ? round(($nouvelleVente / $totalVente) * 100, 2) : 0;

                        // 4️⃣ Affichage des résultats
                        echo "
                            <p>Ventes totales</p>
                            <h2>". number_format($totalVente, 0, '.', ' ') ."</h2>
                            <p>Aujourd'hui  <span>+". number_format($pourcentage, 2) ."%</span></p>
                        ";
                        ?>
                    </div>
                </div>
            </div>

            <div class="container2">
                <div class="box">
                    <div class="boxHeading">
                        <h3>Top ventes</h3>
                        <div class="filtre filtreMobile">
                            <select name="filtre" id="filtre-ventes">
                                <option value="all">Tout</option>
                                <option value="todays">Aujourd'hui</option>
                                <option value="week">Semaine</option>
                                <option value="month">Mois</option>
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
                                    <td>Quantité</td>
                                    <td>Total</td>
                                </tr>
                            </thead>
                            <tbody id="ventesTable">
                                <?php
                                    $sql = "SELECT * FROM produits ORDER BY qte_vendus DESC LIMIT 4";
                                    $results = $conn->query($sql);
                                    if($results->num_rows > 0) {
                                        while($row = $results->fetch_assoc()) {
                                            $photorec = unserialize($row['photos']);
                                                echo"
                                                    <tr>
                                                        <td class='img'>
                                                            <img src=".$photorec[0]." alt=''>
                                                        </td>
                                                        <td>".$row['nomProduit']."</td>
                                                        <td>".$row['qte_vendus']."</td>
                                                        <td>".$row['prix']."</td>
                                                    </tr>
                                                ";
                                        }
                                    }else {
                                        echo "<tr><td>Aucun produit disponible</td></tr>";
                                    }
                                ?>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="box">

                    <div class="boxHeading">
                        <h3>Clients</h3>
                        <div class="filtre filtreMobile">
                        <select name="filtre" id="filtre-client">
                            <option value="all">Tout</option>
                            <option value="todays">Aujourd'hui</option>
                            <option value="week">Semaine</option>
                            <option value="month">Mois</option>
                        </select>
                        </div>
                    </div>
                    <div class="infos">
                        <table>
                            <thead>
                                <tr>
                                    <td>**</td>
                                    <td>Nom</td>
                                    <td>Prénom</td>
                                    <td>Email</td>
                                </tr>
                            </thead>
                            <tbody id="clientTable">
                                <?php 
                                    $sql = "SELECT * FROM clients";
                                    $results = $conn->query($sql);
                                    if ($results->num_rows > 0) {
                                        while ($row = $results->fetch_assoc()) {
                                            echo "
                                                <tr>
                                                    <td class='img'>
                                                        <img src='../assets/images/apropos.webp' alt='photo du client'>
                                                    </td>
                                                    <td>".$row['nom']."</td>
                                                    <td>".$row['prenom']."</td>
                                                    <td>".$row['email']."</td>
                                                </tr>
                                            ";
                                        }
                                    } else {
                                        echo "<tr><td colspan='4'>Aucun client trouvé</td></tr>";
                                    }
                                ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <script src="../assets/js/menuDashboard.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", function () {
            const filtre = document.getElementById("filtre-client");
            const filtreVentes = document.getElementById("filtre-ventes");
            const tbody = document.querySelector("#clientTable");
            const tbodyVentes = document.querySelector("#ventesTable");

            filtre.addEventListener("change", function () {
                const valeurFiltre = this.value;

                fetch(`filtrer_clients.php?filtre=${valeurFiltre}`)
                    .then(response => response.text())
                    .then(data => {
                        tbody.innerHTML = data; // Injecte uniquement les lignes <tr>
                    })
                    .catch(error => console.error("Erreur:", error));
            });

            filtreVentes.addEventListener("change", function () {
                const valeurFiltre = this.value;

                fetch(`filtrer_ventes.php?filtre=${valeurFiltre}`)
                    .then(response => response.text())
                    .then(data => {
                        tbodyVentes.innerHTML = data; // Injecte uniquement les lignes <tr>
                    })
                    .catch(error => console.error("Erreur:", error));
            });
        });

    </script>
</body>
</html>