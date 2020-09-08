import striptags from 'striptags';
//scripts/operators.js
//Operators

export default class Operators {
	
	constructor(express){
		
		if(!express) return false;
		
		express.get('/operators', (req, res) => { 
			this.pageRender(req, res);
		});
		
		express.post('/operators/add', async (req, res) => { 
			if(!req.body) return res.json(this.error("body_empty"));
			res.json(await this.add(req.body.code, req.body.name)); 
		});
		
		express.post('/operators/edit', async (req, res) => { 
			if(!req.body) return res.json(this.error("body_empty"));
			res.json(await this.edit(req.body.operator_id, req.body.code, req.body.name)); 
		});
		
		express.post('/operators/del', (req, res) => { 
			if(!req.body) return res.json(this.error("body_empty"));
			this.del(req.body.operator_id);
		});
		
	}
	
	//render page html
	//req:express request
	//res:express response
	async pageRender(req, res){
		res.render('body.html', {
			menu: 'operators', 
			operators_list: await this.getList()
		});
	}
	
	//add operator
	//code:text
	//operator_name:text
	async add(code, operator_name = ""){
		let errors = [];
		
		if(!parseInt(code)) errors.push(this.error("code_empty"));
		if(!operator_name || !striptags(operator_name).length) errors.push(this.error("operator_name_empty"));
		
		if(errors.length) return {error: errors};
		
		const id = await DB.insert({name: striptags(operator_name), code: parseInt(code)}).into('operators').returning("id");
		
		return {success: true, id: id[0], code: parseInt(code), name: striptags(operator_name)};
	}
	
	//edit operator
	//operator_id:bigint
	//code:text
	//operator_name:text
	async edit(operator_id, code, operator_name){
		let errors = [];
		
		if(!parseInt(operator_id)) errors.push(this.error("wrong_operator_id"));
		if(!code) errors.push(this.error("code_empty"));
		if(!operator_name || !striptags(operator_name).length) errors.push(this.error("operator_name_empty"));
		
		if(errors.length) return {error: errors};
		
		await DB.from("operators").update({code: parseInt(code), name: striptags(operator_name)}).where("id", parseInt(operator_id));
		
		return {success: true, id: parseInt(operator_id), code: parseInt(code), name: striptags(operator_name)};
		
	}
	
	//delete operator
	//operator_id:bigint
	async del(operator_id){
		
		if(!parseInt(operator_id)) return this.error("wrong_operator_id");
		
		await DB.from("operators").where("id", parseInt(operator_id)).del();
		
		return {success: true};
		
	}
	
	//get operators list
	async getList(){
		return await DB.from("operators").orderBy("id", "asc");	
	}
	
	async get(operator_id){
		
		const operator = await DB.from("operators").where("id", operator_id);
		
		if(!operator.length) return [];
		
		return operator[0];
		
	}
	
	//error_key:text
	error(error_key){
		const errors = {
			"operator_name_empty": {id: 20, text: "Operator name is empty"},
			"code_empty": {id: 21, text: "Code is empty"},
			"wrong_code": {id: 22, text: "Wrong code number"},
			"body_empty": {id: 23, text: "Body is empty"},
			"wrong_operator_id": {id: 24, text: "Operator id is wrong"},
		}
		
		return errors[error_key];
	}
	
}
