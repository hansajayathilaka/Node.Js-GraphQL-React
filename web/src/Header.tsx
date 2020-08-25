import React from 'react';
import {Link} from "react-router-dom";
import {useLogoutMutation, useMeQuery} from "./generated/graphql";
import {setAccessToken} from "./accessToken";


interface Props {}

export const Header: React.FC<Props> = () => {
    const { data, loading } = useMeQuery();
    const [ logout, { client } ] = useLogoutMutation();

    let body: any= null

    if(loading){
        body = null;
    } else if (data && data.me) {
        body = <div>You are Logged in as { data.me.email }</div>;
    } else {
        body = <div>Not Logged in</div>;
    }

    return(
        <header>
            <div>
                <Link to='/'>Home Page</Link>
            </div>
            <div>
                <Link to='/register'>Register Page</Link>
            </div>
            <div>
                <Link to='/login'>Login Page</Link>
            </div>
            <div>
                <Link to='/bye'>Bye</Link>
            </div>
            { !loading && data && data.me ? (
                <div>
                    <button onClick={async () => {
                        await logout();
                        setAccessToken('');
                        await client.resetStore();
                    }}>Logout
                    </button>
                </div>
            ) : null }
            { body }
        </header>
    );
}
