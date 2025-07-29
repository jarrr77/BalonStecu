<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "balon_stecu";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) die("Koneksi gagal");
?>
