# wInput.js

A small jQuery plugin for `textarea`, `password` and `text` inputs.  This plugin was designed to take care of nagging issues for inputs like backwards compatability with placeholders for unsupported browsers (including password fields), labels and styling.  Since we are already applying the plugin for placeholders we might as well apply some other things as well.

* [View the wInput demo](http://winput.websanova.com)
* [Download the lastest version of wInput](https://github.com/websanova/wInput/tags)

## Related Plugins

* [wSelect](http://wselect.websanova.com) - Custom select boxes.
* [wCheck](http://wcheck.websanova.com) - Radio and checkbox input plugin.
* [wChar](http://wchar.websanova.com) - On the fly character counter for inputs.


## Settings

Available options with notes, the values here are the defaults.

```js
$.fn.wInput.defaults = {
    theme: 'classic',        // set theme for inputs
    labelPosition: 'left',   // set position for label (left,top)
    highlight: true          // highlight field when selected
};
```

## Examples

For starters you will need to include the following files:

```js
<script type="text/javascript" src="./wInput.js"></script>
<link rel="Stylesheet" type="text/css" href="./wInput.css" />
```

You can then apply the plugin to any input text, password and textarea elements using the jQuery selector function:

```js
$('input:text, input:password, textarea').wInput();
```

You can also optionally set the `data-label` attribute and a label will automatically be created for you.  It's position will be beased on the `labelPosition` option.

```html
<input type="text" data-label="Username:" placeholder="Enter a username"/>
```

### CSS labels

Global CSS labels are also available in this plugin and can be used by setting an adding the class name `wLabel-left`, `wLabel-top` or `wLabel-left-top` to an element.

```html
<label class="wLabel-left">Label:</label>
```


## Resources

* [More jQuery plugins by Websanova](http://websanova.com/plugins)
* [jQuery Plugin Development Boilerplate](http://www.websanova.com/tutorials/jquery/jquery-plugin-development-boilerplate)
* [The Ultimate Guide to Writing jQuery Plugins](http://www.websanova.com/tutorials/jquery/the-ultimate-guide-to-writing-jquery-plugins)


## License

MIT licensed

Copyright (C) 2011-2013 Websanova http://www.websanova.com