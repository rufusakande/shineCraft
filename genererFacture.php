<?php
require('fpdf/fpdf.php');
include("connexionDB.php");
session_start();

if (!isset($_GET['id'])) {
    die("Commande non trouvée.");
}

$idCommande = $_GET['id'];
$idUtilisateur = $_SESSION['user_id'];

// Récupérer les infos de la commande
$sqlCommande = "SELECT c.id, c.date_commande, c.status, u.nom, u.email
                FROM commande c
                JOIN clients u ON c.idUtilisateur = u.id
                WHERE c.id = ? AND c.idUtilisateur = ?";
$stmtCommande = $conn->prepare($sqlCommande);
$stmtCommande->bind_param("ii", $idCommande, $idUtilisateur);
$stmtCommande->execute();
$resultCommande = $stmtCommande->get_result();
$commande = $resultCommande->fetch_assoc();

// Récupérer les produits commandés
$sqlProduits = "SELECT p.nomProduit, p.prix, d.quantite
                FROM details_commande d
                JOIN produits p ON d.idProduit = p.id
                WHERE d.idCommande = ?";
$stmtProduits = $conn->prepare($sqlProduits);
$stmtProduits->bind_param("i", $idCommande);
$stmtProduits->execute();
$resultProduits = $stmtProduits->get_result();

// Création du PDF
$pdf = new FPDF();
$pdf->AddPage();
$pdf->SetFont('Arial', 'B', 16);
$pdf->Cell(190, 10, 'Facture - Commande #'.$idCommande, 0, 1, 'C');

$pdf->SetFont('Arial', '', 12);
$pdf->Cell(100, 10, 'Client: '.$commande['nom'], 0, 1);
$pdf->Cell(100, 10, 'Email: '.$commande['email'], 0, 1);
$pdf->Cell(100, 10, 'Date: '.$commande['date_commande'], 0, 1);

$pdf->Ln(10);
$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(90, 10, 'Produit', 1);
$pdf->Cell(30, 10, 'Prix (€)', 1);
$pdf->Cell(30, 10, 'Quantité', 1);
$pdf->Cell(40, 10, 'Total (€)', 1);
$pdf->Ln();

$pdf->SetFont('Arial', '', 12);
$total = 0;
while ($produit = $resultProduits->fetch_assoc()) {
    $sousTotal = $produit['prix'] * $produit['quantite'];
    $total += $sousTotal;
    $pdf->Cell(90, 10, $produit['nomProduit'], 1);
    $pdf->Cell(30, 10, $produit['prix'], 1);
    $pdf->Cell(30, 10, $produit['quantite'], 1);
    $pdf->Cell(40, 10, $sousTotal, 1);
    $pdf->Ln();
}

$pdf->Cell(150, 10, 'Total', 1);
$pdf->Cell(40, 10, $total.' €', 1);

$pdf->Output('D', 'facture_'.$idCommande.'.pdf'); // Téléchargement direct
?>
