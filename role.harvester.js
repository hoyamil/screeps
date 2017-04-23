/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */
var GFun = require('game.function');
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {// creep.memory.tgid='58c2ac6eb4d821a76086bc57';
	    /*if(creep.memory.die){
            if(GFun.Die(creep))return true;
        }*/

        var targets = creep.room.find(FIND_HOSTILE_CREEPS);
        if(targets.length>0){
            creep.moveTo(Game.flags.BASE);
        }
        var target=Game.getObjectById(creep.memory.tgid);
        if(target && target.structureType==STRUCTURE_CONTAINER && target.hits<110000){
            if(creep.carry.energy < 20) {
    	        var source=Game.getObjectById(creep.memory.scid);
    	        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }else{
                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }   
            }
            return -1;
        }
        if(creep.carry.energy < creep.carryCapacity - 4) {
	        var source=Game.getObjectById(creep.memory.scid);
	        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }else{
            
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE || target && target.Energy == 0) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }   
        }
	},
	dismantle:function(creep){
	    //if(creep.carry.energy < creep.carryCapacity - 1) {
	    //creep.drop(RESOURCE_ENERGY);
	    var p= Game.flags.Dismantle.pos;
	    if(p)var targets = Game.flags.Dismantle.pos.findInRange(FIND_STRUCTURES,0);
    	
    	if(targets.length>0){
    	    if(creep.dismantle(targets[0]) == ERR_NOT_IN_RANGE ) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
    	}else{
    	    creep.moveTo( Game.flags.Dismantle, {visualizePathStyle: {stroke: '#ffffff'}});
    	}
	}
};

module.exports = roleHarvester;