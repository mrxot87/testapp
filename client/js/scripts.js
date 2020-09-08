
//Search page
(function(){
	var form, error_block, input, result_block; 
	
	var init = function(){
		form = $("#search_form");
		error_block = $(".error");
		input = $("input[name=phone]");
		result_block = $("#result_block");
		form.submit(form_submit)
	}
	
	var form_submit = function(){
		const phone = input.val();
		error_block.hide();
		result_block.hide();
		
		$.post("/search/result", {phone: phone}, result);
		
		return false;
	}
	
	var result = function(data){
		
		
		
		if(data.error){
			error_block.find(".alert").text(data.error.text);
			error_block.show();
		} else {
			result_block.find("#user_name").text(data.name);
			result_block.find("#operator").text(data.operator_name);
			result_block.find("#phone").text(data.normal_phone);
			result_block.show();
		}
		
	}
	
	$(document).ready(() => {
		if($("#search_form").length) init();
	});
})();



//Users page
(function(){
	var users, modal, users_list, user_item, add_button, edit_button, del_button, error_block, error_list;
	
	var init = function(){
		users = $("#users_block");
		users_list = $("#users_list");
		modal = $("#user_modal");
		add_button = $("#user_add");
		edit_button = users_list.find(".edit_user");
		del_button = users_list.find(".del_user");
		user_item = $("#user_item");
		error_block = $(".error");
		error_list = $("#error_list");
		
		init_buttons();
	}
	
	var update_user_row = function(data){
		
		if(data.error){
			return showErrors(data.error);
		}
		
		modal.modal('hide');
		
		var user_item = users_list.find("[data-id="+ data.user_id +"]");
		user_item.find("td").eq(0).text(data.user_id);
		user_item.find("td").eq(1).text(data.name);
		user_item.find("td").eq(2).text(data.phone);
		user_item.find("td").eq(3).attr("data-operator", data.operator_id).text(data.operator_name);
		
	}
	
	var add_user_row = function(data){
		
		if(data.error){
			return showErrors(data.error);
		}
		
		modal.modal('hide');
		
		var item = user_item.find("tr").clone();
		item.attr("data-id", data.user_id);
		item.find("td").eq(0).text(data.user_id);
		item.find("td").eq(1).text(data.name);
		item.find("td").eq(2).text(data.phone);
		item.find("td").eq(3).attr("data-operator", data.operator_id).text(data.operator_name);
		
		item.find(".edit_user").click(edit_user);
		item.find(".del_user").click(delete_user);
		
		item.appendTo(users_list);
		
	}
	
	var add_user = function(e){
		
		hideErrors();
		modal.modal('show');
		
		modal.find("modal-title").text("Add user");
		modal.find("input[name=user_name]").val("");
		modal.find("input[name=user_phone]").val("");
		//modal.find("select[name=operator]").val("");
		
		modal.find("#user_modal_submit").unbind().bind("click", function(){
			send_to_server();
		});
		
	}
	
	var send_to_server = function(user_id){
		
		hideErrors();
		
		var name = modal.find("input[name=user_name]").val();
		var phone = modal.find("input[name=user_phone]").val();
		var operator_id = modal.find("select[name=operator]").val();
		
		var send = {
			user_id: user_id,
			name: name,
			phone: phone,
			operator_id: operator_id
		};
		
		if(parseInt(user_id)){
			$.post("/users/edit", send, update_user_row);
		} else {
			$.post("/users/add", send, add_user_row);
		}
		
	}
	
	var edit_user = function(e){
		var row = $(e.target).closest("[data-id]");
		
		var user_id = row.data("id");
		var name = row.find("td").eq(1).text();
		var phone = row.find("td").eq(2).text();
		var operator_id = row.find("td").eq(3).data("operator");
		
		if(!parseInt(user_id)) return false;
		
		modal.find("modal-title").text("Edit user");
		modal.find("input[name=user_name]").val(name);
		modal.find("input[name=user_phone]").val(phone);
		modal.find("select[name=operator]").val(operator_id);
		
		hideErrors();
		modal.modal('show');
		
		modal.find("#user_modal_submit").unbind().bind("click", function(){
			send_to_server(user_id);
		});
		
	}
	
	var delete_user = function(e){
		
		if(confirm("Delete user?")){
			var row = $(e.currentTarget).closest("[data-id]");
			var user_id = row.data("id");
			$.post("/users/del", {user_id: parseInt(user_id)});
			row.remove();
		}
	}
	
	var init_buttons = function(){
		
		add_button.click(add_user);
		edit_button.click(edit_user);
		del_button.click(delete_user);
		
	}
	
	var showErrors = function(errors){
		var _error = error_block.clone();
		errors.map(item => {
			_error.find(".alert").text(item.text);
			_error.appendTo(error_list);
			_error.show();
		});
		
		return false;
	}
	
	var hideErrors = function(){
		error_list.html("");
	}
	
	$(document).ready(() => {
		if($("#users_block").length) init();
	});
})();


