var MyEForms = function() {
    this.widget = 'widget';
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
    validateAll: function(el){

            var this_label = $("label[for='" + $(el).attr('id') + "']");
            var this_label_text = this_label.text();
            var error = '';

            var valid_empty = this.validateEmpty(this_label_text, $(el).val());
            //if class mandatory
            if (!valid_empty) {
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
                    error += ' Please select a value.'
                };
            }
            return error;

    },
    enable_required: function(el, disabled, required) {
        // console.log(disabled);
        // console.log(required);
        if ($(el).attr('type') !== 'button') {

            if (typeof disabled !== 'undefined') {
                $(el).prop('disabled', disabled);
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
    txtClaimantName
    txtClaimantAddress
    txtClaimantTelephone
    txtClaimantEmail
    txtClaimantHBReference
    txtClaimantNationalInsuranceNumber
    txtLandlordAgentName
    txtLandlordAgentAddress
    txtLandlordAgentEmailAddress
    txtLandlordAgentTelephone
    txtLandlordAgent
    */

    /* -- validation --
    validate email address
    validate telephone number
    date picker
    */

    /* -- conditionals
    Nature of request result in other forms being conditionally show
    any fields not shown need to be invalidated on submit e.g. prop=disabled 

    - select all the relevant DOM form elements
    */

    var instance_of_myeforms = new MyEForms();
    var body_element = instance_of_myeforms.body_element;
    var inputs = body_element.find('input');
    var agent_landlord_dependent = $('#agent-landlord-dependent');
    var agent_landlord_dependent_children = agent_landlord_dependent.children();
    var landlord_agent_select = $('#txtLandlordAgent');
    var claimant_info = $('#claimant-info');
    var change_of_address = $('#change-of-address');
    var fieldsets = $('fieldset');
    var conditional_fieldsets = $('fieldset.conditional');

    //onload disable & hide all of the conditional fieldsets
    conditional_fieldsets.each(function(index, el) {
        instance_of_myeforms.enable_required($(el), true, false);
    });
    body_element.find('fieldset.conditional').hide();

    //disable & hide dependents of agent/landlord select
    agent_landlord_dependent_children.filter(function(_index, e) {
        instance_of_myeforms.enable_required($(e), true, false);
    });
    agent_landlord_dependent.hide();

    //add asterix to mandatory fields
    $(".mandatory").prev().append('*');

    $('#submitForm').on('click', function(event) {
        event.preventDefault();
        //validate
        fieldsets.find('input:enabled, textarea, select').each(function(index, el) {

            var error = instance_of_myeforms.validateAll($(el));

            if (error.length) {
                $(el).next('.error').text(error);
            } else {
                $(el).next('.error').text('');
            }
        });

        //$('body').text(JSON.stringify($('form').serializeArray()));
    });

    //conditional based on select value matching id of fieldset
    //todo: make this reusable
    $(body_element).on('change', '.form-conditional-select', function(event) {
        event.preventDefault();
        var select = $(this);
        var select_val = select.val();
        //check if the fieldset has the selected val id
        $(conditional_fieldsets).filter(function(_index, e) {
            var self = $(this);
            var self_children = $(this).children();
            if (select_val === $(e).attr('id')) {
                //and show that fieldset, enable all fields
                self_children.each(function(index, el) {
                    instance_of_myeforms.enable_required($(e), false);
                });
                body_element.find('fieldset#' + select_val).show();
            } else {
                //hide and disable all the others
                self_children.each(function(index, el) {
                    instance_of_myeforms.enable_required($(e), true);
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
        var parent_fieldset = $(this).closest('fieldset');

        if (select_val == 'no') {
            agent_landlord_dependent_children.filter(function(_index, e) {
                instance_of_myeforms.enable_required($(e), false, true);
            });
            agent_landlord_dependent.show();
        } else {
            agent_landlord_dependent_children.filter(function(_index, e) {
                //instance_of_myeforms.enable_required($(e), true, false);
            });
            agent_landlord_dependent.hide();
            $('.error', parent_fieldset).text('');
        }
    });

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
                if(this.files[i].type !== 'application/pdf'){
                    $('#files-upload .response').text('must be a pdf');
                    return;
                }else{
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