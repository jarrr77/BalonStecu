<?php
include "db.php";

$sql = "SELECT name, score FROM leaderboard ORDER BY score DESC LIMIT 10";
$result = $conn->query($sql);

$rows = [];
while ($row = $result->fetch_assoc()) {
  $rows[] = $row;
}
echo json_encode($rows);
?>
