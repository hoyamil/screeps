//var roleRepairer = require('role.repairer');
var roleTransporter = require('role.transporter');
var roleShipper = require('role.shipper');
var roleAttacker = require('role.attacker');
var roleRanger = require('role.ranger');
var roleClaimer = require('role.claimer');
var roleHealer = require('role.healer');
var roleScouter = require('role.scouter');
var rolePicker = require('role.picker');
var roleBait = require('role.bait');
var roleBackup = require('role.backup');
var roleDefender = require('role.defender');
var structureSpawn = require('structure.spawn');
var structureLink = require('structure.link');

var GFun = require('game.function');
var RFun = require('room.function');
var rMemory = require('room.memory');
var rSpawn = require('room.spawn');
var rStructure =  require('room.structures');
var rCreep = require('room.creeps');
var rCreepMemory = require('room.creepmemory');
var CreepBody = require('creep.body');
//Game.getObjectById('58dbc5f78283ff5308a415c6').activateSafeMode();
//------------------------------设定建筑id------------------------
// console.log(CreepBody.SetDefender(250,1200));
//  var newName = Game.spawns.Spawn3.createCreep(CreepBody.SpawnBody([CARRY,4,MOVE,2]), undefined, {role: 'shipper',i:33,scid:'58e6dcf93599483a2933a1d8' ,tgid : '58f399c7ba7c8236a075b709',type:'X'});
    
