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
        $conn = new mysqli('localhost', 'root', '', 'shinecraft');
        
        // Vérifier la connexion à la base de données
        if($conn->connect_error) {
            die("Erreur de connexion : " . $conn->connect_error);
        }
            
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
                                        <td><a href='deletePanierProduit.php?idProduit=".$row['id']."' class='delete'>X</a></td>
                                    </tr>";
                            }
                            echo "</table>
                            <div class='total'>
                                    <p> Total hors taxe <br> TVA  <br> Total à payer </p>
                                    <p>:<span> ".$apayer." FCFA</span> <br> :<span> ".$tva * $apayer." FCFA</span> <br> :<span> ".$apayer + $tva * $apayer." FCFA</span> </p>
                            </div>
                            
                            <div class='btnCommande'>
                                <a href=''><button>Passez votre commande</button></a>
                            </div>
                            ";
                            
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
</body>
</html>