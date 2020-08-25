import React from 'react';
import {useUsersQuery} from "../generated/graphql";


interface Props {

}

export const Home: React.FC<Props> = () => {
    const { data, loading } = useUsersQuery({ fetchPolicy: 'network-only' })
    if (!data || loading){
        return <div>Loading...</div>
    }

    return(
        <div>
            <div>Users</div>
            <ul>
                { data.users.map(x => {
                    return(
                        <li key={x.id}>
                            {x.id} | {x.email}
                        </li>
                    );
                }) }
            </ul>
        </div>
    );
};
