/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.creeps');
 * mod.thing == 'a thing'; // true
 */
var GFun = require('game.function');
var RFun = require('room.function');
var csAction =  require('creep.sourceaction');
var RoomCreeps = {
    harvest:function(roomname){
        var ROOM = Game.rooms[roomname];
        var RoomMemory = Memory.rooms[roomname];
        if(!ROOM || !RoomMemory || !ROOM.controller)return ERR_NOT_FOUND;
        if(!ROOM.controller.my && RoomMemory.defending && !RoomMemory.defending.baited && RoomMemory.defending.enermyPower>30){
            for(var i in RoomMemory.source){
                var source = RoomMemory.source[i];
                var spawn = Game.spawns[source.spawnname];
                for(var j in source.harvesters){
                    var creep = Game.creeps[source.harvesters[j] ];
                    
                    var tgcontainer=Game.getObjectById(source.tgid);
                    if(spawn && (spawn.room != creep.room || creep.pos.x>48 || creep.pos.x<1 || creep.pos.y>48 || creep.pos.y<1 ) ){
                        if(tgcontainer)creep.transfer(tgcontainer,RESOURCE_ENERGY);
                        creep.moveTo(spawn);
                        return ;
                    }
                }
            }
        }
        for(i in RoomMemory.source){
            var source = RoomMemory.source[i];
            for(j in source.harvesters){
                var creep = Game.creeps[source.harvesters[j] ];
                if(creep.memory.role=='renew')continue;
                var target = null;
                if(source.tgid){
                    var target = Game.getObjectById(source.tgid);
                }
                if(source.tgtype==STRUCTURE_LINK && creep.getActiveBodyparts(CARRY)){
                    csAction.setIO(creep);
                    if(creep.memory.io=='i'){
                        csAction.harvest(creep,Game.getObjectById(source.id) );
                    }else{
                        creep.transfer(target,RESOURCE_ENERGY);
                    }
                }else if(!target && creep.getActiveBodyparts(CARRY)){
                    csAction.setIO(creep);
                    if(creep.memory.io=='i'){
                        csAction.harvest(creep,Game.getObjectById(source.id) );
                    }else{
                        var target = creep.pos.findClosestByRange(FIND_STRUCTURES,{
                           filter: { structureType:STRUCTURE_SPAWN} });
                        if(target)csAction.transfer(creep,target);
                    }
                    
                }else{
                    csAction.harvest(creep,Game.getObjectById(source.id) );
                    if(target){
                        var poscreep = target.pos.lookFor(LOOK_CREEPS);
                        if(!poscreep.length || poscreep[0]==creep)creep.moveTo(target);
                    }
                }
            }
        }
    },
    mine:function(roomname){
        var ROOM = Game.rooms[roomname];
        var RoomMemory = Memory.rooms[roomname];
        if(!ROOM || !RoomMemory || !RoomMemory.mineral)return ERR_NOT_FOUND;
        var rMmineral = RoomMemory.mineral;
        if(!rMmineral.tgid || !rMmineral.exid || !rMmineral.miner)return ERR_NOT_FOUND;
        var creep = Game.creeps[rMmineral.miner];
        var target = Game.getObjectById(rMmineral.tgid);
        if(!target || !creep)return;
        if(!creep.pos.isEqualTo(target.pos)){
            creep.moveTo(target);
        }else{
            csAction.harvest(creep,Game.getObjectById(rMmineral.scid) );
        }
    },
    builders:function(roomname){
        var ROOM = Game.rooms[roomname];
        if(ROOM == null || ROOM.controller == null)return ERR_NOT_FOUND;
        var pickNum = 0;
        for(i in ROOM.memory.building.builders){
            var creep=Game.creeps[ROOM.memory.building.builders[i] ];
            
            if(creep.room!=ROOM){
                //var flag = Game.flags.BuildFlag;
                //if(creep.room!=flag.room && Game.map.getRoomLinearDistance(roomname,creep.room.name) >1 )
                //        creep.moveTo(Game.flags.BuildFlag,{visualizePathStyle: {stroke: '#0ff'}});
                //else   
                creep.moveTo(ROOM.controller,{visualizePathStyle: {stroke: '#0ff'}});
                //creep.moveTo(ROOM.controller,{visualizePathStyle: {stroke: '#0ff'}});
                continue;
            }
            if(ROOM.memory.structures.spawn.length && creep.memory.role!='renew'){
                if(creep.ticksToLive<300){
                    creep.memory.role='renew';
                    creep.memory.done=false;
                    continue;
                }
            }else if(creep.memory.role=='renew'){
                if(creep.memory.done){
                    creep.memory.done=false;
                    creep.memory.role='builder';
                }else continue;
            }
            csAction.setIO(creep);
            if(creep.memory.io=='i'){
                if(pickNum<2){
                   if(csAction.pickUpEnergy(creep)==OK){
                       pickNum++;
                       continue; 
                   }
                }
                if(csAction.getEnergy(creep)==OK)continue;
                //if(Memory.rooms[roomname].structures.spawn.length==0){
                    const sources = creep.room.find(FIND_SOURCES, {
                    filter: object =>(object.energy>0)
                    });
    	            const source= creep.pos.findClosestByPath(sources);
    	            csAction.harvest(creep,source);
               // }
            }else{
                if(ROOM.memory.building.builderDemand>0){
                    csAction.build(creep);
                }else{
                    if(csAction.repair(creep)!=OK){
                        var targets = ROOM.find(FIND_STRUCTURES,{
                        filter: object => (object.structureType == STRUCTURE_EXTENSION || object.structureType == STRUCTURE_SPAWN || object.structureType == STRUCTURE_TOWER )
                        && object.energy<object.energyCapacity });
                        if(targets.length){
                            csAction.transfer(creep,targets[0]);
                            continue;
                        }
                        var spawn = Game.spawns[ROOM.memory.building.spawnname];
                        if(spawn && Game.map.getRoomLinearDistance(roomname,spawn.room.name)<=1){
                            if(ROOM !=spawn.room){
                                if(RFun.TransCreep(creep,roomname,'builder')==OK){
                                    ROOM.memory.building.builders.splice(i,1);
                                }
                            }
                            else{
                                console.log(creep+' is suiciding!');
                                creep.suicide();
                            }
                        }
                    }
                }
            }
        }
    },
    repairers:function(roomname){
        var ROOM = Game.rooms[roomname];
        if(ROOM == null || ROOM.controller == null)return ERR_NOT_FOUND;
        for(i in ROOM.memory.repairing.repairers){
            var creep=Game.creeps[ROOM.memory.repairing.repairers[i] ];
            if(creep.room!=ROOM){
                creep.moveTo(ROOM.controller,{visualizePathStyle: {stroke: '#0ff'}});
                continue;
            }
            if(ROOM.memory.structures.spawn.length && creep.memory.role!='renew'){
                if(creep.ticksToLive<300){
                    creep.memory.role='renew';
                    creep.memory.done=false;
                    continue;
                }
            }else if(creep.memory.role=='renew'){
                if(creep.memory.done){
                    creep.memory.done=false;
                    creep.memory.role='repairer';
                }else continue;
            }
            csAction.setIO(creep);
            if(creep.memory.io=='i'){
                if(csAction.pickUpEnergy(creep)==OK)continue;
                if(csAction.getEnergy(creep)==OK)continue;
                var sources = creep.room.find(FIND_SOURCES, {
                    filter: object =>(object.energy>0)
                    });
	            source= creep.pos.findClosestByPath(sources);
	            csAction.harvest(creep,source);
            }else{
                
                if(csAction.repair(creep)!=OK){
                    
                    if(ROOM.memory.building.builderDemand>0){
                        csAction.build(creep);
                    }else{
                        var targets = ROOM.find(FIND_STRUCTURES,{
                        filter: object => (object.structureType == STRUCTURE_EXTENSION || object.structureType == STRUCTURE_SPAWN || object.structureType == STRUCTURE_TOWER )
                        && object.energy<object.energyCapacity });
                        if(targets.length){
                            csAction.transfer(creep,targets[0]);
                            continue;
                        }
                        console.log(creep+' is suiciding!');
                        creep.suicide();
                    }
                }
            }
        }
    },
    transporters:function(roomname){
        var ROOM = Game.rooms[roomname];
        if(ROOM == null || ROOM.controller == null || !ROOM.memory.transporting)return ERR_NOT_FOUND;
        for(i in ROOM.memory.transporting.transporters){
            var creep = Game.creeps[ROOM.memory.transporting.transporters[i] ];
            if(ROOM.memory.structures.spawn.length && creep.memory.role!='renew'){
                if(creep.ticksToLive<300){
                    
                    creep.memory.role='renew';
                    creep.memory.done=false;
                    continue;
                }
            }else if(creep.memory.role=='renew'){
                if(creep.memory.done){
                    creep.memory.done=false;
                    creep.memory.role='transporter';
                }else continue;
            }
            var dropped = creep.pos.findInRange(FIND_DROPPED_ENERGY,1,{
                    filter: object =>(object.resourceType==RESOURCE_ENERGY)
                    });
            if(dropped.length>0){
                creep.pickup(dropped[0],RESOURCE_ENERGY);
            }
            if(creep.memory.io=='i' && creep.memory.scid){
                if(creep.memory.sctype==RESOURCE_ENERGY){
                    var how = csAction.pickUpEnergy(creep);
                    if(how == ERR_NOT_FOUND || how == ERR_FULL){
                        creep.memory.wait4order='w';
                        creep.memory.scid=null;
                        creep.memory.sctype=null;
                        continue;
                    }
                }
                var source = Game.getObjectById(creep.memory.scid);
                if(source && !GFun.IsEmpty(source) ){
                    if(source.id==ROOM.memory.mineral.tgid){
                        how = csAction.getMineral(creep,source);
                        if(how == OK || how == ERR_NOT_ENOUGH_RESOURCES || how == ERR_FULL){
                            creep.memory.scid=null;
                            if(ROOM.terminal && (!ROOM.terminal.store[ROOM.memory.mineral.mineralType] || ROOM.terminal.store[ROOM.memory.mineral.mineralType]<10000) ){
                                creep.memory.tgid=ROOM.terminal.id;
                            }else if(ROOM.storage){
                                creep.memory.tgid=ROOM.storage.id;
                            }
                            creep.memory.io='o';
                        }
                    }else{
                        how = csAction.get(creep,source);
                        if(how == OK || how ==ERR_NOT_ENOUGH_ENERGY || how == ERR_FULL){
                            creep.memory.wait4order='w';
                            creep.memory.scid=null;
                        }
                    }
                }else{
                    creep.memory.wait4order='w';
                    creep.memory.scid=null;
                }
            }else if(creep.memory.io=='o' && creep.memory.tgid){
                if(creep.memory.tgtype==STRUCTURE_EXTENSION){
                    if(creep.carry.energy<50){
                        creep.memory.wait4order='w';
                        creep.memory.tgid=null;
                        creep.memory.tgtype=null;
                        continue;
                    }
                    var target = null;
                    if(creep.memory.tgid && creep.memory.tgid!=STRUCTURE_EXTENSION){
                        var target = Game.getObjectById(creep.memory.tgid);
                        if(!target || GFun.IsFull(target) )target=null;
                    }
                    if(!target){
                        var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES,{
                        filter: (structure) => { return (structure.structureType == STRUCTURE_EXTENSION && !GFun.IsFull(structure) );} } );
                    }
                    if(target){
                        creep.memory.tgid=target.id;
                        csAction.transfer(creep,target);
                    }else{
                        creep.memory.wait4order='w';
                        creep.memory.tgid=null;
                        creep.memory.tgtype=null;
                    }
                }else{
                    var target = Game.getObjectById(creep.memory.tgid);
                    if(target && !GFun.IsFull(target) ){
                        if(target == ROOM.storage || target == ROOM.terminal){
                            how = csAction.transferMineral(creep,target);
                            if(how == ERR_NOT_ENOUGH_RESOURCES){
                                creep.memory.wait4order='w';
                                creep.memory.tgid=null;
                            }
                        }else{
                            how = csAction.transfer(creep,target);
                            if(how == OK || how == ERR_FULL){
                                creep.memory.wait4order='w';
                                creep.memory.tgid=null;
                            }
                        }
                    }else{
                        creep.memory.wait4order='w';
                        creep.memory.tgid=null;
                    }
                }
            }
        }
    },
    
    upgraders:function(roomname){
        var ROOM = Game.rooms[roomname];
        if(ROOM == null || ROOM.controller == null || !ROOM.memory.upgrading)return ERR_NOT_FOUND;
        for(i in ROOM.memory.upgrading.upgraders){
            var creep=Game.creeps[ROOM.memory.upgrading.upgraders[i] ];
            csAction.setIO(creep);
            if(ROOM.memory.upgrading.Positions && ROOM.memory.upgrading.Positions.length>0){
                for(var p in ROOM.memory.upgrading.Positions){
                    var pos = RFun.getPos(ROOM.memory.upgrading.Positions[p]);
                    if(pos.isEqualTo(creep.pos) ){
                        break;
                    }else if(pos.lookFor(LOOK_CREEPS).length==0){
                        creep.moveTo(pos);
                        break;
                    }
                }
                if(creep.memory.io=='i'){
                    if(ROOM.memory.upgrading.scid){
                        var source = Game.getObjectById(ROOM.memory.upgrading.scid);
                        csAction.get(creep,source);
                        continue;
                    }
                    var Containers = creep.pos.findInRange(FIND_STRUCTURES,1,{
                        filter: object => (object.structureType == STRUCTURE_CONTAINER )
                        });
                    if(Containers.length>0){
                        Containers.sort( (a,b) => b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY] );
                        csAction.get(creep,Containers[0]);
                    }
                }else{
                    creep.upgradeController(ROOM.controller);
                }
            }else{
                if(creep.memory.io=='i'){
                    var Containers= ROOM.find(FIND_STRUCTURES,{
                        filter: object => (object.structureType == STRUCTURE_CONTAINER && object.store[RESOURCE_ENERGY]>0
                        || object.structureType == STRUCTURE_SPAWN && object.energy>0) } );
                    if(Containers.length>0){
                        Containers.sort( (a,b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b) );
                        csAction.get(creep,Containers[0]);
                    }
                }else{
                    csAction.upgrade(creep,ROOM.controller);
                }
            }
        }
    },
    defenders:function(roomname){
        var ROOM = Game.rooms[roomname];
        var RoomMemory = Memory.rooms[roomname];
        if(!RoomMemory || !RoomMemory.defending)return ERR_NOT_FOUND;
        var pos = new RoomPosition(25,25,roomname);
        //if(ROOM == null || ROOM.controller == null)return ERR_NOT_FOUND;
        for(var i in RoomMemory.defending.defenders){
            var creep = Game.creeps[RoomMemory.defending.defenders[i] ];
            if(!creep)continue;
            creep.moveTo(pos);
           // if(creep.room!=ROOM) creep.moveTo(ROOM.controller, {visualizePathStyle: {stroke: '#fff'}});
            if(!ROOM)continue;
            var targets = creep.room.find(FIND_HOSTILE_CREEPS,{
                filter: object => (object.ticksToLive >10 && (object.getActiveBodyparts('heal')<10 || object.getActiveBodyparts(RANGED_ATTACK)<4 || object.getActiveBodyparts(ATTACK)>8) ) 
                });
            if(targets.length>0){
                var target = creep.pos.findClosestByRange(targets);
                if(target){
                    creep.cancelOrder('move');
                    if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                        if(creep.pos.getRangeTo(target)<=2){
                            var direction = creep.pos.getDirectionTo(target);
                            creep.move(direction);
                        }else creep.moveTo(target, {visualizePathStyle: {stroke: '#f00'}});
                    }
                    creep.rangedAttack(target);
                }
                continue;
            }
            var targets = creep.room.find(FIND_HOSTILE_CREEPS);
            if(targets.length>0){
                var target = creep.pos.findClosestByRange(targets);
                if(target){
                    creep.cancelOrder('move');
                    if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                        if(creep.pos.getRangeTo(target)<=2){
                            var direction = creep.pos.getDirectionTo(target);
                            creep.move(direction);
                        }else creep.moveTo(target, {visualizePathStyle: {stroke: '#f00'}});
                    }
                    creep.rangedAttack(target);
                }
                continue;
            }
            if(creep.hits<creep.hitsMax*0.7){
                var spawn = Game.spawns[RoomMemory.defending.spawnname];
                if(spawn){
                    creep.moveTo(spawn);
                    creep.say("sleep~");
                    continue;
                }
            }
            if(RoomMemory.defending.enermyPower==0){
                var next = RoomMemory.defending.nextflag;
                if(next && Game.flags[next]){
                    creep.memory.role='assault';
                    creep.memory.routeflag=next;
                    RoomMemory.defending.defenders.splice(i,1);
                }
            }
        }
    },
    reservers:function(roomname){
        var ROOM = Game.rooms[roomname];
        var RoomMemory = Memory.rooms[roomname];
        if(!ROOM || !RoomMemory || !RoomMemory.reserving || !ROOM.controller)return ERR_NOT_FOUND;
        for(var i in RoomMemory.reserving.reservers){
            var creep = Game.creeps[RoomMemory.reserving.reservers[i] ];
            if(!creep)continue;
            creep.moveTo(ROOM.controller, {visualizePathStyle: {stroke: '#fff'}});
            creep.reserveController(ROOM.controller);
        }
    },
    scout:function(roomname){
        
    }
    
};
module.exports = RoomCreeps;