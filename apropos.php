<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ShineCraft</title>
    <meta name="description" content="ShineCraft célèbre chaque moment précieux de votre vie avec des bijoux élégants et exquis, conçu pour illuminer vos instants les plus mémorables.">
    <link rel="stylesheet" href="assets/css/styleGenerale.css">
    <link rel="stylesheet" href="assets/css/apropos.css">
    <link rel="stylesheet" href="assets/css/responsive.css">
</head>
<body>
    <?php 
        include("header.php")
    ?>

    <main>
        <!-- La section a propos -->
        <section class="apropos">
            <h2 class="sectionTitle">A propos de Shine</h2>
            <p>
                ShineCraft célèbre chaque moment précieux de votre vie avec des bijoux élégants et exquis.
            </p>

            <div class="row">
                <div class="text">
                    <h3>Élégance, qualité, et durabilité</h3>
                    <p>
                        Chez ShineCraft, nous croyons que chaque bijou raconte une histoire. Depuis notre création, 
                        notre mission est de célébrer les moments uniques de votre vie avec des pièces qui 
                        capturent l'élégance, la beauté et l'émotion
                    </p>
                    <a href="#"><button class="btn1">En savoir plus</button></a>
                </div>
                <img src="assets/images/apropos.webp" alt="Une image qui parle de ShineCraft et qui met en valeur nos cultures">
            </div>
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