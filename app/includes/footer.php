<?php include_once __DIR__ . '/helper.php';
$BASE_URL = getBaseURL();
?>
<footer>
    <div class="container">
        <div class="row">
            <div class="col-12">
                <ul class="social">
                    <li class="facebook">
                        <a href="https://www.facebook.com/david.schu" target="_blank" rel="noopener">
                            <i class="fab fa-facebook-square fa-lg" aria-hidden="true"></i>
                            <span class="visually-hidden">Facebook</span>
                        </a>
                    </li>
                    <!-- Add more socials here if you want -->
                </ul>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <p class="copyright">
                    &copy; <?php echo date('Y'); ?> David Schu – Fine Arts. All rights reserved.
                </p>
            </div>
        </div>
    </div>
</footer>

<!-- Scripts
–––––––––––––––––––––––––––––––––––––––––––––––––– -->
<!-- jQuery (required for Magnific Popup only) -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js" defer crossorigin="anonymous"></script>

<!-- Font Awesome (kit) -->
<script src="https://kit.fontawesome.com/e33b384274.js" crossorigin="anonymous"></script>

<!-- Splide JS (kit) -->
<script src="https://cdn.jsdelivr.net/npm/@splidejs/splide@4/dist/js/splide.min.js"></script>

<!-- Magnific Popup (minified CDN) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/jquery.magnific-popup.min.js" defer
    crossorigin="anonymous" referrerpolicy="no-referrer"></script>

<!-- Bootstrap 5 Bundle (includes Popper) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
    crossorigin="anonymous"></script>

<!-- Site JS  -->
<script src="<?= $BASE_URL ?>/assets/js/script.js" defer></script>

</body>

</html>