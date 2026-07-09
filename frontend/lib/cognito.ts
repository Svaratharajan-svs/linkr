import {
    CognitoUserPool
} from "amazon-cognito-identity-js";


export function getUserPool(){
    return new CognitoUserPool({

        UserPoolId:
        process.env.NEXT_PUBLIC_POOL_ID!,

        ClientId:
        process.env.NEXT_PUBLIC_CLIENT_ID!

    });

}