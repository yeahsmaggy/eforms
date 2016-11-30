jQuery(document).ready(function($) {
//fill in each form element

		$('input').each(function(index, el) {
			//if this input type = email
			if($(el).attr('type') == 'email'){
				//value = 'adsfadssaf' (non email)
				$(el).val('nonemail');
				$(el).val('');
				$(el).change();

			}


			//value = 'a@a.com' (email)


		});


//delete form element item (trigger on change)
//for each form type try different kinds of data - string, integer, email address, non-email address
//rules for what is expected
//enter incorrect email format - trigger appearnace of error (is this.next error visible == true)


});
