<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ShineCraft</title>
    <meta name="description" content="ShineCraft célèbre chaque moment précieux de votre vie avec des bijoux élégants et exquis, conçu pour illuminer vos instants les plus mémorables.">
    <link rel="stylesheet" href="assets/css/styleGenerale.css">
    <link rel="stylesheet" href="assets/css/detailsProduits.css">
    <link rel="stylesheet" href="assets/css/responsive.css">
</head>
<body>
    <?php 
        include("header.php");
        //connexion à la base de données
        include("connexionDB.php");
    ?>

    <main>
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
                                            <img src='dashboard/".$photosrec[0]."' alt=".$row1['nomProduit'].">
                                            <div class='rowImg'>
                                                <img src='dashboard/".$photosrec[0]."' alt=''>
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
                                                <button class='moins' id='moins' >-</button>
                                                <span class='quantiteValue' id='quantiteValue'>1</span>
                                                <button class='plus' id='plus'>+</button>

                                            </div>
                                            <input type='hidden' name='prix' id='prixInput' value='".$row1['prix']."'>
                                            <p class='prix' id='prix'><span>FCFA</span></p>
                                            
                                            <form method='post' action='ajouterPanier.php'>
                                                <input type='hidden' name='idProduit' value='".$row1['id']."'>
                                                <input type='hidden' name='quantite' id='quantite' >
                                                <button type='submit'>Ajouter au panier</button>
                                            </form>
                                            <ul>
                                                <li>Description et caractéristiques du produit</li>
                                            </ul>
                                            <p class='contenu'>".$row1['descriptionProduit']."</p>

                                            

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
        
        <!-- La section top vendus -->
        <section class="topVendus">
            <div class="heading">
                <h2>Des produits similaires</h2>
                
            </div>
            <div class="row">
                <?php
                    $sql1 = "SELECT * FROM produits ORDER BY id DESC LIMIT 6";
                    $results1 = $conn->query($sql1);
                    if ($results1->num_rows > 0) {
                        while ($row1 = $results1->fetch_assoc()){
                                $photosrec = unserialize($row1['photos']);
                                echo"<a class='aLeft' href='detailsProduits.php?idProduit=".$row1['id']."'>
                                    <div class='produit'>
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
    <script>
        let quantiteValue = document.getElementById("quantiteValue").innerHTML
        let prix = document.getElementById("prix")
        let prixInput = document.getElementById("prixInput").value
        let moins = document.getElementById("moins")
        let plus = document.getElementById("plus")

        quantiteValue = 1
        document.getElementById("quantite").value= quantiteValue
        prix.innerHTML = prixInput * document.getElementById("quantiteValue").innerHTML + " FCFA"

        function increment () {
            document.getElementById("quantiteValue").innerHTML = quantiteValue++
            document.getElementById("quantite").value=document.getElementById("quantiteValue").innerHTML
            prix.innerHTML = prixInput * document.getElementById("quantiteValue").innerHTML + " FCFA"
        }

        function decrement () {
            if (quantiteValue > 1) {
                document.getElementById("quantiteValue").innerHTML = quantiteValue--
                document.getElementById("quantite").value=document.getElementById("quantiteValue").innerHTML
                prix.innerHTML = prixInput * document.getElementById("quantiteValue").innerHTML + " FCFA"
            } else {
                document.getElementById("quantiteValue").innerHTML = 1
                document.getElementById("quantite").value=document.getElementById("quantiteValue").innerHTML
                prix.innerHTML = prixInput * document.getElementById("quantiteValue").innerHTML + " FCFA"
            }
        }

        plus.addEventListener('click', (e) =>{
            e.preventDefault()
            increment()
        })
        
        moins.addEventListener('click', (e) =>{
            e.preventDefault()
            decrement()
        })

    </script>
</body>
</html>