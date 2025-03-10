<?php
//connexion à la base de données
$conn = new mysqli('localhost', 'root', '', 'shinecraft');

if ($conn->connect_error){
    die("Erreur de connexion : ". $conn->connect_error);
}
?>