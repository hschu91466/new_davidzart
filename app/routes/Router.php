<?php

declare(strict_types=1);

final class Router
{
    private array $routes = [];
    private $notFoundHandler = null;
    private string $basePath = '';

    public function __construct(string $basePath = '')
    {
        // If your app is in a subdirectory, set it here (e.g., '/sites/production/davidschu_new/public')
        $this->basePath = rtrim($basePath, '/');
    }

    public function get(string $pattern, callable $handler): void
    {
        $this->map('GET', $pattern, $handler);
    }

    public function post(string $pattern, callable $handler): void
    {
        $this->map('POST', $pattern, $handler);
    }

    public function map(string $method, string $pattern, callable $handler): void
    {
        $this->routes[] = [$method, $this->normalize($pattern), $handler];
    }

    public function notFound(callable $handler): void
    {
        $this->notFoundHandler = $handler;
    }

    public function dispatch(): void
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
        if ($this->basePath && str_starts_with($uri, $this->basePath)) {
            $uri = substr($uri, strlen($this->basePath));
            if ($uri === '') {
                $uri = '/';
            }
        }

        foreach ($this->routes as [$m, $pattern, $handler]) {
            if ($m !== $method) continue;
            $params = [];
            if ($this->match($pattern, $uri, $params)) {
                call_user_func_array($handler, $params);
                return;
            }
        }

        if ($this->notFoundHandler) {
            call_user_func($this->notFoundHandler);
        } else {
            http_response_code(404);
            echo 'Not Found';
        }
    }

    private function normalize(string $pattern): string
    {
        // Convert simple param syntax: /gallery/{slug}
        $pattern = rtrim($pattern, '/');
        if ($pattern === '') $pattern = '/';
        return $pattern;
    }

    private function match(string $pattern, string $uri, array &$params): bool
    {
        // Support patterns like: /gallery/{slug}
        $patternParts = explode('/', trim($pattern, '/'));
        $uriParts     = explode('/', trim($uri, '/'));

        if (count($patternParts) !== count($uriParts)) {
            return false;
        }

        $params = [];
        for ($i = 0; $i < count($patternParts); $i++) {
            $pp = $patternParts[$i];
            $up = $uriParts[$i];

            if (preg_match('/^\{([a-zA-Z_][a-zA-Z0-9_]*)\}$/', $pp, $m)) {
                // named param
                $params[$m[1]] = urldecode($up);
                continue;
            }

            if ($pp !== $up) {
                return false;
            }
        }
        return true;
    }
}
