import React, {useEffect, useState} from "react";
import {useLazyGetUserReposQuery, useSearchUsersQuery} from "../store/github/github.api";
import {useDebounce} from "../hooks/debounce";
import {RepoCard} from "../components/RepoCard";

export function HomePage() {
    const [search, setSearch] = useState('')
    const [dropdown, setDropdown] = useState(false)
    const debounced = useDebounce(search)
    const {isLoading, isError, data} = useSearchUsersQuery(debounced, {
        skip: debounced.length < 3,
        refetchOnFocus: true,
    })

    const [fetchRepos, {isLoading: isReposLoading, data: repos}] = useLazyGetUserReposQuery()


    useEffect(() => {
        setDropdown(debounced.length > 2 && data?.length! > 0)
    }, [debounced, data])

    const selectUser = (username: string) => {
        fetchRepos(username)
        setDropdown(false)
    }

    return (
        <div className="flex justify-center px-10 mx-auto h-screen w-screen">
            {isError && <p className="text-center text-red-600">Something went wrong...</p>}

            <div className="relative w-[560px] mt-5">
                <input
                    type="text"
                    className="border py-3 px-4 w-full h-[42px] mb-2"
                    placeholder="Search for username..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

                {dropdown &&
                    <ul className="list-none absolute top-[42px] left-0 right-0 max-h-[200px] overflow-y-scroll shadow-md bg-white">
                        {isLoading && <p className="text-center">loading...</p>}
                        {data?.map(user => (
                            <li key={user.id}
                                onClick={() => selectUser(user.login)}
                                className="py-2 px-4 hover:bg-gray-500 transition-colors cursor-pointer"
                            >
                                {user.login}
                            </li>
                        ))}
                    </ul>
                }

                <div className="container">
                    {isReposLoading && <p className="text-center">loading...</p>}

                    {repos?.map(repo => (
                        <RepoCard repo={repo} key={repo.id}/>
                    ))}
                </div>
            </div>
        </div>
    )
}
