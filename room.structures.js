/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.structures');
 * mod.thing == 'a thing'; // true
 */
var RoomStructures = {
    tower:function(roomname){
        var ROOM = Game.rooms[roomname];
        if(ROOM == null || ROOM.controller == null || !ROOM.memory.structures)return ERR_NOT_FOUND;
        for(var i in ROOM.memory.structures.tower){
            var tower = Game.getObjectById(ROOM.memory.structures.tower[i].id);
            if(!tower)continue;
            /*var q = Game.flags.qqq;
            if(q.pos.findInRange(FIND_HOSTILE_CREEPS,2).length)
            var target = Game.getObjectById('58fbcb68563b75056118c56c');
            var w = Game.flags.www;
            if(w.pos.findInRange(FIND_HOSTILE_CREEPS,2).length)
            var target = Game.getObjectById('58fbd095233bc2d851efe0be');
            if(target && target.room == ROOM){
                tower.attack(target);
                continue;
            }*/
            var closestCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS,{
                filter: object => ( (object.hits < object.hitsMax-400 ) && (object.pos.inRangeTo(tower,10)||object.memory.role=='semiAttacker' ) )
                });
            if(closestCreep) {
                tower.heal(closestCreep);
                continue;
            }
            
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS,{
                filter: object => ( object.pos.inRangeTo(tower,5) && object.ticksToLive >50 && (object.getActiveBodyparts('heal')<=3 || object.getActiveBodyparts(ATTACK)>8)
                || object.pos.inRangeTo(tower,5) && object.ticksToLive >50 && (object.getActiveBodyparts('heal')<=2 || object.getActiveBodyparts(ATTACK)>8)
                || object.owner.username=='Invader'
                ) } );
            if(closestHostile) {
                tower.attack(closestHostile);
                continue;
            }
            var closestCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS,{
                filter: object => ( (object.hits < object.hitsMax-200 ) && (object.pos.inRangeTo(tower,10)||object.memory.role=='semiAttacker' ) )
                });
            if(closestCreep) {
                tower.heal(closestCreep);
                continue;
            }
            
            var defenceLevel=0;
            var wallhitsDemand=0;
            if(ROOM.memory.defending){
                defenceLevel = ROOM.memory.defending.defenceLevel;
                wallhitsDemand= ROOM.memory.defending.wallhitsDemand;
            }
            
            var targets = tower.room.find(FIND_STRUCTURES, {
                filter: object =>( object.hits <= object.hitsMax-800 && tower.pos.inRangeTo(object,5) && 
                (object.structureType!=STRUCTURE_WALL && object.structureType!=STRUCTURE_RAMPART || (object.structureType==STRUCTURE_WALL || object.structureType==STRUCTURE_RAMPART) && object.hits <= wallhitsDemand-1200 ) ) } );
            if(targets.length > 0 && tower.energy>300) {
                targets.sort( (a,b) => a.hits-b.hits);
                tower.repair(targets[0]);
                continue;
            }
        }
    },
    link:function(roomname){
        var ROOM = Game.rooms[roomname];
        if(ROOM == null || ROOM.controller == null || !ROOM.memory.structures)return ERR_NOT_FOUND;
        for(var i in ROOM.memory.structures.link){
            
        }
    }
};
module.exports = RoomStructures;