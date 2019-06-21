"use strict";
(function() {
  document.addEventListener('DOMContentLoaded', function () {

    var checkbox = {
      'checkboxes': {},
      'defaults': {
        'selector': '.checkbox',
        'post_html': '<input type = "hidden" />'
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
                  var attr = ele.getAttribute('data-color')
                  if (attr != null) {
                      ele.setAttribute('style', 'color:'+ attr +';');
                  }
              },//end set color attr
              'set_style_attr' : function (ele) {
                  var attr = ele.getAttribute('data-style')
                  if (attr != null) {
                      if (attr.indexOf(';')>1) {
                          attr = attr.replace(';', '');
                      }
                      ele.setAttribute('style', attr+';');
                  }
              },//end set style attr
              attach_posts: function (ele) {
                if (ele.getAttribute('data-excludepost')!='true') {
                  ele.innerHTML = ele.innerHTML + checkbox.defaults.post_html;
                }
              }//end attach_posts
          }//end utils
      }//end checkbox

      //var checkboxes = document.querySelectorAll('.checkbox')
      var checkboxes = document.querySelectorAll(checkbox.defaults.selector);
      if(checkboxes.length > 0) {
          for (var x = 0; x<checkboxes.length; x++) {
              checkbox.utils.set_color_attr(checkboxes[x]);
              checkbox.utils.set_style_attr(checkboxes[x]);
              checkbox.utils.attach_posts(checkboxes[x]);

              var index = 'checkbox_'+x;
              checkbox.checkboxes[index] = checkboxes[x];
              checkboxes[x].addEventListener("click", function() {
              var element = this
                if (checkbox.utils.check_for_check(this, 'checked') ===true) {
                    this.classList.remove("checked");
                } else {
                    this.classList.add("checked");
                }
                checkbox.checkboxes[index] = this;
              });
          }//end for
      }//end if
  }, false); //end add listerner
}()); //end anomynous function
