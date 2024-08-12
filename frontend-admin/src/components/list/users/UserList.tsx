"use client";
import {ChangeEvent, useEffect, useState} from "react";
import {User} from "@/types";
import UserCard from "@/components/list/users/UserCard";
import {getUsers} from "@/api/services/user-service";
import Search from "@/components/list/search";
import Pagination from "@/components/list/pagination";


export default function UserList({pending = false, query, page}: {pending?: boolean, query?: string, page?: number}) {
    const [userList, setUserList] = useState<User[]>();
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const loadUsers = async () => {
        setLoading(true);
        let newUsers;
        newUsers = await getUsers(query, page)
        setLoading(false)
        setUserList(newUsers.data)
        if (newUsers.count){
            setTotalCount(newUsers.count)
        }else{
            setTotalCount(0)
        }
    }

    useEffect(() => {
        loadUsers().then()
    }, [query, page]);

    return (
        <div>
            <Search placeholder={"Rechercher Utilisateur"}></Search>
            <div className="flex flex-col my-3">
                {
                    loading ? <h1 className="text-3xl text-center font-bold">Loading Users...</h1> :
                        userList?.length ?
                                userList.map((user: User) => <UserCard key={user.id} user={user}/>)
                            :
                                <h1 className="text-3xl text-center font-bold">No users found.</h1>
                }
            </div>
            <Pagination count={totalCount} itemsName={"Users"}></Pagination>
        </div>
    )
}