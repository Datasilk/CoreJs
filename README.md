![Datasilk Logo](http://www.markentingh.com/projects/datasilk/logo.png)

# Datasilk Core JavaScript
#### A simple, extensible JavaScript framework
Used alongside [Datasilk Core](http://www.github.com/Datasilk/Core), this JavaScript framework is meant to be used by web applications as a starting point. 

## Requirements
 * Use [Selector](http://github.com/websilk/selector), jQuery, or a jQuery clone (Zepto, cash) within your web application.

## Installation
1. clone into your project folder, preferrably into `/scripts/datasilk/`
2. (optional) copy `assets` folder into your public web root folder, preferrably into `/wwwroot/datasilk/`

## Features
Datasilk Core JS uses a modular system combined with `gulpfile.js`, allowing developers to quickly modify and compile their own build of the Datasilk Core `platform.js` file using [Gulp](https://www.gulpjs.com').


### S
`S` is a global JavaScript object that is used as a "Super" object, containing a hierarchy of methods & properties used within your web application. 

|Property|default|description|
|---|---|---|
|`S.root`|`''`|Specifies where the platform was installed relative to the project folder.|

### Accordion.js
Simple module that toggles an HTML element to display or hide when clicking on a target element. This can be combined to show and hide list items, menu items, and to show more detailed information when clicking a button.

```
<style>
	.accordion .contents{display:none;}
	.accordion.expanded .contents{display:block;}
</style>
<div class="accordion">
	<div class="title">Hello</div>
	<div class="contents">
		World!	
	</div>
</div>
```
```
	S.accordion.load({container: '.accordion', target: '.accordion .title', ontoggle: (e, show) => {} });
```

### Ajax.js
Access RESTful web APIs and use `S.ajax.inject(data)` to load content into the DOM from the JSON response of a `Datasilk.Datasilk.Response` web service object (found in [Datasilk Core](http://github.com/Datasilk/Core)). For example:

```
S.ajax.post('User/GetInfo', {userId:1, details:true, layout:3}, 
	function (d) {
		S.ajax.inject(d);
	}, 
	function (err) {
		S.message.show('.message', 'error', S.message.error.generic);
	}
);
```

### Loader.js
Display an SVG spinning loader animation on the page. For example:

```
$('body').html(S.loader({padding:5}));
```

### Clipboard.js
Copy text to the OS clipboard.
```
S.clipboard.copy('copy me please');
```

### Drag.js
Drag elements using an input like a mouse or touch screen

### Message.js
Display a message on the page, such as an error or confirmation message above a form. For example:

```
<div class="message hide"><span></span></div>
```

```
S.message.show('.message', 'error', 'Incorrect password');
```

### Polyfill.js
Various polyfills for older web browsers, such as `Element.matches`, `Element.matchesSelector`, & `requestAnimationFrame` polyfills, 

### Popup.js
View a popup window above all the content on the web page. For example:

```
S.popup.show("New User", template_html, {offsetTop:-50, className:"new-user"});
```

### Util.js
Various utility functions, such as loading JavaScript & CSS files, injecting raw JavaScript code from a string, and injecting raw CSS styling from a string. For example:

```
S.util.css.add('bg_update', '.bg{background-color:#e0e0e0;}');
```

### Util.Color.js
Various color functions, such as converting RGB into HEX.

### Validate.js
Used for validating different kinds of data, such as an email address, credit card, or phone number

### View.js
Load HTML content on the page while replacing `mustache` variables & blocks with dynamic data.

For example:

```
<script type="text/html" id="template_element">
    <div class="element">{{title}}</div>
    <div class="field"><input type="text" value="{{value}}"></div>
</script>

<script>
    var vars = {title: "Hello", value: "World"};
    var view = new S.View($('#template_element).val(), vars);
    $('body').append(view.render());
</script>
```

### Window.js
An accurate representation of the web browser window bounds & scroll positions.
