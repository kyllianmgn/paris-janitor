"use client"
import Icon, {IconProps} from "@/components/ui/icon";
import Link from "next/link";
import {usePathname} from "next/navigation";


export default function NavItem({menuName, iconName, route}: { menuName: string, iconName: IconProps["name"], route: string }) {
    const pathname = usePathname()
    return (
        <Link href={route}>
            <div className={`m-1 w-24 h-24 cursor-pointer  flex flex-col justify-center items-center rounded-full ${pathname == route ? 'bg-black text-white' : 'hover:bg-gray-100 hover:transition-all'}`}>
                <Icon name={iconName}/>
                <h2 className="text-center">{menuName}</h2>
            </div>
        </Link>
    )
}