//Operators page
(function(){
	var operators, modal, operators_list, operator_item, add_button, edit_button, del_button, error_block, error_list;
	
	var init = function(){
		operators = $("#operators_block");
		operators_list = $("#operators_list");
		modal = $("#operator_modal");
		add_button = $("#operator_add");
		edit_button = operators_list.find(".edit_operator");
		del_button = operators_list.find(".del_operator");
		operator_item = $("#operator_item");
		error_block = $(".error");
		error_list = $("#error_list");
		
		init_buttons();
		
	}
	
	var update_operator_row = function(data){
		
		if(data.error){
			return showErrors(data.error);
		}
		
		modal.modal('hide');
		
		var op_item = operators_list.find("[data-id="+ data.id +"]");
		op_item.find("td").eq(0).text(data.id);
		op_item.find("td").eq(1).text(data.name);
		op_item.find("td").eq(2).text(data.code);
		
	}
	
	var add_operator_row = function(data){
		
		if(data.error){
			return showErrors(data.error);
		}
		
		modal.modal('hide');
		
		var item = operator_item.find("tr").clone();
		item.attr("data-id", data.id);
		item.find("td").eq(0).text(data.id);
		item.find("td").eq(1).text(data.name);
		item.find("td").eq(2).text(data.code);
		
		item.find(".edit_operator").click(edit_operator);
		item.find(".del_operator").click(delete_operator);
		
		item.appendTo(operators_list);
		
	}
	
	var add_operator = function(e){
		
		hideErrors();
		modal.modal('show');
		
		modal.find("modal-title").text("Add operator");
		modal.find("input[name=operator_name]").val("");
		modal.find("input[name=operator_code]").val("");
		
		modal.find("#operator_modal_submit").unbind().bind("click", function(){
			send_to_server();
		});
		
	}
	
	var send_to_server = function(operator_id){
		
		hideErrors();
		
		var name = modal.find("input[name=operator_name]").val();
		var code = modal.find("input[name=operator_code]").val();
		
		var send = {
			operator_id: operator_id,
			name: name,
			code: code
		};
		
		if(parseInt(operator_id)){
			$.post("/operators/edit", send, update_operator_row);
		} else {
			$.post("/operators/add", send, add_operator_row);
		}
		
	}
	
	var edit_operator = function(e){
		var row = $(e.target).closest("[data-id]");
		
		var operator_id = row.data("id");
		var name = row.find("td").eq(1).text();
		var code = row.find("td").eq(2).text();
		
		if(!parseInt(operator_id)) return false;
		
		modal.find("modal-title").text("Edit operator");
		modal.find("input[name=operator_name]").val(name);
		modal.find("input[name=operator_code]").val(code);
		
		hideErrors();
		modal.modal('show');
		
		modal.find("#operator_modal_submit").unbind().bind("click", function(){
			send_to_server(operator_id);
		});
		
	}
	
	var delete_operator = function(e){
		
		if(confirm("Delete operator?")){
			var row = $(e.currentTarget).closest("[data-id]");
			var operator_id = row.data("id");
			$.post("/operators/del", {operator_id: parseInt(operator_id)});
			row.remove();
		}
	}
	
	var init_buttons = function(){
		
		add_button.click(add_operator);
		edit_button.click(edit_operator);
		del_button.click(delete_operator);
		
	}
	
	var showErrors = function(errors){
		var _error = error_block.clone();
		errors.map(item => {
			_error.find(".alert").text(item.text);
			_error.appendTo(error_list);
			_error.show();
		});
		
		return false;
	}
	
	var hideErrors = function(){
		error_list.html("");
	}
	
	$(document).ready(() => {
		if($("#operators_block").length) init();
	});
})();






