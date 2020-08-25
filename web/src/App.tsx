import React, { useEffect, useState } from 'react';
import { Routes } from "./Routes";
import { setAccessToken } from "./accessToken";

interface Props {

}

export const App: React.FC<Props> = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(
            'http://localhost:3000/refresh_token',
            {
                method: 'POST',
                credentials: 'include'
            })
            .then(async (x: any) => {
                x = await x.json();
                console.log(x);
                setAccessToken(x.accessToken);
                setLoading(false);
            });
    }, []);

    if (loading){
        return <div>loading...</div>;
    }

    return <Routes /> ;
}
