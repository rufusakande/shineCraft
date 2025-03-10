<?php
    session_start();
    if (!isset($_SESSION['user_id'])) {
        if (isset($_GET['idProduit']) && isset($_GET['quantite'])) {
            $idProduit = isset($_POST['idProduit']) ? $_POST['idProduit'] : intval($_GET['idProduit']);
            $quantite = isset($_POST['quantite']) ? $_POST['quantite'] : intval($_GET['quantite']);
            header("Location: authentificationClients.php?idProduit=".$idProduit."&quantite=".$quantite.""); // Rediriger vers la page de connexion si non connecté
            exit();
        }     
        
    }
    include("connexionDB.php");
    
    // Vérifier si l'utilisateur est connecté
    if (isset($_SESSION['user_id'])) {
        $idUtilisateur = $_SESSION['user_id'];
        $idProduit = isset($_POST['idProduit']) ? $_POST['idProduit'] : intval($_GET['idProduit']);
        $quantite = isset($_POST['quantite']) ? $_POST['quantite'] : intval($_GET['quantite']);
    
        // Vérifier si le produit est déjà dans le panier de cet utilisateur
        $sqlCheck = "SELECT * FROM panier WHERE idUtilisateur = ? AND idProduit = ? AND commande = 0";
        $stmtCheck = $conn->prepare($sqlCheck);
        $stmtCheck->bind_param('ii', $idUtilisateur, $idProduit);
        $stmtCheck->execute();
        $result = $stmtCheck->get_result();
    
        if ($result->num_rows > 0) {
            // Si le produit est déjà dans le panier, augmenter la quantité
            $sqlUpdate = "UPDATE panier SET quantite = quantite + ? WHERE idUtilisateur = ? AND idProduit = ? AND commande = 0";
            $stmtUpdate = $conn->prepare($sqlUpdate);
            $stmtUpdate->bind_param('iii', $quantite, $idUtilisateur, $idProduit);
            $stmtUpdate->execute();
        } else {
            // Sinon, ajouter le produit dans le panier
            $sqlInsert = "INSERT INTO panier (idUtilisateur, idProduit, quantite) VALUES (?, ?, ?)";
            $stmtInsert = $conn->prepare($sqlInsert);
            $stmtInsert->bind_param('iii', $idUtilisateur, $idProduit, $quantite);
            $stmtInsert->execute();
        }
    
        echo "Produit ajouté au panier avec succès!";
        header("Location: panier.php");
        exit();
    } else {
        echo "Vous devez vous connecter pour ajouter un produit au panier.";
        $idProduit = $_POST['idProduit'];
        $quantite = $_POST['quantite'];
        header("Location: authentificationClients.php?idProduit=".$idProduit."&quantite=".$quantite.""); // Rediriger vers la page de connexion si non connecté
        exit();
    }
?>    