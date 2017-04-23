/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.defender');
 * mod.thing == 'a thing'; // true
 */
var roleDefender = {
    homeAttacker:function(creep){
        var posflag=Game.flags[creep.memory.posflag];
        if(!posflag)return;
        creep.moveTo(posflag);
        var target = null;
        if(creep.memory.tgid){
            target = Game.getObjectById(creep.memory.tgid);
        }
        if(!target){
            var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS,1);
            if(targets.length){
                targets.sort( (a,b) => a.hits - b.hits );
                target = targets[0];
            }
        }
        if(target){
            creep.attack(target);
        }
        if(creep.room.Memory && creep.room.Memory.structures.spawn.length && creep.ticksToLive<500){
            creep.memory.renew=true;
        }
    },
    semiAttacker:function(creep){
        var posflag=Game.flags[creep.memory.posflag];
        if(!posflag)return;
        creep.moveTo(posflag);
        var target = null;
        if(creep.memory.tgid){
            target = Game.getObjectById(creep.memory.tgid);
        }
        if(!target){
            var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS,3);
            if(targets.length){
                targets.sort( (a,b) => a.hits - b.hits );
                target = targets[0];
            }
        }
        if(target && target.room){
            if(creep.pos.getRangeTo(target)<=4){
                const direction = posflag.pos.getDirectionTo(target);
                var x = target.pos.x;var y = target.pos.y;
                switch(direction){
                    case TOP:       x--;y--;break;
                    case TOP_RIGHT: x++;y--;break;
                    case RIGHT:     x++;y++;break;
                    case BOTTOM_RIGHT:x++;y++;break;
                    case BOTTOM:    x--;y++;break;
                    case BOTTOM_LEFT:x--;y++;break;
                    case LEFT:      x--;y--;break;
                    case TOP_LEFT:  x--;y--;break;
                }
                var newpos = new RoomPosition(x,y,target.room.name);
                creep.moveTo(newpos);
            }else{
                creep.moveTo(target);
            }
            
            if(creep.attack(target)==ERR_NOT_IN_RANGE){
                creep.heal(creep);
            }
            
            creep.rangedAttack(target);
        }else{
            creep.heal(creep);
        }
    },
    homeRanger:function(creep){
        var posflag=Game.flags[creep.memory.posflag];
        if(!posflag)return;
        creep.moveTo(posflag);
        var target = null;
        if(creep.memory.tgid){
            target = Game.getObjectById(creep.memory.tgid);
        }
        if(!target){
            var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS,3);
            if(targets.length){
                targets.sort( (a,b) => a.hits - b.hits );
                target = targets[0];
            }
        }
        if(target){
            creep.rangedAttack(target);
        }
    }
};
module.exports = roleDefender;