# dhis2API

Basic Wrapper and helper functions for dhis2 API

 - Dev
npm install dhis2api
webpack

 - Usage
 
 
import api from 'dhis2api';

const apiWrapper = new api.wrapper();


apiWrapper.getObj("dataElements?field=id,name",function(error,response,body){}


apiWrapper.putObj("events/"+event.event,event,function(error,response,body){}
