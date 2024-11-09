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
            include("nav.php")
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
                        <p>commande en cours</p>
                        <h2>15</h2>
                        <p>Aujourd'hui  <span>+12%</span></p>
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
                        <p>Nos clients</p>
                        <h2>61</h2>
                        <p>Nouveaux  <span>+09%</span></p>
                    </div>
                </div>
                <div class="box">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-receipt-cutoff" viewBox="0 0 16 16">
                        <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5M11.5 4a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z"/>
                        <path d="M2.354.646a.5.5 0 0 0-.801.13l-.5 1A.5.5 0 0 0 1 2v13H.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1H15V2a.5.5 0 0 0-.053-.224l-.5-1a.5.5 0 0 0-.8-.13L13 1.293l-.646-.647a.5.5 0 0 0-.708 0L11 1.293l-.646-.647a.5.5 0 0 0-.708 0L9 1.293 8.354.646a.5.5 0 0 0-.708 0L7 1.293 6.354.646a.5.5 0 0 0-.708 0L5 1.293 4.354.646a.5.5 0 0 0-.708 0L3 1.293zm-.217 1.198.51.51a.5.5 0 0 0 .707 0L4 1.707l.646.647a.5.5 0 0 0 .708 0L6 1.707l.646.647a.5.5 0 0 0 .708 0L8 1.707l.646.647a.5.5 0 0 0 .708 0L10 1.707l.646.647a.5.5 0 0 0 .708 0L12 1.707l.646.647a.5.5 0 0 0 .708 0l.509-.51.137.274V15H2V2.118z"/>
                    </svg>
                    <div class="texte">
                        <p>Ventes totale</p>
                        <h2>34</h2>
                        <p>Aujourd'hui  <span>+17%</span></p>
                    </div>
                </div>
            </div>

            <div class="container2">
                <div class="box">
                    <div class="boxHeading">
                        <h3>Top ventes</h3>
                        <div class="filtre filtreMobile">
                            <select name="filtre" id="filtre">
                                <option value="all">Tout</option>
                                <option value="colliers">Aujourd'hui</option>
                                <option value="bracelets">Semaine</option>
                                <option value="bagues">Mois</option>
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
                            <tbody>
                                <tr>
                                    <td class="img">
                                        <img src="../assets/images/produits1.webp" alt="">
                                    </td>
                                    <td>Perle de minuit</td>
                                    <td>5</td>
                                    <td>180000FCFA</td>
                                </tr>
                                <tr>
                                    <td class="img">
                                        <img src="../assets/images/produits2.webp" alt="">
                                    </td>
                                    <td>Mystique de lune</td>
                                    <td>9</td>
                                    <td>800000FCFA</td>
                                </tr>
                                <tr>
                                    <td class="img">
                                        <img src="../assets/images/produits3.webp" alt="">
                                    </td>
                                    <td>Soleil d'or</td>
                                    <td>3</td>
                                    <td>300000FCFA</td>
                                </tr>
                                <tr>
                                    <td class="img">
                                        <img src="../assets/images/produits4.webp" alt="">
                                    </td>
                                    <td>Collier des E</td>
                                    <td>7</td>
                                    <td>560000FCFA</td>
                                </tr>
                                <tr>
                                    <td class="img">
                                        <img src="../assets/images/produits5.webp" alt="">
                                    </td>
                                    <td>Papillon</td>
                                    <td>5</td>
                                    <td>300000FCFA</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="box">
                    <div class="boxHeading">
                        <h3>Clients</h3>
                        <div class="filtre filtreMobile">
                            <select name="filtre">
                                <option value="all">Tout</option>
                                <option value="colliers">Aujourd'hui</option>
                                <option value="bracelets">Semaine</option>
                                <option value="bagues">Mois</option>
                            </select>
                        </div>
                    </div>
                    <div class="infos">
                        <table>
                            <thead>
                                <tr>
                                    <td>**</td>
                                    <td>Nom</td>
                                    <td>Pays</td>
                                    <td>Session</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="img">
                                        <img src="../assets/images/bg5.webp" alt="">
                                    </td>
                                    <td>Alban Jaurès</td>
                                    <td>Mali</td>
                                    <td>9%</td>
                                </tr>
                                <tr>
                                    <td class="img">
                                        <img src="../assets/images/bg5.webp" alt="">
                                    </td>
                                    <td>Jean01</td>
                                    <td>Bénin</td>
                                    <td>12%</td>
                                </tr>
                                <tr>
                                    <td class="img">
                                        <img src="../assets/images/bg5.webp" alt="">
                                    </td>
                                    <td>AnneP8</td>
                                    <td>Bénin</td>
                                    <td>7%</td>
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