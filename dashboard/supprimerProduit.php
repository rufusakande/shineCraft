    <?php

                    //connexion à la base de données
                    $conn = new mysqli('localhost', 'root', '', 'shinecraft');

                    if ($conn->connect_error){
                        die("Erreur de connexion : ". $conn->connect_error);
                    }
                    if (isset($_GET['idProduit'])) {
                        $idProduit = intval($_GET['idProduit']);
                        $sql1 = "DELETE FROM produits WHERE id = $idProduit";
                        $results1 = $conn->query($sql1);
                        if( $conn->query($sql1) === true){
                            header("location:produits.php");
                        }
                    }

                    ?>