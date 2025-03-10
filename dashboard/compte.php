<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ShineCraft</title>
    <meta name="description" content="ShineCraft célèbre chaque moment précieux de votre vie avec des bijoux élégants et exquis, conçu pour illuminer vos instants les plus mémorables.">
    <link rel="stylesheet" href="../assets/css/authentification.css">
    <link rel="stylesheet" href="../assets/css/compte.css">
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
                <h2>Créer un compte admin</h2>
                <form action="#" method="post">
                    <span>
                        <label class="label" for="nom">Nom</label>
                        <input type="text" id="nom" name="nom" placeholder="Votre nom" onfocus="on" minlength="2" required>
                    </span>
                    <span>
                        <label class="label" for="prenom">Prénom</label>
                        <input type="text" id="prenom" name="prenom" placeholder="Votre prénom"  minlength="2" required>
                    </span>
                    <span>
                        <label class="label" for="email">Email</label>
                        <input type="email" id="mail" name="mail" placeholder="Votre adresse mail"  minlength="3" required>
                    </span>
                    <span>
                        <label class="label" for="passWord">Mot de passe</label>
                        <input type="password" id="passWord" name="passWord" placeholder="Votre mot de passe" minlength="6" required>
                    </span>
                    <span>
                        <input type="checkbox" name="terms" id="terms" required>
                        <label for="terms">Acceptez les terms et conditions</label>
                    </span>

                    <input type="submit" value="Créer un compte">
                </form>
            </div>
        </div>
    </section>

    <?php
        // Connexion à la base de données
        $servername = "localhost"; // Remplacez par votre serveur
        $usernameDB = "root"; // Remplacez par votre nom d'utilisateur MySQL
        $passwordDB = ""; // Remplacez par votre mot de passe MySQL
        $dbname = "shinecraft"; // Remplacez par le nom de votre base de données

        //connexion à la base de données
        include("../connexionDB.php");

        // S'assurer que l'encodage est correct
        $conn->set_charset("utf8mb4");

        // Si le formulaire a été soumis
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $nom = $_POST['nom'];
            $prenom = $_POST['prenom'];
            $email = $_POST['mail'];
            $passWord = $_POST['passWord'];

            // Vérifier si le mail existe déjà
            $sql_check = "SELECT * FROM administrateur WHERE email = ?";
            $stmt_check = $conn->prepare($sql_check);
            $stmt_check->bind_param("s", $email);
            $stmt_check->execute();
            $result_check = $stmt_check->get_result();

            if ($result_check->num_rows > 0) {
                echo "L'adresse mail existe déjà dans la base de données, veuillez en choisir une autre.";
            } else {
                // Hacher le mot de passe pour le stocker en toute sécurité
                $hashed_password = password_hash($passWord, PASSWORD_DEFAULT);

                // Insérer l'administrateur dans la base de données
                $sql = "INSERT INTO administrateur (nom, prenom, email, passWordAdmin) VALUES (?, ?, ?, ?)";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("ssss", $nom, $prenom, $email, $hashed_password);

                if ($stmt->execute()) {
                    echo "Inscription réussie !";
                    // Rediriger l'utilisateur vers la page protégée
                    header("Location: authentification.php");
                } else {
                    echo "Erreur lors de l'inscription : " . $conn->error;
                }

                $stmt->close();
            }

            $stmt_check->close();
        }

        $conn->close();
    ?>
</body>
</html>