<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ShineCraft</title>
    <meta name="description" content="ShineCraft célèbre chaque moment précieux de votre vie avec des bijoux élégants et exquis, conçu pour illuminer vos instants les plus mémorables.">
    <link rel="stylesheet" href="assets/css/styleGenerale.css">
    <link rel="stylesheet" href="assets/css/catalogue.css">
    <link rel="stylesheet" href="assets/css/responsive.css">
</head>
<body>
    <?php 
        include("header.php");
        include("connexionDB.php")
    ?>

    <main>
        <!-- La section tendances -->
        <section class="tendances">
            <h3>Les tendances actuelles</h3>
            <div class="row">
                <div class="box" id="tendance1">
                    
                    <em>Sponsorisé</em>
                </div>
            </div>
        </section>

        <!-- La section rowGrid1 -->
        <section class="rowGrid1">
            <div class="box">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-truck" viewBox="0 0 16 16">
                    <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
                </svg>
                <div>
                    <h2>Livraison rapide</h2>
                    <p>Livraison rapide et sécurisée à votre porte.</p>
                </div>
            </div>
            <div class="box">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-credit-card" viewBox="0 0 16 16">
                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
                    <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
                </svg>
                <div>
                    <h2>Paiements sécurisés</h2>
                    <p>Paiement 100% sécurisés pour une tranquillité d'esprit.</p>
                </div>
            </div>
            <div class="box">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-headset" viewBox="0 0 16 16">
                    <path d="M8 1a5 5 0 0 0-5 5v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a6 6 0 1 1 12 0v6a2.5 2.5 0 0 1-2.5 2.5H9.366a1 1 0 0 1-.866.5h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 .866.5H11.5A1.5 1.5 0 0 0 13 12h-1a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1V6a5 5 0 0 0-5-5"/>
                </svg>
                <div>
                    <h2>Assistance 24/7</h2>
                    <p>Une assistance dédiée à chaque étape de votre achat.</p>
                </div>
            </div>
            <div class="box">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-award" viewBox="0 0 16 16">
                    <path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702z"/>
                    <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1z"/>
                </svg>
                <div>
                    <h2>Qualité produits</h2>
                    <p>Dés produits de qualité, soigneusement sélectionnés pour vous.</p>
                </div>
            </div>
        </section>

        <!-- La section rowGrid2 -->
        <section class="rowGrid2">
            <div class="box box1">
                <div>
                    <h2>Colliers élégants</h2>
                    <p>Sublimez votre style</p>
                    <p class="texte">15% de réduction</p>
                </div>
            </div>
            <div class="box box2">
                <div>
                    <h2>Bagues scintillantes</h2>
                    <p>Faites briller vos mains</p>
                    <p class="texte">Offre promo du jour</p>
                </div>
            </div>
            <div class="box box3">
                <div>
                    <h2>Montres sophistiquées</h2>
                    <p>Alliez style et précision</p>
                    <p class="texte">Livraison offerte</p>
                </div>
            </div>
        </section>        

        <!-- La section produits -->
        <section class="produits">
            <h2>Nos collections phares</h2>
            <p>
                Des créations artisanales, réalisées avec passion pour chaque moment de votre vie.
            </p>

            <div class="row">
                <?php
                    $sql1 = "SELECT * FROM produits ORDER BY id DESC LIMIT 3";
                    $results1 = $conn->query($sql1);
                    if ($results1->num_rows > 0) {
                        while ($row1 = $results1->fetch_assoc()){
                                $photosrec = unserialize($row1['photos']);
                                echo"
                                <a href='detailsProduits.php?idProduit=".$row1['id']."'>
                                    <div class='box'>
                                        <div class='image' style='background-image: url(dashboard/".$photosrec[0].");'>
                                            <div><em>".$row1['prix']."</em><span> FCFA</span></div>
                                        </div>
                                        <p class='info'>".$row1['nomProduit']."</p>
                                        <p class='icones'>
                                            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-star-fill' viewBox='0 0 16 16'>
                                                <path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'/>
                                            </svg>
                                            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-star-fill' viewBox='0 0 16 16'>
                                                <path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'/>
                                            </svg>
                                            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-star-fill' viewBox='0 0 16 16'>
                                                <path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'/>
                                            </svg>
                                            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-star-fill' viewBox='0 0 16 16'>
                                                <path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'/>
                                            </svg>
                                            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-star-fill' viewBox='0 0 16 16'>
                                                <path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'/>
                                            </svg>
                                        </p>
                                    </div>
                                </a>
                                ";
                            
                        }
                    } else{
                        echo"Aucun produits disponible";
                    }
                ?>
            </div>
            
        </section>

        <!-- La section rowGrid3 -->
        <section class="rowGrid3">
            <div class="box box1">
                <div class="content">
                    <p>Dernières collections</p>
                    <h2>Boucles d'oreilles</h2>
                    <p class="texte">15% de reduction</p>
                </div>
            </div>
            <div class="box box2">
                <div class="content">
                    <p>Les plus vendus</p>
                    <h2>Accessoires pour mariage</h2>
                    <p class="texte">Livraison gratuite pour toute commande</p>
                </div>
            </div>
        </section>

        <!-- La section top vendus -->
        <section class="topVendus">
            <div class="heading">
                <h2>Les plus vendus</h2>
                <ul class="filtre">
                    <li class="active allFilter">Tout</li>
                    <li class="colliersFilter">Colliers</li>
                    <li class="braceletsFilter">Bracelets</li>
                    <li class="baguesFilter">Bagues</li>
                </ul>

                <div class="filtre filtreMobile">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-funnel-fill" viewBox="0 0 16 16">
                        <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z"/>
                    </svg>
                    <select name="filtre" id="filtre">
                        <option value="allFilter">Tout</option>
                        <option value="colliersFilter">Colliers</option>
                        <option value="braceletsFilter">Bracelets</option>
                        <option value="baguesFilter">Bagues</option>
                    </select>
                </div>
            </div>
                <!-- Cette section affiche les produits en fonction des catégorie sélectionnées par l'utilisateur -->
            <?php
                include("produitsFIlter.php")
            ?>
        </section>

        <!-- La section nouveautés -->
        <section class="nouveautes">
            <div class="heading">
                <h2>Nouveautés</h2>
                <a href="#"><button>
                    Voir plus
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                    </svg>
                    </button></a>
            </div>
            <div class="row">
                <?php
                    $sql1 = "SELECT * FROM produits ORDER BY id DESC LIMIT 1";
                    $results1 = $conn->query($sql1);
                    if ($results1->num_rows > 0) {
                        while ($row1 = $results1->fetch_assoc()){
                            $photosrec = unserialize($row1['photos']);
                            echo"
                                
                                    <div class='boxLeft'>
                                        <a class='aLeft' href='detailsProduits.php?idProduit=".$row1['id']."'>
                                            <img src='dashboard/".$photosrec[0]."' alt=".$row1['nomProduit'].">
                                        </a>
                                        
                                            <div class='infos'>
                                            <a class='aLeft' href='detailsProduits.php?idProduit=".$row1['id']."'>
                                                <h3>".$row1['nomProduit']."</h3>
                                                <p class='icones'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-star-fill' viewBox='0 0 16 16'>
                                                        <path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'/>
                                                    </svg>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-star-fill' viewBox='0 0 16 16'>
                                                        <path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'/>
                                                    </svg>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-star-fill' viewBox='0 0 16 16'>
                                                        <path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'/>
                                                    </svg>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-star-fill' viewBox='0 0 16 16'>
                                                        <path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'/>
                                                    </svg>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-star-fill' viewBox='0 0 16 16'>
                                                        <path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'/>
                                                    </svg>
                                                </p>
                                                <p class='prix'>".$row1['prix']."<span>FCFA</span></p>
                                                <ul>
                                                    <li>Infos du fabricant</li>
                                                    <li>Les caractéristique du produits</li>
                                                    <li>Fabriqué en France en 2023</li>
                                                </ul>
                                                <div class='btnDiv'>
                                                    <a href='detailsProduits.php?idProduit=".$row1['id']."'><button>Ajouter au panier</button></a>
                                                </div>
                                                </a>
                                            </div>
                                        
                                    </div>
                                
                            ";
                        }
                    }else{
                        echo"Aucun produits disponible";
                    }
                ?>
                
                <div class="boxRight">
                    <?php
                        $sql1 = "SELECT * FROM produits ORDER BY id DESC LIMIT 4";
                        $results1 = $conn->query($sql1);
                        if ($results1->num_rows > 0) {
                            while ($row1 = $results1->fetch_assoc()){
                                    $photosrec = unserialize($row1['photos']);
                                    echo"
                                    <a href='detailsProduits.php?idProduit=".$row1['id']."'>
                                        <div class='box'>
                                            <img src='dashboard/".$photosrec[0]."' alt=".$row1['nomProduit'].">
                                            <div class='infos'>
                                                <h3>".$row1['nomProduit']."</h3>
                                                <p class='icones'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-star-fill' viewBox='0 0 16 16'>
                                                        <path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'/>
                                                    </svg>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-star-fill' viewBox='0 0 16 16'>
                                                        <path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'/>
                                                    </svg>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-star-fill' viewBox='0 0 16 16'>
                                                        <path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'/>
                                                    </svg>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-star-fill' viewBox='0 0 16 16'>
                                                        <path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'/>
                                                    </svg>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-star-fill' viewBox='0 0 16 16'>
                                                        <path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'/>
                                                    </svg>
                                                </p>
                                                <p class='prix'>".$row1['prix']."<span>FCFA</span></p>
                                            </div>
                                        </div>
                                    </a>
                                    ";
                            }
                        }else{
                            echo"Aucun produits disponible";
                        }
                    ?>
                </div>
                
                
            </div>
        </section>

        <!-- Footer -->
        <?php 
            include("footer.php")
        ?>

        <!-- Back to top -->
        <a class="backToTop" href="#">
            <span>back to top</span>
            
        </a>
    </main>

    <script src="assets/js/main.js"></script>
    <script src="assets/js/animation.js"></script>
    <script src="assets/js/filter.js"></script>
</body>
</html>