/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.healer');
 * mod.thing == 'a thing'; // true
 */

var roleHealer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var status = 0;
        var target;
        if(creep.memory.tgid){
            target = Game.getObjectById(creep.memory.tgid);
            if(target && target.hits<target.hitsMax){
                status = 1;
            }
        }
        if(!status){
            var targets = _.filter(Game.creeps, (target) => target.hits<target.hitsMax );
           // console.log('healer '+targets.length);
            if(targets.length>0){
                target= creep.pos.findClosestByRange(targets);
                if(target){
                    creep.memory.tgid = target.id;
                    status = 1;
                }else{
                    targets.sort( (a,b) => Game.map.getRoomLinearDistance(creep.room.name,a.room.name)-Game.map.getRoomLinearDistance(creep.room.name,b.room.name) );
                    target = targets[0];
                    creep.memory.tgid = target.id;
                    status = 1;
                }
            }
        }
        if(status){ 
            creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
            if(creep.heal(target) == ERR_NOT_IN_RANGE) {
                creep.rangedHeal(target);
            }
        }else{
            
          //  creep.moveTo(Game.flags.Base.pos, {visualizePathStyle: {stroke: '#ffffff'}});
        }
            
	},
	harass:function(){
	    if(creep.hits<creep.hitsMax*0.8){
	        reep.moveTo(Game.flags.Harass_rest.pos, {visualizePathStyle: {stroke: '#ffffff'}});
	    }else{
	        creep.moveTo(Game.flags.Harass.pos, {visualizePathStyle: {stroke: '#ffffff'}});
	    }
	    var targets=creep.room.find(FIND_MY_CREEPS,{
            filter: object =>(object.hits < object.hitsMax)
            });
                
        if(targets.length>0){
            target=targets[0];
            if(creep.heal(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
                }
                }
	    
	    
	    var targets = Game.flags.ATTACK.pos.findInRange(FIND_HOSTILE_CREEPS,10);
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
            }
	    
	}
};

module.exports = roleHealer;