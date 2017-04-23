/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.sourceaction');
 * mod.thing == 'a thing'; // true
 */
var GFun = require('game.function');
var creepSourceAction = {
    harvest:function(creep,source){
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#fa0'}});
        }
    },
    transfer:function(creep,target){
        var how = creep.transfer(target, RESOURCE_ENERGY);
        if(how == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#0ff'}});
        }
        return how;
    },
    transferMineral:function(creep,target){
        var how = null;
        for(var r in creep.carry){
            how = creep.transfer(target,r);
            if(how == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#0ff'}});
            }
            
        }
        if(how!=null)return how;
        return ERR_NOT_ENOUGH_RESOURCES;
    },
    upgrade:function(creep,target){
        var how = creep.upgradeController(target);
        if(how == ERR_NOT_IN_RANGE) {
            
            var p = new RoomPosition(target.pos.x,target.pos.y,target.pos.roomName);
            var dx = p.x-creep.pos.x;
            var dy = p.y-creep.pos.y;
            if(dx<-6 || dx>6 || dy<-6 || dy>6){
                creep.moveTo(target, {visualizePathStyle: {stroke: '#0ff'} });
            }else{
                p.x-=dx/2;
                p.y-=dy/2;
                creep.moveTo(p, {visualizePathStyle: {stroke: '#0ff'}});
            }
            //console.log(how2);
            //if(how2==ERR_NO_PATH)creep.moveTo(target, {visualizePathStyle: {stroke: '#0ff'}});
        }
        return how;
    },
    get:function(creep,source){
        var how = creep.withdraw(source,RESOURCE_ENERGY);
        if(how == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#0af'} });
        }
        return how;
    },
    getMineral:function(creep,source){
        for(var r in source.store){
            if(source.store[r]!=0){
                var how = creep.withdraw(source,r);
                if(how == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#0af'} });
                }
                return how;
            }
        }
        return ERR_NOT_ENOUGH_RESOURCES;
    },
    pickUpEnergy:function(creep){
        var sources = creep.room.find(FIND_DROPPED_RESOURCES,{filter:(resource) => (resource.resourceType==RESOURCE_ENERGY && resource.amount>=100
            && resource.pos.x>=2 && resource.pos.x<=47 && resource.pos.y>=2 && resource.pos.y<=47) } );
        if(sources.length>0){
            var source = creep.pos.findClosestByRange(sources);
            if(source){
                var how = creep.pickup(source,RESOURCE_ENERGY);
                if(how == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#0af'} });
                    return OK;
                }else if(how == OK){
                    return OK;
                }
            }
        }else return ERR_NOT_FOUND;
    },
    getEnergy:function(creep){
        var sources = creep.room.find(FIND_STRUCTURES,{filter: (object) => (object.structureType==STRUCTURE_CONTAINER || object.structureType==STRUCTURE_STORAGE)&& object.store[RESOURCE_ENERGY]>=50 } );
        if(sources.length>0){
            var source = creep.pos.findClosestByRange(sources);
            if(source){
                var how = creep.withdraw(source,RESOURCE_ENERGY);
                if(how == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#0af'} });
                    return OK;
                }else if(how == OK){
                    return OK;
                }
            }
        }
    },
    build:function(creep){
        if(!creep)return;
        var target = null;
        if(creep.memory.buildid){
            target=Game.getObjectById(creep.memory.buildid);
            if(!target && creep.memory.buildType){
                console.log('building '+ creep.memory.buildType +' complete');
                creep.room.memory.building.completeOne=creep.memory.buildType;
                creep.memory.buildid=null;
                creep.memory.buildType=null;
            }
        }
        if(!target){
            var ROOM = Game.rooms[creep.memory.roomname];
            if(ROOM){
                var targets = ROOM.find(FIND_CONSTRUCTION_SITES);
            }else{
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES); 
            }
            
            if(targets.length>0) {
                target = creep.pos.findClosestByPath(targets);
            }
        }
        if(target){
            creep.memory.buildid=target.id;
            creep.memory.buildType=target.structureType;
            var how = creep.build(target);
            if(how == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            return OK;
        }
        
    },
    repair:function(creep,target=null){
        var defenceLevel=0;
        var wallhitsDemand=0;
        var ROOM=creep.room;
        var targets = creep.pos.findInRange(FIND_STRUCTURES,3, {
            filter: object => (object.hits < object.hitsMax && object.hits <= 4500)
            });
        if(targets.length>0){
            creep.repair(targets[0]);
        }
        if(ROOM.memory.defending){
            defenceLevel = ROOM.memory.defending.defenceLevel;
            wallhitsDemand= ROOM.memory.defending.wallhitsDemand;
        }
        if(!target && creep.memory.tgid && !GFun.inDismantleList(creep.memory.tgid)){
            target = Game.getObjectById(creep.memory.tgid);
            if(target && (target.hits==target.hitsMax ||  (target.structureType==STRUCTURE_WALL || target.structureType==STRUCTURE_RAMPART ) && target.hits >= wallhitsDemand  ) ){
                target = null;
            }
        }
        /*if(!target){
            var targets = ROOM.find(FIND_STRUCTURES, {filter: object => (object.hits < 6000 && object.structureType!=STRUCTURE_ROAD) } );
            if(targets.length > 0) {
                target = creep.pos.findClosestByRange(targets);
            }
        }*/
        if(!target){
            var targets = ROOM.find(FIND_STRUCTURES, {filter: object => ((object.structureType==STRUCTURE_WALL || object.structureType==STRUCTURE_RAMPART ) && object.hits < wallhitsDemand * 0.9) } );
            if(targets.length > 0) {
                target = creep.pos.findClosestByRange(targets);
            }
        }
        if(!target){
            var targets = ROOM.find(FIND_STRUCTURES, {filter: object => (object.structureType==STRUCTURE_ROAD && !GFun.inDismantleList(object.id) && object.hits < object.hitsMax * 0.5) } );
            if(targets.length > 0) {
                target = creep.pos.findClosestByRange(targets);
            }
        }
        if(!target){
            var targets = ROOM.find(FIND_STRUCTURES, {filter: object => (object.hits < object.hitsMax * 0.9 && object.structureType!=STRUCTURE_WALL && object.structureType!=STRUCTURE_RAMPART
            && !GFun.inDismantleList(object.id) ) } );
            if(targets.length > 0) {
                target = creep.pos.findClosestByRange(targets);
            }
        }
        if(target){
            creep.memory.tgid=target.id;
            if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#0f0'}});
            }
            return OK;
        }
    },
    setIO:function(creep){
        if(!creep.memory.io)creep.memory.io='i';
        const workbody = creep.getActiveBodyparts(WORK);
        if(creep.memory.io != 'o' && creep.carry.energy >= creep.carryCapacity - workbody*0.7){
            creep.memory.io = 'o';
            creep.say("I'm Happy!");
        }
        if(creep.memory.io != 'i' && creep.carry.energy <= workbody*0.7){
            creep.memory.io='i';
            creep.say("I miss you~");
        }
    }
}
module.exports = creepSourceAction;