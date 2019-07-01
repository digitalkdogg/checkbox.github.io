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
      'font_size': '1.1em',
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

             if ($(ele).attr('data-checked')=='true') {
               $(ele).parent('.checkbox-wrapper').addClass('checked');
             }
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

                              if (item == 'font_size') {
                                if (checkbox.defaults.styles['font_size'] != val) {
                                  var defaultval = checkbox.defaults.styles['font_size'];
                                  var newunit = ''
                                  var defaultunit = ''
                              //    if (val.indexOf('px')>0) {
                              //      newunit = 'px'
                            //      }
                            //      if (val.indexOf('em')>0) {
                            //        newunit = 'em';
                          //        }
                            //      if (defaultval.indexOf('px')>0) {
                          //          defaultunit = 'px';
                          //        }
                        //          if (defaultval.indexOf('em')>0) {
                          //          defaultunit = 'em';
                        //          }

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

            }
          },
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
                $(childele).prop('checked', false);

                $(this).parent('checkbox-wrapper').toggleClass('checked')

              } else {
                $(this).addClass('checked');
                $(this).attr('data-checked', true)

                $(this).parent('checkbox-wrapper').toggleClass('checked')

                $(childele).prop('checked', true)
              }
            }); //end click

            checkbox.utils.set_style_attr($(this));
            checkbox.utils.attach_posts($(this));

          }); //end each
        }//end if
      }
  }//end checkbox
