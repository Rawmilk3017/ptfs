const commands = [
 {name:"schedule-add",description:"Add an event to the website schedule",options:[
  {name:"day",description:"Day of the week",type:3,required:true,choices:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(x=>({name:x,value:x}))},
  {name:"event",description:"Event title",type:3,required:true},
  {name:"time",description:"Time including timezone",type:3,required:false},
  {name:"location",description:"Event location",type:3,required:false},
  {name:"details",description:"Extra details",type:3,required:false}]},
 {name:"schedule-remove",description:"Remove a day's schedule entry",options:[{name:"day",description:"Day to remove",type:3,required:true,choices:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(x=>({name:x,value:x}))}]},
 {name:"site-update",description:"Update the website title or tagline",options:[
  {name:"team-name",description:"Main team name",type:3,required:false},
  {name:"tagline",description:"Hero tagline",type:3,required:false},
  {name:"discord-url",description:"Discord invite URL",type:3,required:false}]},
 {name:"announcement",description:"Publish a website announcement",options:[
  {name:"title",description:"Announcement title",type:3,required:true},
  {name:"message",description:"Announcement text",type:3,required:true}]},
 {name:"team-add",description:"Add a member to the team page",options:[
  {name:"name",description:"Member display name",type:3,required:true},
  {name:"role",description:"Team role",type:3,required:true},
  {name:"callsign",description:"Flight callsign",type:3,required:false}]},
 {name:"team-remove",description:"Remove a member by display name",options:[{name:"name",description:"Exact display name",type:3,required:true}]}
];
const app=process.env.DISCORD_APPLICATION_ID, token=process.env.DISCORD_BOT_TOKEN, guild=process.env.DISCORD_GUILD_ID;
if(!app||!token||!guild) throw new Error("Set DISCORD_APPLICATION_ID, DISCORD_BOT_TOKEN, and DISCORD_GUILD_ID first.");
fetch(`https://discord.com/api/v10/applications/${app}/guilds/${guild}/commands`,{method:"PUT",headers:{"Authorization":`Bot ${token}`,"Content-Type":"application/json"},body:JSON.stringify(commands)})
.then(async r=>{const body=await r.text();if(!r.ok)throw new Error(body);console.log("Registered Discord commands:",body);})
.catch(e=>{console.error(e);process.exit(1);});
