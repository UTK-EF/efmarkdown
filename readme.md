# EF Markdown

# Usage

## Simple

``` javascript
// node.js
var efmd = require('efmarkdown');

var result = efmd.render('# EF Markdown is Great!');

// browser
var result = efmarkdown.render('# EF Markdown is Great!');

// browser, render element content
var el = document.getElementById('efmarkdown');
efmarkdown.renderElement(el);

// browser, render inline with no paragraph wrapping
var inlineResult = efmarkdown.renderInline('**Inline** Render');
```

## Browser

``` html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta charset="utf-8">

  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  <link rel="stylesheet"
      href="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.16.2/build/styles/vs.min.css">
  <link href="style.css" rel="stylesheet" type="text/css"></link>

  <title>EF Browser Render</title>
</head>

<body>
  <h1>EF Render Bundle</h1>
  
  <div class="markdownit">
    This is an alert <!-- {.alert .alert-primary} -->

    ::: collapse Announcements
    This is an anouncement.
    - Item 1
    - Item 2
    :::
  </div>

  <div class="markdownit">
    Some math stuff:
    
    $$
    x = \frac{-b\pm\sqrt{b^2 - 4ac}}{2a}
    $$
    
    ::: collapse Example 1
    
    Some text and math for example 1.

    $$c^{2} = a^{2} + b^{2} - 2ab\cos(C)$$

    Inline math works too $\pi=3.1415\cdots$.
    :::
    
  </div>

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script> <!-- jquery is not required, just used for the demo -->
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script> <!-- without bootstrap style and js, the collapse container will not work as expected -->
  <script src="efmarkdown.js"></script>

  <script type="text/javascript">
    jQuery(function() {
      console.time('markdown');
      $('.markdownit').each((idx, el) => {
        efmarkdown.renderElement(el);
      });
      console.timeEnd('markdown');
    });
  </script>
</body>
</html>
```

