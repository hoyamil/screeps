/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.picker');
 * mod.thing == 'a thing'; // true
 */
var rolePicker={
    pickBoost:function(creep){
        if(_.sum(creep.carry)<creep.carryCapacity){
            var boosts = creep.room.find(FIND_DROPPED_RESOURCES,{
                        filter: object =>(object.resourceType != RESOURCE_ENERGY) } );
            if(boosts.length>0){
                boosts.sort((a,b)=>b.amount-a.amount);
                if(creep.pickup(boosts[0])== ERR_NOT_IN_RANGE){
                        creep.moveTo(boosts[0], {visualizePathStyle: {stroke: '#00f'}});
                }
                return;
            }
            var sources = creep.room.find(FIND_DROPPED_RESOURCES);
            if(sources.length>0){
                sources.sort((a,b)=>b.amount-a.amount);
                if(creep.pickup(sources[0])== ERR_NOT_IN_RANGE){
                        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#00f'}});
                }
                return;
            }
        }
        if(_.sum(creep.carry)>0 && creep.room.storage){
            if(!creep.pos.inRangeTo(creep.room.storage,1))creep.moveTo(creep.room.storage);
            else{
                for(var s in creep.carry){
                    creep.transfer(creep.room.storage,s);
                }
            }
        }
    }
};
module.exports = rolePicker;