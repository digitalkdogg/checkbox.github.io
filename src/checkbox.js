setTimeout(function () {

 var checkboxes = document.querySelectorAll("[id^=checkbox]");

  if(checkboxes.length > 0) {
    for (var x = 0; x<checkboxes.length; x++) {
      checkboxes[x].addEventListener("click", function() {
        var element = this
        console.log(element.classList);
        element.classList.add("checked");
      });
    }//end for
  }//end if
}) //end settimeout
