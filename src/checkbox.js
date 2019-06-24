"use strict";
var checkbox = {
  'checkboxes': {},
  'defaults': {
    'selector': '.checkbox',
    'post_html': {
      'type': 'checkbox'
    }
  },
  'utils': {
      'get_class_list': function (ele) {
          return ele.classList;
        },
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
                  //ele.setAttribute('style', 'color:'+ attr +';');
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
                  //ele.setAttribute('style', attr+';');
              }
          },//end set style attr
          attach_posts: function (ele) {
            if ($(ele).attr('data-excludepost')!=='true') {
              var eleid = $(ele).attr('id')
              $('<input />', {
                'id' : 'input_'+eleid,
                'type': checkbox.defaults.post_html.type,
                'class': 'hidden',
                'name': 'input_'+eleid
              }).insertAfter($(ele));

              if ($(ele).attr('data-checked') =='true') {
                $('input#input_'+eleid).prop('checked', true)
              }

              checkbox.checkboxes[eleid]['childinput']= $('input#input_'+eleid);

              }
          }//end attach_posts
      }//end utils
  }//end checkbox

$(function() {
  var checkboxes = $(checkbox.defaults.selector);
  if(checkboxes.length > 0) {
    $.each(checkboxes, function (index) {
      var thisindex = $(this).attr('id')

      checkbox.checkboxes[thisindex] = $(this)

      if($(this).hasClass('checked')==true) {
        $(this).attr('data-checked', true)
      } else {
        $(this).attr('data-checked', false)
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
        //checkbox.checkboxes[thisindex] = this;
      }); //end click

      checkbox.utils.set_color_attr($(this));
      checkbox.utils.set_style_attr($(this));
      checkbox.utils.attach_posts($(this));


    }); //end each
  }//end if
})//end doc ready
