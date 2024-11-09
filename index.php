<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <!-- Favicon à ajouter après -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ShineCraft</title>
    <meta name="description" content="ShineCraft célèbre chaque moment précieux de votre vie avec des bijoux élégants et exquis, conçu pour illuminer vos instants les plus mémorables.">
    <link rel="stylesheet" href="assets/css/styleGenerale.css">
    <link rel="stylesheet" href="assets/css/heros.css">
    <link rel="stylesheet" href="assets/css/responsive.css">
</head>
<body>
    <?php 
        include("header.php");
        //connexion à la base de données
        $conn = new mysqli('localhost', 'root', '', 'shinecraft');

        if ($conn->connect_error){
            die("Erreur de connexion : ". $conn->connect_error);
        }
    ?>

    <main>
        <!-- La section héros -->
        <section class="heros">
            <h1>Brillez avec élégance</h1>
            <p>Découvrez notre collection conçues pour briller à chaque instant.</p>
            <div class="row">
                <a href="catalogue.php"><button class="btn1">Explorez notre collection</button></a>
                <a href="catalogue.php"><button class="btn2">Decouvrez votre style</button></a>
            </div>
        </section>

        <!-- La section produits -->
        <section class="produits">
            <h2>Nos collections phares</h2>
            <p>
                Des créations artisanales, réalisées avec passion pour chaque moment de votre vie.
            </p>

            <div class="row">
                <?php
                    $sql1 = "SELECT * FROM produits ORDER BY id DESC LIMIT 3";
                    $results1 = $conn->query($sql1);
                    if ($results1->num_rows > 0) {
                        while ($row1 = $results1->fetch_assoc()){
                                $photosrec = unserialize($row1['photos']);
                                echo"
                                    <div class='box'>
                                        <div class='image' style='background-image: url(dashboard/".$photosrec[0].");'>
                                            <div><em>".$row1['prix']."</em><span> FCFA</span></div>
                                        </div>
                                        <p class='info'>".$row1['nomProduit']."</p>
                                        <p class='icones'>
                                            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-star-fill' viewBox='0 0 16 16'>
                                                <path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'/>
                                            </svg>
                                            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-star-fill' viewBox='0 0 16 16'>
                                                <path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'/>
                                            </svg>
                                            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-star-fill' viewBox='0 0 16 16'>
                                                <path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'/>
                                            </svg>
                                            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-star-fill' viewBox='0 0 16 16'>
                                                <path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'/>
                                            </svg>
                                            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-star-fill' viewBox='0 0 16 16'>
                                                <path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'/>
                                            </svg>
                                        </p>
                                    </div>
                                ";
                            
                        }
                    } else{
                        echo"Aucun produits disponible";
                    }
                ?>
            </div>
            <a href="catalogue.php"><button class="btn1">Explorez notre collection</button></a>
        </section>

        <!-- La section a propos -->
        <section class="apropos">
            <h2 class="sectionTitle">A propos de ShineCraft</h2>
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
                    <a href="apropos.php"><button class="btn1">En savoir plus</button></a>
                </div>
                <img src="assets/images/apropos.webp" alt="Une image qui parle de ShineCraft et qui met en valeur nos cultures">
            </div>
        </section>

        <!-- La section contact -->
        <section class="contact">
            <div class="text">
                <div>
                    <h3>Contact</h3>
                    <p>
                        Nous serions ravis de vous aider. N'hésitez pas à nous écrire pour toute question ou demande spéciale
                    </p>
                </div>
            </div>
            <div class="row">
                <div class="box">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-house-fill" viewBox="0 0 16 16">
                        <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"/>
                        <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z"/>
                    </svg>
                    <h3>Visitez-nous</h3>
                    <a href="#">Parakou, benin</a>
                </div>
                <div class="box active">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-telephone-fill" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
                    </svg>
                    <h3>Appelez-nous</h3>
                    <a href="tel:+229 51 08 09 83">+229 51 08 09 83</a>
                </div>
                <div class="box">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-envelope-at-fill" viewBox="0 0 16 16">
                        <path d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2zm-2 9.8V4.698l5.803 3.546zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.5 4.5 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586zM16 9.671V4.697l-5.803 3.546.338.208A4.5 4.5 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671"/>
                        <path d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034zm-4.04.21v.227c0 .586.227.8.581.8.31 0 .564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346 0-.573.245-.573.791"/>
                    </svg>
                    <h3>Contactez-nous</h3>
                    <a href="mailto:contact@shine.com">contact@shine.com</a>
                </div>
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

    <link rel="stylesheet" href="assets/css/catalogue.css">
    <link rel="stylesheet" href="assets/css/apropos.css">
    <link rel="stylesheet" href="assets/css/contact.css">

    <script src="assets/js/main.js"></script>
</body>
</html>