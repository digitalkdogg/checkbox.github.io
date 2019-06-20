var checkbox = {
  'checkboxes': {},
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
    }
  }
}

setTimeout(function () {
  var checkboxes = document.querySelectorAll("[id^=checkbox]");
  if(checkboxes.length > 0) {
    for (var x = 0; x<checkboxes.length; x++) {
      checkbox.utils.set_color_attr(checkboxes[x]);

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
}) //end settimeout
