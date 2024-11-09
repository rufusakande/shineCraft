<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ShineCraft</title>
    <meta name="description" content="ShineCraft célèbre chaque moment précieux de votre vie avec des bijoux élégants et exquis, conçu pour illuminer vos instants les plus mémorables.">
    <link rel="stylesheet" href="assets/css/authentification.css">
    <link rel="stylesheet" href="assets/css/compte.css">
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
                        echo "<h2 style='text-align:center;padding:5px;'>Vous devriez créer un compte afin de pouvoir ajouter les produits dans le panier</h2>";
                    } else{
                        echo "<h2>Créer votre compte</h2>";

                    }
                ?>
                
                <form action="#" method="post">
                    <span>
                        <label class="label" for="nom">Nom</label>
                        <input type="text" id="nom" name="nom" placeholder="Votre nom" onfocus="on" minlength="2" required>
                        <span class="spanNom"></span>
                    </span>
                    <span>
                        <label class="label" for="prenom">Prénom</label>
                        <input type="text" id="prenom" name="prenom" placeholder="Votre prénom"  minlength="2" required>
                        <span class="spanPrenom"></span>
                    </span>
                    <span>
                        <label class="label" for="email">Email</label>
                        <input type="email" id="mail" name="mail" placeholder="Votre adresse mail"  minlength="3" required>
                        <span class="spanMail"></span>
                    </span>
                    <span>
                        <label class="label" for="numero">Téléphone</label>
                        <input type="tel" id="numero" name="numero" placeholder="Votre numéro"  minlength="8" required>
                        <span class="spanNumero"></span>
                    </span>
                    <span>
                        <label class="label" for="passWord">Mot de passe</label>
                        <input type="password" id="passWord" name="passWord" placeholder="Votre mot de passe" minlength="6" required>
                        <span class="spanPassWord"></span>
                    </span>
                    <span>
                        <input type="checkbox" name="terms" id="terms" required>
                        <label for="terms">Acceptez les terms et conditions</label>
                    </span>

                    <input type="submit" value="Créer un compte">
                </form>

                <?php
                    if (isset($_GET['idProduit']) && isset($_GET['quantite'])) {
                        $idProduit = intval($_GET['idProduit']);
                        $quantite = intval($_GET['quantite']);
                        echo "<p>Vous avez déjà un compte? <a href='authentificationClients.php?idProduit=".$idProduit."&quantite=".$quantite."'>Connectez-vous</a></p>";
                    } else{
                        echo "<p>Vous avez déjà un compte? <a href='authentificationClients.php'>Connectez-vous</a></p>";

                    }
                ?>
            </div>
        </div>
    </section>

    <?php
        // Connexion à la base de données
        $servername = "localhost"; // Remplacez par votre serveur
        $usernameDB = "root"; // Remplacez par votre nom d'utilisateur MySQL
        $passwordDB = ""; // Remplacez par votre mot de passe MySQL
        $dbname = "shinecraft"; // Remplacez par le nom de votre base de données

        $conn = new mysqli($servername, $usernameDB, $passwordDB, $dbname);

        // Vérifier la connexion
        if ($conn->connect_error) {
            die("Connexion échouée: " . $conn->connect_error);
        }

        // S'assurer que l'encodage est correct
        $conn->set_charset("utf8mb4");

        // Si le formulaire a été soumis
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $nom = $_POST['nom'];
            $prenom = $_POST['prenom'];
            $email = $_POST['mail'];
            $numero = $_POST['numero'];
            $passWord = $_POST['passWord'];
            // Vérifier si le mail existe déjà
            $sql_check = "SELECT * FROM clients WHERE email = ?";
            $stmt_check = $conn->prepare($sql_check);
            $stmt_check->bind_param("s", $email);
            $stmt_check->execute();
            $result_check = $stmt_check->get_result();

            if ($result_check->num_rows > 0) {
                echo "L'adresse mail existe déjà dans la base de données, veuillez en choisir une autre.";
            } else {
                // Hacher le mot de passe pour le stocker en toute sécurité
                $hashed_password = password_hash($passWord, PASSWORD_DEFAULT);

                // Insérer le client dans la base de données
                $sql = "INSERT INTO clients (nom, prenom, email, numero, passWordClient) VALUES (?, ?, ?, ?, ?)";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("sssss", $nom, $prenom, $email, $numero, $hashed_password);

                if ($stmt->execute()) {
                    echo "Inscription réussie !";
                    if (isset($_GET['idProduit']) && isset($_GET['quantite'])) {
                        $idProduit = intval($_GET['idProduit']);
                        $quantite = intval($_GET['quantite']);
                        header("Location: ajouterPanier.php?idProduit=".$idProduit."&quantite=".$quantite."");
                        exit();
                    } else{
                        // Rediriger l'utilisateur vers la page protégée
                        header("Location: profilClients.php");
                        exit();
                    }
                    
                } else {
                    echo "Erreur lors de l'inscription : " . $conn->error;
                }

                $stmt->close();
            }

            $stmt_check->close();
        }

        $conn->close();
    ?>

    <script>
        const nom = document.getElementById('nom').value;
        const prenom = document.getElementById('prenom').value;
        const email = document.getElementById('mail').value;
        const tel = document.getElementById('numero').value;
        const password = document.getElementById('passWord').value;
        const spanNom = document.getElementById('spanNom');
        const spanPrenom = document.getElementById('spanPrenom');
        const spanMail = document.getElementById('spanMail');
        const spanTel = document.getElementById('spanNumero');
        const spanPassWord = document.getElementById('spanPassWord');

        document.querySelector('form').addEventListener('submit', function(event) {

            if (!/^[a-zA-Z]+$/.test(nom)) {
                spanNom.innerHTML = "Le nom doit contenir uniquement des lettres."
                spanNom.style.display = 'block'
                event.preventDefault();
            }else{
                spanNom.style.display = 'none'
            }

            if (!/^[a-zA-Z]+$/.test(prenom)) {
                spanPrenom.innerHTML = "Le nom doit contenir uniquement des lettres."
                spanPrenom.style.display = 'block'
                event.preventDefault();
            } else{
                spanPrenom.style.display = 'none'
            }

            if (!/^\S+@\S+\.\S+$/.test(email)) {
                spanMail.innerHTML = "L'email est invalide."
                spanMail.style.display = 'block'
                event.preventDefault();
            }else{
                spanMail.style.display = 'none'
            }

            if (!/^\d{8,}$/.test(tel)) {
                spanTel.innerHTML = "Le numéro de téléphone doit contenir au moins 8 chiffres."
                spanTel.style.display = 'block'
                event.preventDefault();
            }else{
                spanTel.style.display = 'none'
            }

            if (password.length < 6) {
                spanPassWord.innerHTML = "Le mot de passe doit comporter au moins 6 caractères."
                spanPassWord.style.display = 'block'
                event.preventDefault();
            }else{
                spanPassWord.style.display = 'none'
            }
        });

    </script>
</body>
</html>