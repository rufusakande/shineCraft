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
            <form action="#" method="post" enctype="multipart/form-data">
                <span>
                    <label class="label" for="nomProduit">Le nom du produit</label>
                    <input type="text" id="nomProduit" name="nomProduit" placeholder="Le nom du produit" onfocus="on" minlength="2" required>
                </span>
                <span class="row">
                    <span class="col">
                        <label class="label" for="categorie">Catégorie</label>
                        <select id="categorie" name="categorie" id="options">
                            <option value="colliers">Colliers</option>
                            <option value="bracelets">Bracelets</option>
                            <option value="bagues">Bagues</option>
                        </select>
                    </span>
                    <span class="col">
                        <label class="label" for="prix">Le prix</label>
                        <input type="number" id="prix" name="prix" placeholder="Le prix" minlength="2" required>
                    </span>
                    <span class="col">
                        <label class="label" for="quantite">La quantite</label>
                        <input type="number" id="quantite" name="quantite" placeholder="La quantite" required>
                    </span>
                    <span class="col">
                        <label class="label" for="status">Le status</label>
                        <input type="text" id="status" name="status" placeholder="Le status" minlength="2" required>
                    </span>
                </span>
                <span>
                    <label class="label" for="description">La description</label>
                    <input type="text" id="description" name="description" placeholder="La description"  minlength="2" required>
                </span>
                <span>
                    <label class="label" for="photos">Images du produits</label>
                    <input type="file" id="photos" name="photos[]" multiple required>
                </span>

                <input type="submit" name="ajouterProduits" value="Ajouter">
            </form>
        </section>
    </main>

    <?php
        if (isset($_POST['ajouterProduits'])) {
            //connexion à la base de données
            include("../connexionDB.php");

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
            
            //Insertion dans la base de données 
            $sql = "INSERT INTO produits (nomProduit, categorie, prix, quantite, statusProduit, descriptionProduit, photos)
                VALUES(?,?,?,?,?,?,?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ssdisss", $nomProduit, $categorie, $prix, $quantite, $statusProduit, $descriptionProduit, $photosSerialized);

            if($stmt->execute()) {
                echo("Produits ajouté avec succès!");
            } else{
                echo("Erreur : ".$stmt->error);
            }

            $stmt->close();
            $conn->close();
        }
    ?>


    <script src="../assets/js/menuDashboard.js"></script>
</body>
</html>