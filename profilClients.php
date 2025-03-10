<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ShineCraft</title>
    <meta name="description" content="ShineCraft célèbre chaque moment précieux de votre vie avec des bijoux élégants et exquis, conçu pour illuminer vos instants les plus mémorables.">
    <link rel="stylesheet" href="assets/css/styleGenerale.css">
    <link rel="stylesheet" href="assets/css/contact.css">
    <link rel="stylesheet" href="assets/css/responsive.css">
</head>
<body>
    <?php
    session_start();
    if (!isset($_SESSION['user_id'])) {
        header("Location: authentificationClients.php"); // Rediriger vers la page de connexion si non connecté
        exit();
    }
        include("header.php")
    ?>

    <main>
        <!-- La section Profil client -->
        <section class="profilClient">
            <p>Profil</p>
        </section>

        <!-- Footer -->
        <?php 
            include("footer.php")
        ?>

        <!-- Back to top -->
        <a class="backToTop" href="#">
            <span>back to top</span>
            
        </a>
    </main>

    <script src="assets/js/main.js"></script>
</body>
</html>