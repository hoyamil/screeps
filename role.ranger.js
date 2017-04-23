/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.ranger');
 * mod.thing == 'a thing'; // true
 */

var roleRanger = {

    /** @param {Creep} creep **/
    run: function(creep) {
        //creep.moveTo(Game.flags.flagr.pos, {visualizePathStyle: {stroke: '#ffffff'}});
    	var targets = creep.room.find(FIND_HOSTILE_CREEPS);
        if(targets.length>0) {
            //target = creep.pos.findClosestByPath(targets);
            target = Game.flags.flagr.pos.findClosestByPath(targets);
            if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                //creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }else{
            creep.moveTo(Game.flags.flagr.pos, {visualizePathStyle: {stroke: '#ffffff'}});
        }
	}
};
module.exports = roleRanger;