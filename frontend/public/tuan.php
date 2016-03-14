<html>
<body>

<?php
    $servername = "13.80.11.8";
    $username = "root";
    $password = " root ";

    // Create connection
    $conn = new mysqli($servername, $username, $password);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    echo "Connected successfully<br>";

    $sql = "SELECT * FROM  AuctionSite.Buyers";
    $result = $conn->query($sql);

    //if ($result->num_rows > 0) {
    if (mysqli_num_rows($result) > 0) {
        // output data of each row
        //while($row = $result->fetch_assoc()) {
        echo "<table style=\"width:100%\">
          <tr>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Rating</th>
            <th>Buyer ID</th></tr>";
        while($row = mysqli_fetch_assoc($result)) {
        echo"
          <tr>
            <td>" . $row["First Name"] . " </td>
            <td>" . $row["Last Name"] . " </td>
            <td>" . $row["Rating"] . " </td>
            <td>" . $row["Buyer ID"] . " </td>
          </tr>";
        }
        echo "</table>";
    } else {
        echo "<br>0 results";
    }
    mysqli_close($conn);
?>
<br>
made changes
</body>
</html>
