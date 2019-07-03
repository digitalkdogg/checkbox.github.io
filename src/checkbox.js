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
    'exclude_post': false,
    'styles': {
      'color': 'black',
      'background': '#eee',
      'border': '1px solid black',
      'font_size': '1.1em',
      'margin': '0 5px',
    }
  },//end defaults
  'fn': {
    'set_proper_class' : function (ele, thisindex) {
  //    let parentele = $(ele).parent('.checkbox-wrapper')
    //  let cloneele = $(ele).clone().appendTo(parentele);

      if ($(ele).hasClass('checked') == true) {
    //    $(cloneele).removeClass('checked')
    //    $(cloneele).addClass('notchecked');
        $(ele).addClass('checked');
        checkbox.checkboxes[thisindex]['status'] = 'checked'
      } else {
    //    $(cloneele).removeClass('notchecked')
    //    $(cloneele).addClass('checked');
        $(ele).addClass('notchecked');
        checkbox.checkboxes[thisindex]['status'] = 'notchecked'
      }

  //    $(cloneele).addClass('hidden');
      $(ele).addClass('visible');

      checkbox.checkboxes[thisindex]['visible'] = $(ele)
    //  checkbox.checkboxes[thisindex]['hidden'] = $(cloneele)

    //  if ($(cloneele).hasClass('checkbox')!=true) {
  //      $(cloneele).addClass('checkbox');
  //    }
      if ($(ele).hasClass('checkbox')!=true) {
        $(ele).addClass('checkbox');
      }

    //  checkbox.checkboxes[thisindex]['cloneele'] = $(cloneele)

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
            case 'exclude_post':
               checkbox.defaults.exclude_post = val;
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
          }
        })
      }
    },
    'wrap_ele' : function (ele) {
      $(ele).wrap('<div class = "checkbox-wrapper" />')
      let html = $(ele).html();
      $(ele).empty();
      $('<div />', {
        'class': 'checkbox-text',
        'html': html
      }).appendTo($(ele).parent('.checkbox-wrapper'))
    },// end wrap_ele
    'click': function (ele, status) {
      var thisindex = $(ele).attr('id');
      if (status == 'notchecked') {
        $(ele).addClass('notchecked');
        $(ele).removeClass('checked');
        checkbox.checkboxes[thisindex].status = 'notchecked'
      } else {
        $(ele).addClass('checked');
        $(ele).removeClass('notchecked');
        checkbox.checkboxes[thisindex].status = 'checked'
      }
    },//end click
    'attach_posts': function (ele) {
      //legacy code need to review
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
    'legacy' : {
      'font_size_css' : function () {
        if (item == 'font_size') {
          if (checkbox.defaults.styles['font_size'] != val) {
            var defaultval = checkbox.defaults.styles['font_size'];
            var newunit = ''
            var defaultunit = ''

            var unitobj = checkbox.utils.get_font_size_unit(val, defaultval);

            if (unitobj.new == unitobj.default) {
              let startpos = val.indexOf(unitobj.new);
              let newnumval = val.slice(0, startpos);

              var topdiff = checkbox.utils.calc_font_size_diff(unitobj.new, val, unitobj.default, defaultval);
              var diffobj = checkbox.utils.calc_font_size_left_right(unitobj.new, newnumval, topdiff);

            }

              checkbox.helpers.add_rule('.checkbox:before', {
                top: '-' + diffobj.top + unitobj.new + ' !important',
                left: '-' + diffobj.left + unitobj.new + ' !important'
              })
          }
        }
      },//end fontsizecss
      'get_font_size_unit': function (val, defaultval) {
        var unitobj = {};
        if (val.indexOf('px')>0) {
          unitobj.new = 'px'
        }
        if (val.indexOf('em')>0) {
          unitobj.new = 'em';
        }
        if (defaultval.indexOf('px')>0) {
          unitobj.default = 'px';
        }
        if (defaultval.indexOf('em')>0) {
          unitobj.default = 'em';
        }
        return unitobj;
      },
      'calc_font_size_diff': function (unit, val, defaultunit, defaultval) {
        let startpos = val.indexOf(unit);
        let newnumval = val.slice(0, startpos);
        startpos = defaultval.indexOf(defaultunit);
        let newdefaultnumval = defaultval.slice(0, startpos);
        var topdiff = 0;

        if (newdefaultnumval > newnumval) {
          topdiff = newdefaultnumval - newnumval;
        } else {
          topdiff = newnumval - newdefaultnumval
        }
        return topdiff;
      },
      'calc_font_size_left_right' : function (unit, val, topdiff) {
        switch(unit) {
          case 'em':
            var diffobj = {top:0, left:0}
            if (val > 0 && val <= 1.5) {
              diffobj.top = ((topdiff / 2) * 1) /1;
              return diffobj;
            }
            if (val > 1.5 && val <= 2) {
              diffobj.top = ((topdiff / 2.5) * 1) /1;
              return diffobj;
            }
            if (val > 2 && val <= 3) {
              diffobj.top = ((topdiff / 3.5) * 1) / 1
              diffobj.left = .2
              return diffobj;
            }
            return diffobj;
            break;
          case 'px':
        }//end switch
      }//end calc font size left right
    },//end legacy
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
        $(ele).addClass('default')
        $.each(styles, function (prop, val){
          $(ele).css(prop, val)
        })
      })
    },//end set set_globals
    'set_styling' : function (ele, thisindex) {
      if ($(ele).attr('data-style') != undefined) {
        var attr = $(ele).attr('data-style').split(';');

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

          $(this).click(function () {
            if ($(this).hasClass('checked') == true) {
              checkbox.fn.click($(this), 'notchecked');
            } else {
              checkbox.fn.click($(this), 'checked');
            }
          })
        }
      })
    }
  }//end init
}//end checkbox
