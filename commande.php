<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ShineCraft</title>
    <meta name="description" content="ShineCraft célèbre chaque moment précieux de votre vie avec des bijoux élégants et exquis, conçu pour illuminer vos instants les plus mémorables.">
    <link rel="stylesheet" href="assets/css/styleGenerale.css">
    <link rel="stylesheet" href="assets/css/commande.css">
    <link rel="stylesheet" href="assets/css/responsive.css">

    <style>
        .hidden {
            display: none;
        }

        /* Style du modal */
        #modalRecuperation {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0px;
            top: 0px;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.36);
            align-items: center;
            justify-content: center;
        }

        .modal-content {
            background: white;
            padding: 20px;
            border-radius: 5px;
            text-align: center;
            width: 400px;
        }

        @media screen and (max-width : 450px) {
            .modal-content {
                width: 95%;
            }
        }

        .close {
            float: right;
            cursor: pointer;
            font-size: 20px;
        }

        #map {
            width: 100%;
            height: 300px;
            margin-top: 10px;
        }

        #modalRecuperation input,
        #livraisonContainer input{
            padding: 12px;
            border: none;
            border-radius: 10px;
            background-color: gray;
            color: black;
        }

        #modalRecuperation input::placeholder,
        #livraisonContainer input::placeholder {
            color: black;
        }

        #modalRecuperation button,
        #livraisonContainer button{
            padding: 12px;
            border: none;
            border-radius: 10px;
            background-color: blue;
            color: white;
        }
    </style>
</head>
<body>
    <?php 
        session_start();
        if (!isset($_SESSION['user_id'])) {
            header("Location: authentificationClients.php"); // Rediriger vers la page de connexion si non connecté
            exit();
        }
        include("connexionDB.php");
            
        include("header.php");
    ?>

    <main>
        <!-- La section contact -->
        <form class="commande" id="formCommande" method="POST">
            <?php
                if (isset($_SESSION['user_id'])) {
                    $idUtilisateur = $_SESSION['user_id'];
                
                    // Récupérer les produits dans le panier
                    $sql = "SELECT p.id, p.nomProduit, p.prix, p.photos, pn.quantite 
                            FROM produits p 
                            INNER JOIN panier pn ON p.id = pn.idProduit 
                            WHERE pn.idUtilisateur = ? AND pn.commande = 0";
                    $stmt = $conn->prepare($sql);
                    $stmt->bind_param('i', $idUtilisateur);
                    $stmt->execute();
                    $result = $stmt->get_result();
                    if ($result->num_rows > 0) {
                        $tva = 0.18;
                        $apayer = 0;
                        while ($row = $result->fetch_assoc()) {
                            $photosrec = unserialize($row['photos']);
                            $total = $row['prix'] * $row['quantite'];
                            $apayer += $total;
                        }
                        echo"<input type='hidden' name='prixTotal' id='prixTotal' value=".$apayer + $tva * $apayer.">";
                    }
                }
            ?>
            <div class="commandeContainer">
                <h3>Comment souhaiter vous récupérer votre commande?</h3>
                <ul>
                    <li>
                        <input type="checkbox" name="livraison" id="livraison" class="checkbox" value="Livraison">
                        <label for="livraison">Être livré chez vous</label>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                        </svg>
                    </li>
                    <li>
                        <input type="checkbox" name="recuperer" id="recuperer" class="checkbox" value="Récuperation">
                        <label for="recuperer">Passez dans notre agence pour le récupérer</label>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                        </svg>
                    </li>
                </ul>
            </div>

            <!-- Modal pour la récupération en agence -->
            <div id="modalRecuperation" class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h3>Choisissez la date de récupération</h3>
                    <input type="date" id="dateRecuperation">
                    <button id="validerRecuperation">Valider</button>
                </div>
            </div>

            <!-- Formulaire pour la livraison -->
            <div id="livraisonContainer" class="hidden">
                <h3>Entrez vos informations de livraison</h3>
                <input type="text" id="nomLivraison" placeholder="Nom complet">
                <input type="text" id="telephoneLivraison" placeholder="Téléphone">
                <div id="map"></div> <!-- Carte Google Maps -->
                <button id="validerLivraison">Confirmer l'adresse</button>
            </div>

            <div class='btnCommande' id="payerCommande">
                <button type="submit">Payer la commande</button>
            </div>
        </form>
                
        <!-- Footer -->
        <?php 
            include("footer.php")
        ?>
    </main>

    <script src="assets/js/main.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", function () {
            const livraisonCheckbox = document.getElementById("livraison");
            const recupererCheckbox = document.getElementById("recuperer");
            const modalRecuperation = document.getElementById("modalRecuperation");
            const livraisonContainer = document.getElementById("livraisonContainer");
            const closeModal = document.querySelector(".close");

            // Gérer le choix de récupération
            recupererCheckbox.addEventListener("change", function () {
                if (recupererCheckbox.checked) {
                    livraisonCheckbox.checked = false; // Désélectionner l'autre option
                    modalRecuperation.style.display = "flex";
                }
            });

            // Fermer le modal
            closeModal.addEventListener("click", function () {
                modalRecuperation.style.display = "none";
            });

            // Gérer le choix de livraison
            livraisonCheckbox.addEventListener("change", function () {
                if (livraisonCheckbox.checked) {
                    recupererCheckbox.checked = false; // Désélectionner l'autre option
                    livraisonContainer.classList.remove("hidden"); // Afficher la section livraison
                    //initMap(); // Charger la carte Google Maps
                } else {
                    livraisonContainer.classList.add("hidden");
                }
            });

            // Initialisation de la carte Google Maps
            function initMap() {
                const map = new google.maps.Map(document.getElementById("map"), {
                    center: { lat: 6.3703, lng: 2.3912 }, // Coordonnées par défaut (exemple : Cotonou)
                    zoom: 12
                });

                let marker = new google.maps.Marker({
                    position: { lat: 6.3703, lng: 2.3912 },
                    map: map,
                    draggable: true
                });

                google.maps.event.addListener(marker, 'dragend', function (event) {
                    document.getElementById("adresseLivraison").value = event.latLng.lat() + ", " + event.latLng.lng();
                });
            }
        });

        const payerCommande = document.getElementById("payerCommande")
        payerCommande.addEventListener("click", (e) =>{
            e.preventDefault()
            window.location.href = "process_commande.php"
        })
        
        // Ajoutez dynamiquement le script kkiapay
    const totalPrice = document.getElementById("prixTotal").value;

    // Dynamisez l'attribut 'amount' du script
    const kkiapayScript = document.createElement("script");
    kkiapayScript.setAttribute("amount", totalPrice); // Ajout de l'attribut montant
    kkiapayScript.setAttribute("callback", (response) => {
            
                submitForm();
                if (response.status === "SUCCESS") {
                    // Envoie les données du formulaire au backend
                    //submitForm();
                } else {
                    console.log("Paiement échoué!")
                    alert("Le paiement a échoué. Veuillez réessayer.");
                    
                }
            },);
    kkiapayScript.setAttribute("data", "");
    kkiapayScript.setAttribute("position", "right");
    kkiapayScript.setAttribute("theme", "green");
    kkiapayScript.setAttribute("sandbox", "true");
    kkiapayScript.setAttribute("key", "6f132220c49911efaaa41d1ce4fc853f");
    kkiapayScript.src = "https://cdn.kkiapay.me/k.js";

    // Ajoutez dynamiquement le script au DOM
    document.body.appendChild(kkiapayScript);


