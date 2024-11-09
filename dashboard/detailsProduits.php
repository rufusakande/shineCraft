<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ShineCraft</title>
    <meta name="description" content="ShineCraft célèbre chaque moment précieux de votre vie avec des bijoux élégants et exquis, conçu pour illuminer vos instants les plus mémorables.">
    <link rel="stylesheet" href="../assets/css/accueil.css">
    <link rel="stylesheet" href="../assets/css/responsiveDashboard.css">
    <link rel="stylesheet" href="../assets/css/detailsProduits.css">
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
            $conn = new mysqli('localhost', 'root', '', 'shinecraft');

            if ($conn->connect_error){
                die("Erreur de connexion : ". $conn->connect_error);
            }
        ?>

        <!-- La section details produits -->
        <section class="details">
                <?php
                if (isset($_GET['idProduit'])) {
                    $idProduit = intval($_GET['idProduit']);
                    $sql1 = "SELECT * FROM produits WHERE id = $idProduit";
                    $results1 = $conn->query($sql1);
                    if ($results1->num_rows > 0) {
                        while ($row1 = $results1->fetch_assoc()){
                            $photosrec = unserialize($row1['photos']);
                            echo"
                                    <div class='boxLeft'>
                                        <div class='img'>
                                            <img src='".$photosrec[0]."' alt=".$row1['nomProduit'].">
                                            <div class='rowImg'>
                                                <img src='' alt=''>
                                            </div>
                                        </div>
                                        <div class='infos'>
                                            <h3>".$row1['nomProduit']."</h3>
                                            <p class='icones'>
                                                <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='currentColor' class='bi bi-star-fill' viewBox='0 0 16 16'>
                                                    <path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'/>
                                                </svg>
                                                <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='currentColor' class='bi bi-star-fill' viewBox='0 0 16 16'>
                                                    <path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'/>
                                                </svg>
                                                <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='currentColor' class='bi bi-star-fill' viewBox='0 0 16 16'>
                                                    <path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'/>
                                                </svg>
                                                <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='currentColor' class='bi bi-star-fill' viewBox='0 0 16 16'>
                                                    <path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'/>
                                                </svg>
                                                <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='currentColor' class='bi bi-star-fill' viewBox='0 0 16 16'>
                                                    <path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'/>
                                                </svg>
                                            </p>
                                            <div class='btnQuantite'>
                                                <span class='quantiteValue' id='quantiteValue'>".$row1['quantite']."</span>
                                            </div>
                                            <p class='prix'>".$row1['prix']."<span>FCFA</span></p>

                                            <ul>
                                                <li>Description et caractéristiques du produit</li>
                                            </ul>
                                            <p class='contenu'>Description et caractéristiques du produit</p>

                                            <a href='modifierProduits.php?idProduit=".$idProduit."'><button>Modifier</button></a>
                                            <button id='supprimer'>Supprimer</button>

                                            <div id='modal'>
                                                <p class='titre'>Voullez vous vraiment supprimer : </p>
                                                <p>".$row1['nomProduit']."</p>
                                                <span>
                                                    <button class='btn non'>Non</button>
                                                    <a href='supprimerProduit.php?idProduit=".$idProduit."'><button class='btn oui'>Oui</button></a>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                            ";
                        }
                    }else{
                        echo"Aucun produits disponible";
                    }
                }
                ?>
        </section>
    </main>

    <script src="../assets/js/menuDashboard.js"></script>
    <script>
        const modal = document.getElementById("modal")
        const supprimer = document.getElementById("supprimer")
        const body = document.querySelector("body")

        supprimer.addEventListener("click", () =>{
            modal.style.top='30%'
            modal.style.transition='all 0.7s'
        })
    </script>
</body>
</html>