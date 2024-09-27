<!doctype html>
<html lang="en" data-bs-theme="dark">

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <meta name="description" content="RimuEirnarn's homepage">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <meta property="og:description" content="RimuEirnarn's homepage" />
  <meta property="og:url" content="https://rimueirnarn.github.io/" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/assets/profile.webp" />
  <meta property="og:title" content="RimuEirnarn - About Me" />
  <meta property="og:site_name" content="RimuEirnarn's Personal Website" />
  <meta property="og:image:alt" content="A boy who is at the forest" />
  <meta property="keywords" content="RimuEirnarn,Portfolio,Personal Website" />

  <link rel="icon" href="/favicon.ico" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:site" content="@RimuEirnarn" />
  <meta name="twitter:creator" content="@RimuEirnarn" />
  <meta name="twitter:url" content="https://rimueirnarn.github.io" />

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://cdn.jsdelivr.net">
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400&display=swap" rel="stylesheet">

  <!-- CSS -->
  <!--link href="assets/css/bootstrap.min.css" rel="stylesheet" -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel='stylesheet'
    integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
  <!--link rel="stylesheet" href="static/css/color.css">
  <link rel="stylesheet" href="static/css/custom.css">
  <link rel="stylesheet" href="static/css/preloaded.css"-->
  <link rel="stylesheet" href="static/css/app.css">
  <link rel="stylesheet" href="static/css/app-chat.css">

  <!-- JS -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm"
    crossorigin="anonymous"></script>

  <!--script src="/static/js/jobcontrol.js"></script>
  <script src="/static/js/preloaded.js"></script>
  <script src="/static/js/debug-check.js"></script>
  <script src="/static/js/error-handler.js"></script>
  <script src="/static/js/keybinds.js" defer></script-->
  <script src="/static/js/pre-main.js" defer></script>
  <script defer>

  </script> <!--script src="assets/js/bootstrap.bundle.min.js" defer></script-->
    <script src="/static/js/main.js" defer type='module'></script>

  <!-- sw.js -->
  <!-- some were copied into here -->
  <meta name="theme-color" content="#212529">
  <link rel="manifest" href="/manifest.json">

  <title>RimuEirnarn</title>
</head>

<body class="color-292836 text-light" style='overflow: hidden' data-sw='false'>
  <nav class="container-fluid nav-background sticky-top">
    <header class="d-flex flex-wrap py-2 mb-4 border-bottom">
      <div class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-light text-decoration-none" id="nav-root-goto">
        <img src="assets/profile.webp" width="32px" height="32px" class="rounded-circle justify-content-around"
          alt="RimuEirnarn's img header" />
        <span class="fs-5 color-text-cyan ms-2" id='name'>RimuEirnarn<span id="dcomp-output"
            class='disable'></span></span><span class='badge bg-primary mx-2 pe-none' id="version">beta
          <span>
      </div>

      <ul class="nav ms-auto nav-pills" id="nav-btns-lists">
        <li class="nav-item"><a href="/" class="nav-link link-light active"><i class="bi bi-person-circle"></i> About
            me</a></li>
        <li class='nav-item dropdown'>
          <button class="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-box-arrow-up-right"></i> External
          </button>
          <ul class="dropdown-menu">
            <li><a href="https://rimueirnarn.github.io/note-app" class='dropdown-item'><i
                  class="bi bi-journal-text"></i> Note App</a></li>
            <li><a href="https://rimueirnarn.github.io/blog" class="dropdown-item" target="_blank"><i
                  class="bi bi-journals"></i> Blog</a></li>
            <li><a href="https://github.com/RimuEirnarn?tab=repositories" class="dropdown-item" target="_blank"><i
                  class="bi bi-github"></i> Repos</a></li>
            <li><a href="https://rimueirnarn.glitch.me" class="dropdown-item" target="_blank"><i
                  class="bi bi-sticky-fill"></i> Glitch</a></li>
            <li><a href="https://github.com/RimuEirnarn/rimueirnarn.github.io" class='dropdown-item' target="_blank"><i
                  class="bi bi-github"></i> Source</a></li>
          </ul>
        </li>
        <li class="nav-item">
          <button class="nav-link" id="ms-button">
            <i class="bi bi-sliders2"></i>
          </button>
          </ul>
        </li>
      </ul>
    </header>
  </nav>
  <div class="toast-container position-fixed bottom-0 end-0 p-3" id="alerts">
  </div>
  <main class="container-fluid" id="app">
    <p>You think this is WordPress?</p>
  </main>
  <div class="container-0"></div>
  <div id='loading'>
    <div class='premount-block'></div>
    <div id="premount" class='position-absolute top-50 start-50 translate-middle'>
      <div class='progress-stacked' style="height: 20px; margin-bottom: 10px">
        <div id='prog-success' class="progress" role="progressbar" aria-label="Loading" aria-valuenow="0"
          aria-valuemin="0" aria-valuemax="100" style='height: 20px'>
          <div class="progress-bar text-bg-white progress-bar-animated">0%</div>
        </div>
        <div id='prog-error' class="progress" role="progressbar" aria-label="Error rate" aria-valuenow="0"
          aria-valuemin="0" aria-valuemax="100" style="height: 20px">
          <div class="progress-bar bg-danger">
          </div>
        </div>

      </div>
      <h3 id="premount-text">
        <noscript class="fs-5 text-danger">
          <i class="bi bi-x-circle-fill"></i>
          Please enable JavaScript :)
        </noscript>
      </h3>
    </div>
  </div>
  <div id='editor-command' class='disable'>
    <div id="buffer">
      <div id="buffout"></div>
      <span class='dis-inline'>:</span><input class='dis-inline' type="text" />
    </div>
  </div>
  <!-- Backup contents -->
  <div id="app-backup" class='disable'>
  </div>
</body>

</html>

