/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.creepmemory');
 * mod.thing == 'a thing'; // true
 */
 var GFun = require('game.function');
var RFun = require('room.function');
var rCreepMemory = {
    clean:function(creepArray){
        for(i = 0;i<creepArray.length;){
            var creep = Game.creeps[creepArray[i] ];
            if(!creep){
                creepArray.splice(i,1);
                continue;
            }
            i++;
        }
    },
    cleanAll:function(roomname){
        var ROOM = Game.rooms[roomname];
        if(ROOM == null || ROOM.controller == null)return ERR_NOT_FOUND;
        for(i in ROOM.memory.source){
            RoomCreeps.clean(ROOM.memory.source[i].harvesters);
        }
        for(i in ROOM.memory.shipping){
            RoomCreeps.clean( ROOM.memory.shipping[i].shippers);
        }
        RoomCreeps.clean(ROOM.memory.building.builders);
        RoomCreeps.clean(ROOM.memory.transporting.transporters);
        RoomCreeps.clean(ROOM.memory.repairing.repairers);
        RoomCreeps.clean(ROOM.memory.upgrading.upgraders);
    },
    setTransporter:function(roomname){
        var ROOM = Game.rooms[roomname];
        if(ROOM == null || ROOM.controller == null || !ROOM.memory.transporting)return ERR_NOT_FOUND;
        for(var i in ROOM.memory.transporting.transporters){
            var creep = Game.creeps[ROOM.memory.transporting.transporters[i] ];
            if(!creep.memory.wait4order)creep.memory.wait4order='w';
            if(creep.memory.wait4order=='w'){
                creep.memory.scid=null;creep.memory.tgid=null;creep.memory.tgtype=null;creep.memory.sctype=null;
                if(creep.carry.energy>=50){
                    creep.memory.io='o';
                    if(ROOM.memory.transporting.requireList.length>0){
                        var minRange = 50;
                        var minj = -1;
                        for(var j in ROOM.memory.transporting.requireList){
                            var requireItem = ROOM.memory.transporting.requireList[j];
                            if(requireItem==STRUCTURE_EXTENSION){
                                var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES,{
                                    filter: (structure) => { return (structure.structureType == STRUCTURE_EXTENSION && !GFun.IsFull(structure) );} } );
                            }else{
                                var target = Game.getObjectById(ROOM.memory.transporting.requireList[j]);
                            }
                            var Range = creep.pos.getRangeTo(target);
                            if(Range<minRange){
                                minRange=Range;
                                minj=j;
                            }
                        }
                        if(minj!=-1){
                            var tgid = ROOM.memory.transporting.requireList[minj];
                            if(tgid == STRUCTURE_EXTENSION){
                                creep.memory.tgtype = STRUCTURE_EXTENSION;
                                tgid = target.id;
                            }
                            creep.memory.tgid=tgid;
                            ROOM.memory.transporting.requireList.splice(minj,1);
                            creep.memory.wait4order='b';
                        }else if(ROOM.storage){
                            creep.memory.tgid=ROOM.storage.id;
                            creep.memory.wait4order='b';
                        }
                    }else if(ROOM.storage){
                        creep.memory.tgid=ROOM.storage.id;
                        creep.memory.wait4order='b';
                    }
                }else{
                    creep.memory.io='i';
                    if(ROOM.memory.transporting.supplyList.length>0){
                        creep.memory.scid=ROOM.memory.transporting.supplyList.pop();
                        creep.memory.wait4order='b';
                    }else if(ROOM.storage){
                        creep.memory.scid=ROOM.storage.id;
                        creep.memory.wait4order='b';
                    }else{
                        creep.memory.scid=RESOURCE_ENERGY;
                        creep.memory.sctype=RESOURCE_ENERGY;
                        creep.memory.wait4order='b';
                    }
                }
                
            }
        }
    }

}
module.exports = rCreepMemory;
