var MyEForms = function() {
    // this.widget = 'widget';
    self = this;
    this.error_checking_obj = {};
    
    self.claimant_reference = "12341234";
};

MyEForms.prototype = {
    create: function() {
        // console.log(this.widget);
        // console.log('constructor');

    },
    addEventListeners: function() {
        
        //hide file uploads initially
        //$('#files-upload').hide();
        //temp show
        $('#files-upload').show();
        
        //yes / no conditional select
        this.selectSwitch('#agent-landlord-dependent', '#selectLandlordAgent');
        this.onlyNumbersInNumberInputs();

        //add asterix to mandatory fields
        $(".mandatory").prev().prev('label').append('*');

        //validate when input changes
        $('input, textarea, select', 'body #content').on('change', function() {
            if ($(this).is(':enabled')) {
                this.error_checking_obj = {};

                var error = self.validateAll(this);
                self.checkForError(error, $(this));
            }
        });


        //form submit button click
        $('#submitForm').on('click', function(event) {
            event.preventDefault();
            //validate
            this.error_checking_obj = {};

            $('input, textarea, select', 'body #content').each(function(index, el) {
                // console.log($(this).is(':disabled'));
                if ($(this).is(':enabled')) {
                    //if this enabled / visible, then do...
                    //because using body selector will only attach this event to whatever is initially visible / enabled
                    //we want the event to be attached to all then we can check visibility/  status in logic
                    var error = self.validateAll($(el));
                    self.checkForError(error, $(el));
                }

            });

            //remote the reference to the submit button and the file upload as we arent usign that at the moment
            delete this.error_checking_obj['submitForm'];
            delete this.error_checking_obj['myFiles'];

            if ($.isEmptyObject(self.error_checking_obj)) {

                var form_data = $('form#myForm').serializeArray();
                console.log(form_data);
                var enabled_dates = [];

                //get the enabled dates ids and values in an array
                $('input[type=date]:enabled').each(function(index, el) {
                    enabled_dates.push($(el).attr('id'));
                });

                //for each in the form_data array
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


                
                
                $.ajax({
                    type: "POST",
                    url: "BenefitChangeofDetailsPdf",
                    data: form_data,
                    success: function(res) {
                        if( typeof res.caseReference !== 'undefined' && typeof res.pdfFileName !== 'undefined'){
                            
                            console.log(res);      
                            
                            self.claimant_reference = res.caseReference;
                            self.pdf_file_name = res.pdfFileName;
                            
                            $('#claimant-info').hide();
                            $('#change-of-address').hide();
                            $('#change-of-income').hide();
                            $('#change-of-household').hide();
                            $('#change-of-rent').hide();
                            $('#other-change').hide();   
                            $('#submitForm').hide();
                            
                            
                            $('#files-upload').show();

                        };
                    },
                    dataType: "JSON"
                });

            };
        });
        
        //file upload stuff:
        //https://code.tutsplus.com/tutorials/uploading-files-with-ajax--net-21077
        //http://stackoverflow.com/questions/13656066/html5-multiple-file-upload-upload-one-by-one-through-ajax#13692285

        $upload_button = $('<button id="upload" class="upload" type="button">Upload</button>');
        $remove_button = $('<button id="remove" class="remove" type="button">Remove</button>');

        //upload form shows
       
        $("input:file").after($upload_button);

        $("input:file").on('change', function() {
            //user selects file
            if ($(this).val()) {
            } else {
                $(this).next('button').remove();
            }
        });

        $('body').on('click', 'button.upload', function() {
            //user clicks upload

            event.preventDefault();
            $file_input = $(this).closest('.upload-file-block').find('input:file');
//            $(this).prop("disabled", true);

            self.upload($file_input[0]);

            $(this).prop("disabled", false);
        });

        $('body').on('click', 'button.remove', function() {
            event.preventDefault();
            $(this).parent().remove();
            //delete the file from the filesystem?      
        });


        $('button.file-add-another').on('click', function() {
            event.preventDefault();
            var count = $('fieldset#files-upload > fieldset').length;

            $new_fieldset = $('<fieldset/>', {
                id: 'file-upload-' + count,
                class: 'upload-file-block',
                name: 'data'
            });
            $new_fieldset.append($('<input/>', {
                id: 'file-upload',
                class: 'file-upload-input',
                type: 'file'
            }));
            $new_fieldset.append($('<button/>', {
                id: 'upload',
                class: 'upload',
                type: 'button',
                text: 'Upload'
            }));

            if(count == 0){
                $('fieldset#files-upload > p.response').after($new_fieldset);
            }else{
                $('fieldset#files-upload fieldset:last-of-type').after($new_fieldset);
            }
            
            
            self.toggleAddAnother();
        });

    },
    upload: function(file_input) {      
        
        var form_data = false;
        if (window.FormData) {
            form_data = new FormData();
        }
        
        //mime type checking
        var accepted_mime_types = [ 'image/jpeg' ,  'image/png',  'image/gif'  ];
        
        if (  $.inArray(file_input.files[0].type , accepted_mime_types) == -1  ) {
            $('#files-upload .response').text('must be a jpg, gif or png');
            return;
        }
        
        form_data.append("file", file_input.files[0]);        
        //we need to relate the images to the claimantNumber
        //we need to relate the images to the pdfFileName (via the Unix timestamp used)
  
        console.log(self.claimant_reference);
        console.log(self.pdf_file_name);
        
        form_data.append("claimantNumber", self.claimant_reference);
        form_data.append("pdfFileName", self.pdf_file_name);
        
        //file uploads to server
        $.ajax({
            'type': 'POST',
            'url': 'UploadFiles',
            'data': form_data,
            'processData': false,
            'contentType': false,
            enctype: 'multipart/form-data',
            success: function(data, text) {

                if (typeof data.error == 'undefined') {
                    var file_input_parent_block = $(file_input).parent();

                    //file uploads successfully
                    //hide error?
                    $('#files-upload').find('.response', '.error').text('');

                    //replace the file input with a file name rather than disable
                    $(file_input).replaceWith(data.fileName);

                    //hide the upload button for this fieldset
                   $(file_input_parent_block).find('button').hide();

                    //add a remove button to remove this fieldset (and potenttially delete the file)
                    $(file_input_parent_block).append('<button id="remove" class="remove" type="button">Remove</button>');

                    //show the add another button                    
                    self.toggleAddAnother();

                    
                }else {
                    //if we are not overwriting files
//                    if(data.exception=="FileAlreadyExistsException"){
//                      $('#files-upload').find('.error').text('File already exists');
//                    }
                }
            },
            error: function(request, status, error) {
                //return a proper error response from the server?
                //handle errors properly?    
            }
        });
    },
    toggleAddAnother: function() {
        //only show the add another button if the last file input is disabled -
        //e.g. it represents an already uploaded file

        if ($('button.file-add-another').prev('.upload-file-block').find('input:file').prop('disabled') == false) {
            $('button.file-add-another').hide();
        } else {
            $('button.file-add-another').show();
        }
    },
    selectSwitch: function(el, select_el) {
        //disable & hide children of select
        $(el).children().filter(function(_index, e) {
            self.enabledRequired($(e), true, false);
        });
        $(el).hide();

        //conditional yes / no select
        $(select_el).on('change', function(event) {
            event.preventDefault();
            var select = $(this);
            var select_val = select.val();

            if (select_val == 'no') {
                $(el).children().filter(function(_index, e) {
                    self.enabledRequired($(e), false, true);
                });
                $(el).show();
            } else {
                $(el).children().filter(function(_index, e) {
                    self.enabledRequired($(e), true, false);
                });
                $(el).hide();
            }
        });
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
            }
            if ($(el).is('select')) {
                if (!$(el).val().length) {
                    error += ' Please select an option.'
                };
            }

        }

        //we still want this to trigger if not mandatory but 
        //a value has been entereed
        if ($(el).val() != '') {
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
        }


        return error;


    },
    enabledRequired: function(el, disabled, required) {
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
    },
    checkForError: function(error, element) {
        var this_id = element.attr('id');

        if (error.length) {
            $(element).next('.error').text(error);
            this.error_checking_obj[this_id] = 1;
            // return;
        } else {
            $(element).next('.error').text('');
            delete this.error_checking_obj[this_id];
        }
    },
    onlyNumbersInNumberInputs: function() {
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

    }

}

jQuery(document).ready(function($) {
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

    var my_eforms = new MyEForms();
    my_eforms.addEventListeners();
    my_eforms.toggleAddAnother();

    $('#income-changed > fieldset').ajwcondit({
        fieldset_switcher: '#selectIncomeChange'
    });

    $('fieldset.conditional').ajwcondit({
        fieldset_switcher: '.conditional-fieldset-select'
    })

    //use native datepicker if it exists otherwise use jquery ui
    // from:- https://www.tjvantoll.com/2012/06/30/creating-a-native-html5-datepicker-with-a-fallback-to-jquery-ui/

    if (!Modernizr.inputtypes['date']) {
        $('input[type=date]').datepicker();
    }

});