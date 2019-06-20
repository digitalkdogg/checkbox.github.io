var checkbox = {
  'checkboxes': {},
  'utils': {
    'set_class_list': function (classstr) {
      //var classarray = classstr.split(' ');
      //console.log(classarray);
    },
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
    }//end checxk for check
  }
}

setTimeout(function () {
  var checkboxes = document.querySelectorAll("[id^=checkbox]");
  if(checkboxes.length > 0) {
    for (var x = 0; x<checkboxes.length; x++) {
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
