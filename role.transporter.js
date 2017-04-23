/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.transporter');
 * mod.thing == 'a thing'; // true
 */
var GFun = require('game.function');
var roleTransporter = {

    /** @param {Creep} creep **/
    run: function(creep) {//creep.memory.transporting=true;
        //GFun.findLargestSource(creep);
        /*var energy = creep.room.find(FIND_DROPPED_ENERGY);
        if(creep.carry.energy ==0 && energy.length>0){
            if(creep.pickup(energy[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(energy[0]);
            }
            return FIND_DROPPED_ENERGY;
        }*/
	    /*if(creep.memory.scid==null){
	        GFun.findLargestSource(creep);
	    } */
	    var status=0;
//	    var controllerContainer1='58c6b23a4f1d978402e47b93';
//	    var controllerContainer2='58c392098b91b680736d7042';
	    if(creep.carry.energy == 0){//确定资源
	        if(creep.memory.scid){
	            source = Game.getObjectById(creep.memory.scid);
	            if(source && source.store && source.store[RESOURCE_ENERGY]>0){
	                status=1;//取资源
	            }
	        }
	        if(!status){//搜索资源
	            var sources = creep.room.find(FIND_STRUCTURES, {//
                    filter: (structure) => {
                        return ( structure.structureType == STRUCTURE_CONTAINER// && (structure.store[RESOURCE_ENERGY]>1800 || !GFun.IsConContainer(structure.id))
                        || structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY]>0
                        || structure.structureType==STRUCTURE_LINK && structure.energy>0;
                        }
                });
	            if(sources.length>0){
	                var source = creep.pos.findClosestByRange(sources);
                    if(source){
                        creep.memory.scid=source.id;
                        status=1;//取资源
                    }
	            }
	        }
	    }else{//确定目标
	        if(creep.memory.tgid){
	            var target = Game.getObjectById(creep.memory.tgid);
	            if(target && (target.energy<target.energyCapacity //||  GFun.IsConContainer(target.id) && target.store[RESOURCE_ENERGY]<600 
	            ) ){
	                status=2;//送资源
	            }
	        }
	        if(!status){//搜索目标
	            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                    return ( (structure.structureType == STRUCTURE_EXTENSION || structure.structureType ==STRUCTURE_SPAWN )&& structure.energy < structure.energyCapacity 
                    || structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity -100 
                    //|| GFun.IsConContainer(structure.id) && structure.store[RESOURCE_ENERGY] <600)
                    )}
                });
                if(targets.length>0){
	                var target = creep.pos.findClosestByRange(targets);
                    if(target){
                        creep.memory.tgid=target.id;
                        status=2;//送资源
                    }
	            }else{
	                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => { return (structure.structureType == STRUCTURE_STORAGE ) } } );
	            }
	        }
	    }
	    if(status==1){
	        var how = creep.withdraw(source,RESOURCE_ENERGY);
	        if(how == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'} });
            }else if(how == OK){//完成后刷新资源id
                creep.memory.scid = null;
            }
	    }else if(status==2){
	        var how = creep.transfer(target, RESOURCE_ENERGY);
            if(how == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }else if(how == OK || how == ERR_FULL){//完成后刷新目标id
                creep.memory.tgid = null;
            }
        }
	   /* if(creep.memory.scid==null &&(creep.memory.functioning && creep.carry.energy == 0)) {
            creep.memory.functioning = false;
            creep.memory.tgid=null;
            if(creep.memory.scid==null)GFun.findClosestSource(creep,0);
	    }
	    /*if(creep.memory.tgid==null){
	        if(GFun.findClosestObject(creep)){creep.say('🚧 transport');}
	    }
	    if(creep.memory.tgid==null &&(!creep.memory.functioning && creep.carry.energy >0)) {
	        if(GFun.findClosestTransObject(creep)){creep.say('🚧 transport');}
	        creep.memory.functioning = true;
	        creep.memory.scid=null;
	        
	    }
       */ 
        
	    /*if(creep.memory.functioning) {
	        
            target = Game.getObjectById(creep.memory.tgid);
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }else{
                creep.memory.functioning = false;
                creep.memory.tgid=null;  
            }
	    }
	    else {
            if(creep.memory.scid){
	            source = Game.getObjectById(creep.memory.scid);
	            
	            if(creep.withdraw(source,RESOURCE_ENERGY)== ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'} });
                }else{
                    creep.memory.scid=null;
                }
	        }else{
	            creep.memory.functioning = true;
	        }
	    }*/
	}

};
module.exports = roleTransporter;