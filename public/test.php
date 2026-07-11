<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
echo "<h1>Test PHP Diagnostics</h1>";
try {
    require __DIR__.'/../vendor/autoload.php';
    $app = require_once __DIR__.'/../bootstrap/app.php';
    $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
    $response = $kernel->handle(
        $request = Illuminate\Http\Request::capture()
    );
    echo "<p>Laravel booted successfully! If you see this, the framework is working, but maybe the routes are broken?</p>";
} catch (\Throwable $e) {
    echo "<h2>Fatal Error Caught:</h2>";
    echo "<pre>" . htmlspecialchars((string) $e) . "</pre>";
}
