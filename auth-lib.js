var newRightsCounter = 0;                                     //for createRights without argument if rights is strings
var grGuest = {name: "guest", rights: ["canViewContent"]};    //for setting all guests

var session;                                                  //current session
var rollbackSession;                                          //for loginAs

var allUsers = [
	// {username: "admin", password: "1234", groups: [allGroups[0]]},
	// {username: "alex007", password: "4321", groups: [allGroups[1]]},
  // {username: "Sancho", password: "228", groups: [allGroups[2]]}
];

var allRights = [
  // "canLoginAs", "canIncreaseCounter", "canMakeContent", "canViewContent", "canDownloadContent"
];

var allGroups = [
	// {name: "admin", rights: [allRights[0], allRights[1]]},
	// {name: "manager", rights: [allRights[2]]},
  // {name: "basic", rights: [allRights[3], allRights[4]]}
];

var allListners = [
  //function(user, action){...}
];


function createUser(username, password) {
  // var answer = allUsers.some(function (item) {             //Check for name matches
  //   return item.username === username
  // });
  // if (answer === true) {throw new Error("This username is busy")}


  allUsers.push({username: username, password: password, groups: []});
  return allUsers[allUsers.length-1]
};


function deleteUser(user) {
  var i = allUsers.indexOf(user);

  if (i >= 0) {
    allUsers.splice(i, 1);
    return
  }
  throw new Error('User for delete not found')
};


function users() {
  return allUsers;
};


function createGroup() {
  allGroups.push({name: arguments[0], rights: []});
  return allGroups[allGroups.length-1]
};


function deleteGroup(group) {
  var i = allGroups.indexOf(group);

  if (i == -1) {
  throw new Error('Group to delete not found')
  }
  allUsers.forEach(function(item) {
    if ( item.groups.indexOf(group) >= 0 ) {
      removeUserFromGroup(item, group);
    }
  });
  allGroups.splice(i, 1);
};


function groups() {
  return allGroups;
};


function addUserToGroup(user, group) {
  if ( allUsers.indexOf(user) == -1 || allGroups.indexOf(group) == -1 ) {
    throw new Error("Can't add user to group (not existing argument(s))")
  }
  user.groups.push(group);
};


function userGroups(user) {
  return user.groups
};


function removeUserFromGroup(user, group) {
  var i = allUsers.indexOf(user);
  //var j = allGroups.indexOf(group);
  var k = user.groups.indexOf(group);

  // if ( i == -1 || j == -1 || k == -1 ) {
  //   throw new Error("Can't delete user from group...")
  // }
  if ( i == -1 ) {
    throw new Error("Can't delete user from group (user)")
  }
  // if ( j == -1 ) {
  //   throw new Error("Can't delete user from group (group)")
  // }
  if ( k == -1 ) {
    throw new Error("Can't delete user from group (user in group)")
  }
  user.groups.splice(k, 1);
};


function createRight() {
  if (arguments[0]) {
    allRights.push("" + arguments[0]);
  } else {
  allRights.push("NewRights" + newRightsCounter);
  newRightsCounter++;
  }

  return allRights[allRights.length-1]
};


function deleteRight(right) {
  var i = allRights.indexOf(right);

  if (i == -1) {
  throw new Error('Right to delete not found')
  }
  allGroups.forEach(function(item){
    if ( item.rights.indexOf(right) >= 0 ) {
      removeRightFromGroup(right, item);
    }
  });
  allRights.splice(i, 1);
};


function groupRights(group) {
  return group.rights
};


function rights() {
  return allRights;
};


function addRightToGroup(right, group) {
  var i = allRights.indexOf(right);
  var j = allGroups.indexOf(group);

  if ( i == -1 || j == -1 ) {
    throw new Error('Right or group not found')
  }
  group.rights.push(right);
};


function removeRightFromGroup(right, group) {
  //var i = allRights.indexOf(right);
  var j = allGroups.indexOf(group);
  var k = group.rights.indexOf(right);

  // if ( i == -1 || j == -1 || k == -1 ) {
  //   throw new Error("Can't remove right from group")
  // }
  // if ( i == -1 ) {
  //   throw new Error("Can't remove right from group (right)")
  // }
  if ( j == -1 ) {
    throw new Error("Can't remove right from group (group)")
  }
  if ( k == -1 ) {
    throw new Error("Can't remove right from group (rihgt in group)")
  }
  group.rights.splice(k, 1);
};


function login(username, password) {
  var answer;

  if (session) {return false}

  //guest's login
  if (arguments[1] === undefined) {
    var guest = {username: username, groups: [grGuest]};

    if (allGroups.indexOf(grGuest) == -1) {allGroups.push(grGuest)}
    //Should i add 'guest to allUsers???
    session = guest;
    answer = true;
    return answer
  }

  answer = allUsers.some(function(item){
    if ( item.username === username && item.password === password ) {
    session = item;
    return true
    }
    return false
  });
  return answer
};


function currentUser() {
  return session
};


function logout() {
  session = rollbackSession;
  rollbackSession = undefined;
};


function isAuthorized(user, right) {
  var answer;

  if ( allUsers.indexOf(user) == -1 || allRights.indexOf(right) == -1 ) {
    throw new Error("Can't is Autorized...")
  }
  answer = user.groups.some(function(item){
    return item.rights.indexOf(right) >= 0
  });

  return answer
};


function loginAs(user) {
  if (!isAuthorized(session, "canLoginAs")) {return alert("Error: u can't do this")}; //do I need this check?
  if (allUsers.indexOf(user) == -1) {throw new Error("User is not found")};

  rollbackSession = session;
  session = user;
};


function securityWrapper(action, right) {
  var funcToExecute = function () {
    ///Listners
    allListners.map(func => func.apply(null, [session.username, action]));    //username or user???

    answer = session.groups.some(function(item) {
      return item.rights.indexOf(right) >= 0
    });
    if (answer === true) {
      action.apply(null, Array.from(arguments))
    }
  };

  return funcToExecute;
};


function addActionListener(listner) {
  allListners.push(listner);
}