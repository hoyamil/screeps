/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.memory');
 * mod.thing == 'a thing'; // true
 */
var CreepBody = require('creep.body');
var GFun = require('game.function');
var RFun = require('room.function');
var RoomMemory = {
    initscan:function(roomname){
        var ROOM = Game.rooms[roomname];
        if(ROOM == null || ROOM.controller == null)return ERR_NOT_FOUND;
        //if(ROOM.memory)return ERR_NAME_EXISTS;
        //-----------------------------------确认资源-----------------------------------
        if(!ROOM.memory.source){
            var sources = ROOM.find(FIND_SOURCES);
            console.log(sources.length);
            if(!sources.length)return ERR_NOT_ENOUGH_RESOURCES;
            var spawns = ROOM.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_SPAWN } } );
            var spawnname = null;
            if(spawns.length>0){
                spawnname = spawns[0].name;
            }
            var harvesterDemand=0;
            if(ROOM.controller && (ROOM.controller.my || ROOM.controller.reservation && ROOM.controller.reservation.username=='hoyamil') ){
                harvesterDemand = 5;
            }else{
                harvesterDemand = 3;
            }
            ROOM.memory.source = new Array();
            for(var s in sources){
                var scid=sources[s].id;
                var pos=sources[s].pos;
                //Game.getObjectById(scid).pos;
                var x = pos.x;var y = pos.y;
                var p = new RoomPosition(pos.x,pos.y,pos.roomName);
                var neighborAvailable=0;
                for(var i=x-1;i<=x+1;i++){
                    for(var j=y-1;j<=y+1;j++){
                        p.x=i;p.y=j;
                        var t=p.lookFor(LOOK_TERRAIN);
                        if(t.length>0){
                            if(t[0].localeCompare('wall')==0)continue;
                            neighborAvailable++;
                        }
                    }
                }
                ROOM.memory.source[s] = {id:scid, pos:sources[s].pos, neighborAvailable:neighborAvailable, spawnname:spawnname, harvesterDemand:harvesterDemand, harvesters:new Array() };
            }
        }

        if(ROOM.controller.my){
            if(!ROOM.memory.mineral){
                var minerals = ROOM.find(FIND_MINERALS);
                if(minerals.length>0){
                    ROOM.memory.mineral={scid:minerals[0].id,mineralType:minerals[0].mineralType,exid:null,tgid:null,
                                        minerDemand:0,miner:null,transporterDemand:0,transporter:null,labs:new Array()};
                }
            }
            if(!ROOM.memory.scouting){
                ROOM.memory.scouting = new Array();
                var exits = Game.map.describeExits(roomname);
                for(var i in exits){
                    switch(i){
                        case '1':var direction = 'top';break;
                        case '3':var direction = 'right';break;
                        case '5':var direction = 'buttom';break;
                        case '7':var direction = 'left';break;
                    }
                    var scout = {roomname:exits[i],direction:direction,scout:null};
                    ROOM.memory.scouting.push(scout);
                }
            }
            if(!ROOM.memory.energyRecord)ROOM.memory.energyRecord=new Array();
            
            if(!ROOM.memory.transporting)ROOM.memory.transporting={spawnDemand:0,transporterDemand:0,distanceLevel:10,transporters:new Array(),
            supplyList:new Array(),requireList:new Array(),supplyLimit:9,requireLimit:1};
            if(!ROOM.memory.upgrading)ROOM.memory.upgrading = {scid:null,upgraderDemand:0,upgraders:new Array()};
            if(ROOM.memory.reserving)delete ROOM.memory.reserving;
            
        }else{
            if(ROOM.memory.upgrading)delete ROOM.memory.upgrading;
            //ROOM.memory.reserving = {spawnname:null,reserverDemand:500,reservers:new Array()};
            if(!ROOM.memory.reserving)ROOM.memory.reserving = {spawnname:null,reserverDemand:500,reservers:new Array()};
        }
        if(!ROOM.memory.shipping)ROOM.memory.shipping = new Array();
        
        if(!ROOM.memory.defending)ROOM.memory.defending={defenceLevel:0 , wallhitsDemand:0 , enermyPower:0 , defenders:new Array() ,defencePower:0};
            
        if(!ROOM.memory.building)ROOM.memory.building={spawnname:spawnname,builderDemand:0,builders:new Array(),completeOne:1};
            
        if(!ROOM.memory.repairing)ROOM.memory.repairing={spawnname:spawnname,repairerDemand:0,repairers:new Array()};
           
        if(!ROOM.memory.structures)ROOM.memory.structures={spawn:new Array(), extension:new Array(), container:new Array(), link:new Array(), tower:new Array()};
        //--------------------------------建筑物---------------------------------
      //  if(!ROOM.memory.structures)ROOM.memory.structures={spawns:new Array(), extensions:new Array(), containers:new Array(), links:new Array(), towers:new Array()};
        
        //ROOM.memory.state={energyflow,;
        //ROOM.memory.dangerlevel;
        return OK;
    },
    cleanRoom:function(){
        for(var i in Memory.rooms){
            var ROOM = Game.rooms[i];
            if(ROOM==null  && !Memory.rooms[i].defending.baited && (!Memory.rooms[i].defending || Memory.rooms[i].defending.spawnname==null) ){
                delete(Memory.rooms[i]);
                console.log('clearing Room '+i);
            }
        }
    },
    getDemandsToSpawnRoom:function(ignoreRooms){
        
        for(var r in Memory.rooms){
            if(!Game.rooms[r] || !Game.rooms[r].controller)continue;
            if(Memory.rooms[r].transporting) Game.rooms[r].memory.transporting.spawnDemand=0;
        }
        for(var i in Memory.rooms){
            var ignore = false;
            for(var ignorei in ignoreRooms){
                if(ignoreRooms[ignorei]==i){ignore = true;break;}
            }
            if(ignore)continue;
            var RoomMemory = Memory.rooms[i];
            if(!Game.rooms[i] || !Memory.rooms[i] || !Game.rooms[i].controller )continue;
            //--------------------升级者&&快递者需求----------------------------------
            if(Memory.rooms[i].transporting){
                Memory.rooms[i].transporting.spawnDemand += Memory.rooms[i].upgrading.upgraderDemand;
                Memory.rooms[i].transporting.spawnDemand += Memory.rooms[i].transporting.transporterDemand;
            }
            //-----------------建造者&&修复者需求--------------------------
            var spawn = Game.spawns[Memory.rooms[i].building.spawnname];
            if(spawn && spawn.room){
                spawn.room.memory.transporting.spawnDemand += Memory.rooms[i].building.builderDemand;
            }
            spawn = Game.spawns[Memory.rooms[i].repairing.spawnname];
            if(spawn && spawn.room){
                spawn.room.memory.transporting.spawnDemand += Memory.rooms[i].repairing.repairerDemand;
            }
            //------------------reserver
            if(Memory.rooms[i].reserving){
                spawn = Game.spawns[Memory.rooms[i].reserving.spawnname];
                if(spawn && spawn.room){
                    spawn.room.memory.transporting.spawnDemand += 10;
                }
            }
            //-----------------开采者需求------------------------------
            for(var j in Memory.rooms[i].source){
                var spawn = Game.spawns[Memory.rooms[i].source[j].spawnname];
                if(spawn && spawn.room){
                    spawn.room.memory.transporting.spawnDemand += Memory.rooms[i].source[j].harvesterDemand;
                }
            } 
            //-----------------运输者需求------------------------------
           /* for(var k in Memory.rooms[i].shipping){
                var spawn = Game.spawns[Memory.rooms[i].shipping[k].spawnname];
                if(spawn && spawn.room){
                    spawn.room.memory.transporting.spawnDemand += Memory.rooms[i].shipping[k].shipperDemand;
                }
            }*/
        }
    },
    getDemandsPerRoom:function(roomname){//设置快递&&建造者&&升级者&&修复者
        var ROOM = Game.rooms[roomname];
        if(ROOM==null || !ROOM.controller)return ERR_NOT_FOUND;
        
        var containers= ROOM.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE);
                }
        });
        var sum=0,msum=0;
        for(var ci in containers){
            sum += containers[ci].store[RESOURCE_ENERGY];
            msum += containers[ci].storeCapacity;
        }
        var dropped =  ROOM.find(FIND_DROPPED_ENERGY, {filter: {resourceType:RESOURCE_ENERGY}});
        for(var di in dropped){
            sum += dropped[di].amount;
        }
        //-----------------------建造者---------------------
        var constructions = ROOM.find(FIND_CONSTRUCTION_SITES);
        if(constructions.length>0){
            if(msum==0 || ROOM.controller.my && ROOM.memory.structures.spawn.length==0){
                var sourceNum = ROOM.memory.source.length;
                if(ROOM.controller.my && ROOM.memory.structures.spawn.length==0){
                    if(ROOM.controller.level>=5){
                        ROOM.memory.building.builderDemand=20;
                    }else{
                        ROOM.memory.building.builderDemand=8*sourceNum;
                    }
                }
                //else 
                ROOM.memory.building.builderDemand=4*sourceNum;
            }else if(sum>=1000){
                var constructionHits=0;
                for(var i in constructions){
                    constructionHits += constructions[i].progressTotal-constructions[i].progress;
                }
               // console.log(Math.min((sum/1000)*(sum*3/msum) )+' '+constructionHits/1000 );
                ROOM.memory.building.builderDemand=Math.min(20,Math.ceil(Math.min((sum/1200)*(sum*2/msum),constructionHits/1200)*(sum*2/msum) ) );
            }
            if(ROOM.memory.building.builderDemand==0)ROOM.memory.building.builderDemand=1;
        }else{
            ROOM.memory.building.builderDemand=0;
        }
        //--------------------------------------------修复者--------------------------------
                
        var defenceLevel=0;
        var wallhitsDemand=0;
        if(ROOM.controller.my){
            if(ROOM.controller.level>=2){
                ROOM.memory.defending.defenceLevel = ROOM.controller.level-1;
            }else{
                ROOM.memory.defending.defenceLevel=0;
            }
            defenceLevel = ROOM.memory.defending.defenceLevel;
            switch(defenceLevel){
                case 1:case 2:case 3:case 4:case 5:
                wallhitsDemand=10000;break;    
                case 6:case 7:
                wallhitsDemand=50000;break;
            }
            if(ROOM.memory.defending.wallhitsDemand && ROOM.memory.defending.wallhitsDemand > wallhitsDemand){
                wallhitsDemand = ROOM.memory.defending.wallhitsDemand;
            }else{ 
                ROOM.memory.defending.wallhitsDemand = wallhitsDemand;
            }
        }
        var hitsLack=0;
        var structures = ROOM.find(FIND_STRUCTURES, {filter: object =>(object.hits < object.hitsMax)
            && object.structureType!=STRUCTURE_WALL && object.structureType!=STRUCTURE_RAMPART && !GFun.inDismantleList(object.id)} );
        for(var si in structures){
            hitsLack += structures[si].hitsMax-structures[si].hits;
        }
        if(defenceLevel){
            var structures = ROOM.find(FIND_STRUCTURES, {
                filter: object =>(object.structureType==STRUCTURE_WALL || object.structureType==STRUCTURE_RAMPART )
                && object.hits < wallhitsDemand } );
            for(var si in structures){
                var dhits = wallhitsDemand-structures[si].hits;
                if(dhits>0)hitsLack += dhits;
            }
        }
        if(hitsLack>50000){
            ROOM.memory.repairing.repairerDemand =Math.min(20,Math.min(Math.max(3,sum/2000),hitsLack/50000) );
        }else{
            ROOM.memory.repairing.repairerDemand = 0;
        }
        //-------------------------------------- 防御者 ---------------------------
        
        var hostiles = ROOM.find(FIND_HOSTILE_CREEPS);
        if(hostiles.length>0){
            var enermyPower=0;
            for(var e in hostiles){
                enermyPower += CreepBody.CalCreepPower(hostiles[e]);
            }
            ROOM.memory.defending.enermyPower=enermyPower;
        }else{
            ROOM.memory.defending.enermyPower=0;
        }
        var defencePower = 0;
        for(var d in ROOM.memory.defending.defenders){
            var defender = Game.creeps[ROOM.memory.defending.defenders[d] ];
            defencePower+=CreepBody.CalCreepPower(defender);
        }
        ROOM.memory.defending.defencePower=defencePower;
        //------------------------------------确认快递需求---------------------------
        if(ROOM.controller.my){
        //    console.log('room '+ROOM+':sum/1000:'+sum/1000+' ROOM.eCAvailable/200:'+ROOM.energyCapacityAvailable/200+' spawnDemand/8:'+ROOM.memory.transporting.spawnDemand/8);
            /*var maxR = 0;
            for(var sci in ROOM.memory.source){
                var pos = new RoomPosition(ROOM.memory.source[sci].pos.x,ROOM.memory.source[sci].pos.y,roomname);
                var range = pos.getRangeTo(Game.spawns[ROOM.memory.structures.spawn[0] ]);
                if(range>maxR)maxR=range;
            }*/
          //  console.log(ROOM+' :'+maxR);distanceLevel
            var number1 =  (sum/1000)*(ROOM.memory.transporting.supplyLimit-ROOM.memory.transporting.requireLimit + 6)/10;
            var number2 = Math.min( ROOM.energyCapacityAvailable/200 + ROOM.memory.upgrading.upgraderDemand/8, ROOM.memory.transporting.spawnDemand/12
                + ROOM.memory.structures.tower.length/2 ) + ROOM.memory.structures.spawn.length*2 - 2;
            console.log(ROOM+' :'+number1+' :'+number2);
            ROOM.memory.transporting.transporterDemand=Math.ceil(Math.min(number1,number2) )*(ROOM.memory.transporting.distanceLevel+10)/20;
            if(ROOM.memory.transporting.transporterDemand<=0)ROOM.memory.transporting.transporterDemand=1;
            //-------------------------mineral-------------------------
            if(ROOM.memory.mineral){
                ROOM.memory.mineral.minerDemand=0;
                if(ROOM.memory.mineral.tgid && ROOM.memory.mineral.exid){
                    var mineral = Game.getObjectById(ROOM.memory.mineral.scid);
                    if(mineral && mineral.mineralAmount>1500 && ROOM.storage && (!ROOM.storage.store[ROOM.memory.mineral.mineralType] || ROOM.storage.store[ROOM.memory.mineral.mineralType]<100000) ){
                        ROOM.memory.mineral.minerDemand=8;
                    }
                }
            }
            
            
            //-------------------------升级者------------------------------
            
            sum +=ROOM.energyAvailable;
            msum+=ROOM.energyCapacityAvailable;
            if(ROOM.storage)msum-=ROOM.storage.storeCapacity*0.2;
            if(sum>=2000 && ROOM.memory.upgrading.Positions){
           //     console.log(sum+' '+msum);
                ROOM.memory.upgrading.upgraderDemand=Math.round((sum/2000)*(sum*2/msum)*(sum*2/msum));
            }else{
                ROOM.memory.upgrading.upgraderDemand=0;
            }
            if(ROOM.memory.upgrading.upgraderDemand==0 && ROOM.controller.my && (ROOM.controller.ticksToDowngrade<2000 || ROOM.controller.level==1) ){
                ROOM.memory.upgrading.upgraderDemand=1;
            }
        }
    },
    updateStructures:function(roomname){
        var ROOM = Game.rooms[roomname];
        var roomMemory = Memory.rooms[roomname];
        if(!roomMemory || !ROOM || !ROOM.controller)return ERR_NOT_FOUND;
        if(roomMemory.building.completeOne){
            //delete roomMemory.structures;
            roomMemory.structures={spawn:new Array(), extension:new Array(), container:new Array(), link:new Array(), tower:new Array()};
            var structures = ROOM.find(FIND_STRUCTURES);
            for(var s in structures){
                if(roomMemory.structures[structures[s].structureType]){
                    if(structures[s].structureType==STRUCTURE_SPAWN){
                        roomMemory.structures[structures[s].structureType].push(structures[s].name);
                    }
                    else roomMemory.structures[structures[s].structureType].push({id:structures[s].id, pos:structures[s].pos});
                }
            }
            var complete = roomMemory.building.completeOne;
            if(complete == STRUCTURE_SPAWN || complete == 1){
                
                if(roomMemory.structures.spawn.length==1){
                    var spawnname = roomMemory.structures.spawn[0];
                    for(var i in roomMemory.source){
                        
                        roomMemory.source[i].spawnname = spawnname;
                    }
                    roomMemory.building.spawnname =  spawnname;
                    roomMemory.repairing.spawnname =  spawnname;
                    roomMemory.defending.spawnname =  spawnname;
                }
            }
            if(complete == STRUCTURE_CONTAINER || complete == STRUCTURE_LINK || complete == 1){
        //-----------------------判断资源附近的存储---------------------
                for(var i in ROOM.memory.source){

                    var source = ROOM.memory.source[i];

                    
                    if(!source.tgid || !Game.getObjectById(source.tgid) ){
                        ROOM.memory.source[i].tgid = null;
                        for(var j in ROOM.memory.structures.container){
                            var container = ROOM.memory.structures.container[j];
                            
                            var cpos = RFun.getPos(container.pos);
                            var spos = RFun.getPos(source.pos);
                            if(spos.inRangeTo(cpos,1) ){
                                ROOM.memory.source[i].tgid = container.id;
                                ROOM.memory.source[i].tgtype = STRUCTURE_CONTAINER;
                                break;
                            }
                        }
                        for(var j in ROOM.memory.structures.link){
                            var link = ROOM.memory.structures.link[j];
                            var pos = RFun.getPos(link.pos);
                            if(pos.inRangeTo(source.pos,2) ){
                                ROOM.memory.source[i].tgid = link.id;
                                ROOM.memory.source[i].tgtype = STRUCTURE_LINK;
                                break;
                            }
                        }
                    }
                    if(source.tgid && Game.getObjectById(source.tgid) ){
                        if(source.tgtype == STRUCTURE_LINK){
                            if(ROOM.controller.my){
                                source.harvesterDemand = 6;
                            }else if(ROOM.controller.reservation && ROOM.controller.reservation.username=='hoyamil'){
                                source.harvesterDemand = 7;
                            }else{
                                source.harvesterDemand = 4;
                            }
                        }else{
                            if(ROOM.controller.my){
                                source.harvesterDemand = 5;
                            }else if(ROOM.controller.reservation && ROOM.controller.reservation.username=='hoyamil'){
                                source.harvesterDemand = 5;
                            }else{
                                source.harvesterDemand = 3;
                            }
                        }
                        
                    }
                    
                }
        
        //------------------------判断控制器周边-------------------------
                var Containers = ROOM.controller.pos.findInRange(FIND_STRUCTURES,3,{
                    filter: object => (object.structureType == STRUCTURE_CONTAINER )
                    });
                var posArray=new Array();
                posArray[0]=new Array();
                posArray[1]=new Array();
                posArray[2]=new Array();
                var r = ROOM.controller.pos.roomName;
                if(Containers.length>0){
                    if(ROOM.memory.upgrading){
                        ROOM.memory.upgrading.scid=Containers[0].id;
                        ROOM.memory.upgrading.Positions=new Array();
                        for(var x = ROOM.controller.pos.x - 3; x<= ROOM.controller.pos.x + 3; x++){
                            for(var y = ROOM.controller.pos.y - 3; y<=ROOM.controller.pos.y + 3; y++){
                                var pos = new RoomPosition(x,y,r);
                                var inrange = 0;
                                for(var i in Containers){
                                    if(pos.lookFor(LOOK_TERRAIN)[0].localeCompare('wall')==0){
                                        continue;
                                    }
                                    if(Containers[i].pos.inRangeTo(pos,1) )inrange=1;
                                }
                                if(inrange){
                                    posArray[ROOM.controller.pos.getRangeTo(pos)-1].push(pos);
                                }
                            }
                        }
                        for(var x in posArray){
                            for(var y in posArray[x]){
                                ROOM.memory.upgrading.Positions.push(posArray[x][y]);
                            }
                        }
                    }
                }else{
                    ROOM.memory.upgrading.Positions=new Array();
                }
    //-----------------------------判断矿石周边-------------------------
                if(ROOM.controller.my && ROOM.memory.mineral){
                    var mine = Game.getObjectById(ROOM.memory.mineral.scid);
                    var minestructures =_.filter(mine.pos.lookFor(LOOK_STRUCTURES),(structure)=>{return(structure.structureType==STRUCTURE_EXTRACTOR);} );
                    if(minestructures.length>0)ROOM.memory.mineral.exid = minestructures[0].id;
                    var Containers = mine.pos.findInRange(FIND_STRUCTURES,1,{filter: object => (object.structureType == STRUCTURE_CONTAINER ) } );
                    if(Containers.length>0)ROOM.memory.mineral.tgid = Containers[0].id;
                }
            }
        ROOM.memory.building.completeOne=null;
        return OK;    
        }
        return null;
    },
    setSRList:function(roomname){
        var ROOM = Game.rooms[roomname];
        var roomMemory = Memory.rooms[roomname];
        if(!ROOM || !roomMemory || !roomMemory.transporting)return ERR_NOT_FOUND;
        //-------------------------------设置快递订单----------------------------------
        var rM_transporting = roomMemory.transporting;
        var sListn = rM_transporting.sListn = rM_transporting.supplyList.length;
        var rListn = rM_transporting.rListn = rM_transporting.requireList.length;
        var dListn = sListn-rListn;
        var sLimit = rM_transporting.supplyLimit;      var rLimit = rM_transporting.requireLimit;
        if(sListn<rListn){
            rM_transporting.supplyLimit -= 0.5;
            rM_transporting.requireLimit -= 0.5;
        }else if (sListn>rListn){
            rM_transporting.supplyLimit += 0.5;
            rM_transporting.requireLimit += 0.5;
        }
        if(sListn < rM_transporting.transporters.length/2 ){
            rM_transporting.supplyLimit -= ( (dListn>4)?(dListn/4):1 );
        }else {
            rM_transporting.supplyLimit += (10-sListn)>4?(10-sListn)/4:1;
        }
        if(rListn < rM_transporting.transporters.length/2 ){
            rM_transporting.requireLimit += ( (dListn>4)?(dListn/4):1 );
        }else {
            rM_transporting.requireLimit -= rListn>4?rListn/4:1;
        }
        
        if(rM_transporting.supplyLimit <= rM_transporting.requireLimit){
            var avg = (rM_transporting.supplyLimit+ rM_transporting.requireLimit)/2;
            rM_transporting.supplyLimit = rM_transporting.requireLimit = avg;
            if(avg>=5){
                rM_transporting.requireLimit-=0.5;
            }else{
                rM_transporting.supplyLimit+=0.5;
            }
        }
        if(rM_transporting.supplyLimit>10)  rM_transporting.supplyLimit=10;
        if(rM_transporting.requireLimit>10) rM_transporting.requireLimit=10;
        if(rM_transporting.requireLimit<0)  rM_transporting.requireLimit=0;
        if(rM_transporting.supplyLimit<0)   rM_transporting.supplyLimit=0;
        delete rM_transporting.supplyList;
        delete rM_transporting.requireList;
        rM_transporting.supplyList=new Array();
        rM_transporting.requireList=new Array();
        var structures = ROOM.find(FIND_STRUCTURES,{
                    filter: object => (object.structureType == STRUCTURE_EXTENSION || object.structureType == STRUCTURE_SPAWN || object.structureType == STRUCTURE_TOWER 
                    || object.structureType == STRUCTURE_CONTAINER || object.structureType == STRUCTURE_LINK 
                    || object.structureType == STRUCTURE_TERMINAL || object.structureType == STRUCTURE_STORAGE )
                    });
        var ExtensionsToFill = 0;
        for(var i= 0 ;i<structures.length;i++){
            var pairMax =0 ;var type =0 ;
            switch(structures[i].structureType){
                case STRUCTURE_EXTENSION:
                    pairMax=0;type= 2;break;
                case STRUCTURE_SPAWN:
                    pairMax=1;type= 2;break;
                case STRUCTURE_TOWER:
                    pairMax=1;type= 1;break;
                case STRUCTURE_CONTAINER:
                    pairMax=2;type= 0;break;
                case STRUCTURE_LINK:
                    pairMax=1;type= -1;break;
                case STRUCTURE_STORAGE:
                    pairMax=1;type= 0;break;
                case STRUCTURE_TERMINAL:
                    pairMax=2;type= -2;break;
                default:pairMax=0;type= 0;
            }
            if(pairMax){
                //--------------------供给
                if( (type==0 && GFun.IsFull(structures[i],rM_transporting.supplyLimit/10) && structures[i].id != roomMemory.upgrading.scid || type==-1 && !GFun.IsEmpty(structures[i]) 
                || structures[i].id == roomMemory.upgrading.scid && GFun.IsFull(structures[i],(roomMemory.upgrading.upgraderDemand>10?(roomMemory.upgrading.upgraderDemand*0.015 + 0.45):0.6) ) )
                    && structures[i].pos.x>=4 && structures[i].pos.x<=45 && structures[i].pos.y>=4 && structures[i].pos.y<=45
                    || type==-2 && structures[i].store[RESOURCE_ENERGY]>ROOM.storage.store[RESOURCE_ENERGY]/5+1000 ){
                    var pair=0;
                    if(structures[i].id == roomMemory.upgrading.scid)pairMax=1;
                    if(type==0 && structures[i].id==roomMemory.mineral.tgid && !ROOM.storage)pairMax=0;
                    for(var j in rM_transporting.transporters){
                        var creep = Game.creeps[rM_transporting.transporters[j] ];
                        if(creep.memory.scid==structures[i].id)pair++;
                    }
                    if(pair<pairMax)rM_transporting.supplyList.push(structures[i].id);
                }//--------------------需求
                else if( type==0 && structures[i].id != roomMemory.mineral.tgid && GFun.IsEmpty(structures[i],rM_transporting.requireLimit/10) 
                    && structures[i].pos.x>4 && structures[i].pos.x<45 && structures[i].pos.y>4 && structures[i].pos.y<45
                    || type==2 && !GFun.IsFull(structures[i]) || type==1 && !GFun.IsFull(structures[i],0.9) 
                    || structures[i].id==roomMemory.upgrading.scid && !GFun.IsFull(structures[i],
                    (roomMemory.upgrading.upgraderDemand>10?(roomMemory.upgrading.upgraderDemand*0.015 + 0.15):0.3) )  
                    || type==-2 && structures[i].store[RESOURCE_ENERGY]<ROOM.storage.store[RESOURCE_ENERGY]/5-1000 ){
                    var pair=0;
                    for(var s in roomMemory.source){if(roomMemory.source[s].tgid==structures[i].id){pairMax= 0;break;} }
                    if(!pairMax)continue;
                    if(structures[i].id==roomMemory.upgrading.scid && roomMemory.upgrading.upgraderDemand>40){
                        pairMax=roomMemory.upgrading.upgraderDemand/10 - 2;
                    }
                    for(var j in rM_transporting.transporters){
                        var creep = Game.creeps[rM_transporting.transporters[j] ];
                        if(creep.memory.tgid==structures[i].id)pair++;
                    }
                    if(pair<pairMax)rM_transporting.requireList.push(structures[i].id);
                }
            }else{
               // console.log(ROOM + 'pairMax '+ pairMax + 'type '+type);
             if(type==2){// && !GFun.IsFull(structures[i]) ){
               // console.log(ROOM + structures[i]);
                if( !GFun.IsFull(structures[i])){
                    ExtensionsToFill ++;
                }
            }
            }
        }
       
        if(ExtensionsToFill>0){
            var ExtensionsPaired = 0;
            for(var j in rM_transporting.transporters){
                var creep = Game.creeps[rM_transporting.transporters[j] ];
                if(creep.memory.tgtype==STRUCTURE_EXTENSION)ExtensionsPaired++;
            }
           // console.log(ROOM + ' '+ ExtensionsToFill + ' '+ExtensionsPaired);
            switch(ROOM.controller.level){
                case 1:var creepFillNum=1;break;
                case 2:var creepFillNum=3;break;
                case 3:var creepFillNum=6;break;
                case 4:case 5:case 6:creepFillNum=8;break;
                default:creepFillNum=4;
            }
            for(var pushi = ExtensionsPaired; pushi<ExtensionsToFill/creepFillNum;pushi++)
                rM_transporting.requireList.push(STRUCTURE_EXTENSION);
            return OK;
        }
    }
};
module.exports = RoomMemory;