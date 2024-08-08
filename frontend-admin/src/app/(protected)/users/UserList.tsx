"use client";
import {ChangeEvent, useEffect, useState} from "react";
import {User} from "@/types";
import UserCard from "@/app/(protected)/users/UserCard";
import {getUsers} from "@/api/services/user-service";
import Search from "@/components/list/search";
import Pagination from "@/components/list/pagination";


export default function UserList({pending = false, query, page}: {pending?: boolean, query?: string, page?: number}) {
    const [userList, setUserList] = useState<User[]>();
    const [totalCount, setTotalCount] = useState(0);

    const loadUsers = async () => {
        let newUsers;
        newUsers = await getUsers(query, page)
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
            <h1 className="text-3xl font-bold">Users</h1>
            <Search placeholder={"Rechercher Utilisateur"}></Search>
            <div className="flex flex-col my-3">
                {userList?.map((user: User) => <UserCard key={user.id} user={user}/>)}
            </div>
            <Pagination count={totalCount} itemsName={"Users"}></Pagination>
        </div>
    )
}