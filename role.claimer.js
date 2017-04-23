/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.claimer');
 * mod.thing == 'a thing'; // true
 */

var roleClaimer = {

    /** @param {Creep} creep **/
    claim: function(creep) {
        var flag = Game.flags[creep.memory.roomflag];
        creep.moveTo(flag, {visualizePathStyle: {stroke: '#ffffff'}});
        if(flag && flag.room)
        var target = flag.room.controller;
        //var target=Game.getObjectById(creep.memory.tgid);
        if(creep.claimController(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        //creep.moveTo(Game.flags.flagc.pos, {visualizePathStyle: {stroke: '#ffffff'}});
	},
	reserve: function(creep) {
        var ROOM = Game.rooms[creep.memory.roomname];
        if(ROOM){
            var target = ROOM.controller;
            if(creep.reserveController(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
	}
};
module.exports = roleClaimer;