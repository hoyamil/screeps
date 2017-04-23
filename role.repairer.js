/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.repairer');
 * mod.thing == 'a thing'; // true
 */
var GFun = require('game.function');
var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {//creep.memory.repairing=true;
        if(creep.memory.scid==null || (creep.memory.functioning && creep.carry.energy == 0) ) {
            creep.memory.functioning = false;
            GFun.findClosestSource(creep,0);
	    }
	    if(!creep.memory.functioning && creep.carry.energy >0) {
	        creep.memory.functioning = true;
	        creep.say('🚧 repair');
	    }
        
	   if(creep.memory.functioning) {
	        var limit = 100000;
            do{
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: object =>(object.hits < object.hitsMax && object.hits < limit && !object.pos.isEqualTo(Game.flags.Dismantle.pos))
                    });
                limit *=2;
               // console.log(limit);
            }while(targets.length<1 && limit <300000);
            
            if(targets.length > 0) {
                target = creep.pos.findClosestByRange(targets);
                if(target){
                    if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
	        
        }
        else{
            if(creep.memory.scid){
	            source = Game.getObjectById(creep.memory.scid);
	            if(creep.withdraw(source,RESOURCE_ENERGY)== ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'} });
                }
	        }
            
        }
	},
	outrepair:function(creep) {//creep.memory.repairing=true;
	    if(creep.memory.scid==null || (creep.memory.functioning && creep.carry.energy == 0) ) {
            creep.memory.functioning = false;
            GFun.findClosestSource(creep,0);
	    }
	    if(!creep.memory.functioning && creep.carry.energy >0) {
	        creep.memory.functioning = true;
	        creep.say('🚧 repair');
	    }
        
	   if(creep.memory.functioning) {
	       var flag = Game.flags[creep.memory.roomflag];
	       if(flag && creep.room != flag.room){
	       // if(creep.room.name!=creep.memory.roomid){
	            creep.moveTo(flag);
    	        // GFun.GoToRoom(creep,creep.memory.roomid);
	            return 0;
	        }
	       var limit = 5000;
            do{
                var targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => (object.hits < object.hitsMax && object.hits < limit)
                });
                limit *=2;
               // console.log(limit);
            }while(targets.length<1 && limit <300000);
            
            if(targets.length > 0) {
                target = creep.pos.findClosestByRange(targets);
                if(target){
                    if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }else{
                creep.moveTo(flag);
            }
	        
        }else{
            if(creep.memory.scid){
	            source = Game.getObjectById(creep.memory.scid);
	            if(creep.withdraw(source,RESOURCE_ENERGY)== ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'} });
                }
	        }else{
	            var bflag = Game.flags[creep.memory.baseflag];
	            if(bflag)creep.moveTo(bflag, {visualizePathStyle: {stroke: '#ffaa00'} });
	        }
            
        }
	}
};

module.exports = roleRepairer;