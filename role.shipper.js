/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.shiper');
 * mod.thing == 'a thing'; // true
 */
var GFun = require('game.function');
var roleShipper = {
    /** @param {Creep} creep **/
    run: function(creep) {//creep.memory.functioning=true;
        /*if(creep.ticksToLive < 25 || creep.memory.die){
            if(GFun.Die(creep))return true;
        }*/
        var type = creep.memory.type;
        if(!type)type = RESOURCE_ENERGY;
        var roomMemory= Memory.rooms[creep.room.name];
        var ROOM= Game.rooms[creep.room.name];
        if(roomMemory && ROOM && !ROOM.controller.my && roomMemory.defending && roomMemory.defending.enermyPower>=30){
            var exits = Game.map.describeExits(creep.pos.roomName);
            for(var e in exits){
                var roomname = exits[e].roomname;//console.log(roomname);
                if(Memory.rooms[roomname] && Memory.rooms[roomname].upgrading){
                    var pos = new RoomPosition(25,25,roomname);
                    creep.moveTo(pos);
                    return;
                }
            }
        }
	    if(creep.memory.functioning &&  _.sum(creep.carry) == 0) {//取资源
            creep.memory.functioning = false;
	    }
	    //console.log( creep.carry.energy +' '+ creep.carryCapacity);
	    if(!creep.memory.functioning &&  _.sum(creep.carry) > creep.carryCapacity*0.9) {//送资源
	        creep.say('🚧 shipping');
	        creep.memory.functioning = true;
	    }
        
	    if(creep.memory.functioning) {
            target = Game.getObjectById(creep.memory.tgid);
            if(creep.transfer(target, type) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
	    }
	    else {//去取资源
	        var source = Game.getObjectById(creep.memory.scid);
	       // if(GFun.IsConContainer(creep.memory.scid) && source.store && source.store[RESOURCE_ENERGY]<1000){
	       //     return 0;
	       // }
	        
	        creep.withdraw(source,type);//== ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'} });
            //source.store[RESOURCE_ENERGY]<(100+creep.carryCapacity) || 
            var targets = creep.pos.findInRange(FIND_DROPPED_ENERGY, 2);
	        if(targets.length>0){
	           creep.cancelOrder('withdraw');creep.cancelOrder('move');
	           if(creep.pickup(targets[0])== ERR_NOT_IN_RANGE) {
	               creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffaa00'} });
	           }
	        }
	    }
	},
	walk: function(creep){
	    /*if(creep.ticksToLive < 25 || creep.memory.die){
            if(GFun.Die(creep))return true;
        }*/
	    if(creep.memory.functioning && creep.carry.energy == 0) {
            creep.memory.functioning = false;
	    }
	    //console.log( creep.carry.energy +' '+ creep.carryCapacity);
	    if(!creep.memory.functioning && creep.carry.energy > 0) {
	        creep.say('🚧 walking');
	        creep.memory.functioning = true;
	    }
        
	    if(creep.memory.functioning) {
	        
	        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: object => (object.hits < object.hitsMax && object.hits < 200000)
            });
            if(targets.length>0){
                target=creep.pos.findClosestByRange(targets);
                if(target){
                    creep.repair(target);
                }
            }
            target = Game.getObjectById(creep.memory.tgid);
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target,{visualizePathStyle: {stroke: '#ffffff'}});
            }
	    }
	    else {//去取资源
	        
	        
            var source = Game.getObjectById(creep.memory.scid);
            //source && (source.store[RESOURCE_ENERGY]<(100+creep.carryCapacity) || 
	        if( creep.withdraw(source,RESOURCE_ENERGY)== ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'} });
            }
            var targets = creep.pos.findInRange(FIND_DROPPED_ENERGY, 1);
	        if(targets.length>0){
	           creep.pickup(targets[0]);
	        }
	    }
	},
	gather:function(creep){
	    
	    var target= Game.getObjectById(creep.memory.tgid);
	    if(creep.memory.functioning && creep.carry.energy == 0) {
            creep.memory.functioning = false;
	    }
	    if(!creep.memory.functioning && creep.carry.energy >0){
	        creep.say('🚧 gathering');
	        creep.memory.functioning = true;
	    }
	    if(creep.memory.functioning) {
	        
            if(target && creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
	    }else {
            var sources = target.pos.findInRange(FIND_STRUCTURES,3,{
            filter: object => {return (//object.structureType == STRUCTURE_CONTAINER  && object.store[RESOURCE_ENERGY]>=1800 ||
            object.id == creep.memory.linkid  && object && object.energy>0 )}
            });
            if(sources.length>0){
                source=sources[0];
                //source=creep.pos.findClosestByRange(sources);
                //if(source){
                    if(creep.withdraw(source,RESOURCE_ENERGY)== ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                    }     
                //}
            }
	    }
	}
};
module.exports = roleShipper;