/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('move.route');
 * mod.thing == 'a thing'; // true
 */
var MoveRoute = {
    nextFlag:function(flagname){
        var linep = flagname.indexOf('_');
        var num = parseInt(flagname.substring(linep+1));
        num++;
        return(flagname.substring(0,linep+1)+num);
    }
};
module.exports = MoveRoute;