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
      'border': '1px solid black'
    }
  },
  'helpers': {
    'get_obj_size' : function(obj) {
      var size = 0, key;
      for (key in obj) {
          if (obj.hasOwnProperty(key)) size++;
      }
      return size;
    }
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

        }, //end wrap checkboxes
        'check_for_check': function (ele, classstr) {
            var classarray = ele.classList.value.split(' ');
            if (classarray.indexOf(classstr)>=0) {
                return true;
            } else {
                return false;
            }
          },//end checxk for check
          'set_color_attr' : function (ele) {
              //var attr = ele.getAttribute('data-color')
              var attr = $(ele).attr('data-color')
              if (attr != null) {
                $(ele).attr('style', 'color:'+attr+';');
              }
          },//end set color attr
          'set_style_attr' : function (ele) {
              //var attr = ele.getAttribute('data-style')
              var attr = $(ele).attr('data-style');
              if (attr != undefined) {
                  if (attr.indexOf(';')>0) {
                      attr = attr.replace(';', '');
                  }

                  $(ele).attr('style', attr + ';');
              }
          },//end set style attr
          'attach_posts': function (ele) {
            if (checkbox.defaults.exclude_post == false) {
              if ($(ele).attr('data-excludepost')!=='true') {
                var eleid = $(ele).attr('id')
                $('<input />', {
                  'id' : 'input_'+eleid,
                  'type': checkbox.defaults.post_html.type,
                  'class': checkbox.defaults.post_html.class,
                  'name': 'input_'+eleid
                }).insertAfter($(ele));

                if ($(ele).attr('data-checked') =='true') {
                  $('input#input_'+eleid).prop('checked', true)
                }

                checkbox.checkboxes[eleid]['childinput']= $('input#input_'+eleid);
              } //end if ele excludepost
            } //end if ele global exclude
          },//end attach_posts
          'init': function (checkboxes) {
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

                checkbox.utils.set_color_attr($(this));
                checkbox.utils.set_style_attr($(this));
                checkbox.utils.attach_posts($(this));


              }); //end each
            }//end if
          }
      }//end utils
  }//end checkbox

  function init(selector, options) {
    if (options != null) {
      if (checkbox.helpers.get_obj_size(options) > 0) {
         $.each(options, function (index, value) {
           switch(index) {
             case 'exclude_post':
                checkbox.defaults.exclude_post = value;
             break;
             case 'styles':
                //todo : loop through and check if one needs updated
                //instead of the whole kitchen sink
                checkbox.defaults.styles = value;
             break;
             default:

            }
         })
      }
    }
    checkbox.utils.init(selector)
  }
