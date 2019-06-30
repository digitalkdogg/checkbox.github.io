"use strict";
var checkbox = {
  'checkboxes': {},
  'defaults': {
    'selector': '.checkbox',
    'post_html': {
      'type': 'checkbox',
      'class':'hidden'
    },
    'exclude_post': false,
    'styles': {
      'color': 'black',
      'background': '#eee',
      'border': '1px solid black',
      'font_size': '1.5em',
    }
  },
  'helpers': {
    'get_obj_size' : function(obj) {
      var size = 0, key;
      for (key in obj) {
          if (obj.hasOwnProperty(key)) size++;
      }
      return size;
    },
    'add_rule' : function (selector, styles, sheet) {
        styles = (function (styles) {
            if (typeof styles === "string") return styles;
            var clone = "";
            for (var p in styles) {
                if (styles.hasOwnProperty(p)) {
                    var val = styles[p];
                    p = p.replace(/([A-Z])/g, "-$1").toLowerCase(); // convert to dash-case
                    clone += p + ":" + (p === "content" ? '"' + val + '"' : val) + "; ";
                }
            }
            return clone;
        }(styles));
        sheet = sheet || document.styleSheets[document.styleSheets.length - 1];
        if (sheet.insertRule) {
          sheet.insertRule(selector + " {" + styles + "}", sheet.cssRules.length);
        } else if(sheet.addRule) {
          sheet.add_rule(selector, styles);
        }

        return this;

    }//end addRule funciton
  },
  'utils': {
      'get_class_list': function (ele) {
          return ele.classList;
        },
        'wrap_checkboxes': function (ele) {

          if ($(ele).html().length > 0) {
              let html = $(ele).html();
              $(ele).wrap('<div class = "checkbox-wrapper" />')
              $(ele).empty();
              $('<span />', {
                'html':html,
               'class': 'checkbox-span'
             }).insertAfter($(ele))
           }

           $(ele).css({'background':checkbox.defaults.styles.background});
           $(ele).css({'border':checkbox.defaults.styles.border});
           $(ele).css({'color':checkbox.defaults.styles.color});
           $(ele).css({'font-size':checkbox.defaults.styles.font_size});

        }, //end wrap checkboxes
        'check_for_check': function (ele, classstr) {
            var classarray = ele.classList.value.split(' ');
            if (classarray.indexOf(classstr)>=0) {
                return true;
            } else {
                return false;
            }
          },//end checxk for check
          'set_style_attr' : function (ele) {
              //var attr = ele.getAttribute('data-style')
              var attr = $(ele).attr('data-style');
              if (attr != undefined) {
                if (attr.indexOf(':')>0) {
                  var style = attr.split(':');
                  style[1] = style[1].replace(';', '')
                  $(ele).css(style[0], style[1])
                }
              }
          },//end set style attr
          'attach_posts': function (ele) {
            if (checkbox.defaults.exclude_post == false) {
              if ($(ele).attr('data-excludepost')!=='true') {
                var eleid = $(ele).attr('id')
                if (eleid == undefined) {
                  eleid = Date.now();
                }
                $('<input />', {
                  'id' : 'input_'+eleid,
                  'type': checkbox.defaults.post_html.type,
                  'class': checkbox.defaults.post_html.class,
                  'name': 'input_'+eleid
                }).insertAfter($(ele));

                if ($(ele).attr('data-checked') =='true') {
                  $('input#input_'+eleid).prop('checked', true)
                }

                if (checkbox.checkboxes[eleid] == undefined) {
                  checkbox.checkboxes[eleid] = {};
                }
                checkbox.checkboxes[eleid]['childinput']= $('input#input_'+eleid);
              } //end if ele excludepost
            } //end if ele global exclude
          },//end attach_posts
          'handle_options': function (options) {
            if (checkbox.helpers.get_obj_size(options) > 0) {
               $.each(options, function (index, value) {
                 switch(index) {
                   case 'exclude_post':
                      checkbox.defaults.exclude_post = value;
                   break;
                   case 'styles':
                      if (checkbox.helpers.get_obj_size(value) >0) {
                        $.each(value, function (item, val) {
                          if (checkbox.defaults.styles[item] != undefined) {
                            if (val != checkbox.defaults.styles[item]) {
                              checkbox.defaults.styles[item] = val
                            }
                          }
                        })
                      }
                    //  checkbox.defaults.styles = value;
                   break;
                   default:

                  }
               })

          //     checkbox.helpers.add_rule(".checkbox:before", {
          //       top: '-10px',
          //       color: 'green'
          //     });
            }
          }
      },//end utils
      'init': function (selector, options) {
        //check if there are global options overried
        if (options != null) {
          this.utils.handle_options(options)
        }

        var checkboxes = $(selector);

        if(checkboxes.length > 0) {
          $.each(checkboxes, function (index) {
            var thisindex = $(this).attr('id')

            checkbox.checkboxes[thisindex] = $(this)

            if($(this).hasClass('checked')==true) {
              $(this).attr('data-checked', true)
            } else {
              $(this).attr('data-checked', false)
            }

            if ($(this).html().length > 0) {
                checkbox.utils.wrap_checkboxes($(this));
             }

            $(this).click(function() {
              var element = this
              var childele = checkbox.checkboxes[thisindex].childinput;
              if (checkbox.utils.check_for_check(this, 'checked') ===true) {
                $(this).removeClass('checked');
                $(this).attr('data-checked', false);

                $(childele).prop('checked', false)
              } else {
                $(this).addClass('checked');
                $(this).attr('data-checked', true)
                $(childele).prop('checked', true)
              }
            }); //end click

            checkbox.utils.set_style_attr($(this));
            checkbox.utils.attach_posts($(this));

          }); //end each
        }//end if
      }
  }//end checkbox
