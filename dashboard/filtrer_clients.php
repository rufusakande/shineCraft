<?php
include("../connexionDB.php");

$filtre = isset($_GET['filtre']) ? $_GET['filtre'] : 'tout';

$query = "SELECT * FROM clients "; // Requête de base

// Ajout du filtre selon la valeur reçue
if ($filtre === 'todays') {
    $query .= " WHERE DATE(date_creation) = CURDATE()";
} elseif ($filtre === 'week') {
    $query .= " WHERE YEARWEEK(date_creation, 1) = YEARWEEK(CURDATE(), 1)";
} elseif ($filtre === 'month') {
    $query .= " WHERE YEAR(date_creation) = YEAR(CURDATE()) AND MONTH(date_creation) = MONTH(CURDATE())";
} elseif ($filtre === 'all') {
    $query .= " WHERE 1";
}

$stmt = $conn->prepare($query);
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    echo "<tr>";
    echo "<td class='img'>
            <img src='../assets/images/apropos.webp' alt='photo du client'>
        </td>";
    echo "<td>" . $row['nom'] . "</td>";
    echo "<td>" . $row['prenom'] . "</td>";
    echo "<td>" . $row['email'] . "</td>";
    echo "</tr>";
}
?>


