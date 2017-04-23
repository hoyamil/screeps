/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('structure.spawn');
 * mod.thing == 'a thing'; // true
 */
var CreepBody = require('creep.body');
var GFun = require('game.function');
var structureSpawn = {
    ship :function(spawn,shpi,scid,tgid,size=2,shpn=1,pathl=10,secondid=null){
        if(Game.getObjectById(scid)==null || Game.getObjectById(tgid)==null)return 0;
        var shippers = _.filter(Game.creeps, (creep) => {return(creep.memory.role == 'shipper' || creep.memory.role == 'walker') && creep.memory.i==shpi && (creep.spawning || creep.ticksToLive >(creep.body.length*3+pathl) ) ;} );
        
        for(i in shippers){
            shippers[i].memory.scid= scid;
            shippers[i].memory.tgid= tgid;
        }
        if(!spawn || !spawn.memory.spawnIsFree )return 0;
        var source = Game.getObjectById(scid);
        if(source && !source.room.memory.defending.baited && source.room.memory.defending.enermyPower>=30 && !source.room.controller.my)return 0;
        if(shippers.length < shpn && !spawn.spawning){
            var newName = spawn.createCreep(CreepBody.SpawnBody([CARRY,size,     MOVE,(size%2)? (size+1)/2 : (size/2)]), undefined, {role: 'shipper',i:shpi,scid : scid,tgid : tgid});
            newName = GFun.GetError(newName);
            console.log(spawn.name+' is Spawning new shipper ' + shpi+ ' : '+newName + ' of size '+ size);
            spawn.memory.spawnIsFree=false;
        }
    },
    
    toughship :function(spawn,shpi,scid,tgid,size=2,shpn=1,pathl=10,secondid=null){
        if(Game.getObjectById(scid)==null || Game.getObjectById(tgid)==null)return 0;
        var shippers = _.filter(Game.creeps, (creep) => {return(creep.memory.role == 'shipper' || creep.memory.role == 'walker') && creep.memory.i==shpi && (creep.spawning || creep.ticksToLive >(creep.body.length*3+pathl) ) ;} );
        
        for(i in shippers){
            shippers[i].memory.scid= scid;
            shippers[i].memory.tgid= tgid;
        }
        if(!spawn || !spawn.memory.spawnIsFree )return 0;
        
        if(Game.getObjectById(scid).room.memory.defending.enermyPower>=30 && !Game.getObjectById(scid).room.controller.my)return 0;
        if(shippers.length < shpn && !spawn.spawning){
            var newName = spawn.createCreep(CreepBody.SpawnBody([TOUGH,size,CARRY,size,MOVE,size]), undefined, {role: 'shipper',i:shpi,scid : scid,tgid : tgid});
            newName = GFun.GetError(newName);
            console.log(spawn.name+' is Spawning new shipper ' + shpi+ ' : '+newName + ' of size '+ size);
            spawn.memory.spawnIsFree=false;
        }
    },
    bait :function(spawn,flagname,nextflag=null,protectflag=null){
        if(!spawn)return 0;
        var baits = _.filter(Game.creeps, (creep) => {return(creep.memory.role == 'bait' && creep.memory.flagname == flagname );});
        if(baits.length<1){
            var newName = spawn.createCreep([MOVE], undefined, {role: 'bait',flagname:flagname ,nextflag:nextflag,protectflag:protectflag});
            newName = GFun.GetError(newName);
            console.log(spawn.name+' is Spawning new scout : '+newName+' at '+flagname);
            spawn.memory.spawnIsFree=false;
        }
        
    },
    scout :function(spawn,roomname,pathl=10){
        if(!spawn || spawn.spawning || !spawn.memory.spawnIsFree)return 0;
        var scouts = _.filter(Game.creeps, (creep) => {return(creep.memory.role == 'scouter' && creep.memory.roomname == roomname && (creep.spawning || creep.ticksToLive >(creep.body.length*3+pathl) ) );});
        if(scouts.length<1){
            var newName = spawn.createCreep([MOVE], undefined, {role: 'scouter',roomname:roomname });
            newName = GFun.GetError(newName);
            console.log(spawn.name+' is Spawning new scout : '+newName+' at '+roomname);
            spawn.memory.spawnIsFree=false;
        }
        
    },
    pick:function(spawn){
        if(!spawn || !spawn.room.storage)return 0;
        //if(spawn.room.defending.enermyPower>100)
        if(spawn.room.memory.defending.enermyPower>0){
            var enermies = spawn.room.find(FIND_HOSTILE_CREEPS);
            var boostparts=0;
            for(var e in enermies){
                for(var b in enermies[e].body){
                    if(enermies[e].body[b].boost)boostparts++;
                }
            }
            if(boostparts>=5){
                var pickers = _.filter(Game.creeps, (creep) => {return(creep.memory.role == 'picker');});
                if(pickers.length==0){
                    var newName = spawn.createCreep([CARRY,MOVE], undefined, {role: 'picker'});
                    newName = GFun.GetError(newName);
                    console.log(spawn.name+' is Spawning new picker : '+newName);
                    spawn.memory.spawnIsFree=false;
                    
                }
            }
        }
        var boosts = spawn.room.find(FIND_DROPPED_RESOURCES,{
                        filter: object =>(object.resourceType != RESOURCE_ENERGY) } );
        if(boosts.length>0){
            var pickers = _.filter(Game.creeps, (creep) => {return(creep.memory.role == 'picker');});
            if(pickers.length==0){
                var newName = spawn.createCreep([CARRY,MOVE], undefined, {role: 'picker'});
                newName = GFun.GetError(newName);
                console.log(spawn.name+' is Spawning new picker : '+newName);
                spawn.memory.spawnIsFree=false;
            }
        }
    },
    scoutre :function(spawn,stri,scid,x=2){
         if(!spawn)return 0;
        var scoutres = _.filter(Game.creeps, (creep) => {return(creep.memory.role == 'scoutre' && creep.memory.i == stri);});
        if(scoutres.length<1){
            switch(x){
                case 1:var newName = spawn.createCreep([WORK,CARRY,MOVE], undefined, {role: 'scoutre',i:stri,scid : scid});break;
                case 2:var newName = spawn.createCreep([WORK,WORK,CARRY,MOVE], undefined, {role: 'scoutre',i:stri,scid : scid});break;
            }
            console.log(spawn.name+' is Spawning new scoutre ' + stri+' : '+newName);
            
        }
        
    },
    claim :function(spawn,roomflag,size=1,number=1){
        if(!spawn || !spawn.memory.spawnIsFree )return 0;
        var claimers = _.filter(Game.creeps, (creep) => {return (creep.memory.role == 'claimer' && creep.memory.roomflag == roomflag );});
        if(claimers.length<number){
           // tg=Game.getObjectById(tgid);
            var flag = Game.flags[roomflag];
            if(flag && flag.room)
            var target = flag.room.controller;
            if(target && target.my)return 0;
            switch(size){
                case 1:var newName = spawn.createCreep([CLAIM,MOVE], undefined, {role: 'claimer', roomflag:roomflag});break;
                case 2:var newName = spawn.createCreep([CLAIM,CLAIM,MOVE,MOVE], undefined, {role: 'claimer', roomflag:roomflag});break;
            }
            newName = GFun.GetError(newName);
            console.log(spawn.name+' is Spawning new claimer : '+newName+' at '+roomflag);
            spawn.memory.spawnIsFree=false;
        }
    },
    reserve :function(spawn,roomname,size=2,number=1){//function(spawn,clmi,tgid,r=0,x=2,clmn=1){
        if(!spawn || !spawn.memory.spawnIsFree || Memory.rooms[roomname] &&  Memory.rooms[roomname].defending.enermyPower>=30)return 0;
        var reservers = _.filter(Game.creeps, (creep) => {return(creep.memory.role == 'reserver' && creep.memory.roomname == roomname );});
        if(reservers.length<number){
            var ROOM = Game.rooms[roomname];
            if(!ROOM || !ROOM.controller)return 0 ;
            var target = ROOM.controller;
            if(target && (target.reservation && target.reservation.ticksToEnd >1000 || target.my) )return 0;
            switch(size){
                case 1:var newName = spawn.createCreep([CLAIM,MOVE], undefined, {role: 'reserver', roomname:roomname});break;
                case 2:var newName = spawn.createCreep([CLAIM,CLAIM,MOVE,MOVE], undefined, {role: 'reserver', roomname:roomname});break;
            }
            newName = GFun.GetError(newName);
            console.log(spawn.name+' is Spawning new reserver : '+newName+' at '+roomname);
            spawn.memory.spawnIsFree=false;
        }
    },
    assault:function(spawn,roomflag,size=2,number=1){
        if(!spawn || !spawn.memory.spawnIsFree)return 0;
        var assaults = _.filter(Game.creeps, (creep) => {return(creep.memory.role == 'assault' && creep.memory.roomflag == roomflag );});
        if(assaults.length<number){
            switch(size){
                
                case 1:var newName = spawn.createCreep([MOVE,ATTACK], undefined, {role:'assault', roomflag:roomflag});break;
                case 2:var newName = spawn.createCreep([MOVE,MOVE,ATTACK,ATTACK], undefined, {role:'assault', roomflag:roomflag});break;
                case 3:var newName = spawn.createCreep([MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK], undefined, {role:'assault', roomflag:roomflag});break;
            }
            newName = GFun.GetError(newName);
            console.log(spawn.name+' is Spawning new assault : '+newName+' at '+roomflag);
            spawn.memory.spawnIsFree=false;
          //  console.log(spawn.name+' is Spawning new claimer ' + clmi+ ' : '+newName);
        }
    },
        
        
        
    defence:function(spawn,roomflag,baseflag='BASE'){
         if(!spawn)return -1;
       // var rm=Game.rooms[roomid];
               
        //if(1){
            /*var myforces = _.filter(Game.creeps, (creep) => {return(creep.memory.role == 'defender' && creep.memory.roomflag == roomflag && (creep.spawning || creep.ticksToLive >(creep.body.length*3+pathl) && creep.hits>creep.hitsMax*0.6 ) ) ;}) ;
            if(myforces.length<def){
                switch(x){
                    case 3: var newName = spawn.createCreep([TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK], undefined, {role: 'defender',roomflag : roomflag,baseflag:baseflag});break;
                    case 4: var newName = spawn.createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK], undefined, {role: 'defender',roomflag : roomflag,baseflag:baseflag});break;
                    default : console.log('Invalid defender size');
                }
                console.log(spawn.name+' is Spawning new defencer ' +newName + ' at '+ roomflag);
            }*/
            var flagroom=Game.flags[roomflag].room;
            var dforces = 0;
        if(flagroom){
            var hostiles = flagroom.find(FIND_HOSTILE_CREEPS);
                
            if(hostiles.length>0){
                var enemyforces=0;
                for(i in hostiles){
                    enemyforces += GFun.CalCreep(hostiles[i]);
                }
                enemyforces *=1.1;
                console.log('enemyforces :'+enemyforces +' at '+roomflag);
                var mydefences = _.filter(Game.creeps, (creep) => {return(creep.memory.role == 'defender' && creep.memory.roomflag == roomflag && (creep.spawning ||creep.hits>creep.hitsMax*0.3));}) ;
                var myforces=0;
                for(i in mydefences){
                    myforces += GFun.CalCreep(mydefences[i]);
                }
                dforces = enemyforces-myforces;
            }
            if(dforces>0){
                    spawn.memory[roomflag]=dforces;
            }else{
                var targets = flagroom.find(FIND_MY_CREEPS, {
                filter: object => object.hits < object.hitsMax
                });
                if(targets.length > 0) {
                    var healers =  _.filter(Game.creeps, (creep) => (creep.memory.role == 'healer' && creep.memory.roomflag==roomflag) );
                    if(healers.length==0){
                        var newName = spawn.createCreep([MOVE,HEAL], undefined, {role: 'healer',roomflag:roomflag });
                        newName = GFun.GetError(newName);
                        console.log(spawn.name+' is Spawning new healer : '+newName+' at '+roomflag);
                    }
                }
            } 
           
        }
        if(spawn.memory[roomflag]){
            dforces=spawn.memory[roomflag];
            var bodycal = GFun.SetDefender(dforces,GFun.calfun(spawn,0));
          //  console.log('bodycal:'+bodycal);
            var newName = spawn.createCreep(GFun.SpawnBody(bodycal), undefined, {role: 'defender',roomflag : roomflag,baseflag:baseflag});
            console.log('newName:'+newName);
            if(GFun.GetError(newName,0)==0){
                spawn.memory[roomflag]=null;
                console.log(spawn.name+' is Spawning new Defender: ' + newName + ' of '+GFun.CalBody(bodycal)[0]+' forces and '+GFun.CalBody(bodycal)[1]+' energy at '+roomflag);
            }
            //return 0; 
            return spawn.memory[roomflag];
        } 
        return 0;
       
    },
    testDefence:function(spawn,roomflag='ATTACK',baseflag='BASE'){
        var newName = spawn.createCreep(GFun.SpawnBody(), undefined, {role: 'defender',roomflag : roomflag,baseflag:baseflag});
    },
    gather :function(spawn,gth=1,x=1){
        if(!spawn)return 0;
        var gatherers =  _.filter(Game.creeps, (creep) =>(creep.memory.role == 'gatherer' && creep.room == spawn.room));
        if(gatherers.length < gth){
            var tg=spawn.room.storage;
            if(tg){
                var tgid = tg.id;
                var Links = spawn.room.storage.pos.findInRange(FIND_STRUCTURES,2,{
                filter: object => (object.structureType == STRUCTURE_LINK )
                });
                if(Links.length>0)linkid =Links[0].id;
                /*switch(spawn.name){
                    case 'Spawn1':var linkid = '58c71c97882e5a6e2583bb90';break;
                    //case 'Spawn2':var linkid = '58c71c97882e5a6e2583bb90';break;
                    default:var linkid =null;
                }*/
                switch(x){
                    case 1: var newName = spawn.createCreep([CARRY,CARRY,MOVE], undefined, {role: 'gatherer',tgid:tgid,linkid:linkid});break;
                    case 2: var newName = spawn.createCreep([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'gatherer',tgid:tgid,linkid:linkid});break;
                    case 3: var newName = spawn.createCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'gatherer',tgid:tgid,linkid:linkid});break;
                }
                console.log(spawn.name+' is Spawning new gatherer: ' + newName);
            }
        }
    },
};
module.exports = structureSpawn;