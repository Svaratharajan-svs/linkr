"use client";


import {useState} from "react";

import {login}
from "@/services/auth";



export default function Login(){


const [email,setEmail]=useState("");

const [password,setPassword]=useState("");



async function submit(){


try{


await login(
email,
password
);


window.location.href="/dashboard";


}
catch(err){
console.error(err);
alert("Login failed");

}


}



return (

<div>


<h1>
Login
</h1>


<input

placeholder="email"

onChange={
e=>setEmail(e.target.value)
}

/>


<input

type="password"

placeholder="password"

onChange={
e=>setPassword(e.target.value)
}

/>


<button onClick={submit}>

Login

</button>


</div>

);


}