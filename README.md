# Datasilk Core JavaScript
#### A simple JavaScript framework used alongside [Datasilk Core](http://www.github.com/Datasilk/Core).

## Features
All features have been tested on various modern web browsers, including Internet Explorer 9 and up.

### Ajax
Access RESTful web APIs and use `S.ajax.inject(data)` to load content onto the page from the JSON response of a `Datasilk.Service.Response` web service object.

### Loader
Display an SVG spinning loader animation on the page.

### Message
Display a message on the page, such as an error or confirmation message above a form.

### Polyfill
Various polyfills for older web browsers, such as `Element.matches`, `Element.matchesSelector`, & `requestAnimationFrame` polyfills, 

### Popup
View a popup window above all the content on the web page

### Scaffold
Load HTML content on the page while replacing `mustache` variables & blocks with dynamic data.

For example:

```
<script type="text/html" id="template_element">
    <div class="element">{{title}}</div><div class="field"><input type="text" value="{{value}}">
</script>

<script>
var vars = {title: "Hello", value: "World"};
var scaffold = new S.scaffold($('#template_element).val(), vars);
$('body').append(scaffold.render());
</script>
```

### Util
Various utility functions, such as loading JavaScript & CSS files, injecting raw JavaScript code from a string, and injecting raw CSS styling from a string.

### Util.Color
Various color functions, such as converting RGB into HEX.

### Validate
Used for validating different kinds of data, such as an email address, credit card, or phone number

### Window
An accurate representation of the web browser window bounds & scroll positions.
