
//scripts/search.js
//Search by phone

export default class Search {
	
	constructor(express){
		
		if(!express) return false;
		
		express.get('/search', (req, res) => { 
			this.pageRender(req, res);
		});
		
		express.post('/search/result', async (req, res) => {
			if(!req.body) return res.json(this.error("body_empty"));			
			res.json(await this.getResult(req.body.phone)); 
		});
			
	}
	
	pageRender(req, res){
		res.render('body.html', {
			menu: 'search'
		});
	}
	
	//phone:text
	async getResult(phone = ""){
		let parsed_phone;
		
		if(!phone || !phone.length) return {error: this.error("empty")};
		
		if(!(parsed_phone = this.parsePhone(phone))) return {error: this.error("wrong_phone")};
		
		const result = await this.find(parsed_phone);
		
		if(!result) return {error: this.error("not_exist")};
		
		return result;
	}
	
	//parsed_phone:object
	async find(parsed_phone){
		
		const user = (await DB.select("users.*", "operators.name as operator_name", "operators.code as operator_code").from("users").leftJoin("operators", {"operators.id": "users.operator_id"})
							.where(function(){
								if(parsed_phone.operator) 
									this.where("operators.code", parsed_phone.operator).andWhere("users.phone", parsed_phone.phone);
								else 
									this.where("users.phone", parsed_phone.phone);
							}).limit(1)).map(item => {
								const parsed = this.parsePhone(item.operator_code + item.phone);
								item.normal_phone = this.toNormalPhone(parsed);
								return item;
							});
		
		return user.length ? user[0] : false;
		
	}
	
	//phone:text
	parsePhone(phone = ""){
		let parsed = (parseInt(phone.replace(/([^0-9]+)/g, "")) + "").matchAll(/^([0-9]{3}|[0-9]{0})([0-9]{2}|[0-9]{0})([0-9]{7})$/g);
		parsed = Array.from(parsed);
		
		if(!parsed.length) return false;
		
		return {country: parsed[0][1], operator: parsed[0][2], phone: parsed[0][3]};
	}
	
	//parsed_phone:object
	toNormalPhone(parsed_phone){
		let ph = parsed_phone.phone.matchAll(/^([0-9]{3})([0-9]{2})([0-9]{2})$/g);
		ph = Array.from(ph);
		return "0" + parsed_phone.operator + " " + ph[0][1] + "-" + ph[0][2] + "-" + ph[0][3];
	}
	
	//error_key:text
	error(error_key){
		const errors = {
			"empty": {id: 1, text: "Phone is empty"},
			"wrong_phone": {id: 2, text: "Wrong phone number"},
			"not_exist": {id: 3, text: "Phone number not exist"}
		}
		
		return errors[error_key];
	}
	
}
