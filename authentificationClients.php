<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ShineCraft</title>
    <meta name="description" content="ShineCraft célèbre chaque moment précieux de votre vie avec des bijoux élégants et exquis, conçu pour illuminer vos instants les plus mémorables.">
    <link rel="stylesheet" href="assets/css/authentification.css">
</head>
<body>
    <section>
        <h1>ShineCraft</h1>
        <div class="row">
            <div class="box1">
                <div class="content">
                    <h2>ShineCraft</h2>
                    <p>Laissez ShineCraft illuminer vos moments les plus précieux.</p>
                </div>
            </div>
            <div class="box2">
                <?php
                    if (isset($_GET['idProduit']) && isset($_GET['quantite'])) {
                        echo "<h2 style='text-align:center; margin-top:-53px'>Vous devriez vous connecter à votre compte afin de pouvoir ajouter les produits dans le panier</h2>";
                    } else{
                        echo "<h2>Connexion</h2>";

                    }
                ?>
                <form action="#" method="post">
                    <span>
                        <label class="label" for="email">Email</label>
                        <input type="email" id="mail" name="mail" placeholder="Votre adresse mail" onfocus="on" minlength="3" required>
                    </span>
                    <span>
                        <label class="label" for="passWord">Mot de passe</label>
                        <input type="password" id="passWord" name="passWord" placeholder="Votre mot de passe" minlength="6" required>
                    </span>
                    <a class="passWordOublier" href="#"> Mot de passe oublié?</a>
                    <span>
                        <input type="checkbox" name="terms" id="terms">
                        <label for="terms">Rester connecter</label>
                    </span>

                    <input type="submit" value="Se connecter">
                </form>
                <?php
                    if (isset($_GET['idProduit']) && isset($_GET['quantite'])) {
                        $idProduit = intval($_GET['idProduit']);
                        $quantite = intval($_GET['quantite']);
                        echo "<p>Vous n'avez pas de compte? <a href='inscriptionClients.php?idProduit=".$idProduit."&quantite=".$quantite."'>Inscrivez-vous</a></p>";
                    } else if (isset($_GET['src']) ) {
                        $src = $_GET['src'];
                        echo "<p>Vous n'avez pas de compte? <a href='inscriptionClients.php?src=".$src."'>Inscrivez-vous</a></p>";
                    } else {
                        echo "<p>Vous n'avez pas de compte? <a href='inscriptionClients.php'>Inscrivez-vous</a></p>";

                    }
                ?>
            </div>
        </div>
    </section>

    <?php
        // Démarrer une session
        session_start();

        // Connexion à la base de données
        $servername = "localhost"; // Remplacez par votre serveur
        $username = "root"; // Remplacez par votre nom d'utilisateur MySQL
        $password = ""; // Remplacez par votre mot de passe MySQL
        $dbname = "shinecraft"; // Remplacez par le nom de votre base de données

        include("connexionDB.php");

        // S'assurer que l'encodage est correct
        $conn->set_charset("utf8mb4");

        // Vérifier si le formulaire a été soumis
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $email = $_POST['mail'];
            $passWord = $_POST['passWord'];

            // Requête SQL pour vérifier si l'administrateur existe
            $sql = "SELECT * FROM clients WHERE email = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                // L'utilisateur existe, vérifier le mot de passe
                $row = $result->fetch_assoc();
                
                // Vérifier si le mot de passe haché correspond au mot de passe saisi
                if (password_verify($passWord, $row['passWordClient'])) {
                    // Connexion réussie, enregistrer les informations dans la session
                    $_SESSION['user_id'] = $row['id'];
                    $_SESSION['email'] = $row['email'];

                    if (isset($_GET['idProduit']) && isset($_GET['quantite'])) {
                        $idProduit = intval($_GET['idProduit']);
                        $quantite = intval($_GET['quantite']);
                        header("Location: ajouterPanier.php?idProduit=".$idProduit."&quantite=".$quantite."");
                        exit();
                    } else if (isset($_GET['src']) ) {
                        header("Location: panier.php");
                        exit();
                    } else {
                        // Rediriger l'utilisateur vers la page protégée
                        header("Location: profilClients.php");
                        exit();
                    }
                } else {
                    echo "Mot de passe incorrect.";
                }
            } else {
                echo "Aucun compte n'est associé à cette adresse mail. Veillez créer votre compte.";
            }
            
            $stmt->close();
        }

        $conn->close();
    ?>
</body>
</html>