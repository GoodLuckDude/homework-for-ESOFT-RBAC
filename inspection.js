var grAdmin = createGroup("admin");
var grManager = createGroup("manager");
var grBasic = createGroup("basic");

allRights = [
  "canConfigurate", "canViewContent", "canLoginAs"
];

allGroups.forEach(function(item){
  addRightToGroup(allRights[1], item);
});

grAdmin.rights.push("canLoginAs");
grAdmin.rights.push("canIncreaseCounter");
grManager.rights.push("canLoginAs");

allUsers = [
  {username: "admin", password: "1234", groups: [grAdmin, grManager, grBasic]},
  {username: "Alex007", password: "4321", groups: [grManager,grBasic]},
  {username: "UbIvAshKa", password: "1488", groups: [grBasic]},
  {username: "Sancho", password: "228", groups: [grBasic]},
];

var counter = 0;
function increaseCounter(amount) { counter += amount };
var secureIncreaseCounter = securityWrapper(increaseCounter, "canIncreaseCounter");

console.log("Counter = " + counter);

addActionListener(function(user, action) { 
  console.log("Пользователь " + user + " только что сделал " + action.name); 
});

addActionListener(function(user, action) { 
  alert("Пользователь " + user + " только что сделал " + action.name); 
});

login("admin", "1234");  
secureIncreaseCounter(1);
console.log("Counter = " + counter);

logout();

login("Barash2001");
secureIncreaseCounter(1);
console.log("Counter = " + counter);
logout();
