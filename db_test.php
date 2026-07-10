<?php
try {
    $dsn = "pgsql:host=pgsql;port=5432;dbname=laravel";
    $pdo = new PDO($dsn, "sail", "password", [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    echo "Connected successfully to Postgres!\n";
} catch (PDOException $e) {
    echo "Error connecting to Postgres: " . $e->getMessage() . "\n";
}
