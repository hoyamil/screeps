/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.scouter');
 * mod.thing == 'a thing'; // true
 */
var roleScouter={
    run:function(creep){
        var pos = new RoomPosition(25,25,creep.memory.roomname);
        creep.moveTo(pos);
    }
};
module.exports = roleScouter;