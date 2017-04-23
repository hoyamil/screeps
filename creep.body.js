/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.body');
 * mod.thing == 'a thing'; // true
 */
var creepBody = { 
    CalCreepPower:function(creep){
        if(!creep)return 0;
        var pointSum=0;
        var bodys=creep.body;
        for(i in bodys){
            var point=0;
            if(bodys[i].hits>0){
                switch(bodys[i].type){
                    case 'work':
                    case 'claim':
                    case 'carry':
                    case 'tough':point = 10;break;
                    case 'move':point = 12;break;
                    case 'attack':point = 20;break;
                    case 'heal':point = 30;break;
                    case 'ranged_attack':point = 25;break;
                }
                if(bodys[i].boost){
                    point *=2;
                }
            }
            pointSum += point;
        }
        //console.log(pointSum);
        return pointSum;
    },
    CalBodyCost:function(body_i=[MOVE,1]){
        var costSum=0;
        var part=0;//部件数量
        for(var i=1;i<body_i.length;i+=2){
            part+=body_i[i];
        }
        if(body_i.length % 2)part++;
        var body = new Array(part);
        var parti =0;
        for(var i=0;i<body_i.length/2;i++){
            var partn = (i*2+1)<body_i.length ? body_i[i*2+1]:1;
            for(var j = 0;j<partn;j++){
                var cost =0;
                switch(body_i[i*2]){
                    case TOUGH:cost = 10;break;
                    case CARRY:
                    case MOVE:cost = 50;break;  
                    case WORK:cost = 100;break;  
                    case ATTACK:cost = 80;break;
                    case RANGED_ATTACK:cost = 150;break;
                    case HEAL:cost = 250;break;
                    case CLAIM:cost = 600;break;
                }
                costSum += cost;
            }
        }
        return(costSum);
    },
    SetDefender:function(points,energy){
    //    console.log(points+' points , '+energy+' energy:');
        var toughsize =0;
        var movesize=0;
        var attacksize=0;
        var rangesize=0;
       // var healsize=0;
        var setpoint = 10+24+20;
        var setcost = 10+100+80;
        //console.log(points>setpoint*3); console.log(energy>setcost*3);
        console.log(energy +' ' +points*setcost/setpoint);
        console.log( energy > points*setcost/setpoint);
        if(points>setpoint*3 && energy>setcost*3 && energy > points*setcost/setpoint){
            console.log('rangesize++');
            rangesize++;
            movesize++;
            points-=(12+25);
            energy-=(50+150);
            
        }
     /*   if(points>setpoint*5 && energy>setcost*5 && energy > points*setcost/setpoint){
            healsize++;
            movesize++;
            points-=(12+30);
            energy-=(50+250);
            
        }*/
        var n=Math.min(Math.floor(points/setpoint),Math.floor(energy/setcost));
        toughsize=attacksize=n;
        movesize=toughsize+attacksize+rangesize;//+healsize;
        points -= (toughsize*10 + movesize*12 + attacksize*20);
        energy -= (toughsize*10 + movesize*50 + attacksize*80);
        if(points>0 && energy >=(10+50)){
            toughsize++;
            movesize++;
            points-=(10+12);
            energy-=(10+50);
        }
        if(points>0 && energy >=(80-10) && toughsize>0  || attacksize==0 && toughsize>0){
            toughsize--;
            attacksize++;
            points-=(12-10);
            energy-=(80-10);
        }
        if(points>0 && energy >=(10+50)){
            toughsize++;
            movesize++;
            points-=(10+12);
            energy-=(10+50);
        }
      //  console.log([TOUGH,toughsize,MOVE,movesize,ATTACK,attacksize,HEAL,healsize]);
        return([TOUGH,toughsize,MOVE,movesize,ATTACK,attacksize,RANGED_ATTACK,rangesize]);//,HEAL,healsize]);
        
    },
    SetDefender2:function(points,energy){
    //    console.log(points+' points , '+energy+' energy:');
        var toughsize =0;
        var movesize=0;
        var attacksize=0;
        var rangesize=0;
       // var healsize=0;
        var setpoint = 12+20;
        var setcost = 50+80;
        //console.log(points>setpoint*3); console.log(energy>setcost*3);
        //console.log(energy +' ' +points*setcost/setpoint);
       // console.log( energy > points*setcost/setpoint);
        /*if(points>setpoint*3 && energy>setcost*3 && energy > points*setcost/setpoint){
            console.log('rangesize++');
            rangesize++;
            //movesize++;
            points-=(25);
            energy-=(150);
            
        }*/
        var n=Math.min(Math.floor(points/setpoint),Math.floor(energy/setcost));
        //toughsize=
        attacksize=n;
        movesize=Math.ceil((toughsize+attacksize+rangesize)/2);//+healsize;
        points -= (toughsize*10 + movesize*12 + attacksize*20);
        energy -= (toughsize*10 + movesize*50 + attacksize*80);
       /* if(points>0 && energy >=(10+50)){
            toughsize++;
            movesize++;
            points-=(10+12);
            energy-=(10+50);
        }
        if(points>0 && energy >=(80-10) && toughsize>0  || attacksize==0 && toughsize>0){
            toughsize--;
            attacksize++;
            points-=(12-10);
            energy-=(80-10);
        }
        if(points>0 && energy >=(10+50)){
            toughsize++;
            movesize++;
            points-=(10+12);
            energy-=(10+50);
        }*/
      //  console.log([TOUGH,toughsize,MOVE,movesize,ATTACK,attacksize,HEAL,healsize]);
        return([TOUGH,toughsize,MOVE,movesize,ATTACK,attacksize,RANGED_ATTACK,rangesize]);//,HEAL,healsize]);
        
    },
    SetHarvester:function(demand,energy,speed=1,type=STRUCTURE_CONTAINER){
        var worksize =0;
        var movesize=0;
        var carrysize=0;
        switch(speed){
            case 0:var movecycle=4;var carrycycle=6;break;
            case 1:var movecycle=2;var carrycycle=6;break;
            case 2:var movecycle=1;var carrycycle=3;break;
        }
        for(var i = 0;i < demand;){
            if(type==STRUCTURE_LINK){
               if(carrysize<=i/carrycycle){
                    if(energy>=50){
                        energy-=50;
                        carrysize++;
                    }else break;
                }
            }
            if(i% movecycle ==0){
                if(energy>=150){
                    energy-=150;
                    movesize++;
                    worksize++;
                    i++;
                }else break;
            }else{
                if(energy>=100){
                    energy-=100;
                    worksize++;
                    i++;
                }else break;
            }
        }
        //console.log([WORK,worksize,CARRY,carrysize,MOVE,movesize]);
        return([WORK,worksize,CARRY,carrysize,MOVE,movesize]);
    },
    SetUpgrader:function(demand,energy,speed=1){
        var worksize =0;
        var movesize=0;
        var carrysize=0;
        switch(speed){
            case 0:var movecycle=6;var carrycycle=6;break;
            case 1:var movecycle=4;var carrycycle=6;break;
            case 2:var movecycle=1;var carrycycle=3;break;
        }
        for(var i = 0;i < demand;){
            if(carrysize<=i/carrycycle){
                if(energy>=50){
                    energy-=50;
                    carrysize++;
                }else break;
            }
            if(i% movecycle ==0){
                if(energy>=150){
                    energy-=150;
                    movesize++;
                    worksize++;
                    i++;
                }else break;
            }else{
                if(energy>=100){
                    energy-=100;
                    worksize++;
                    i++;
                }else break;
            }
        }
        //console.log([WORK,worksize,CARRY,carrysize,MOVE,movesize]);
        return([WORK,worksize,CARRY,carrysize,MOVE,movesize]);
    },
    Setbuilder:function(demand,energy){
        var worksize =0;
        var movesize=0;
        var carrysize=0;
        var setcost=100+50+50;
        for(var i = 0;i < demand;i++){
            if(energy>=setcost){
                energy -= setcost;
                worksize++;
                movesize++;
                carrysize++;
            }else break;
        }
        //console.log([WORK,worksize,CARRY,carrysize,MOVE,movesize]);
        return([WORK,worksize,CARRY,carrysize,MOVE,movesize]);
    },
    SetTransporter:function(demand,energy){
        var movesize=0;
        var carrysize=0;
        var setcost=100+50;
        for(var i = 0;i < demand;i++){
            if(energy>=setcost){
                energy -= setcost;
                movesize++;
                carrysize+=2;
            }else break;
        }
        //console.log([WORK,worksize,CARRY,carrysize,MOVE,movesize]);
        return([CARRY,carrysize,MOVE,movesize]);
    },
    SpawnBody:function(body_i=[MOVE,1]){
        var part=0;
        for(var i=1;i<body_i.length;i+=2){
            part+=body_i[i];
        }
        if(body_i.length % 2)part++;
        var body = new Array(part);
        var parti =0;
        for(var i=0;i<body_i.length/2;i++){
            
            var partn = (i*2+1)<body_i.length ? body_i[i*2+1]:1;
            for(var j = 0;j<partn;j++){
                body[parti++]=body_i[i*2];
            }
        }
        return(body);
    }
}
module.exports = creepBody;