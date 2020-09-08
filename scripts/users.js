import striptags from 'striptags';
import Operators from './operators';


//scripts/users.js
//Users

export default class Users {
	
	constructor(express){
		
		if(!express) return false;
		
		express.get('/users', (req, res) => { 
			this.pageRender(req, res);
		});
		
		express.post('/users/add', async (req, res) => {
			if(!req.body) return res.json(this.error("body_empty"));
			res.json(await this.add(req.body.operator_id, req.body.phone, req.body.name)); 
		});
		
		express.post('/users/edit', async (req, res) => {
			if(!req.body) return res.json(this.error("body_empty"));
			res.json(await this.edit(req.body.user_id, req.body.operator_id, req.body.phone, req.body.name)); 
		});
		
		express.post('/users/del', (req, res) => {
			if(!req.body) return res.json(this.error("body_empty"));
			this.del(req.body.user_id);
		});
		
	}
	
	//render page html
	//req:express request
	//res:express response
	async pageRender(req, res){
		res.render('body.html', {
			menu: 'users', 
			users_list: await this.getList(),
			operators_list: await this.getOperators()
		});
	}
	
	//add user
	//operator_id:bigint
	//phone:text
	//user_name:text
	async add(operator_id, phone, user_name = ""){
		let errors = [];
		
		if(!operator_id) errors.push(this.error("operator_empty"));
		if(!parseInt(operator_id)) errors.push(this.error("wrong_operator_id"));
		if(!phone) errors.push(this.error("phone_empty"));
		if(!user_name || !user_name.length) errors.push(this.error("user_name_empty"));
		
		if(errors.length) return {error: errors};
		
		phone = parseInt(phone.replace(/([^0-9]+)/g, ""));
		
		const id = await DB.insert({name: striptags(user_name), phone: phone, operator_id: parseInt(operator_id)}).into("users").returning("id");
		
		const operators = new Operators();
		const operator = await operators.get(parseInt(operator_id));
		
		return {success: true, name: user_name, user_id: id[0], phone: phone, operator_id: operator_id, operator_name: operator.name};
	}
	
	//edit user
	//user_id:bigint
	//operator_id:bigint
	//phone:text
	//user_name:text
	async edit(user_id, operator_id, phone, user_name){
		let errors = [];
		
		if(!user_id) errors.push(this.error("user_id_empty"));
		if(!parseInt(user_id)) errors.push(this.error("wrong_user_id"));
		if(!operator_id) errors.push(this.error("operator_empty"));
		if(!parseInt(operator_id)) errors.push(this.error("wrong_operator_id"));
		if(!phone) errors.push(this.error("phone_empty"));
		if(!user_name || !striptags(user_name).length) errors.push(this.error("user_name_empty"));
		
		if(errors.length) return {error: errors};
		
		phone = parseInt(phone.replace(/([^0-9]+)/g, ""));
		
		await DB.from("users").update({name: striptags(user_name), phone: phone, operator_id: parseInt(operator_id)}).where("id", parseInt(user_id));
		
		const operators = new Operators();
		const operator = await operators.get(parseInt(operator_id));
		
		return {success: true, name: striptags(user_name), user_id: user_id, phone: phone, operator_id: operator_id, operator_name: operator.name};
	}
	
	//delete user
	//operator_id:bigint
	//phone:text
	//user_name:text
	async del(user_id){
		
		if(!parseInt(user_id)) return this.error("wrong_user_id");
		
		await DB.from("users").where("id", parseInt(user_id)).del();
		
		return {success: true};
	}
	
	//get users list
	async getList(){
		return await DB.select("users.*", "operators.name as operator_name").from("users").leftJoin("operators", {"operators.id": "users.operator_id"}).orderBy("users.id", "asc");
	}
	
	async getOperators(){
		
		const operators = new Operators();
		return await operators.getList();
		
	}
	
	//error_key:text
	error(error_key){
		const errors = {
			"user_name_empty": {id: 10, text: "User name is empty"},
			"phone_empty": {id: 11, text: "phone is empty"},
			"wrong_phone": {id: 12, text: "Wrong phone number"},
			"body_empty": {id: 13, text: "Body is empty"},
			"operator_empty": {id: 14, text: "Operator is empty"},
			"user_id_empty": {id: 15, text: "User id is empty"},
			"wrong_user_id": {id: 16, text: "User id is wrong"},
			"wrong_operator_id": {id: 17, text: "Operator id is wrong"},
		}
		
		return errors[error_key];
	}
	
}
