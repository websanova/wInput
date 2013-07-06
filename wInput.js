(function($) {
    
    function Input(el, options) {
        this.$el = $(el);
        this.options = options;
        this.phState = true;
        this.type = this.$el.prop('type').toLowerCase();

        this.generate();
    }
    
    Input.prototype = {
        generate: function() {
            var _self = this;
            
            this.$el.addClass('wInput wInput-' + this.$el.prop('tagName').toLowerCase());
            this.setTheme(this.options.theme);

            if (!$.support.placeholder) {
                this.togglePassword();

                this.$el.keydown(function(e){ _self.onKeydown(e); });
                this.$el.keyup(function(e){ _self.onKeyup(e); });
                this.$el.mousedown(function(e){ _self.onMousedown(e); });

                $(document).ready(function() {
                    var text = _self.$el.attr('placeholder');

                    if (_self.$el.val() === '' || _self.$el.val() === _self.$el.attr('placeholder')) {
                        _self.$el.val(text);
                        _self.$el.addClass('wInput-placeholder');
                    }
                    else if (_self.$el.val() !== text) {
                        _self.phState = false;
                    }
                });
            }

            this.$el.focus(function(){ _self.onClick(); });
            this.$el.blur(function(){ _self.onBlur('active'); });

            this.$el.hover(
                function(){ _self.onFocus('hover'); },
                function(){ _self.onBlur('hover'); }
            );

            return this.$el;
        },

        togglePassword: function() {
            if (this.type === 'password') {
                var _self = this,
                    $clone = this.$el.clone().wrap('<span></span>').parent('span').html();

                if (this.phState === true) {
                    $clone = $($clone.replace(/type=\"?password\"?/, 'type="text"'));
                }
                else {
                    if ($clone.search(/type=\"?text\"?/) > -1) {
                        $clone = $($clone.replace(/type=\"?text\"?/, 'type="password"'));
                    }
                    else {
                        $clone = $($clone.replace(/>/, 'type="password">'));
                    }
                }

                $clone.blur(function(){ _self.onBlur('active'); });
                $clone.focus(function(){ _self.onClick(); });
                $clone.mousedown(function(e){ _self.onMousedown(e); });
                $clone.keydown(function(e){ _self.onKeydown(e); });
                $clone.keyup(function(e){ _self.onKeyup(e); });

                this.$el.replaceWith($clone);
                this.$el = $clone;
            }
        },

        onMousedown: function() {
            if (this.phState === true) {
                this.$el.blur().focus();
            }
        },

        onClick: function() {
            if (!$.support.placeholder && this.phState === true) {
                this.setInputPosition(0);
            }

            this.onFocus('active');
        },

        onFocus: function(className) {
            className = className || 'active';

            if (this.options.highlight) {
                this.$el.addClass('wInput-' + className);
            }
        },

        onBlur: function(className) {
            className = className || 'active';

            if (this.options.highlight) {
                this.$el.removeClass('wInput-' + className);
            }
        },

        onKeydown: function(e) {
            if (this.phState === true) {
                this.phState = false;
                this.$el.val('');
                this.$el.removeClass('wInput-placeholder');
            }

            // special case for tabs which will not toggle keyup so we do it manually to trigger proper state
            if((e.keyCode || e.which) === 9) {
                this.onKeyup(e);
            }
        },

        onKeyup: function(e) {
            if (this.$el.val() === '') {
                this.phState = true;

                // special case for tabs here as well, don't need to toggle password in this situation, it will already be toggled in proper position at this point
                if (this.type === 'password' && (e.keyCode || e.which) !== 9) {
                    this.togglePassword();
                    this.setInputPosition(0);
                }

                this.$el.val(this.$el.attr('placeholder'));
                this.$el.addClass('wInput-placeholder');
                this.onMousedown();
            }
            else if (this.type === 'password' && this.$el.prop('type').toLowerCase() === 'text') {
                var val = this.$el.val();

                this.togglePassword();
                this.$el.val(val); // keep this line separate and not below, otherwise typing too fast will put the caret in wrong position
                this.setInputPosition(this.$el.val().length);
            }
        },

        setInputPosition: function(index) {
            var input = this.$el[0];

            if (input.setSelectionRange) {
                input.setSelectionRange(index, index);
            } else if (input.createTextRange) {
                var range = input.createTextRange();
                range.collapse(true);
                range.moveEnd('character', index);
                range.moveStart('character', index);
                range.select();
            }
        },

        setTheme: function(theme) {
            this.$el.attr('class', this.$el.attr('class').replace(/wInput-theme-.+\s|wInput-theme-.+$/, ''));
            this.$el.addClass('wInput-theme-' + theme);
        }
    };
    
    $.support.placeholder = 'placeholder' in document.createElement('input');

    $.fn.wInput = function(options, value) {
        if (typeof options === 'string') {
            var values = [];
            var elements = this.each(function() {
                var wInput = $(this).data('wInput');

                if (wInput) {
                    var func = (value ? 'set' : 'get') + options.charAt(0).toUpperCase() + options.substring(1).toLowerCase();

                    if (wInput[options]) {
                        wInput[options].apply(wInput, [value]);
                    } else if (value) {
                        if (wInput[func]) { wInput[func].apply(wInput, [value]); }
                        if (wInput.options[options]) { wInput.options[options] = value; }
                    } else {
                        if(wInput[func]) { values.push(wInput[func].apply(wInput, [value])); }
                        else if (wInput.options[options]) { values.push(wInput.options[options]); }
                        else { values.push(null); }
                    }
                }
            });

            if (values.length === 1) { return values[0]; }
            else if (values.length > 0) { return values; }
            else { return elements; }
        }

        options = $.extend({}, $.fn.wInput.defaults, options);

        function get(el) {
            var wInput = $.data(el, 'wInput');
            if (!wInput) {
                var _options = jQuery.extend(true, {}, options);
                wInput = new Input(el, _options);
                $.data(el, 'wInput', wInput);
            }

            return wInput;
        }

        return this.each(function() {
            var tagName = $(this).prop('tagName').toLowerCase(),
                inputType = ($(this).prop('type') || '').toLowerCase();

            if (tagName === 'textarea' || (tagName === 'input' && (inputType === 'text' || inputType === 'password') ) ) {
                get(this);
            }
        });
    };
    
    $.fn.wInput.defaults = {
        theme: 'classic',        // set theme for inputs
        highlight: true          // highlight field when selected
    };
    
})(jQuery);
