<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ShineCraft</title>
    <meta name="description" content="ShineCraft célèbre chaque moment précieux de votre vie avec des bijoux élégants et exquis, conçu pour illuminer vos instants les plus mémorables.">
    <link rel="stylesheet" href="assets/css/styleGenerale.css">
    <link rel="stylesheet" href="assets/css/pannier.css">
    <link rel="stylesheet" href="assets/css/responsive.css">
</head>
<body>
    <?php 
        session_start();
        if (!isset($_SESSION['user_id'])) {
            header("Location: authentificationClients.php?src=pn"); // Rediriger vers la page de connexion si non connecté
            exit();
        }
        include("connexionDB.php");
            
        include("header.php");
    ?>

    <main>
        <!-- La section contact -->
        <section class="panier">
        <?php
        echo"<table>
                <tbody>";
                    if (isset($_SESSION['user_id'])) {
                        $idUtilisateur = $_SESSION['user_id'];
                    
                        // Récupérer les produits dans le panier
                        $sql = "SELECT p.id, p.nomProduit, p.prix, p.photos, pn.quantite 
                                FROM produits p 
                                INNER JOIN panier pn ON p.id = pn.idProduit 
                                WHERE pn.idUtilisateur = ? AND pn.commande = 0";
                        $stmt = $conn->prepare($sql);
                        $stmt->bind_param('i', $idUtilisateur);
                        $stmt->execute();
                        $result = $stmt->get_result();
                        if ($result->num_rows > 0) {
                            $tva = 0.18;
                            $apayer = 0;
                            while ($row = $result->fetch_assoc()) {
                                $photosrec = unserialize($row['photos']);
                                $total = $row['prix'] * $row['quantite'];
                                $apayer += $total;

                                echo "<tr>
                                        <td><img src='dashboard/".$photosrec[0]."' alt=''></td>
                                        <td>{$row['nomProduit']}</td>
                                        <td>{$row['quantite']}</td>
                                        <td>$total</td>
                                        <td class='delete' id=".$row['id'].">
                                            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' class='bi bi-x-circle-fill' viewBox='0 0 16 16'>
                                                <path d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z'/>
                                            </svg>
                                        </td>
                                    </tr>
                                    ";
                                    
                            }
                            echo "</table>
                            <div class='total'>
                                    <p> Total hors taxe <br> TVA  <br> Total à payer </p>
                                    <p>:<span> ".$apayer." FCFA</span> <br> :<span> ".$tva * $apayer." FCFA</span> <br> :<span> ".$apayer + $tva * $apayer." FCFA</span> </p>
                            </div>
                            <div class='btnCommande kkiapay-button'>
                                <a href='commande.php'><button>Passez votre commande</button></a>
                            </div>
                            
                                        <div class='modalDelete'>
                                            <h3>Voulez vous retirer cet produit du panier?</h3>
                                            <div class='btn'>
                                                <button class='non'>Non</button>
                                                <button class='oui'>Oui</button>
                                            </div>
                                        </div>";
                            
                        } else {
                            echo "Votre panier est vide.";
                        }
                    } else {
                        echo "Veuillez vous connecter pour voir votre panier.";
                    }
                    
                echo"</tbody>
            </table>
            ";

            $conn->close();
            ?>
            
        </section>
                
        <!-- Footer -->
        <?php 
            include("footer.php")
        ?>
    </main>

    <script src="assets/js/main.js"></script>
    <script>
        /**
        *Ce code permet d'afficher le modal de supression lorsqu'on clique sur supprimer un produit du pannier. 
        @deleteProduit nous permet de savoir sur quel produits l'utilisateur a cliqué et on récupère l'id de se produit 
        *et on en fait un url dynamique pour retirer le produit du panier lorsque l'utilisateur clique sur oui dans le modal 
        */
        const deleteProduit = document.querySelectorAll('.delete')
        const modalDelete = document.querySelector('.modalDelete')
        const non = document.querySelector('.non')
        const oui = document.querySelector('.oui')

        function redirection (id) {
            oui.addEventListener('click', () =>{
                window.location.href = "deletePanierProduit.php?idProduit=" + id
                modalDelete.style.display = 'none'
            })
        }

        deleteProduit.forEach(produit =>{
            produit.addEventListener('click', () =>{
                modalDelete.style.display = 'block'
                produit.getAttribute("id")
                redirection(produit.getAttribute("id"))

            })
        })

        non.addEventListener('click', () =>{
                modalDelete.style.display = 'none'
            })
    </script>
</body>
</html>