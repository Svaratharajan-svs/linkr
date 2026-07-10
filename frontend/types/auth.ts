export interface LoginRequest {

    username:string;

    password:string;

}


export interface AuthContextType {

    token: string | null;

    isAuthenticated: boolean;

    loading: boolean;


    login(
        username: string,
        password: string
    ): Promise<void>;


    logout(): void;

}