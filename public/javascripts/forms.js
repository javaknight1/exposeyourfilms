function formhash(form, password) {
    // Create a new element input, this will be our hashed password field. 
    var p = document.createElement("input");
 
    // Add the new element to our form. 
    form.appendChild(p);
    p.name = "p";
    p.type = "hidden";
    p.value = hex_sha512(password.value);
 
    // Make sure the plaintext password doesn't get sent. 
    password.value = "";
 
    // Finally submit the form. 
    form.submit();
}
 
function regformhash(form, uid, email, password, conf, membership) {	
	
	var errors = [];
	
     // Check each field has a value
    if (uid.value == '') {
        errors.push('You must enter a username.');
    }
    
    // Check each field has a value
    if (email.value == '') {
    	errors.push('You must enter an email address.');
    }
    
    // Check each field has a value
    if (password.value == '') {
    	errors.push('You must enter a password and confirm it.');
    }
    
    // Check each field has a value
    if (membership.value == '') {
    	errors.push('You must select either Basic or Filmmaker membership.');
    }
 
    // Check the username
    re = /^\w+$/; 
    if(!re.test(form.username.value)) { 
    	errors.push("Username must contain only letters, numbers and underscores."); 
    }
 
    // Check that the password is sufficiently long (min 6 chars)
    // The check is duplicated below, but this is included to give more
    // specific guidance to the user
    if (password.value.length < 6) {
    	errors.push('Passwords must be at least 6 characters long.');
    }
 
    // At least one number, one lowercase and one uppercase letter 
    // At least six characters 
    var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/; 
    if (!re.test(password.value)) {
    	errors.push('Passwords must contain at least one number, one lowercase and one uppercase letter.');
    }
 
    // Check password and confirmation are the same
    if (password.value != conf.value) {
    	errors.push('Your password and confirmation do not match.');
    }
    
    //Membership can only be 'basic' or 'filmmaker'
    if (!(membership.value == 'basic' || membership.value == 'filmmaker')){
    	errors.push(membership.value + " isn't a valid membership status.");
    }
    
    //If there is errors, make hidden array of different errors
    var l = errors.length;
    if(errors.length > 0){
 	   for(var i = 0; i < l; i++){
 		   var error = document.createElement('input');
 		   error.name = "errors["+i+"]";
 		   error.type = "hidden";
 		   error.value = errors[i];
 		   form.appendChild(error);
 	   }
    }
 
    // Create a new element input, this will be our hashed password field. 
    var p = document.createElement("input");
 
    // Add the new element to our form. 
    form.appendChild(p);
    p.name = "p";
    p.type = "hidden";
    p.value = hex_sha512(password.value);
 
    // Make sure the plaintext password doesn't get sent. 
    password.value = "";
    conf.value = "";
 
    // Finally submit the form. 
    form.submit();
    return true;
}

function filmuploadformhash(form, title, release_date, rent_price, rent_price_toggle, buy_price, buy_price_toggle, rating) {
	
	var errors = [];
	
    // check if a title has been given
   if (title.value == '') {
	   errors.push("You must give a title.");
   }
   
   // Check each field has a value
   if (rating.options[rating.selectedIndex].value == '') {
	   errors.push("You must select an appropriate rating.");
   }
   
   // Check each field has a value
   if (release_date.value == '') {
	   errors.push("You must include your films initial release date.");
   }

   //rent and/or buy must be checked
   if(!rent_price_toggle.checked && !buy_price_toggle.checked){
	   errors.push("You must choose rent, buy, or both.");
   }
   
   //check for rent_price
   if(rent_price_toggle.checked && rent_price.value == ''){
	   errors.push("You must enter a rent price for your film.");
   }
   
   //check for buy_price
   if(buy_price_toggle.checked && buy_price.value == ''){
	   errors.push("You must enter a buy price for your film.");
   }
   
   // Check the username
   re = /^[\w ]*[^\W_][\w ]*$/; 
   if(!re.test(form.title.value)) { 
       errors.push("The title must contain only letters, numbers, and underscores.");
   }
   
   //If there is errors, make hidden array of different errors
   var l = errors.length;
   if(errors.length > 0){
	   for(var i = 0; i < l; i++){
		   var error = document.createElement('input');
		   error.name = "errors["+i+"]";
		   error.type = "hidden";
		   error.value = errors[i];
		   form.appendChild(error);
	   }
   }
   
   var buy = document.createElement('input');
   buy.name = "buy";
   buy.type = "hidden";
   if(buy_price_toggle.checked)
	   buy.value = buy_price.value;
   else
	   buy.value = " ";
   
   var rent = document.createElement('input');
   rent.name = "rent";
   rent.type = "hidden";
   if(rent_price_toggle.checked)
	   rent.value = rent_price.value;
   else
	   rent.value = " ";
   
   form.appendChild(buy);
   form.appendChild(rent);
   
   var expiration = document.createElement('input');
   expiration.name = "expiration_date";
   expiration.type = "hidden";  
   
   var post = document.createElement('input');
   post.name = "post_date";
   post.type = "hidden";
   
   var offsetmonths = 2;
   var CurrentDate = new Date();
   
   post.value = CurrentDate.getFullYear() + '-' + 
		(CurrentDate.getMonth() < 10? '0':'') + CurrentDate.getMonth() + '-' + 
		(CurrentDate.getDate() < 10? '0':'') + CurrentDate.getDate();
   
   //For the very rare cases like the end of a month
   //eg. May 30th - 3 months will give you March instead of February
   var date = CurrentDate.getDate();
   CurrentDate.setDate(1);
   CurrentDate.setMonth(CurrentDate.getMonth()+offsetmonths);
   CurrentDate.setDate(date);
   
   expiration.value = CurrentDate.getFullYear() + '-' + 
   		(CurrentDate.getMonth() < 10? '0':'') + CurrentDate.getMonth() + '-' + 
   		(CurrentDate.getDate() < 10? '0':'') + CurrentDate.getDate();
   
   form.appendChild(expiration);
   form.appendChild(post);

   // Finally submit the form.
   form.submit();
   return true;
}

