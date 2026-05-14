import { cn } from "@/lib/utils"

const Spacer = ({className}:{className?:string}) => {
    return <div className={cn(`h-12` , className)}/>
}
export default Spacer;