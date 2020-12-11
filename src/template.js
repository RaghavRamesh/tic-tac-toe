// html skeleton provider
export default function template(title, initialState = {}, content = "") {
  const scripts = `<script>
                     window.__STATE__ = ${JSON.stringify(initialState)}
                   </script>
                   <script src="assets/client.js"></script>
                  `
  const page = `<!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="utf-8">
                  <title> ${title} </title>
                  <link rel="stylesheet" href="assets/style.css">
                </head>
                <body>
                  <div class="content">
                    <div id="app" class="wrap-inner">
                      ${content}
                    </div>
                  </div>

                  ${scripts}
                </body>
                `;

  return page;
}
