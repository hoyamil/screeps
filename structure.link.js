/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('structure.link');
 * mod.thing == 'a thing'; // true
 */


var structureLink = {

    /** @param {Creep} creep **/
    run: function(link1,link2,n1=0,n2=0) {
        if(link1 && link2){
            
            if(n1==0){
                if(link1.energy>0 && link2.energy<=link2.energyCapacity-link1.energy){
                    link1.transferEnergy(link2);//,link1.energy-n);
                    return OK;
                }
            }else{
                if(link1.energy>=n1 && link2.energy<=link2.energyCapacity-link1.energy+n2){
                    link1.transferEnergy(link2,link1.energy-n2);//,link1.energy-n);
                    return OK;
                }
            }
        }
       // creep.moveTo(Game.flags.flagb.pos, {visualizePathStyle: {stroke: '#ffffff'}});
	}
};
module.exports = structureLink;