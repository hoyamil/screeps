/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.attacker');
 * mod.thing == 'a thing'; // true
 */
var MoveRoute = require('move.route');
var GFun = require('game.function');
var roleAttacker = {
    assault:function(creep){
        var flag = Game.flags[creep.memory.routeflag];
        var oldflag =Game.flags[creep.memory.oldflag];
  
        if(!creep.room.controller || !creep.room.controller.safeMode){
            var targets =creep.pos.findInRange(FIND_HOSTILE_CREEPS,3);//,{
                    //    filter: (creep) => { return ( creep.getActiveBodyparts(ATTACK)>0 || creep.getActiveBodyparts(RANGED_ATTACK)>0 || creep.getActiveBodyparts(HEAL)>0 || creep.getActiveBodyparts(WORK)>0 ) ; } } );
            if(targets.length>0){
                var rt1=creep.pos.findInRange(FIND_HOSTILE_CREEPS,1).length;
                var rt2=creep.pos.findInRange(FIND_HOSTILE_CREEPS,2).length;
                var rmdm=targets.length+rt2*3+rt1*6;
                if(rmdm>10){
                    creep.rangedMassAttack();
                }
                creep.rangedAttack(targets[0]);
                creep.attack(targets[0]);
            }
            var targets =creep.pos.findInRange(FIND_HOSTILE_STRUCTURES,3);//,{
                    //    filter: (creep) => { return ( creep.getActiveBodyparts(ATTACK)>0 || creep.getActiveBodyparts(RANGED_ATTACK)>0 || creep.getActiveBodyparts(HEAL)>0 || creep.getActiveBodyparts(WORK)>0 ) ; } } );
            if(targets.length>0){
                creep.rangedAttack(targets[0]);
                creep.attack(targets[0]);
            }
        }
        if(oldflag && oldflag.room==creep.room){
            if(!creep.room.controller || !creep.room.controller.safeMode){
                var targets =creep.room.find(FIND_HOSTILE_CREEPS,{
                    filter: (creep) => { return ( creep.getActiveBodyparts(ATTACK)>0 || creep.getActiveBodyparts(RANGED_ATTACK)>0 || creep.getActiveBodyparts(HEAL)>0 || creep.getActiveBodyparts(WORK)>0 ) ; } } );
                if(targets.length>0){
                    var target = creep.pos.findClosestByRange(targets);
                    if(target){
                        creep.rangedAttack(target);
                        if(creep.attack(target) == ERR_NOT_IN_RANGE)creep.moveTo(target, {visualizePathStyle: {stroke: '#f00'} } ) ;
                        return;
                    }
                }
            }
        }
        if(flag){
            if(flag.room!=creep.room){
                creep.moveTo(flag);
                return;
            }
            
            if(!creep.room.controller || !creep.room.controller.safeMode){
                /*if(Game.flags.ATTACK.room==creep.room){
                    var targets = creep.room.lookForAt(FIND_STRUCTURES, Game.flags.ATTACK.pos);
                    if(targets.length>0){
                        if(creep.attack(targets[0]) == ERR_NOT_IN_RANGE)creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#f00'} } ) ;
                        return;
                    }
                    var targets =  Game.flags.ATTACK.pos.findInRange(FIND_HOSTILE_CREEPS,3);
                    if(targets.length>0){
                        if(creep.attack(targets[0]) == ERR_NOT_IN_RANGE)creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#f00'} } ) ;
                        return;
                    }
                    creep.moveTo(Game.flags.ATTACK);
                    return;
                }*/
                if(Game.flags.GATHER && Game.flags.GATHER.room==creep.room){
                    creep.moveTo(Game.flags.GATHER, {visualizePathStyle: {stroke: '#f00'} });
                    return;
                }
                
                var targets =flag.room.find(FIND_HOSTILE_STRUCTURES,{
                    filter: (structure) => { return ( structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_SPAWN );} } );
                if(targets.length>0){
                    var target = creep.pos.findClosestByRange(targets);
                    if(target){
                        creep.rangedAttack(target);
                        if(creep.attack(target) == ERR_NOT_IN_RANGE)creep.moveTo(target, {visualizePathStyle: {stroke: '#f00'} } ) ;
                        return;
                    }
                }
                var targets =flag.room.find(FIND_HOSTILE_CREEPS,{
                    filter: (creep) => { return ( creep.getActiveBodyparts(ATTACK)>0 || creep.getActiveBodyparts(RANGED_ATTACK)>0 || creep.getActiveBodyparts(HEAL)>0 || creep.getActiveBodyparts(WORK)>0 ) ; } } );
                if(targets.length>0){
                    var target = creep.pos.findClosestByRange(targets);
                    if(target){
                        creep.rangedAttack(target);
                        if(creep.attack(target) == ERR_NOT_IN_RANGE)creep.moveTo(target, {visualizePathStyle: {stroke: '#f00'} } ) ;
                        return;
                    }
                }
                var targets =flag.room.find(FIND_HOSTILE_STRUCTURES,{filter:(structure)=>(structure.structureType!=STRUCTURE_CONTROLLER)});
                if(targets.length>0){
                    var target = creep.pos.findClosestByRange(targets);
                    if(target){
                        creep.rangedAttack(target);
                        if(creep.attack(target) == ERR_NOT_IN_RANGE)creep.moveTo(target, {visualizePathStyle: {stroke: '#f00'} } ) ;
                        return;
                    }
                }
            }
            var next = MoveRoute.nextFlag(creep.memory.routeflag);
            if(next && Game.flags[next]){
                creep.memory.oldflag=creep.memory.routeflag;
                creep.memory.routeflag=next;
                creep.moveTo(Game.flags[next]);
                return;
            }
            next = Memory.flags[creep.memory.routeflag];
            if(next && Game.flags[next]){
                creep.memory.oldflag=creep.memory.routeflag;
                creep.memory.routeflag=next;
                creep.moveTo(Game.flags[next]);
                return;
            }
            if(!creep.room.controller || !creep.room.controller.safeMode){
                var targets =flag.room.find(FIND_HOSTILE_CREEPS);
                if(targets.length>0){
                    var target = creep.pos.findClosestByRange(targets);
                    if(target){
                        creep.rangedAttack(target);
                        if(creep.attack(target) == ERR_NOT_IN_RANGE)creep.moveTo(target, {visualizePathStyle: {stroke: '#f00'} } ) ;
                        return;
                    }
                }
                
            }
        }
    },
    run: function(creep) {
        
    	//var targets = creep.room.find(FIND_HOSTILE_CREEPS);
    	flag= Game.flags.ATTACK;
    	if(flag && flag.room && creep.room == flag.room){
    	    var targets = Game.flags.ATTACK.pos.findInRange(FIND_HOSTILE_CREEPS,40);
            if(targets.length>0) {
                target = creep.pos.findClosestByPath(targets);
               // target = Game.flags.ATTACK.pos.findClosestByPath(targets);
               //target=targets[0];
               how=creep.attack(target) 
                if(how== ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }else if(how==OK){
                    return;
                }
            }else{
                var targets =Game.flags.ATTACK.pos.findInRange(FIND_HOSTILE_STRUCTURES,6);
                if(targets.length>0) {
                    target = creep.pos.findClosestByPath(targets);
                        //target = Game.flags.ATTACK.pos.findClosestByPath(targets);
                    how = creep.attack(target);
                    if(how == ERR_NOT_IN_RANGE) {
                       // console.log('b');
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
                    }else if(how ==OK){
                        return 1;  
                    }
                }else{
                
              //  if(creep.hits==creep.hitsMax){
                    creep.moveTo(Game.flags.ATTACK.pos, {visualizePathStyle: {stroke: '#ffffff'}});
               // }else{
               //     creep.moveTo(Game.flags.Base.pos, {visualizePathStyle: {stroke: '#ffffff'}});
              //  }
                }
            }
    	}else{
    	     creep.moveTo(Game.flags.ATTACK.pos, {visualizePathStyle: {stroke: '#ffffff'}});
    	}
         if(creep.getActiveBodyparts(HEAL)> 0){
            if(creep.hits < creep.hitsMax){
    	        creep.heal(creep);
    	    }else{
    	        targets=creep.room.find(FIND_MY_CREEPS,{
                        filter: object =>(object.hits < object.hitsMax)
                        });
                
                if(targets.length>0){
                    target=targets[0];
                    if(creep.heal(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
                    }
                }
            }  
	    }
	},
	defend: function(creep) {
	    
	    var flag = Game.flags[creep.memory.roomflag];
	    if(flag && flag.room){
	       // console.log(flag);
	       var targets = flag.room.find(FIND_HOSTILE_CREEPS);
	    }else{
	       var targets = creep.room.find(FIND_HOSTILE_CREEPS);
	    }
	    if(flag && !flag.room){
	      // console.log('a');
	       creep.moveTo(flag, {visualizePathStyle: {stroke: '#ff0000'}});
	    }
        if(targets.length>0) {
            
            target = creep.pos.findClosestByPath(targets);
                //target = Game.flags.ATTACK.pos.findClosestByPath(targets);
            if(target){
                how = creep.attack(target);
                if(how == ERR_NOT_IN_RANGE) {
                            //console.log('b');
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
                }else if(how ==OK){
                    return 1;  
                }
              //  console.log(flag);
            }else{
                creep.moveTo(flag, {visualizePathStyle: {stroke: '#ff0000'}});
            }
            
                   
        }else if(creep.hits<creep.hitsMax){
           // console.log('c');
            how =creep.moveTo(Game.flags[creep.memory.baseflag], {visualizePathStyle: {stroke: '#ffffff'}});
            if(how ==OK){
                return 1;  
            }
        }else{
            var targets = creep.room.find(FIND_HOSTILE_STRUCTURES);
            if(targets.length>0) {
                target = creep.pos.findClosestByPath(targets);
                    //target = Game.flags.ATTACK.pos.findClosestByPath(targets);
                how = creep.attack(target);
                if(how == ERR_NOT_IN_RANGE) {
                   // console.log('b');
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
                }else if(how ==OK){
                    return 1;  
                }
            }else{
                creep.moveTo(flag, {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
        if(creep.getActiveBodyparts(HEAL)> 0){
            if(creep.hits < creep.hitsMax){
    	        creep.heal(creep);
    	    }else{
    	        targets=creep.room.find(FIND_MY_CREEPS,{
                        filter: object =>(object.hits < object.hitsMax)
                        });
                
                if(targets.length>0){
                    target=targets[0];
                    if(creep.heal(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
                    }
                }
            }  
	    }
                
	        //}
	       // 
	        //GFun.GoToRoom(creep,creep.memory.roomid);
	    //}else{
	   //      creep.moveTo(Game.flags.Base.pos, {visualizePathStyle: {stroke: '#ffffff'}});
	  
	},
	guard:function(creep){
	    var flag = Game.flags[creep.memory.routeflag];
        if(!creep.room.controller || !creep.room.controller.safeMode){
            var targets =creep.pos.findInRange(FIND_HOSTILE_CREEPS,3);//,{
            if(targets.length>0){
                var rt1=creep.pos.findInRange(FIND_HOSTILE_CREEPS,1).length;
                var rt2=creep.pos.findInRange(FIND_HOSTILE_CREEPS,2).length;
                var rmdm=targets.length+rt2*3+rt1*6;
                if(rmdm>10){
                    creep.rangedMassAttack();
                }
                creep.rangedAttack(targets[0]);
                creep.attack(targets[0]);
            }
        }
        if(flag){
            creep.moveTo(flag);
            if(flag.room!=creep.room){
                return;
            }
            var next = MoveRoute.nextFlag(creep.memory.routeflag);
            if(next && Game.flags[next]){
                creep.memory.oldflag=creep.memory.routeflag;
                creep.memory.routeflag=next;
                creep.moveTo(Game.flags[next]);
                return;
            }
            next = Memory.flags[creep.memory.routeflag];
            if(next && Game.flags[next]){
                creep.memory.oldflag=creep.memory.routeflag;
                creep.memory.routeflag=next;
                creep.moveTo(Game.flags[next]);
                return;
            }
            if(!creep.room.controller || !creep.room.controller.safeMode){
                var targets =flag.pos.findInRange(FIND_HOSTILE_CREEPS,10,{
                        filter: (creep) => { return ( creep.getActiveBodyparts(ATTACK)>0 || creep.getActiveBodyparts(RANGED_ATTACK)>0 || creep.getActiveBodyparts(HEAL)>0 || creep.getActiveBodyparts(WORK)>0  || creep.getActiveBodyparts(CLAIM)>0 ) ; } } );
                if(targets.length>0){
                    var rt1=creep.pos.findInRange(FIND_HOSTILE_CREEPS,1).length;
                    var rt2=creep.pos.findInRange(FIND_HOSTILE_CREEPS,2).length;
                    var rmdm=targets.length+rt2*3+rt1*6;
                    if(rmdm>10){
                        creep.rangedMassAttack();
                    }
                    var target = creep.pos.findClosestByRange(targets);
                    if(target){
                        creep.rangedAttack(target);
                        if(creep.attack(target) == ERR_NOT_IN_RANGE)creep.moveTo(target, {visualizePathStyle: {stroke: '#f00'} } ) ;
                        return;
                    }
                }
            }
        }
	},
	dismantle:function(creep){
	    if(Game.flags.Dismantle1 && Game.flags.Dismantle2){
	        if(creep.room == Game.flags.Dismantle1.room){
	            var targets = creep.room.find(FIND_STRUCTURES,{
	                filter: (structure) => { return ( structure.pos.x>=Game.flags.Dismantle1.pos.x && structure.pos.x<=Game.flags.Dismantle2.pos.x
	                 && structure.pos.y>=Game.flags.Dismantle1.pos.y && structure.pos.y<=Game.flags.Dismantle2.pos.y);} } );
	            if(targets.length>0){
	                var target = creep.pos.findClosestByRange(targets);
	                if(target){
	                   if(creep.dismantle(target)==ERR_NOT_IN_RANGE)creep.moveTo(target, {visualizePathStyle: {stroke: '#f00'} } ) ;
	                }
	            }
	        }
	    }
	}
};
module.exports = roleAttacker;