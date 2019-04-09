class Users {

    constructor(client){
        this._users = this.getUsers(client);
    }
    get users(){
        return this._users;
    }

    set users(users){
        this._users = users;
    }

    getUsers(client){
        
    }
    
}