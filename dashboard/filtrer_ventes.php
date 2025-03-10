<?php
include("../connexionDB.php");

$filtre = isset($_GET['filtre']) ? $_GET['filtre'] : 'tout';

$query = "SELECT * FROM produits "; // Requête de base

// Ajout du filtre selon la valeur reçue
if ($filtre === 'todays') {
    $query .= " WHERE DATE(date_vendus) = CURDATE() ORDER BY qte_vendus DESC lIMIT 4";
} elseif ($filtre === 'week') {
    $query .= " WHERE YEARWEEK(date_vendus, 1) = YEARWEEK(CURDATE(), 1) ORDER BY qte_vendus DESC lIMIT 4";
} elseif ($filtre === 'month') {
    $query .= " WHERE YEAR(date_vendus) = YEAR(CURDATE()) AND MONTH(date_vendus) = MONTH(CURDATE()) ORDER BY qte_vendus DESC lIMIT 4";
} elseif ($filtre === 'all') {
    $query .= " WHERE 1 ORDER BY qte_vendus DESC lIMIT 4";
}

$stmt = $conn->prepare($query);
$stmt->execute();
$result = $stmt->get_result();

if($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $photorec = unserialize($row['photos']);
            echo"
                <tr>
                    <td class='img'>
                        <img src=".$photorec[0]." alt=''>
                    </td>
                    <td>".$row['nomProduit']."</td>
                    <td>".$row['qte_vendus']."</td>
                    <td>".$row['prix']."</td>
                </tr>
            ";
    }
}

?>