//----------------------------------------------------------------
module.exports.loop = function () {
//console.log(CreepBody.SpawnBody(CreepBody.SetHarvester(7,800)));
//CreepBody.SetHarvester(7,500,1);
//console.log(CreepBody.SpawnBody(CreepBody.SetDefender2(300,5000)));
//Game.spawns.Spawn2a.createCreep(CreepBody.SpawnBody([MOVE,2,RANGED_ATTACK,10,MOVE,3]), undefined, {role: 'homeRanger',posflag:'Gather3',tgid:null});
 /*     var myStuff1 = _.filter(Game.creeps, (creep) => {return(creep.memory.torole=='harvester' && creep.memory.flagname == 'stuff' );});
    if(myStuff1.length<2){
        var newName = Game.spawns.Spawn2.createCreep([WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'bait',torole:'harvester',flagname:'stuff' });
        console.log('Spawn2 is Spawning new Stuff : '+newName+' at stuff');
    }
 
    var myStuff2 = _.filter(Game.creeps, (creep) => {return(creep.memory.torole=='builder' && creep.memory.flagname == 'stuff2' );});
    if(myStuff2.length<4){
        var newName = Game.spawns.Spawn2.createCreep([WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'bait',torole:'builder',flagname:'stuff2' });
        console.log('Spawn2 is Spawning new Stuff : '+newName+' at stuff2');
        var newName = Game.spawns.Spawn2a.createCreep([WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'bait',torole:'builder',flagname:'stuff2' });
        console.log('Spawn2a is Spawning new Stuff : '+newName+' at stuff2');
    }
    */
    var cycleindex=Game.time % 1500;
    if(cycleindex % 100 ==7){
       // Game.rooms.E98N6.terminal.send(RESOURCE_ENERGY, 1000, 'E96N7', 'Energy Gather');
      //  console.log('Energy Gather From E98N6 to E96N7');
    }
    for(var name in Memory.creeps) {//清理名字空间
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
  //  structureSpawn.pick(Game.spawns.Spawn1);
 //   structureSpawn.pick(Game.spawns.Spawn2);
  //  structureSpawn.pick(Game.spawns.Spawn3);
 //   structureSpawn.pick(Game.spawns.Spawn4);
     var ignoreRooms=new Array('E98N6','E95N7','E93N7','E97N8','E96N7','E96N9','E97N9','E98N8','E95N8');
    rMemory.cleanRoom();  
    if(cycleindex % 20 == 5){
        rMemory.getDemandsToSpawnRoom(ignoreRooms);
    }
    if(cycleindex % 2 == 0){
        for(var gr in Game.rooms){
            rMemory.initscan(gr);
        }
    }
   
    for(var i in Memory.rooms){//-------初始化房间内存---------------
        
        //console.log(RoomMemory.initscan(Game.rooms[i].name) );
       // cpuused[0]=Game.cpu.getUsed();
       // var startCpu = Game.cpu.getUsed();
        
      //  cpuused[1]=Game.cpu.getUsed();
        
        RFun.cleanAll(i);
       // cpuused[2]=Game.cpu.getUsed();
        if(cycleindex %300 ==33){
            Memory.rooms[i].building.completeOne=1;
        }
        rMemory.updateStructures(i);
      //  cpuused[3]=Game.cpu.getUsed();
        
        if(cycleindex % 10 == 0){
            rMemory.getDemandsPerRoom(i);
        }
      //  cpuused[4]=Game.cpu.getUsed();
        
      //  cpuused[5]=Game.cpu.getUsed();
        //var elapsed = Game.cpu.getUsed() - startCpu;
        if(cycleindex % 500 == 1 ){
            RFun.EnergyRecord(i);
        }
        RFun.ShowEnergyRecord(i);
      //  cpuused[6]=Game.cpu.getUsed();
        
        rCreep.harvest(i);
        rCreep.mine(i);
     //   cpuused[7]=Game.cpu.getUsed();
        
        rCreep.builders(i);
     //   cpuused[8]=Game.cpu.getUsed();
        
        rCreepMemory.setTransporter(i);
      //  cpuused[9]=Game.cpu.getUsed();
       
        rCreep.transporters(i);
      //  cpuused[10]=Game.cpu.getUsed();
        
        rCreep.repairers(i);
     //   cpuused[11]=Game.cpu.getUsed();
        
        rCreep.upgraders(i);
     //   cpuused[12]=Game.cpu.getUsed();
        
        rCreep.defenders(i);
      //  cpuused[13]=Game.cpu.getUsed();
        rCreep.reservers(i);
        rStructure.tower(i);
     //   cpuused[14]=Game.cpu.getUsed();
      
     /*   for(var t = 0; t < sumcpu.length;t++){
            console.log(sumcpu[t]);
            sumcpu[t] +=  cpuused[t + 1] - cpuused[t];
            console.log(sumcpu[t]);
        }*/
        //sumcpu+=elapsed;
        //console.log('Room '+i+' has used '+elapsed+' CPU time');
        
        if(cycleindex % 2 ==1){
            
            rMemory.setSRList(i);
            var ignore = false;
            for(var ignorei in ignoreRooms){
                if(ignoreRooms[ignorei]==i){ignore = true;break;}
            }
            if(ignore)continue;
            rSpawn.spawn(i);
        }
    }
  /*  for(var t = 0 ;t<sumcpu.length;t++){
        console.log('Rooms action '+t+ ' has used '+sumcpu[t]+' CPU time');
    }*/
    //console.log('---------Rooms has used '+sumcpu+' CPU time---------');
   /* if(assaults.length<10){
        var spawns = new Array(Game.spawns.Spawn2,Game.spawns.Spawn3,Game.spawns.Spawn4);
        for(var sp in spawns){
            if(spawns[sp].memory.spawnIsFree && !spawns[sp].spawning){
                var newName = spawns[sp].createCreep([TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK], undefined, {role:'assault', routeflag:'Route4_1'});
                console.log(spawns[sp].name+' is spawning a assault '+newName+' at Route4_1');
            }
        }
    }*/
   
// structureSpawn.claim(Game.spawns.Spawn2,'Route3_3',size=1,number=1);
 //  structureSpawn.bait(Game.spawns.Spawn2,'bait1','bait1_2');
//   structureSpawn.bait(Game.spawns.Spawn2,'bait3_1','bait3_2','bait3_0');
 //   structureSpawn.bait(Game.spawns.Spawn4,'bait1','bait1_2');
//  structureSpawn.bait(Game.spawns.Spawn4,'bait2');
 //  structureSpawn.bait(Game.spawns.Spawn4,'bait3');
 
 //    structureSpawn.bait(Game.spawns.Spawn2,'bait4_1','bait4_2','bait4_0');
//   structureSpawn.bait(Game.spawns.Spawn2a,'bait5_1','bait5_2','bait5_0');
  
  //  structureSpawn.bait(Game.spawns.Spawn2,'bait3','bait3_2');
     //   structureSpawn.scout(Game.spawns.Spawn2a,'E96N8');//
  //  structureSpawn.scout(Game.spawns.Spawn2a,'E96N9');//上
  //  structureSpawn.scout(Game.spawns.Spawn3,'E97N8');//右
    
 //   structureSpawn.scout(Game.spawns.Spawn3,'E93N8',200);//前线
  //  structureSpawn.scout(Game.spawns.Spawn2,'E95N8');//左
   // structureSpawn.scout(Game.spawns.Spawn2,'E95N7');//左下
    
 //   structureSpawn.scout(Game.spawns.Spawn1,'E97N6');//左
 //   structureSpawn.scout(Game.spawns.Spawn1a,'E97N5');//左下
 //   structureSpawn.scout(Game.spawns.Spawn1,'E98N7');//上
  //  structureSpawn.scout(Game.spawns.Spawn1,'E99N7');//右上
   
  //  structureSpawn.scout(Game.spawns.Spawn4a,'E97N9');//左
  //  structureSpawn.scout(Game.spawns.Spawn4,'E98N8');//下
    //structureSpawn.scout(Game.spawns.Spawn4a,'E99N8');//右下
    
 //   structureSpawn.scout(Game.spawns.Spawn5,'E94N7');//右
  // structureSpawn.scout(Game.spawns.Spawn5,'E93N6');//下
     //-----------------------------塔和链----------------------------------

    //-----------------------------------------------采集队伍1,2,3,4,5,6,7,8,9,
    //-----------------------------------------------快运队伍1,3,4,5,6,7,8,9,11,12
    
   // structureSpawn.ship(Game.spawns.Spawn4, 5       ,'58e5ac0880b7c63b77d13909','58e59f661e705c6e43c47e3b',7);
//     var newName = Game.spawns.Spawn3.createCreep(CreepBody.SpawnBody([CARRY,4,MOVE,2]), undefined, {role: 'shipper',i:33,scid:'58e6dcf93599483a2933a1d8' ,tgid : '58f399c7ba7c8236a075b709',type:'X'});
           
//structureSpawn.ship(Game.spawns.Spawn4, 92      ,'58f0cf197659afb0089de1f0','58fbb9f4a74ea02552985ce2',14,1,10);//右
//structureSpawn.ship(Game.spawns.Spawn4, 93      ,'58f0cf197659afb0089de1f0','58fbb1063752d946ff0bb87a',14,1,10);//右

  //  structureSpawn.ship(Game.spawns.Spawn2, 1       ,'58dbc5d88283ff5308a41211','58f95dc0b8042f6e66e1ca61',8,1,10);//左OK
    
  //  structureSpawn.ship(Game.spawns.Spawn2a, 9       ,'58f0b4d83c115816137c3749','58fac7a3cd9e206876e20713',12,2);//上OK
 //   structureSpawn.toughship(Game.spawns.Spawn2, 91       ,'58f0cbb36f55a63f37e5cf61','58fab7ef7c31195c956838f8',4);//tower
    //structureSpawn.toughship(Game.spawns.Spawn2a, 92       ,'58f0b1942f80ab6172ce7f20','58fac0b0128b2a2e389666ed',4);//tower

 //   structureSpawn.ship(Game.spawns.Spawn2a, 12       ,'58faa4fb9e3d825043469195','58e909c14b8ff97ff457a92f',16,1,50);//右OK
 //   structureSpawn.ship(Game.spawns.Spawn2a, 13       ,'58e909c14b8ff97ff457a92f','58f0c75eb1e5633360979a9b',14,1,10);//右

  //  structureSpawn.ship(Game.spawns.Spawn2, 15       ,'58f8f5bad9b21cc860d3d242','58ed263d72c4e66733f676fd',16);//左下OK
  //  structureSpawn.ship(Game.spawns.Spawn3, 16       ,'58f8f1d38d881062eba08e78','58ed263d72c4e66733f676fd',8,1,40);//左下OK
  //  structureSpawn.ship(Game.spawns.Spawn3, 17       ,'58ed263d72c4e66733f676fd','58f95dc0b8042f6e66e1ca61',20,1,50);//左下
    
  //  structureSpawn.ship(Game.spawns.Spawn3, 33       ,'58e6dcf93599483a2933a1d8','58f399c7ba7c8236a075b709',4);
   // structureSpawn.ship(Game.spawns.Spawn3, 20       ,'58e63a3bfd627d6f1a3b2c6a','58f18d5fbabe2127582d768b',16,1,30);//fromspawn2
    
  //  structureSpawn.ship(Game.spawns.Spawn3, 23       ,'58e6dcf93599483a2933a1d8','58e527ae58ae26f12b9863e3',10);
  //  structureSpawn.ship(Game.spawns.Spawn1a, 4       ,'58f0b635613f3c651f175679','58f0adf8d6aae4b07275cde1',8,1,30);//左OK
  //  structureSpawn.ship(Game.spawns.Spawn1a, 3       ,'58f0adf8d6aae4b07275cde1','58e765f34058ec7c4fdc8ee8',20,1,20);//OK
   // structureSpawn.ship(Game.spawns.Spawn1a, 2       ,'58e765f34058ec7c4fdc8ee8','58f3557e3d0f47ab7b0c3717',2);
   // structureSpawn.ship(Game.spawns.Spawn1a, 22       ,'58f5cfa94ab62793370e9e85','58e765f34058ec7c4fdc8ee8',14,1,60);//左下
    
    
  //  structureSpawn.ship(Game.spawns.Spawn1, 8       ,'58f0b0cb21ed4374700893e4','58f9964745505d2f020ddd1f',16);//上OK
    
 //   structureSpawn.ship(Game.spawns.Spawn1, 14       ,'58f9a97bf53e96df1c82e9e2','58f9964745505d2f020ddd1f',12,2);//右上OK
    
 //   structureSpawn.ship(Game.spawns.Spawn4, 5       ,'58f9a5cadc26737a7697e5c8','58f99c89d23040070595f34a',8,2);//下OK
//    structureSpawn.ship(Game.spawns.Spawn4, 6       ,'58f99c89d23040070595f34a','58ea04ebf1d45619459f41ef',6,3);//下OK
 //   structureSpawn.ship(Game.spawns.Spawn4, 11       ,'58ea04ebf1d45619459f41ef','58e5466b7660bf4a45dea4de',6,2);//下
    
    //structureSpawn.ship(Game.spawns.Spawn4a, 7       ,'58f0c18b83d5fbd749e8df30','58ea1c5ce39c4c22057be6e9',14);//左OK
    
 //   structureSpawn.ship(Game.spawns.Spawn5, 18       ,'58f9acb337151b9a52112e41','58f2fcc565b381bb23241332',8);//右
//    structureSpawn.ship(Game.spawns.Spawn5, 19       ,'58f9b582eef53f4c03cbd2d2','58f2fcc565b381bb23241332',8);//右
 //   structureSpawn.ship(Game.spawns.Spawn5, 21       ,'58f9d4c5fbb5526d1242d835','58f193d4cceb833518fa7011',8);//下
//    structureSpawn.ship(Game.spawns.Spawn4, 10       ,'58e6cc1b3a1d2e785e7dbc3a','58e5466b7660bf4a45dea4de',8);//左
    
  //  structureSpawn.ship(Game.spawns.Spawn4, 11       ,'58e6cc1b3a1d2e785e7dbc3a','58e5466b7660bf4a45dea4de',4);//中
/* var assaults = _.filter(Game.creeps, (creep) => {return(creep.memory.role == 'assault' && creep.memory.i == 1 && creep.hits>creep.hitsMax * 0.7 && (creep.spawning || creep.ticksToLive >(creep.body.length*3 + 150) ));});
  
    var assaultNum = 1;
    var enemyPowerSum = 0;
   // if(Memory.rooms.E93N6 && Memory.rooms.E93N6.defending.enemyPower)enemyPowerSum+=Memory.rooms.E93N6.defending.enemyPower;
   // if(Memory.rooms.E93N7 && Memory.rooms.E93N7.defending.enemyPower)enemyPowerSum+=Memory.rooms.E93N7.defending.enemyPower;
   // if(Memory.rooms.E93N8 && Memory.rooms.E93N8.defending.enemyPower)enemyPowerSum+=Memory.rooms.E93N8.defending.enemyPower;
     
    if(enemyPowerSum>200){
        assaultNum=Math.max(4,enemyPowerSum/100);
    }
    if(assaults.length<2){
        if(Memory.spawns.Spawn2.spawnIsFree && !Game.spawns.Spawn2.spawning)
        Game.spawns.Spawn2.createCreep([TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,RANGED_ATTACK], undefined, {role:'assault', routeflag:'Route2_1',i:1});
        //if(Memory.spawns.Spawn2a.spawnIsFree && !Game.spawns.Spawn2a.spawning)
       // Game.spawns.Spawn2a.createCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role:'assault', routeflag:'Build1_1'});
    }
    */
/* var assaults2 = _.filter(Game.creeps, (creep) => {return(creep.memory.role == 'assault' && creep.memory.i == 2 && creep.hits>creep.hitsMax * 0.7 && (creep.spawning || creep.ticksToLive >(creep.body.length*3 + 150) ));});
    if(assaults2.length<2){
        if(Memory.spawns.Spawn2.spawnIsFree && !Game.spawns.Spawn2.spawning)
        Game.spawns.Spawn2.createCreep([TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,RANGED_ATTACK], undefined, {role:'assault', routeflag:'Route2_1',i:2});
        
    }*/
 /*   var assaults4 = _.filter(Game.creeps, (creep) => {return(creep.memory.role == 'assault' && creep.memory.i == 4 && creep.hits>creep.hitsMax * 0.7 && (creep.spawning || creep.ticksToLive >(creep.body.length*3 + 150) ));});
    if(assaults4.length<1){
        if(Memory.spawns.Spawn2.spawnIsFree && !Game.spawns.Spawn2.spawning)
        Game.spawns.Spawn2.createCreep([TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,RANGED_ATTACK], undefined, {role:'assault', routeflag:'Route4_1',i:4});
        
    }*/
  //  if(Memory.spawns.Spawn3.spawnIsFree && !Game.spawns.Spawn3.spawning)
  //      Game.spawns.Spawn3.createCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role:'assault', routeflag:'Build2_1',i:3});
        
   // var guards = _.filter(Game.creeps, (creep) => {return(creep.memory.role == 'guard' && (creep.spawning || creep.ticksToLive >(creep.body.length*3 + 130) ));});
  /*  if(guards.length<2){
        if(Memory.spawns.Spawn2.spawnIsFree && !Game.spawns.Spawn2.spawning)
        Game.spawns.Spawn2.createCreep([TOUGH,MOVE,MOVE,MOVE,ATTACK,RANGED_ATTACK], undefined, {role:'guard', routeflag:'Route3_1'});
        if(Memory.spawns.Spawn3.spawnIsFree && !Game.spawns.Spawn3.spawning)
        Game.spawns.Spawn3.createCreep([TOUGH,MOVE,MOVE,MOVE,ATTACK,RANGED_ATTACK], undefined, {role:'guard', routeflag:'Route3_1'});
    }*/
    //var healers = _.filter(Game.creeps, (creep) => {return(creep.memory.role == 'healer' && (creep.spawning || creep.ticksToLive >(creep.body.length*3) ) );});
    //if(healers.length<1){
    //    if(Memory.spawns.Spawn4.spawnIsFree && !Game.spawns.Spawn4.spawning)
    //    Game.spawns.Spawn4.createCreep([MOVE,HEAL], undefined, {role:'healer'});
   // }
  //  if(structureLink.run(Game.getObjectById('58e765f34058ec7c4fdc8ee8'),Game.getObjectById('58f380f5f677c0488f83a9fb'))!=OK){
  //      structureLink.run(Game.getObjectById('58e765f34058ec7c4fdc8ee8'),Game.getObjectById('58e75a2644b224136a0e90c6'));
 //   }//Spawn1左
   // structureLink.run(Game.getObjectById('58eb4bac1d430672720d62b8'),Game.getObjectById('58e75a2644b224136a0e90c6'));//Spawn1上
    
  //  structureLink.run(Game.getObjectById('58e8566b1703db9c75b9c701'),Game.getObjectById('58e85939b8a8cf7d1e33369c'));//Spawn2
  //  structureLink.run(Game.getObjectById('58ecf104b8da5454bcd35b4c'),Game.getObjectById('58e85939b8a8cf7d1e33369c'));//Spawn2
   // 
   // structureLink.run(Game.getObjectById(''),Game.getObjectById('58f2d2e6404337427bb312f2'));//Spawn3
  //  structureLink.run(Game.getObjectById('58f2d2e6404337427bb312f2'),Game.getObjectById('58f15ade97b1e98852480320'),800,200);//Spawn3
    
    structureLink.run(Game.getObjectById('58fc275b44a96d61b9ad0d03'),Game.getObjectById('58fc88c48918df648a3df8f9'));//Spawn4
    
    
// Game.spawns.Spawn1.createCreep([CARRY,MOVE])
    //----------------------------------------------其它队伍-------------------------------
    //    structureSpawn.gather(Game.spawns['Spawn1']);

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        switch(creep.memory.role){
           // case 'harvester'    :roleHarvester.run(creep);  break;
           
            case 'dismantler'   :roleAttacker.dismantle(creep);  break;
            
            
           // case 'upgrader'     :roleUpgrader.run(creep);  break;
           // case 'builder'      :roleBuilder.run(creep);    break;
           case 'outbuilder'   :roleBuilder.outbuild(creep);    break;
           
          //  case 'repairer'     :roleRepairer.run(creep);   break;
           // case 'outrepairer'  :roleRepairer.outrepair(creep);break;
            
            //case 'transporter'  :roleTransporter.run(creep);break;
            case 'picker'       :rolePicker.pickBoost(creep);     break;
            case 'shipper'      :roleShipper.run(creep);    break;
            case 'walker'       :roleShipper.walk(creep);   break;
            case 'gatherer'     :roleShipper.gather(creep); break;
            
            case 'renew'   :roleBackup.renew(creep); break;
            case 'attacker'     :roleAttacker.run(creep);   break;
            case 'assault'      :roleAttacker.assault(creep);   break;
            case 'guard'        :roleAttacker.guard(creep);   break;
            case 'defender'     :roleAttacker.defend(creep);   break;
            
            case 'ranger'       :roleRanger.run(creep);     break;
            case 'healer'       :roleHealer.run(creep);     break;
            case 'harasser'     :roleHealer.harass(creep);  break;
            case 'homeAttacker':roleDefender.homeAttacker(creep);break;
            case 'homeRanger':roleDefender.homeRanger(creep);break;
            case 'semiAttacker':roleDefender.semiAttacker(creep);break;
            case 'claimer'      :roleClaimer.claim(creep);    break;
            case 'reserver'     :roleClaimer.reserve(creep);   break;
            
            case 'scouter'      :roleScouter.run(creep);    break;
            case 'scoutre'      :roleScouter.walk(creep);   break;
             case 'bait'        :roleBait.run(creep);   break;
        }
    }
   /* var signcreep =  Game.creeps['Aria'];
   signcreep.signController(signcreep.room.controller,'');
   signcreep.moveTo(signcreep.room.controller);*/
}