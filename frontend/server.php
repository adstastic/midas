<?php

$scriptInvokedFromCli =
    isset($_SERVER['argv'][0]) && $_SERVER['argv'][0] === 'server.php';

if($scriptInvokedFromCli) {
    $port = getenv('PORT');
    if (empty($port)) {
        $port = "3000";
    }
    
    $ip = getenv('IP');
    if (empty($ip)) {
        $ip = "127.0.0.1";
    }
    

    echo 'starting server on port '. $port . PHP_EOL;
    exec('php -S '. $ip . ':' . $port . ' -t public server.php');
} else {
    return routeRequest();
}

function routeRequest() 
{
    $uri = $_SERVER['REQUEST_URI'];
    switch ($uri) {
        case '/':
            echo file_get_contents('./public/shopfront.html');
            break;
        case '/api/people.json':
            getData('people');
            break;
        case '/api/auctions.json':
            getData('auctions');
            break;
        case '/api/items.json':
            getData('items');
            break;
        default:
            return false;
    }
}

function getData($table)
{   
    $filename = './api/items.json';
    $contents = file_get_contents($filename);
    if($_SERVER['REQUEST_METHOD'] === 'POST') { 
        $contentsDecoded = json_decode($contents, true);    
        $contentsDecoded = parseJSON($table, $contentsDecoded);

        $contents = json_encode($contentsDecoded, JSON_PRETTY_PRINT);
        file_put_contents($filename, $contents);
    }
    header('Content-Type: application/json');
    header('Cache-Control: no-cache');
    header('Access-Control-Allow-Origin: *');
    echo $contents;
}

function parseJSON($table, $contentsDecoded) 
{
    switch ($table) {
        case 'people':
            $contentsDecoded[] = [
                'id'      => round(microtime(true) * 1000),
                'fname'  => $_POST['fname'],
                'lname'  => $_POST['lname'],
                'email'    => $_POST['email'],
                'pass'  => $_POST['pass']
            ];
            break;
        case 'auctions':
            $contentsDecoded[] = [
                'id'      => round(microtime(true) * 1000),
                'item_id'  => $_POST['item_id'],
                'seller_id'    => $_POST['seller_id'],
                'price'  => $_POST['price']
            ];
            break;
        case 'items':
            $contentsDecoded[] = [
                'id'      => round(microtime(true) * 1000),
                'iname'  => $_POST['iname'],
                'seller_id'    => $_POST['seller_id'],
                'description'  => $_POST['description']
            ];
            break;
    }
    return $contentsDecoded;
}

?>