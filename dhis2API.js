var _ajax = require('./ajax.js');


function  dhis2API(){

    var ajax = new _ajax("../../");

    this.wrapper = function(){
        this.getObj = function(param,callback){
            if (callback){
                ajax.get(param,callback);
                return;
            }
            
            return new Promise((resolve,reject) => {
                ajax.get(param,function(error,response,body){
                    if(!error){
                        resolve(body)
                    }else{
                        reject(error)
                    }
                })
            })  
        }

        this.putObj = function(param,obj,callback){
            if (callback){
                ajax.update(param,obj,callback);
                return;
            }
            
            return new Promise((resolve,reject) => {
                ajax.update(param,obj,function(error,response,body){
                    if(!error){
                        resolve(body)
                    }else{
                        reject(error)
                    }
                })
            })  
        }

        this.postObj = function(param,obj,callback){
            if (callback){
                ajax.post(param,obj,callback);
                return;
            }
            
            return new Promise((resolve,reject) => {
                ajax.post(param,obj,function(error,response,body){
                    if(!error){
                        resolve(body)
                    }else{
                        reject(error)
                    }
                })
            })  
        }
    }

    this.metadataService = function(){
        this.getObj = function(param){
            return new Promise((resolve,reject) => {
                ajax.get(param,function(error,response,body){
                    if(!error){
                        resolve(body)
                    }else{
                        reject(error)
                    }
                })
            })  
        }
    }


    this.getManifest = function(){
        var ajax = new _ajax("./");
        
        return new Promise((resolve,reject) => {
            ajax.get("manifest.webapp",function(error,response,body){
                if(!error){
                    resolve(body)
                }else{
                    reject(error)
                }
            })
        })  
    }
    
    
    this.dataElementService = function(){

        this.getDataElements = function(fields,filter){
            return new Promise((resolve,reject) => {
                ajax.get("dataElements?fields="+fields,function(error,response,body){
                    if(!error){
                        resolve(body)
                    }else{
                        reject(error)
                    }
                })
            })  
        }
        
    }
    this.userService = function(){

        this.getCurrentUser = function(fields,filters){
            return new Promise((resolve,reject) => {
                ajax.get("me?fields="+fields,function(error,response,body){
                    if(!error){
                        resolve(body)
                    }else{
                        reject(error)
                    }
                })
            })  
        }
    }
    
    
    this.organisationUnitService = function(){

        this.getOUGroups = function(fields,filters){
            return new Promise((resolve,reject) => {
                ajax.get("organisationUnitGroups?paging=false&fields="+fields,function(error,response,body){
                    if(!error){
                        resolve(body)
                    }else{
                        reject(error)
                    }
                })
            })
        }
    }

    this.sqlViewService = function(){

        this.dip = function(prefix,query,success){
            
            
            var sqlViewTemplate =
                {
                    "name": prefix+Math.random(1),
                    "sqlQuery": query,
                    "displayName": "temp",
                    "description": "temp",
                    "type": "QUERY"
                }
            
            this.create(sqlViewTemplate,((error,response,body) =>{
                if (error){success(error,response,body)}
                var uid = body.response.uid;
                this.getData(uid,((error,response,body) => {
                    success(error,response,body);
                    this.remove(uid,function(error,response,body){
                        if (error){
                            console.log("Could not delete SQLView"+error);
                        }
                    })
                }))                
            }))
            
        }
        this.getData = function(uid,callback){
            ajax.get("sqlViews/"+uid+"/data",callback);

        }
        
        this.create = function(sqlViewObj,callback){

            ajax.post("sqlViews?",(sqlViewObj),callback);
            
        }

        this.remove = function(uid,callback){
            ajax.remove("sqlViews/"+uid,callback);

        }
    }

    this.periodService = function(){

        this.getPeriods = function(periodType,startDate,endDate){

            switch(periodType){
            case "Monthly" :
                debugger
                return  getMonthlyPeriods();
            default :
                return  getMonthlyPeriods();
                
                
            }

            function getMonthlyPeriods(){

                var periods = [];
                var MONTH_NAMES=new Array('January','February','March','April','May','June','July','August','September','October','November','December');
                var MONTH_NAMES_SHORT=new Array('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');


                var today = new Date();
                var currentYear = today.getFullYear();
                var currentMonth = today.getMonth();
                
                for (var i=currentYear;i>=1990;i--){
                    while(currentMonth!=-1){
                        var monthStr = ""
                        var cm = currentMonth+1;
                        if (cm <10){
                            monthStr = "0";
                        }
                        periods.push(
                            {
                                id:i+monthStr+cm,
                                name : MONTH_NAMES_SHORT[currentMonth]+" "+i

                            }
                        );

                        currentMonth = (currentMonth-1);
                    }
                    currentMonth=11;
                }
                
                return periods;
            }
        }
    }

    
    this.dataStoreService = function(dataStoreName){

        this.getAllKeyValues = function(){
            return new Promise((resolve,reject) => {
                ajax.get("dataStore/"+dataStoreName,((error,response,body) => {
                    
                    if (error){
                        
                    }else{
                        var keyArray = [];
                        
                        body.forEach((key) => {
                            keyArray.push(this.getValue(key));
                        })
                        
                        Promise.all(keyArray).then(function(values){
                            resolve(values)
                        })
                    }
                    
                }))
            })
        }
        
        function getKeys(callback){
            
            ajax.get("dataStore",function(error,body,response){
                if (error){
                }else{
                    callback(response)
                }

            })
        }

        this.getValue = function(key,callback){
            if (callback){
                ajax.get("dataStore/"+dataStoreName+"/"+key,callback)
            }else{
                return new Promise((resolve,reject) => {
                    ajax.get("dataStore/"+dataStoreName+"/"+key,function(error,response,body){
                        if (error){
                            resolve(error);
                        }else{
                            resolve(body);
                        }
                    })

                })
            }
            
        }
        

        this.remove = function(key,callback){
            
            ajax.remove("dataStore/"+dataStoreName+"/"+key,callback);
        }
        this.saveOrUpdate = function(jsonObj,callback){

            
            ajax.update("dataStore/"+dataStoreName+"/"+jsonObj.key,jsonObj,function(error,response,body){
                if (error || body.status == "ERROR"){
                    // may be key not exist
                    ajax.post("dataStore/"+dataStoreName+"/"+jsonObj.key,jsonObj,function(error,response,body){
                        if (error){
                            console.log("Couldn't save data store key value")
                            callback(error,null,null)
                            return
                        }else{
                            callback(error,response,body)
                        }
                        
                    })
                }else{
                    console.log("Updated Key")
                    callback(error,response,body)
                }
            })
            
        }
    }
    
}

module.exports = new dhis2API();
