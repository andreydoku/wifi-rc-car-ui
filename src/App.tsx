import { useEffect, useState } from "react"
import { getStatus, setMotors, type MotorsResponse } from "./lib/RestClient";

import { Button } from "@/components/ui/button"
import { ArrowUpIcon, Octagon } from "lucide-react"

export default function App(){
	
	//npm run dev -- --host
	
	const [status, setStatus] = useState<boolean>(false);
	
	const [count, setCount] = useState<number>(0);
	
	useEffect(() => {
	  
		const fetchStatus = async () => {
			try{
				const status = await getStatus();
				setStatus( status );
			}
			catch(error){
				//console.error("error fetching temperature: ", error);
				setStatus( false );
			}
		}
		fetchStatus();
		const id = setInterval(fetchStatus, 10000);
    	return () => clearInterval(id);

	}, [])
	
	
	async function forward(){
		console.log("forward");
		setMotors({
			frontLeft: 1,
			frontRight: 1,
			backLeft: 1,
			backRight: 1,
		})
	}
	async function stop(){
		console.log("stop");
		setMotors({
			frontLeft: 0,
			frontRight: 0,
			backLeft: 0,
			backRight: 0,
		})
	}
	
	function blah(){
		setCount(count + 1);
	}
	
	
	return (
		<div className="flex h-screen w-screen items-center justify-center">
			<div className="rounded-lg bg-gray-100 p-8 shadow-lg dark:bg-gray-800">
				<p className="text-gray-700 dark:text-gray-300">Wi-Fi RC Car</p>
				<p className="text-gray-700 dark:text-gray-300">{status ? "Connected :)" : "Not Connected :("}</p>
			</div>
			
			<div className="flex gap-4">
				<Button variant="outline" size="icon" aria-label="Submit" className="size-12" onClick={stop} onTouchStart={blah}>
					<Octagon />
				</Button>
				<Button variant="outline" size="icon" aria-label="Submit" className="size-12" onClick={forward}>
					<ArrowUpIcon />
				</Button>
			</div>
			
		</div>
	)
}