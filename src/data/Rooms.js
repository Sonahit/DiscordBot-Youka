class Rooms { 
    constructor(client){
        this._rooms = this.getRooms(client);
        this._ids = this.getIdRooms(client);
    };

    get rooms(){
        return this._rooms
    }

    get ids(){
        return this._ids;
    }

    set ids(ids){
        this._ids = ids;
    }

    set rooms(rooms){
        this._rooms = rooms;
    }

    getRooms(msg , client) {

    }

    getIdRooms(msg , client) {
        
    }
}