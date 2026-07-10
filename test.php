<?php
try {
    $redis = new Redis();
    $redis->connect('redis', 6379, 2);
    echo "Connected successfully to Redis!\n";
} catch (Exception $e) {
    echo "Error connecting to Redis: " . $e->getMessage() . "\n";
}
