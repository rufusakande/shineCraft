<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ShineCraft</title>
    <meta name="description" content="ShineCraft célèbre chaque moment précieux de votre vie avec des bijoux élégants et exquis, conçu pour illuminer vos instants les plus mémorables.">
    <link rel="stylesheet" href="../assets/css/accueil.css">
    <link rel="stylesheet" href="../assets/css/responsiveDashboard.css">
    <link rel="stylesheet" href="../assets/css/ajouterProduits.css">
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
        <?php
        //connexion à la base de données
        include("../connexionDB.php");
        
        if (isset($_GET['idProduit'])) {
            $idProduit = intval($_GET['idProduit']);
            $sql1 = "SELECT * FROM produits WHERE id = $idProduit";
            $results1 = $conn->query($sql1);
            if ($results1->num_rows > 0) {
                while ($row1 = $results1->fetch_assoc()){
                    $photosrec = unserialize($row1['photos']);
        ?>
            <form action="#" method="post" enctype="multipart/form-data">
                <span>
                    <label class="label" for="nomProduit">Le nom du produit</label>
                    <input type="text" id="nomProduit" name="nomProduit" value="<?php echo $row1['nomProduit']; ?>" onfocus="on" minlength="2" required>
                </span>
                <span class="row">
                    <span class="col">
                        <label class="label" for="categorie">Catégorie</label>
                        <input type="text" id="categorie" name="categorie" value="<?php echo $row1['categorie']; ?>" minlength="2" required>
                    </span>
                    <span class="col">
                        <label class="label" for="prix">Le prix</label>
                        <input type="number" id="prix" name="prix" value="<?php echo $row1['prix']; ?>" minlength="2" required>
                    </span>
                    <span class="col">
                        <label class="label" for="quantite">La quantite</label>
                        <input type="number" id="quantite" name="quantite" value="<?php echo $row1['quantite']; ?>" required>
                    </span>
                    <span class="col">
                        <label class="label" for="status">Le status</label>
                        <input type="text" id="status" name="status" value="<?php echo $row1['statusProduit']; ?>" minlength="2" required>
                    </span>
                </span>
                <span>
                    <label class="label" for="description">La description</label>
                    <input type="text" id="description" name="description" value="<?php echo $row1['descriptionProduit']; ?>"  minlength="2" required>
                </span>
                <span>
                    <label class="label" for="photos">Images du produits</label>
                    <input type="file" id="photos" name="photos[]" value="<?php for($i=0; $i<=sizeof($photosrec); $i++){echo $photosrec[$i];} ?>" multiple>
                </span>

                <input type="submit" name="modifierProduits" value="Ajouter">
            </form>
            <?php
                        }
                    }
                }
                ?>
        </section>
    </main>

    <?php
        if (isset($_POST['modifierProduits'])) {

            //Récupération des données du formulaire
            $nomProduit = $_POST['nomProduit'];
            $categorie = $_POST['categorie'];
            $prix = $_POST['prix'];
            $quantite = $_POST['quantite'];
            $statusProduit = $_POST['status']?:Null;
            $descriptionProduit = $_POST['description'];
            
            //Gestion de l'upload des photos
            $photos = [];
            if(!empty($_FILES['photos']['name'][0])){
                foreach($_FILES['photos']['tmp_name'] as $key=>$tmp_name){
                    $photoName = basename($_FILES['photos']['name'][$key]);
                    $uploadDir = "uploads/"; //dossier pour sauvegarder les photos
                    $uploadFile = $uploadDir.$photoName;
                    
                    //Déplacer le fichier téléchargé vers le dossier
                    if(move_uploaded_file($tmp_name, $uploadFile)){
                        $photos[] = $uploadFile;
                    }
                }
            }

            $photosSerialized = serialize($photos); //Sérialisation pour stocker plusieurs photos
            
            // Mise à jour des produits existantes 
            $sql = "UPDATE produits SET nomProduit='$nomProduit', categorie='$categorie', prix='$prix', quantite='$quantite', statusProduit='$statusProduit', descriptionProduit='$descriptionProduit', photos='$photosSerialized'
                WHERE id=$idProduit";
            if ($conn->query($sql) === TRUE) {
                echo "<p style='color:green'>Produit mises à jour avec succès.</p>";
                header("Location : produits.php");
            } else {
                echo "Erreur: " . $sql . "<br>" . $conn->error;
            }
            $conn->close();
        }
    ?>


    <script src="../assets/js/menuDashboard.js"></script>
</body>
</html>