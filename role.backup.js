/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.backup');
 * mod.thing == 'a thing'; // true
 */
var roleBackup = {
    renew:function(creep){
        const spawn = creep.pos.findClosestByRange(FIND_MY_STRUCTURES,{
            filter:(structure) => (structure.structureType==STRUCTURE_SPAWN)
        });
        if(spawn){
            const how = spawn.renewCreep(creep);
            //console.log('renew:'+how);
            if(how==ERR_NOT_IN_RANGE){
                creep.moveTo(spawn);
            }else if(how == ERR_FULL){
                creep.memory.done=true;
            }
        }
    }
};
module.exports = roleBackup;