<?php
include "db.php";

$name = $_POST['name'] ?? '';
$score = (int) $_POST['score'];

if ($name && $score) {
  $stmt = $conn->prepare("INSERT INTO leaderboard (name, score) VALUES (?, ?)");
  $stmt->bind_param("si", $name, $score);
  $stmt->execute();
  $stmt->close();
}

$conn->close();
?>
