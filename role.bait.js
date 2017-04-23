/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.bait');
 * mod.thing == 'a thing'; // true
 */
var roleBait = {
    run:function(creep){
        //var flagname = creep.memory.flagname;
        var flag1 = Game.flags[creep.memory.flagname];
        var flag2 = Game.flags[creep.memory.nextflag];
        var pflag = Game.flags[creep.memory.protectflag];
        var target = Game.getObjectById('58fc10abb10571061cebd1ba');
        if(target){creep.moveTo(target);return;}
        if(!flag1)return;
        if(!flag2){
            creep.moveTo(flag1.pos);
            return;
        }
        if(pflag && pflag.room){
            var dangers = pflag.pos.findInRange(FIND_HOSTILE_CREEPS,6)
            if(dangers.length){
                creep.moveTo(flag1.pos);return;
            }
        }
        
        if(flag1 && flag1.room){
            var targets = flag1.pos.findInRange(FIND_HOSTILE_CREEPS,6);
            if(targets.length && flag2){
                creep.moveTo(flag2.pos);
            }else{
                creep.moveTo(flag1.pos);
            }
        }else{
             creep.moveTo(flag2.pos);
        }
      
        
    }
};
module.exports = roleBait;