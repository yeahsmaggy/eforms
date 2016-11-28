var MyEForms = function() {
    // this.widget = 'widget';
    this.body_element = $('body');
};

MyEForms.prototype = {
    create: function() {

        // console.log(this.widget);
        // console.log('constructor');

    },
    validateEmail: function(email_address) {
        var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return pattern.test(email_address);
    },
    validateEmpty: function(input_name, input_value) {
        if (input_value.length) {
            return true;
        }


    },
    validateTelephone: function(telno) {

        // Convert into a string and check that we were provided with something
        var telnum = telno + " ";
        if (telnum.length == 1) {
            return false;
        }

        if (telnum.length == 7) {
            telnum = '01604' + telnum;
        }

        telnum.length = telnum.length - 1;

        // Don't allow country codes to be included (assumes a leading "+")
        var exp = /^(\+)[\s]*(.*)$/;
        if (exp.test(telnum) == true) {
            return false;
        }

        // Remove spaces from the telephone number to help validation
        while (telnum.indexOf(" ") != -1) {
            telnum = telnum.slice(0, telnum.indexOf(" ")) + telnum.slice(telnum.indexOf(" ") + 1);
        }

        // Remove hyphens from the telephone number to help validation
        while (telnum.indexOf("-") != -1) {
            telnum = telnum.slice(0, telnum.indexOf("-")) + telnum.slice(telnum.indexOf("-") + 1);
        }

        // Now check that all the characters are digits
        exp = /^[0-9]{10,11}$/;
        if (exp.test(telnum) != true) {
            return false;
        }

        // Now check that the first digit is 0
        exp = /^0[0-9]{9,10}$/;
        if (exp.test(telnum) != true) {
            return false;
        }

        // Disallow numbers allocated for dramas.

        // Array holds the regular expressions for the drama telephone numbers
        var tnexp = new Array();
        tnexp.push(/^(0113|0114|0115|0116|0117|0118|0121|0131|0141|0151|0161)(4960)[0-9]{3}$/);
        tnexp.push(/^02079460[0-9]{3}$/);
        tnexp.push(/^01914980[0-9]{3}$/);
        tnexp.push(/^02890180[0-9]{3}$/);
        tnexp.push(/^02920180[0-9]{3}$/);
        tnexp.push(/^01632960[0-9]{3}$/);
        tnexp.push(/^07700900[0-9]{3}$/);
        tnexp.push(/^08081570[0-9]{3}$/);
        tnexp.push(/^09098790[0-9]{3}$/);
        tnexp.push(/^03069990[0-9]{3}$/);

        for (var i = 0; i < tnexp.length; i++) {
            if (tnexp[i].test(telnum)) {
                return false;
            }
        }

        // Finally check that the telephone number is appropriate.
        exp = (/^(01|02|03|05|070|071|072|073|074|075|07624|077|078|079)[0-9]+$/);
        if (exp.test(telnum) != true) {
            return false;
        }

        // Telephone number seems to be valid - return true 
        return true;

    },
    validateAll: function(el) {

        var this_label = $("label[for='" + $(el).attr('id') + "']");
        var this_label_text = this_label.text();
        var error = '';

        var valid_empty = this.validateEmpty(this_label_text, $(el).val());
        //if class mandatory

        if ($(el).hasClass('mandatory')) {
            if (!$(el).is('select') && !valid_empty) {
                error += 'Please enter a value.';
                //error += 'This field cannot be empty.';
                //error += this_label_text + ' . This field cannot be empty.';
            }

            if ($(el).attr('type') === 'email') {
                var valid_email = this.validateEmail($(el).val());
                if (!valid_email) {
                    error += ' Please enter a valid email address.';
                }
            };
            if ($(el).attr('type') === 'tel') {
                var valid_telephone = this.validateTelephone($(el).val());
                if (!valid_telephone) {
                    error += ' Please enter a valid telephone number.'
                }
            }

            if ($(el).is('select')) {
                if (!$(el).val().length) {
                    error += ' Please select an option.'
                };
            }
        }

        return error;


    },
    enabledRequired: function(el, disabled, required) {
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
}

jQuery(document).ready(function($) {
    $('body').addClass('jsLoaded');

    /* -- form elements --
    some are mandatory (can't be empty)
    */

    /* -- validation --
    validate email address
    validate telephone number
    date picker etc
    */

    /* -- conditionals
    Nature of request result in other forms being conditionally show
    any fields not shown need to be invalidated on submit e.g. prop=disabled 
    */

    var instance_of_myeforms = new MyEForms();

    var body_element = instance_of_myeforms.body_element;
    var inputs = body_element.find('input');
    var agent_landlord_dependent = $('#agent-landlord-dependent');
    var agent_landlord_dependent_children = agent_landlord_dependent.children();
    var landlord_agent_select = $('#selectLandlordAgent');
    var claimant_info = $('#claimant-info');
    var change_of_address = $('#change-of-address');
    var fieldsets = $('fieldset');
    var conditional_fieldsets = $('fieldset.conditional');
    //var income_conditional_fieldsets = $('#income-changed > fieldset');


    $('#income-changed > fieldset').ajwcondit({
        fieldset_switcher: '#selectIncomeChange'
    });

    var error_checking_obj = {};

    //onload disable & hide all of the conditional fieldsets children
    conditional_fieldsets.children().each(function(index, el) {
        instance_of_myeforms.enabledRequired($(el), true, false);
    });
    body_element.find('fieldset.conditional').hide();

    //disable & hide children of agent/landlord select
    agent_landlord_dependent_children.filter(function(_index, e) {
        instance_of_myeforms.enabledRequired($(e), true, false);
    });
    agent_landlord_dependent.hide();

    //wrote a plugin to do this instead - see ajwcondit.js
    //disable & hide children of agent/landlord select
    // income_conditional_fieldsets.children().filter(function(_index, e) {
    //     instance_of_myeforms.enabledRequired($(e), true, false);
    // });
    // income_conditional_fieldsets.hide();

    //test the form
    // $('input[type=text]').val('a');
    // $('input[type=email]').val('a@a.com');
    // $('input[type=tel]').val('01858535312');
    // $('input[type=date]').val('01-10-1982');
    // $('#selectLandlordAgent').val('no');
    // $('#selectNatureRequest').val('change-of-address');


    //only allow numbers in number inputs
    //http://stackoverflow.com/questions/469357/html-text-input-allow-only-numeric-input#469362
    $("input[type=number]").keydown(function(e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
            // Allow: Ctrl+C
            (e.keyCode == 67 && e.ctrlKey === true) ||
            // Allow: Ctrl+X
            (e.keyCode == 88 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });


    //add asterix to mandatory fields
    $(".mandatory").prev().append('*');

    //validate when input changes
    $('input, textarea, select', 'body #content').on('change', function() {
        if ($(this).is(':enabled')) {
            error_checking_obj = {};

            var error = instance_of_myeforms.validateAll(this);
            check_for_error(error, $(this));
        }
    });



    function check_for_error(error, element) {
        //pass in jquery object

        var this_id = element.attr('id');

        if (error.length) {
            $(element).next('.error').text(error);
            error_checking_obj[this_id] = 1;
            // return;
        } else {
            $(element).next('.error').text('');
            delete error_checking_obj[this_id];
        }
    }



    $('#submitForm').on('click', function(event) {
        event.preventDefault();
        //validate
        error_checking_obj = {};

        $('input, textarea, select', 'body #content').each(function(index, el) {
            // console.log($(this).is(':disabled'));
            if ($(this).is(':enabled')) {
                //if this enabled / visible, then do...
                //because using body selector will only attach this event to whatever is initially visible / enabled
                //we want the event to be attached to all then we can check visibility/  status in logic
                var error = instance_of_myeforms.validateAll($(el));
                check_for_error(error, $(el));
            }

        });

        //remote the reference to the submit button and the file upload as we arent usign that at the moment
        delete error_checking_obj['submitForm'];
        delete error_checking_obj['myFiles'];


        if ($.isEmptyObject(error_checking_obj)) {

            var form_data = $('form#myForm').serializeArray();

            var enabled_dates = [];

            //get the enabled dates ids and values in an array
            $('input[type=date]:enabled').each(function(index, el) {
                enabled_dates.push($(el).attr('id'));
            });

            //for each in the form_data array
            //
            $(form_data).each(function(index, el) {

                //if the form_data el is in the enabled dates array
                if (($.inArray($(el).prop("name"), enabled_dates)) !== -1) {

                    //create a new date from it in the right format
                    var formatted_date = new Date($(el)[0].value);
                    formatted_date = $.datepicker.formatDate('dd/mm/yy', formatted_date);

                    //replace the value
                    $(el)[0].value = formatted_date;
                };


            });

            // console.log(JSON.stringify(form_data));


            $.ajax({
                type: "POST",
                url: "BenefitChangeofDetailsPdf",
                data: form_data,
                success: function(res) {
                    console.log('success');
                    console.log(res);
                },
                failure: function(res) {
                    console.log('failure');
                    console.log(res);
                },
                dataType: "JSON"
            });

        };


    });

    //conditional based on select value matching id of fieldset
    //todo: make this reusable
    $(body_element).on('change', '.conditional-fieldset-select', function(event) {
        event.preventDefault();
        var select = $(this);
        var select_val = select.val();
        //check if the fieldset has the selected val id
        $(conditional_fieldsets).filter(function(_index, e) {
            var self = $(this);
            var $this_fieldset = $(e);
            var $self_children = $(this).children();
            if (select_val === $this_fieldset.attr('id')) {
                //and show that fieldset, enable all fields
                $self_children.each(function(index, el) {
                    instance_of_myeforms.enabledRequired($(el), false);
                });
                body_element.find('fieldset#' + select_val).show();
            } else {
                //hide and disable all the others
                $self_children.each(function(index, el) {
                    instance_of_myeforms.enabledRequired($(el), true);
                    //reset error messages on hidden fields
                    $('.error', self).text('');
                });
                body_element.find('fieldset#' + $(e).attr('id')).hide();
            }
        });
    });

    //conditional yes / no select
    $(landlord_agent_select).on('change', function(event) {
        event.preventDefault();
        var select = $(this);
        var select_val = select.val();

        if (select_val == 'no') {
            agent_landlord_dependent_children.filter(function(_index, e) {
                instance_of_myeforms.enabledRequired($(e), false, true);
            });
            agent_landlord_dependent.show();
        } else {
            agent_landlord_dependent_children.filter(function(_index, e) {
                instance_of_myeforms.enabledRequired($(e), true, false);
            });
            agent_landlord_dependent.hide();
            // $('.error', $('#agent-landlord-dependent')).text('');
        }
    });

    //we have a select
    //
    //we have elements to show and hide based on the select
    //
    //need a way of indicating the fields that are conditional
    //
    //in this case fields are grouped, making individual fields dependent is messy as we have related labels / hidden inputs with labels etc
    //
    //so group fields into a fieldset with an id
    //
    //match the fieldset id to the value of the select drop down


    //on change of select income option
    // $('#selectIncomeChange').on('change', function(event) {
    //     event.preventDefault();
    //     var select = $(this);
    //     var select_val = select.val();

    //     $(income_conditional_fieldsets).each(function(index, el) {
    //         var $this_fieldset = $(el);
    //         if (select_val == $this_fieldset.attr('id')) {

    //             $this_fieldset.children().each(function(index, el) {
    //                 instance_of_myeforms.enabledRequired($(el), false);
    //             });

    //             body_element.find('fieldset#' + select_val).show();

    //         } else {
    //             $this_fieldset.children().each(function(index, el) {
    //                 instance_of_myeforms.enabledRequired($(el), true);
    //                 //reset error messages on hidden fields
    //                 $('.error', self).text('');
    //             });

    //             body_element.find('fieldset#' + $(el).attr('id')).hide();
    //         }

    //     });
    // });






    // $(':file').on('change', function(){
    //     var file = this.files[0];

    // });

    //manual multiple
    // $('#addFileUpload').on('click', function(){
    //     // console.log($('fieldset#files-upload > input:file').length);
    //     if($('fieldset#files-upload > input:file').length < 5){
    //       $('input:file:last-of-type').after('<br><input type="file" name="myfile[]"/>');
    //     }else{
    //         $('fieldset#files-upload > .error').text('Max number of files 5');
    //     }
    // });
    //https://code.tutsplus.com/tutorials/uploading-files-with-ajax--net-21077
    //http://stackoverflow.com/questions/13656066/html5-multiple-file-upload-upload-one-by-one-through-ajax#13692285

    $('#myFiles').on('change', function() {
        var file_input = this;
        var form_data = false;

        if (window.FormData) {
            form_data = new FormData();
            //hide uploadButton
        }
        var i = 0;
        var files_array = [];
        for (i; i < this.files.length; i++) {

            if (form_data) {
                if (this.files[i].type !== 'application/pdf') {
                    $('#files-upload .response').text('must be a pdf');
                    return;
                } else {
                    form_data.append("files[]", this.files[i]);
                }
            }

        }

        $.ajax({
            'type': 'POST',
            //would need equivalent in java
            'url': 'upload.php',
            'data': form_data,
            'processData': false,
            'contentType': false,
            success: function(res) {
                //console.log(res);
                $('#files-upload .response').text(res);
            },
            error: function(res) {
                //console.log(res);
            }
        });
        // $(':file').each(function(index, el) {
        //     console.log(el.files[0]);

        // });
    });

    //use native datepicker if it exists otherwise use jquery ui
    if (!Modernizr.inputtypes['date']) {
        $('input[type=date]').datepicker();
    }
    // from:- https://www.tjvantoll.com/2012/06/30/creating-a-native-html5-datepicker-with-a-fallback-to-jquery-ui/
    // if (!Modernizr.touch || !Modernizr.inputtypes.date) {
    //     $('input[type=date]')
    //         .attr('type', 'text')
    //         .datepicker({
    //             // Consistent format with the HTML5 picker
    //             dateFormat: 'yy-mm-dd'
    //         });
    // }

});