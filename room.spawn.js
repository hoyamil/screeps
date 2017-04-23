/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.spawn');
 * mod.thing == 'a thing'; // true
 */
var CreepBody = require('creep.body');
var RoomSpawn = {
    creepExist:function(creepArray,part=WORK,ticks=10){
        var creepExist=0;
        for(var i in creepArray){
            var creep = Game.creeps[creepArray[i] ];
            if(creep && (creep.spawning || creep.ticksToLive >(creep.body.length*3 + ticks) ) ){
                creepExist += creep.getActiveBodyparts(part);
            }
        }
        return creepExist;
    },
    spawnHarvester:function(source,spawn,ticks=10,first=false){//采集者
        //for(var i in source){
            if(!spawn)return'free';
            var harvesterExist = RoomSpawn.creepExist(source.harvesters,WORK,ticks);
            var harvesterLack = source.harvesterDemand - harvesterExist;
            if(harvesterLack > 0 && source.neighborAvailable>source.harvesters.length){
                var target = null;
                var scid = source.id;
                if(source.tgid){
                    target = Game.getObjectById(source.tgid);
                }
                
                /*if(!target){
                    var sourceOb = Game.getObjectById(scid);
                    if(!sourceOb)return 'free';
                    var targets = sourceOb.pos.findInRange(FIND_STRUCTURES, 2,{filter: object => 
                            (object.structureType == STRUCTURE_CONTAINER || object.structureType == STRUCTURE_LINK ) } );
                    if(targets && targets.length>0){
                        target = targets[0];
                    }
                }*/
                if(!target){
                    var tgid = null;
                    var speed = 1;
                }else{
                    source.tgid =  target.id;
                    var tgid = target.id;
                    varspeed = 1;
                }
                if(first){
                    var BODY = [WORK,1,CARRY,1,MOVE,1];
                }else if(source.tgtype==STRUCTURE_LINK){
                    var BODY = CreepBody.SetHarvester(source.harvesterDemand,spawn.room.energyCapacityAvailable,speed,type=STRUCTURE_LINK);
                    if(BODY[1]<source.harvesterDemand){
                        if(BODY[1]>=source.harvesterDemand/2){
                            BODY=CreepBody.SetHarvester(harvesterLack,spawn.room.energyCapacityAvailable,speed,STRUCTURE_LINK);
                        }
                    }
                }else{
                    var BODY = CreepBody.SetHarvester(source.harvesterDemand,spawn.room.energyCapacityAvailable,speed);
                    if(BODY[1]<source.harvesterDemand){
                        if(BODY[1]>=source.harvesterDemand/2){
                            BODY=CreepBody.SetHarvester(harvesterLack,spawn.room.energyCapacityAvailable,speed);
                        }
                    }
                }
                
                var body = CreepBody.SpawnBody(BODY);
                var how = spawn.canCreateCreep(body, undefined);
                //console.log(ROOM+' '+how);
                if(how == OK) {
                    var newName = spawn.createCreep(body, undefined,{role: 'harvester',scid : scid,tgid : tgid});
                    source.harvesters.push(newName);
                    console.log(spawn.name+' is spawning new harvester :'+newName);
                    return OK;
                }else return how;
            }//缺少采集者
                
        //}//检索每个资源
        return 'free';
    },
    spawnBuilder:function(roomname,spawn){//建造者
        if(!spawn)return'free';
        var RoomMemory = Memory.rooms[roomname];
        if(RoomMemory && RoomMemory.building.builderDemand>0){
            var builderExist=RoomSpawn.creepExist(RoomMemory.building.builders);
            var builderLack = RoomMemory.building.builderDemand - builderExist;
            if(builderLack > 0){
                var builderMaxSize=Math.min(RoomMemory.building.builderDemand,4);
                var body = CreepBody.SpawnBody(CreepBody.Setbuilder(builderMaxSize,spawn.room.energyCapacityAvailable) );
                var how =spawn.canCreateCreep(body, undefined);
                if(how == OK) {
                    var newName = spawn.createCreep(body, undefined,{role: 'builder',roomname:roomname});
                    RoomMemory.building.builders.push(newName);
                    console.log(spawn.name+' is spawning new builder :'+newName);
                    return OK;
                }else return how;
            }
        }
        return 'free';
    },
    spawnRepairer:function(roomname,spawn){//修复者
         if(!spawn)return'free';
        var RoomMemory = Memory.rooms[roomname];
        if(RoomMemory && RoomMemory.repairing.repairerDemand>0){
            var repairerExist=RoomSpawn.creepExist(RoomMemory.repairing.repairers);
            var repairerLack = RoomMemory.repairing.repairerDemand - repairerExist;
            if(repairerLack > 0){
                var repairerMaxSize=Math.min(RoomMemory.repairing.repairerDemand,4);
                var body = CreepBody.SpawnBody(CreepBody.Setbuilder(repairerMaxSize,spawn.room.energyCapacityAvailable) );
                var how =spawn.canCreateCreep(body, undefined);
                if(how == OK) {
                    var newName = spawn.createCreep(body, undefined,{role: 'repairer'});
                    RoomMemory.repairing.repairers.push(newName);
                    console.log(spawn.name+' is spawning new repairer :'+newName);
                    return OK;
                }else return how;
            }
        }
        return 'free';
    },
    spawnShipper:function(shipping,spawn){//运输者
    
        var ShipperExist = RoomSpawn.creepExist(shipping.shippers,CARRY);
        if(ShipperExist.length==0){
            if(Game.getObjectById(shipping.scid) && Game.getObjectById(shipping.tgid) ){
                
            }
        }
    },
    
    spawnDefender:function(roomname,spawn){
        if(!spawn)return'free';return'free';
        RoomMemory = Memory.rooms[roomname];
        ROOM = Game.rooms[roomname];
        if(RoomMemory && RoomMemory.defending && (RoomMemory.defending.enermyPower>0 && RoomMemory.structures.tower.length==0 && RoomMemory.defending.defenders.length<2) ){
            var dPower = (RoomMemory.defending.enermyPower-RoomMemory.defending.defencePower);
            if(dPower>0){
                var body = CreepBody.SpawnBody(CreepBody.SetDefender(Math.min(300,dPower),spawn.room.energyCapacityAvailable) );
                var how =spawn.canCreateCreep(body, undefined);
                if(how == OK) {
                    var newName = spawn.createCreep(body, undefined,{role: 'defender'});
                    RoomMemory.defending.defenders.push(newName);
                    console.log(spawn.name+' is spawning new defender :'+newName);
                    return OK;
                }else return how;
            }
        }else if(RoomMemory.defending.enermyPower>1000 && RoomMemory.defending.defenders.length<1){
            var dPower = (RoomMemory.defending.enermyPower-RoomMemory.defending.defencePower)/2;
            if(dPower>0){
                if(ROOM.controller.my){
                    var body = CreepBody.SpawnBody(CreepBody.SetDefender2(Math.min(300,dPower),spawn.room.energyCapacityAvailable) );
                }else
                var body = CreepBody.SpawnBody(CreepBody.SetDefender(Math.min(300,dPower),spawn.room.energyCapacityAvailable) );
                var how =spawn.canCreateCreep(body, undefined);
                if(how == OK) {
                    var newName = spawn.createCreep(body, undefined,{role: 'defender'});
                    RoomMemory.defending.defenders.push(newName);
                    console.log(spawn.name+' is spawning new defender :'+newName);
                    return OK;
                }else return how;
            }
        }return 'free';
    },
    spawnReserver:function(roomname,spawn){
        if(!spawn)return'free';
        ROOM= Game.rooms[roomname];
        //if(!ROOM ||)
        RoomMemory=Memory.rooms[roomname];
        
        if(RoomMemory.reserving && RoomMemory.reserving.reserverDemand>0){
            var ReserverExist = RoomSpawn.creepExist(RoomMemory.reserving.reservers,CLAIM);
            if(ReserverExist<2 && ROOM && ROOM.controller && (!ROOM.controller.reservation || ROOM.controller.reservation.ticksToEnd<RoomMemory.reserving.reserverDemand) ){
                if(spawn.room.energyCapacityAvailable>=1300){
                    var BODY=[CLAIM,CLAIM,MOVE,MOVE];
                    var how =spawn.canCreateCreep(BODY, undefined);
                }else if(spawn.room.energyCapacityAvailable>=650){
                    var BODY=[CLAIM,MOVE];
                    var how =spawn.canCreateCreep(BODY, undefined);
                }else return 'free';
                if(how == OK) {
                    var newName = spawn.createCreep(BODY,undefined,{role:'reserver'});
                    ROOM.memory.reserving.reservers.push(newName);
                    console.log(spawn.name+' is spawning new reserver :'+newName);
                    return OK;
                }else return how;
            }
        } return 'free';
    },
    spawn:function(roomname){
        var RoomMemory = Memory.rooms[roomname];
        var ROOM = Game.rooms[roomname];
        var spawn = null;
        if(!ROOM || !RoomMemory)return ERR_NOT_FOUND;
        var spawns = ROOM.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_SPAWN } } );
        if(ROOM && ROOM.controller && ROOM.controller.my && spawns.length){
            for(var spi in spawns){
                if(!spawns[spi].spawning)spawns[spi].memory.spawnIsFree=true;
            }
            if(RoomMemory.structures.spawn.length){
                var first=true;
                for(var i in RoomMemory.source){
                    if(RoomMemory.source[i].harvesters.length){first=false;break;}
                }
                if(first){
                    var spawn1 = Game.spawns[RoomMemory.structures.spawn[0] ];
                    var source = spawn1.pos.findClosestByPath(FIND_SOURCES);
                    for(var i in RoomMemory.source){
                        if(RoomMemory.source[i].id==source.id){var sourceMemory=RoomMemory.source[i];break;}
                    }
                    if(RoomSpawn.spawnHarvester(sourceMemory,spawn1,30,first=true)!='free'){spawn1.memory.spawnIsFree=false;}
                    spawn1.memory.spawnIsFree=false;
                }
            }
            for(var spi in spawns){
                if(!spawns[spi].memory.spawnIsFree)continue;
                var transporterExist=RoomSpawn.creepExist(ROOM.memory.transporting.transporters,MOVE);
                if(transporterExist==0 && ROOM.memory.transporting.transporterDemand>0){
                    var body = CreepBody.SpawnBody(CreepBody.SetTransporter(1,ROOM.energyCapacityAvailable) );
                    var how = spawns[spi].canCreateCreep(body, undefined);
                    if(how == OK) {
                        var newName = spawns[spi].createCreep(body, undefined,{role: 'transporter'});
                        ROOM.memory.transporting.transporters.push(newName);
                        console.log(spawns[spi].name+' is spawning new transporter :'+newName);
                    }
                    spawns[spi].memory.spawnIsFree=false;
                    continue;
                }
                if(RoomSpawn.spawnDefender(roomname,spawns[spi])!='free'){spawns[spi].memory.spawnIsFree=false;continue;}
            }
            
            for(var i in RoomMemory.source){
                var sourcespawn = Game.spawns[RoomMemory.source[i].spawnname];
                if(!sourcespawn || sourcespawn.memory.spawnIsFree==false)continue;
                if(RoomSpawn.spawnHarvester(RoomMemory.source[i],sourcespawn,30)!='free'){sourcespawn.memory.spawnIsFree=false;}
            }
            for(var spj in spawns){
                if(spawns[spj].memory.spawnIsFree==false)continue;
                if(spawns[spi].spawning){spawns[spi].memory.spawnIsFree=false;continue;}
                var transporterExist=RoomSpawn.creepExist(ROOM.memory.transporting.transporters,MOVE);
                var transporterLack = ROOM.memory.transporting.transporterDemand - transporterExist;
                if(transporterLack > 0){
                    var transporterMaxSize=Math.min(ROOM.memory.transporting.transporterDemand,4);
                    var body = CreepBody.SpawnBody(CreepBody.SetTransporter(transporterMaxSize,ROOM.energyCapacityAvailable) );
                    var how =spawns[spj].canCreateCreep(body, undefined);
                    if(how == OK) {
                        var newName = spawns[spj].createCreep(body, undefined,{role: 'transporter'});
                        ROOM.memory.transporting.transporters.push(newName);
                        console.log(spawns[spj].name+' is spawning new transporter :'+newName);
                    }
                    spawns[spj].memory.spawnIsFree=false;continue;
                }
                if(RoomSpawn.spawnBuilder(roomname,spawns[spj])!='free'){spawns[spj].memory.spawnIsFree=false;return;}
                //------------------------------检查修复者----------------------------
                if(RoomSpawn.spawnRepairer(roomname,spawns[spj])!='free'){spawns[spj].memory.spawnIsFree=false;return;}  
            }
            var upgraderExist=RoomSpawn.creepExist(ROOM.memory.upgrading.upgraders);
            var upgraderLack = ROOM.memory.upgrading.upgraderDemand - upgraderExist;
            //console.log('upgraderLack:'+upgraderLack);
            if(upgraderLack > 0 && spawns.length && (!ROOM.memory.upgrading.Positions || ROOM.memory.upgrading.upgraders.length < ROOM.memory.upgrading.Positions.length) ){
                var spawn = spawns[0];
                if(spawn.memory.spawnIsFree){
                    spawn.memory.spawnIsFree=false;
                    var upgraderMaxSize=Math.min(ROOM.memory.upgrading.upgraderDemand,20);
                    var targets = ROOM.controller.pos.findInRange(FIND_STRUCTURES, 3,{filter: object => 
                        (object.structureType == STRUCTURE_CONTAINER || object.structureType == STRUCTURE_LINK ) } );
                    if(targets.length>0){
                        var speed = 1;
                    }else{
                        var speed = 2;
                    }
                    var body = CreepBody.SpawnBody(CreepBody.SetUpgrader(upgraderMaxSize,ROOM.energyCapacityAvailable,speed) );
                    var how =spawn.canCreateCreep(body, undefined);
                    if(how == OK) {
                        var newName = spawn.createCreep(body, undefined,{role: 'upgrader'});
                        ROOM.memory.upgrading.upgraders.push(newName);
                        console.log(spawn.name+' is spawning new upgrader :'+newName);
                    }
                }
            }
            if(ROOM.memory.mineral && ROOM.memory.mineral.minerDemand>0 && spawns.length){
                var miner = ROOM.memory.mineral.miner;
                if(!miner || !Game.creeps[miner] ){
                    var spawn = spawns[0];
                    if(spawn.memory.spawnIsFree){
                        spawn.memory.spawnIsFree=false;
                            //var minerMaxSize = Math.min(ROOM.memory.mineral.minersDemand,10);
                        var body = CreepBody.SpawnBody([WORK,8,MOVE,2]);
                        var how =spawn.canCreateCreep(body, undefined);
                        if(how == OK) {
                            var newName = spawn.createCreep(body, undefined,{role: 'miner'});
                            ROOM.memory.mineral.miner = newName;
                            console.log(spawn.name+' is spawning new miner :'+newName);
                        }
                    }
                }
            }
        //--------------------------查找母巢--------------------------------
        //var spawns = ROOM.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_SPAWN } } );
        //ROOM.memory.spawnIsFree=false;
        /*if(spawn){
            //var spawn = spawns[0];
            if(spawn.spawning)return ERR_BUSY;
            //spawn.memory.spawnIsFree=true;
            //------------------------------检查有无必需快递------------------------------
            var transporterExist=RoomSpawn.creepExist(ROOM.memory.transporting.transporters,MOVE);
            if(transporterExist==0 && ROOM.memory.transporting.transporterDemand>0){
                spawn.memory.spawnIsFree=false;
                var body = CreepBody.SpawnBody(CreepBody.SetTransporter(1,ROOM.energyCapacityAvailable) );
                var how =spawn.canCreateCreep(body, undefined);
                if(how == OK) {
                    var newName = spawn.createCreep(body, undefined,{role: 'transporter'});
                    ROOM.memory.transporting.transporters.push(newName);
                    console.log(spawn.name+' is spawning new transporter :'+newName);
                    return OK;
                }else return how;
            }
            //---------------------------------defence -------------------------
            if(RoomSpawn.spawnDefender(roomname,spawn)!='free'){spawn.memory.spawnIsFree=false;return;}
            //-----------------------检查采集者----------------------------------
           // console.log(ROOM);
           
            for(var i in RoomMemory.source){
                var sourcespawn = Game.spawns[RoomMemory.source[i].spawnname];
                if(RoomSpawn.spawnHarvester(RoomMemory.source[i],sourcespawn?sourcespawn:spawn)!='free'){spawn.memory.spawnIsFree=false;return;}
            }
            //------------------------------检查快递------------------------------
            var transporterLack = ROOM.memory.transporting.transporterDemand - transporterExist;
            if(transporterLack > 0){
                spawn.memory.spawnIsFree=false;
                var transporterMaxSize=Math.min(ROOM.memory.transporting.transporterDemand,5);
                var body = CreepBody.SpawnBody(CreepBody.SetTransporter(transporterMaxSize,ROOM.energyCapacityAvailable) );
                var how =spawn.canCreateCreep(body, undefined);
                if(how == OK) {
                    var newName = spawn.createCreep(body, undefined,{role: 'transporter'});
                    ROOM.memory.transporting.transporters.push(newName);
                    console.log(spawn.name+' is spawning new transporter :'+newName);
                    return OK;
                }else return how;
            }
            //------------------------------检查运输------------------------------
            
            //------------------------------检查建造者----------------------------
            if(RoomSpawn.spawnBuilder(roomname,spawn)!='free'){spawn.memory.spawnIsFree=false;return;}
            //------------------------------检查修复者----------------------------
            if(RoomSpawn.spawnRepairer(roomname,spawn)!='free'){spawn.memory.spawnIsFree=false;return;}
            //------------------------------检查升级者----------------------------
            var upgraderExist=RoomSpawn.creepExist(ROOM.memory.upgrading.upgraders);
            var upgraderLack = ROOM.memory.upgrading.upgraderDemand - upgraderExist;
            //console.log('upgraderLack:'+upgraderLack);
            if(upgraderLack > 0 && (!ROOM.memory.upgrading.Positions || ROOM.memory.upgrading.upgraders.length < ROOM.memory.upgrading.Positions.length) ){
                spawn.memory.spawnIsFree=false;
                var upgraderMaxSize=Math.min(ROOM.memory.upgrading.upgraderDemand,20);
                var targets = ROOM.controller.pos.findInRange(FIND_STRUCTURES, 3,{filter: object => 
                    (object.structureType == STRUCTURE_CONTAINER || object.structureType == STRUCTURE_LINK ) } );
                if(targets.length>0){
                    speed = 1;
                }else{
                    speed = 2;
                }
                var body = CreepBody.SpawnBody(CreepBody.SetUpgrader(upgraderMaxSize,ROOM.energyCapacityAvailable,speed) );
                var how =spawn.canCreateCreep(body, undefined);
                if(how == OK) {
                    var newName = spawn.createCreep(body, undefined,{role: 'upgrader'});
                    ROOM.memory.upgrading.upgraders.push(newName);
                    console.log(spawn.name+' is spawning new upgrader :'+newName);
                    return OK;
                }else return how;
                
            }//升级者
            //----------------------------- Mineral -------------------------------
            if(ROOM.memory.mineral.minerDemand>0){
                var miner = ROOM.memory.mineral.miner;
                if(!miner || !Game.creeps[miner] ){
                    spawn.memory.spawnIsFree=false;
                    //var minerMaxSize = Math.min(ROOM.memory.mineral.minersDemand,10);
                    var body = CreepBody.SpawnBody([WORK,8,MOVE,2]);
                    var how =spawn.canCreateCreep(body, undefined);
                    if(how == OK) {
                        var newName = spawn.createCreep(body, undefined,{role: 'miner'});
                        ROOM.memory.mineral.miner = newName;
                        console.log(spawn.name+' is spawning new miner :'+newName);
                        return OK;
                    }else return how;
                }
            }
*/
        }else{//no spawn
           // RoomSpawn.outerspawn(ROOM);
           if(RoomMemory.defending.enermyPower>=30){
               if(RoomMemory.defending.spawnname){
                   var spawn = Game.spawns[RoomMemory.defending.spawnname];
                   if(spawn && spawn.memory.spawnIsFree){
                       if(RoomSpawn.spawnDefender(roomname,spawn)!='free'){
                           spawn.memory.spawnIsFree=false;
                       }
                       return;   
                   }
                
               }
               
           }
               
           //------------------------------检查建造者----------------------------
            if(RoomMemory.building.spawnname){
                var spawn = Game.spawns[RoomMemory.building.spawnname];
                if(spawn && spawn.memory.spawnIsFree){
                       if(RoomSpawn.spawnBuilder(roomname,spawn)!='free'){
                           spawn.memory.spawnIsFree=false;
                           return;
                       }
                }
            }
            
           //-----------------------检查采集者----------------------------------
           for(var i in RoomMemory.source){
               var source = RoomMemory.source[i];
               if(source.spawnname){
                   var spawn = Game.spawns[source.spawnname];
                   if(spawn && spawn.memory.spawnIsFree){
                       if(RoomSpawn.spawnHarvester(source,spawn,80)!='free'){
                           spawn.memory.spawnIsFree=false;
                           return;
                       }
                   }
               }
            }
            //------------------------------检查运输------------------------------
            
            //------------------------------检查修复者----------------------------
            if(RoomMemory.repairing.spawnname){
                var spawn = Game.spawns[RoomMemory.repairing.spawnname];
                if(spawn && spawn.memory.spawnIsFree){
                       if(RoomSpawn.spawnRepairer(roomname,spawn)!='free'){
                           spawn.memory.spawnIsFree=false;
                           return;
                       }
                }
            }
            if(RoomMemory.reserving && RoomMemory.reserving.spawnname){
                var spawn =  Game.spawns[RoomMemory.reserving.spawnname];
                if(spawn && spawn.memory.spawnIsFree){
                    if(RoomSpawn.spawnReserver(roomname,spawn)!='free'){
                        spawn.memory.spawnIsFree=false;
                        return;
                    }
                }
            }
        }
    }
}
module.exports = RoomSpawn;