function filmeditformhash(form, title, release_date, rent_price, rent_price_toggle, buy_price, buy_price_toggle, rating) {
	
	var errors = [];
	
   // Check each field has a value
   if (title.value == '') {
       errors.push("You can't leave the title blank.");
   }
   
   // Check each field has a value
   if (rating.options[rating.selectedIndex].value == '') {
       errors.push("You must give the film a rating.");
   }
   
   // Check each field has a value
   if (release_date.value == '') {
       errors.push("You must give your film a release date.");
   }

   //rent and/or buy must be checked
   if(!rent_price_toggle.checked && !buy_price_toggle.checked){
	   errors.push("Must choose rent, buy, or both.");
   }
   
   //check for rent_price
   if(rent_price_toggle.checked && rent_price.value == ''){
	   errors.push("Enter a rent price for your film.");
   }
   
   //check for buy_price
   if(buy_price_toggle.checked && buy_price.value == ''){
	   errors.push("Enter a buy price for your film.");
   }
   
   // Check the username
   re = /^[\w ]*[^\W_][\w ]*$/; 
   if(!re.test(form.title.value)) { 
       errors.push("Title must contain only letters, numbers and underscores.");
   }
   
   //If there is errors, make hidden array of different errors
   var l = errors.length;
   if(errors.length > 0){
	   for(var i = 0; i < l; i++){
		   var error = document.createElement('input');
		   error.name = "errors["+i+"]";
		   error.type = "hidden";
		   error.value = errors[i];
		   form.appendChild(error);
	   }
   }
   
   var buy = document.createElement('input');
   buy.name = "buy";
   buy.type = "hidden";
   if(buy_price_toggle.checked)
	   buy.value = buy_price.value;
   else
	   buy.value = " ";
   
   var rent = document.createElement('input');
   rent.name = "rent";
   rent.type = "hidden";
   if(rent_price_toggle.checked)
	   rent.value = rent_price.value;
   else
	   rent.value = " ";
   
   form.appendChild(buy);
   form.appendChild(rent);

   // Finally submit the form.
   form.submit();
   return true;
}

function buyformhash(form, film_id, film_amount, token, type){
	
	//get form values
	var base_url = "http://www.exposeyourfilms.com/transaction_success.php";
	var suc_url;
	var id = form.item_number.value;
	var amount = form.amount.value;
	
	//check if values are valid	
	if(id != film_id){
		return false;
	}
	
	if(amount != film_amount){
		return false;
	}
	
	//create success link
	suc_url = base_url + "?" + 
			"film_id=" + id + "&" +
			"amount=" + amount + "&" +
			"token=" + token + "&" + 
			"type=" + type;
	
	//add success link to form
	var success = document.createElement('input');
	success.name = "return";
	success.type = "hidden";
	success.value = suc_url;
	form.appendChild(success);
	
	//TODO: Create cancel url
	
	//Submit form, if successful
	form.submit();
	return true;
}