import {
    CognitoUser,
    AuthenticationDetails
}
from "amazon-cognito-identity-js";


import {getUserPool}
from "@/lib/cognito";


export function login(
    email:string,
    password:string
){

return new Promise((resolve,reject)=>{


const user =
new CognitoUser({

Username:email,

Pool:getUserPool()

});


const details =
new AuthenticationDetails({

Username:email,

Password:password

});


user.authenticateUser(details,{

onSuccess(session){


const token =
session.getAccessToken()
.getJwtToken();


localStorage.setItem(
"token",
token
);


resolve(token);

},


onFailure(error){

reject(error);

}

});


});


}