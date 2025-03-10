    <?php

                    //connexion à la base de données
                    include("../connexionDB.php");
                    if (isset($_GET['idProduit'])) {
                        $idProduit = intval($_GET['idProduit']);
                        $sql1 = "DELETE FROM produits WHERE id = $idProduit";
                        $results1 = $conn->query($sql1);
                        if( $conn->query($sql1) === true){
                            header("location:produits.php");
                        }
                    }

                    ?>