// Fonction pour soumettre le formulaire après paiement réussi
/* function submitForm() {
    const form = document.querySelector(".commande");

    // Crée une requête AJAX pour envoyer les données du formulaire
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "process_commande.php", true);

    // Récupérez les données du formulaire
    const formData = new FormData(form);

    // Gestion de la réponse du serveur
    xhr.onload = function () {
        if (xhr.status === 200) {
            alert("Commande enregistrée avec succès !");
            window.location.href = "process_commande.php"; // Redirection après succès
        } else {
            alert("Erreur lors de l'enregistrement de la commande : " + xhr.responseText);
            window.location.href = "process_commande.php"; // Redirection après succès
        }
    };

    // Envoyez les données sans définir manuellement le Content-Type
    xhr.send(formData);
} */

function submitForm() {
    const form = document.querySelector("#formCommande");
    const formData = new FormData(form);

    // Ajoutez des données si nécessaire (par exemple, pour des champs cachés)
    //formData.append('lieuLivraison', document.querySelector('#lieuLivraison').value);

    // Crée une requête AJAX
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "process_commande.php", true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log(xhr.responseText + " code 200"); // Affiche la réponse du serveur
            window.location.href = "process_commande.php"; // redirection vers la pache de facture une fois le paiement effèctué et la commande ajouté dans la base de données
        } else if (xhr.status === 400) {
            console.log("Erreur : Utilisateur non connecté.");
        } else if (xhr.status === 500) {
            console.log("Erreur : Une erreur s'est produite lors de l'ajout de la commande.");
        } else if (xhr.status === 405) {
            console.log("Méthode non autorisée.");
        } else {
            console.log("Erreur inconnue.");
        }
    };

    // Envoie les données
    xhr.send(formData);
}

    </script>
</body>
</html>