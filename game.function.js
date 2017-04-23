/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('game.function');
 * mod.thing == 'a thing'; // true
 */
var GFun = {
    inDismantleList:function(id){
        var DList = new Array(
            '58e4b71b5719bd3117eda47a'
        );
        for(var i in DList){
            if(id == DList[i])return true;
        }
        if(!Game.flags.Dismantle1_1 || !Game.flags.Dismantle1_2)return false;
        var target = Game.getObjectById(id);
        if(!target)return false;
        if(target.room == Game.flags.Dismantle1_1.room){
            var flag1=Game.flags.Dismantle1_1;
            var flag2=Game.flags.Dismantle1_2;
            if(target.pos.x>=flag1.pos.x && target.pos.y>=flag1.pos.y && target.pos.x<=flag2.pos.x && target.pos.y<=flag2.pos.y)return true;
        }
        return false;
    },
    IsFull :function(structure,k=1){
        switch(structure.structureType){
            case STRUCTURE_CONTAINER:
            case STRUCTURE_STORAGE:
            case STRUCTURE_TERMINAL:
                if( _.sum(structure.store) >= structure.storeCapacity*k && _.sum(structure.store)>0 ){
                    return true;
                }else {
                    return false;
                }
                break;
            case STRUCTURE_LINK:
            case STRUCTURE_SPAWN:
            case STRUCTURE_EXTENSION:
            case STRUCTURE_TOWER:
                if(structure.energy >= structure.energyCapacity*k && structure.energy >0){
                    return true;
                }else {
                    return false;
                }
                break;
        }
        return -1;
    },
    IsEmpty :function(structure,k=0){
        switch(structure.structureType){
            case STRUCTURE_CONTAINER:
            case STRUCTURE_STORAGE:
            case STRUCTURE_TERMINAL:
                if( _.sum(structure.store) ==0 || _.sum(structure.store)<= structure.storeCapacity*k){
                    return true;
                }else {
                    return false;
                }
                break;
            case STRUCTURE_LINK:
            case STRUCTURE_SPAWN:
            case STRUCTURE_EXTENSION:
            case STRUCTURE_TOWER:
                if(structure.energy ==0 || structure.energy <= structure.energyCapacity*k){
                    return true;
                }else {
                    return false;
                }
                break;
        }
        return -1;
    },
    calfun :function(spawn,select=1){
        if(!spawn)return 0;
        var sum =spawn.room.energyAvailable;
        var msum =spawn.room.energyCapacityAvailable;
        /*
        containers= spawn.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION );
                }
        });
        for(i in containers){
            sum += containers[i].energy;
            msum += containers[i].energyCapacity;
        }
        */
        if(select){
        spawn.room.visual.text(
            '◔' +sum+'/'+msum,
            spawn.pos.x + 1, 
            spawn.pos.y + 1, 
            {align: 'left', opacity: 0.8});
            return sum;
        }else{
            return msum;
        }
    },
    calsto :function(spawn){
         if(!spawn)return 0;
        var containers= spawn.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE);
                }
        });
        var sum=0,msum=0;
        for(i in containers){
            sum += containers[i].store[RESOURCE_ENERGY];
            msum += containers[i].storeCapacity;
        }
        spawn.room.visual.text(
            '▧' +sum+'/'+msum,
            spawn.pos.x + 1, 
            spawn.pos.y + 2, 
            {align: 'left', opacity: 0.8});
        return sum;
    },
    GetError:function(value,select=1){
        switch(value){
            case ERR_NOT_OWNER: return(' You are not the owner of this spawn.');
            case ERR_NAME_EXISTS:  return('	There is a creep with the same name already.');
            case ERR_BUSY: return(' The spawn is already in process of spawning another creep.');
            case ERR_NOT_ENOUGH_ENERGY:return(' Not enough energy to create a creep with the given body.');
            case ERR_INVALID_ARGS: return(' Body is not properly described.');
            case ERR_RCL_NOT_ENOUGH: return(' Your Room Controller level is insufficient to use this spawn.');
            
            default:return(select? value:0);
        }
    }
   // ,Escape:function(creep){
        
};
module.exports = GFun;