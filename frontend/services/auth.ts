import {
    CognitoUser,
    AuthenticationDetails
} from "amazon-cognito-identity-js";


import {
    getUserPool
} from "@/lib/cognito";


import {
    saveToken,
    removeToken
} from "@/utils/storage";



export function login(
    username:string,
    password:string
):Promise<string>{


    return new Promise(
        (resolve,reject)=>{


            const user =
                new CognitoUser({

                    Username:username,

                    Pool:getUserPool()

                });



            const authDetails =
                new AuthenticationDetails({

                    Username:username,

                    Password:password

                });



            user.authenticateUser(
                authDetails,
                {


                    onSuccess:
                    (session)=>{


                        const token =
                            session
                            .getAccessToken()
                            .getJwtToken();



                        saveToken(token);


                        resolve(token);

                    },


                    onFailure:
                    (error)=>{


                        reject(error);

                    }


                }
            );


        }
    );

}



export function logout(){

    removeToken();

}