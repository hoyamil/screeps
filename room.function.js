/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.function');
 * mod.thing == 'a thing'; // true
 */

var RoomFun = {
    clean:function(creepArray,role=null){
        for(i = 0;i<creepArray.length;){
            var creep = Game.creeps[creepArray[i] ];
            if(!creep || (role && creep.memory.role && creep.memory.role!=role && creep.memory.role!='renew')){
                creepArray.splice(i,1);
                continue;
            }
            i++;
        }
    },
    cleanSpawn:function(SpawnArray){
        for(i = 0;i<SpawnArray.length;){
            var Spawn = Game.spawns[SpawnArray[i] ];
            if(!Spawn){
                SpawnArray.splice(i,1);
                continue;
            }
            i++;
        }
    },
    cleanById:function(idArray){
        for(i = 0;i<idArray.length;){
            var object = Game.getObjectById(idArray[i].id);
            if(!object){
                idArray.splice(i,1);
                continue;
            }
            i++;
        }
    },
    
    cleanAll:function(roomname){
        var RoomMemory = Memory.rooms[roomname];
        if(RoomMemory == null)return ERR_NOT_FOUND;
        for(i in RoomMemory.source){
            RoomFun.clean(RoomMemory.source[i].harvesters,'harvester');
        }
        /*for(i in RoomMemory.shipping){
            RoomFun.clean( RoomMemory.shipping[i].shippers);
        }*/
        RoomFun.clean(RoomMemory.building.builders,'builder');
        RoomFun.clean(RoomMemory.repairing.repairers,'repairer');
        if(RoomMemory.transporting)
        RoomFun.clean(RoomMemory.transporting.transporters,'transporter');
        if(RoomMemory.upgrading)
        RoomFun.clean(RoomMemory.upgrading.upgraders,'upgrader');
        if(RoomMemory.defending)
        RoomFun.clean(RoomMemory.defending.defenders,'defender');
        if(RoomMemory.reserving)
        RoomFun.clean(RoomMemory.reserving.reservers,'reserver');
        if(RoomMemory.structures){
            RoomFun.cleanSpawn(RoomMemory.structures.spawn);
            RoomFun.cleanById(RoomMemory.structures.extension);
            RoomFun.cleanById(RoomMemory.structures.container);
            RoomFun.cleanById(RoomMemory.structures.link);
            RoomFun.cleanById(RoomMemory.structures.tower);
        }
    },
    
    EnergyRecord:function(roomname){
        var recordMax=200;
        var ROOM = Game.rooms[roomname];
        if(ROOM==null || !ROOM.memory.energyRecord)return ERR_NOT_FOUND;
        var containers= ROOM.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE);
                }
        });
        var sum=0;//,msum=0;
        for(i in containers){
            sum += containers[i].store[RESOURCE_ENERGY];
          //  msum += containers[i].storeCapacity;
        }
        ROOM.memory.energyRecord.unshift(sum);
        if(ROOM.memory.energyRecord.length > recordMax){
            ROOM.memory.energyRecord.pop();
        }
    },
    ShowEnergyRecord:function(roomname){
        var ROOM = Game.rooms[roomname];
        if(ROOM==null || !ROOM.memory.energyRecord)return ERR_NOT_FOUND;
        var rectleft=10;
        var recttop=30;
        var rectwidth=10;
        var rectheight=10;
        ROOM.visual.rect(rectleft,recttop,rectwidth,rectheight,{fill: 'transparent', stroke: '#eee'});
        var e0=ROOM.memory.energyRecord[0];
        var length=ROOM.memory.energyRecord.length;
        var oldx=rectleft+rectwidth-rectwidth/length/2;
        var oldy=recttop+rectheight-e0*rectheight/(e0>1000?e0:1000);
        var length=ROOM.memory.energyRecord.length;
        for(i=1;i<length;i++){
            var newx = oldx - rectwidth/length;
            var newy = recttop+rectheight - ROOM.memory.energyRecord[i]*rectheight/(e0>1000?e0:1000);
            ROOM.visual.line(oldx,oldy,newx,newy,{color: 'red', style: 'dashed'});
            oldx=newx;oldy=newy;
        }
        return OK;
    },
    getPos:function(object){
        var pos = new RoomPosition(object.x,object.y,object.roomName);
        return pos;
    },
    isEqualto:function(pos,object){
        if(pos.x==object.x && pos.y==object.y && pos.roomName==object.roomName)return true;
        else return false;
    },
    SetSpawn:function(roomname,spawnname,mode=0){
        var ROOM = Game.rooms[roomname];
        if(ROOM==null)return ERR_NOT_FOUND;
        for(var i in ROOM.memory.source){
            ROOM.memory.source[i].spawnname=spawnname;
        }
        for(var i in ROOM.memory.shipping){
            ROOM.memory.shipping[i].spawnname=spawnname;
        }
        ROOM.memory.building.spawnname=spawnname;
        ROOM.memory.repairing.spawnname=spawnname;
        ROOM.memory.defending.spawnname=spawnname;
        if(mode)ROOM.memory.reserving.spawnname=spawnname;
        return OK;
    },
    TransCreep:function(creep,roomname,role){
        if(!creep)return false;
        RoomMemory=Memory.rooms[roomname];
        if(!RoomMemory)return false;
        switch(role){
            case 'builder':
                if(RoomMemory.building){
                    creep.memory.roomname=roomname;creep.memory.role=role;
                    RoomMemory.building.builders.push(creep.name);return OK;
                };break;
            case 'transporter':
                if(RoomMemory.transporting){
                    creep.memory.roomname=roomname;creep.memory.role=role;
                    RoomMemory.transporting.transporters.push(creep.name);return OK;
                };break;
        }
        return false;
    }
};
module.exports = RoomFun;