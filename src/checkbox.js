var checkbox = {
  'checkboxes': {

  },
  'global': {},
  'defaults': {
    'selector': '.checkbox',
    'post_html': {
      'type': 'checkbox',
      'class':'hidden'
    },
    'include_in_post': 'on',
    'styles': {
      'color': 'black',
      'background': '#eee',
      'border': '1px solid black',
      'font_size': '1em',
      'margin': '0 5px',
    }, //end styles
    'before_styles': {
    'margin': '0px'
    }
  },//end defaults
  'fn': {
    'set_proper_class' : function (ele, thisindex) {
      if ($(ele).hasClass('checked') == true) {
        $(ele).addClass('checked');
        checkbox.checkboxes[thisindex]['status'] = 'checked'
      } else {
        $(ele).addClass('notchecked');
        checkbox.checkboxes[thisindex]['status'] = 'notchecked'
      }
      $(ele).addClass('visible');

      checkbox.checkboxes[thisindex]['visible'] = $(ele)

      if ($(ele).hasClass('checkbox')!=true) {
        $(ele).addClass('checkbox');
      }

    },//end add clone
    'handle_global_options' : function (options) {
      if (checkbox.helpers.get_obj_size(options) > 0) {
        checkbox.global.options = {}
        $.each(options, function (index, val) {
          if (checkbox.global.options[index] == undefined) {
            checkbox.global.options[index] = {}
          }
          checkbox.global.options[index] = this;

          switch(index) {
            case 'include_in_post':
               checkbox.defaults.include_in_post = val;
               break;
            case 'styles':
              if (checkbox.helpers.get_obj_size(this)>0) {
                $.each(this, function (prop, value) {
                  if (checkbox.defaults.styles[prop] != value) {
                    checkbox.defaults.styles[prop] = value;
                  }
                })
              }
              break;
              case 'before_styles' :
              if (checkbox.helpers.get_obj_size(this)>0) {
                $.each(this, function (prop, value) {
                  if (checkbox.defaults.before_styles[prop] != value) {
                    checkbox.defaults.before_styles[prop] = value;
                  }
                })
              }
              break;
          }
        })
      }
    },
    'adjust_checks' : function (ele) {

      setTimeout(function () {

        var $ele = $(ele)
        var fonts= {}
        fonts['checkbox'] = parseInt($(ele).css('font-size'));
        fonts['body'] = parseInt($('body').css('font-size'));


        let id = $(ele).attr('id')
        let height = $(ele).height();
        let pos = $(ele).position();

        if (fonts.body != fonts.checkbox) {
          fonts['double'] = parseInt(fonts.body) * parseInt(2);
          fonts['onehalf'] = fonts.body * 1.5;
          fonts['triple'] = parseInt(fonts.body) * parseInt(3);
          fonts['twohalf'] = fonts.body * 2.5
          fonts['threehalf'] = fonts.body * 3.5;
          fonts['quad'] = fonts.body * 4

          if (fonts.checkbox > fonts.body && fonts.checkbox <= fonts.onehalf) {
            pos.top = pos.top - 5;
            pos.left = pos.left + 7;
          } else if (fonts.checkbox > fonts.onehalf && fonts.checkbox <= fonts.double) {
            pos.top = pos.top - 11
            pos.left = pos.left + 5
          } else if (fonts.checkbox > fonts.double && fonts.checkbox  <= fonts.twohalf) {
            pos.top = pos.top - 18;
            pos.left = pos.left + 3;
          } else if (fonts.checkbox > fonts.twohalf && fonts.checkbox <= fonts.triple) {
            pos.top = pos.top - 25;
            pos.left = pos.left;
          } else if (fonts.checkbox > fonts.triple && fonts.checkbox <= fonts.threehalf) {
            pos.top = pos.top - 31;
            pos.left = pos.left -5;
          } else if (fonts.checkbox > fonts.threehalf && fonts.checkbox <= fonts.quad) {
            pos.top = pos.top - 39;
            pos.left = pos.left - 8;
          } else {
            pos.top = pos.top
            pos.left - pos.left + 5
          }
        } else {

          pos.top = pos.top;
          pos.left = pos.left + 10
        }

        checkbox.helpers.add_rule('#'+id+':before', {
          'top': (pos.top) + 'px',
          'left': (pos.left) + 'px'
        })
    },100)

      return null;
    },
    'wrap_ele' : function (ele) {
      $(ele).wrap('<div class = "checkbox-wrapper" />')
      let html = $(ele).html();
      $(ele).empty();
      $('<div />', {
        'class': 'checkbox-text',
        'html': html
      }).appendTo($(ele).parent('.checkbox-wrapper'))

      if (checkbox.defaults.include_in_post == 'on') {
        let individual_include = $(ele).attr('data-include_in_post');

        if (individual_include == 'on' || individual_include == undefined) {
          checkbox.fn.attach_posts($(ele));
        } else {
          if (individual_include == 'off') {
            delete $(ele)
          }
        }
      }
    },// end wrap_ele
    'click': function (ele, status) {
      var thisindex = $(ele).attr('id');
      if (status == 'checked') {

        $(ele).addClass('checked');
        $(ele).removeClass('notchecked');
        checkbox.checkboxes[thisindex].status = 'checked'

        let child = checkbox.checkboxes[thisindex].childinput;
        $(child).prop('checked', true)

      } else if (status == 'notchecked') {
        $(ele).addClass('notchecked');
        $(ele).removeClass('checked');
        checkbox.checkboxes[thisindex].status = 'notchecked'

        let child = checkbox.checkboxes[thisindex].childinput;
        $(child).prop('checked', false)
      }
    },//end click
    'attach_posts': function (ele) {
        var eleid = $(ele).attr('id')

        $('<input />', {
          'id' : 'input_'+eleid,
          'type': checkbox.defaults.post_html.type,
          'class': checkbox.defaults.post_html.class,
          'name': 'input_'+eleid
        }).insertAfter($(ele));


        if ($(ele).hasClass('checked') ==true) {
          $('input#input_'+eleid).prop('checked', true)
        }

        if (checkbox.checkboxes[eleid] == undefined) {
          checkbox.checkboxes[eleid] = {};
        }
        checkbox.checkboxes[eleid]['childinput']= $('input#input_'+eleid);

    },//end attach_posts
    'generate_id': function (ele) {
      var id = checkbox.helpers.get_random_id();
      $.each(checkbox.checkboxes, function (index, val) {
        if (index.trim() == id.toString().trim()) {
          id = checkbox.helpers.get_random_id();
        }
      });
      $(ele).attr('id', id);
      return id;
    }, //end generate  ID:
    'set_globals': function (checkboxes) {
      $.each(checkboxes, function () {
        let ele = $(this)
        let styles = checkbox.defaults.styles
        let beforestyles = checkbox.defaults.before_styles

        $(ele).addClass('default')
        $.each(styles, function (prop, val){
          $(ele).css(prop, val)
        })

        $.each(beforestyles, function(prop, val) {
           var id = $(ele).attr('id');
           checkbox.helpers.add_rule('#'+id+':before', {
             [prop]: val
           })
        })//end before styles
      })
    },//end set set_globals
    'set_styling' : function (ele, thisindex) {
      if ($(ele).attr('data-styles') != undefined) {
        var attr = $(ele).attr('data-styles').split(';');

        for (var x = 0; x< attr.length; x++) {
          var styles = attr[x].split(':');
          if (styles[0] != '') {
            let prop = styles[0].trim();
            let val = styles[1].trim();
            $(ele).css(prop,val)

            checkbox.checkboxes[thisindex]['customstyles'] = {'prop': prop, 'val': val}
          }
        }
      }
    },//end set set_styling
    'set_beforestyling' : function (ele, thisindex) {
      if ($(ele).attr('data-beforestyles') != undefined ) {
        var attr = $(ele).attr('data-beforestyles').split(';');

        for (var x = 0; x< attr.length; x++) {
          var styles = attr[x].split(':');
          if (styles[0] != '') {
            let prop = styles[0].trim();
            let val = styles[1].trim();
            var id = $(ele).attr('id');
            checkbox.helpers.add_rule('#'+id+':before', {
              [prop]: val + ' !important'
            })
          }
        }
      }
    }
  },
  'helpers': {
    'get_random_id' : function () {
      var id = Math.random();
      return 'id_' + id.toString().replace('.', '');
    },
    'get_obj_size' : function(obj) {
      var size = 0, key;
      for (key in obj) {
          if (obj.hasOwnProperty(key)) size++;
      }
      return size;
    },
    'add_rule' : function (selector, styles, sheet) {
        styles = (function (styles) {

            if (typeof styles === "string") {
              return styles;
            }

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
          try {
            sheet.insertRule(selector + " {" + styles + "}", sheet.cssRules.length);
          } catch(e) {console.log(e);}
        } else if(sheet.addRule) {
          try {
            sheet.add_rule(selector, styles);
          } catch(e) {console.log(e);}
        }

        return null;

    }//end addRule funciton
  }, //end helpers
  'init': function (selector, options) {
    var checkboxes = $(selector);

    if(checkboxes.length > 0) {
      //check if there are global options overried
      if (options != null) {
        this.fn.handle_global_options(options)
      }

      this.fn.set_globals(checkboxes);

      $.each(checkboxes, function (index) {
        var thisindex = $(this).attr('id');

        if (thisindex == undefined) {
          thisindex = checkbox.fn.generate_id($(this));
        }

        checkbox.checkboxes[thisindex] = $(this);

        if ($(this).html().length > 0) {
          checkbox.fn.wrap_ele($(this));
          checkbox.fn.set_proper_class($(this), thisindex)
          checkbox.fn.set_styling($(this), thisindex)
          checkbox.fn.set_beforestyling($(this), thisindex);
          checkbox.fn.adjust_checks($(this))

          $(this).click(function () {
            if ($(this).hasClass('checked') == true) {
              checkbox.fn.click($(this), 'notchecked');
            } else {
              checkbox.fn.click($(this), 'checked');
            }
          })

          $(window).resize(function () {
              $this = $(thisindex)
            //  checkbox.fn.adjust_checks($($this))
          })
        }
      })
    }
  }//end init
}//end checkbox
