  (function($) {


      $.fn.ajwcondit = function(options) {

          function enabledRequired(el, disabled, required) {
              // console.log(disabled);
              // console.log(required);
              if ($(el).attr('type') !== 'button') {

                  if (typeof disabled !== 'undefined') {
                      if (disabled === true) {
                          $(el).prop('disabled', 'disabled');
                      } else {
                          $(el).removeAttr('disabled');
                      }
                  }
                  if (typeof required !== 'undefined') {
                      $(el).prop('required', required);
                  }
              }
          }

          var settings = $.extend({
              fieldset_switcher: "class_of_select"
          }, options);


          //the fieldsets you want to show and hide dependentally
          var the_fieldsets = $(this); //this = elemetns with class - conditinoal fieldsets. 
          //E.g. $('.conditional_fieldsets').conditional_fieldsets();

          var select_element = settings.fieldset_switcher;

          //select that switches options
          //onload disable & hide all of the conditional fieldsets children

          the_fieldsets.children().each(function(index, el) {
              enabledRequired($(el), true, false);
          });
          $('body').find(this).hide();
          //on change of select income option
          $(select_element).on('change', function(event) {
              event.preventDefault();
              var select = $(this);
              var select_val = select.val();
              $(the_fieldsets).each(function(index, el) {
                  var $this_fieldset = $(el);
                  if (select_val == $this_fieldset.attr('id')) {
                      $this_fieldset.children().each(function(index, el) {
                          enabledRequired($(el), false);
                      });
                      $('body').find('fieldset#' + select_val).show();
                  } else {
                      $this_fieldset.children().each(function(index, el) {
                          enabledRequired($(el), true);
                          //reset error messages on hidden fields
                          $('.error', self).text('');
                      });
                      $('body').find('fieldset#' + $(el).attr('id')).hide();
                  }
              });
          });
      }
  }(jQuery));