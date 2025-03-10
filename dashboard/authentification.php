<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ShineCraft</title>
    <meta name="description" content="ShineCraft célèbre chaque moment précieux de votre vie avec des bijoux élégants et exquis, conçu pour illuminer vos instants les plus mémorables.">
    <link rel="stylesheet" href="../assets/css/authentification.css">
</head>
<body>
    <section>
        <h1>ShineCraft Admin</h1>
        <div class="row">
            <div class="box1">
                <div class="content">
                    <h2>ShineCraft admin</h2>
                    <p>Découvrer les merveilles de votre site</p>
                </div>
            </div>
            <div class="box2">
                <h2>Connexion</h2>
                <form action="#" method="post">
                    <span>
                        <label class="label" for="email">Email</label>
                        <input type="email" id="mail" name="mail" placeholder="Votre adresse mail" onfocus="on" minlength="3" required>
                    </span>
                    <span>
                        <label class="label" for="passWord">Mot de passe</label>
                        <input type="password" id="passWord" name="passWord" placeholder="Votre mot de passe" minlength="6" required>
                    </span>
                    <span>
                        <input type="checkbox" name="terms" id="terms" required>
                        <label for="terms">Rester connecter</label>
                    </span>

                    <input type="submit" value="Se connecter">
                </form>
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

        //connexion à la base de données
        include("../connexionDB.php");

        // S'assurer que l'encodage est correct
        $conn->set_charset("utf8mb4");

        // Vérifier si le formulaire a été soumis
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $email = $_POST['mail'];
            $passWord = $_POST['passWord'];

            // Requête SQL pour vérifier si l'administrateur existe
            $sql = "SELECT * FROM administrateur WHERE email = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                // L'utilisateur existe, vérifier le mot de passe
                $row = $result->fetch_assoc();
                
                // Vérifier si le mot de passe haché correspond au mot de passe saisi
                if (password_verify($passWord, $row['passWordAdmin'])) {
                    // Connexion réussie, enregistrer les informations dans la session
                    $_SESSION['user_id'] = $row['id'];
                    $_SESSION['email'] = $row['email'];
                    
                    // Rediriger l'utilisateur vers la page protégée
                    header("Location: accueil.php");
                    exit();
                } else {
                    echo "Mot de passe incorrect.";
                }
            } else {
                echo "Email d'administrateur non trouvé.";
            }
            
            $stmt->close();
        }

        $conn->close();
    ?>
</body>
</html>