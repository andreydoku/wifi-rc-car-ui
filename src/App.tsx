import { useEffect, useState } from "react"
import { getStatus, setMotors, type MotorsRequest, type MotorsResponse } from "./lib/RestClient";

import { Button } from "@/components/ui/button"
import { ArrowUpIcon, Octagon } from "lucide-react"
import { Slider } from "@/components/ui/slider"

export default function App(){
	
	//npm run dev -- --host
	
	const [connected, setConnected] = useState<boolean>(false);
	
	const [motor_FL, setMotorFL] = useState<number>(0);
	const [motor_FR, setMotorFR] = useState<number>(0);
	const [motor_BL, setMotorBL] = useState<number>(0);
	const [motor_BR, setMotorBR] = useState<number>(0);
	
	useEffect(() => {
	  
		const fetchStatus = async () => {
			try{
				const statusResponse = await getStatus();
				setConnected( true );
				setMotorFL( statusResponse.FL );
				setMotorFR( statusResponse.FR );
				setMotorBL( statusResponse.BL );
				setMotorBR( statusResponse.BR );
			}
			catch(error){
				//console.error("error fetching temperature: ", error);
				setConnected( false );
			}
		}
		fetchStatus();
		const id = setInterval(fetchStatus, 10000);
    	return () => clearInterval(id);

	}, [])
	
	async function sendMotorsRequest(motorsRequest:MotorsRequest){
		try{
			const motorsResponse:MotorsResponse = await setMotors(motorsRequest)
			
			setConnected( true );
			setMotorFL( motorsResponse.FL );
			setMotorFR( motorsResponse.FR );
			setMotorBL( motorsResponse.BL );
			setMotorBR( motorsResponse.BR );
		}
		catch(error){
			//console.error("error fetching temperature: ", error);
			setConnected( false );
		}
	}
	
	async function forward(){
		console.log("forward");
		
		const v = 0.5;
		
		const motorsRequest:MotorsRequest = {
			FL: v, FR: v,
			BL: v, BR: v,
		}
		
		sendMotorsRequest(motorsRequest);
		
	}
	async function stop(){
		console.log("stop");
		
		const motorsRequest:MotorsRequest = {
			FL: 0, FR: 0,
			BL: 0, BR: 0,
		}
		
		sendMotorsRequest(motorsRequest);
		
	}
	
	async function onSliderValueCommitted(sliderName:string, value:number){
		console.log({sliderName,value})
		
		const motorsRequest:MotorsRequest = {
			FL: motor_FL,
			FR: motor_FR,
			BL: motor_BL,
			BR: motor_BR,
		}
		
		if     ( sliderName == "FL" )	motorsRequest.FL = value;
		else if( sliderName == "FR" )	motorsRequest.FR = value;
		else if( sliderName == "BL" )	motorsRequest.BL = value;
		else if( sliderName == "BR" )	motorsRequest.BR = value;
		else throw Error("invalid slider name");
		
		sendMotorsRequest(motorsRequest);
	}
	
	return (
		<div className="flex flex-col h-screen w-screen items-center justify-center gap-10">
			
			<div className="rounded-lg bg-gray-100 p-8 shadow-lg dark:bg-gray-800">
				<p className="text-gray-700 dark:text-gray-300">Wi-Fi RC Car</p>
				<p className="text-gray-700 dark:text-gray-300">{connected ? "Connected :)" : "Not Connected :("}</p>
			</div>
			
			<div className="flex gap-4">
				<Button variant="outline" size="icon" aria-label="Submit" className="size-12" onClick={stop} >
					<Octagon />
				</Button>
				<Button variant="outline" size="icon" aria-label="Submit" className="size-12" onClick={forward}>
					<ArrowUpIcon />
				</Button>
			</div>
			
			<div className="grid grid-cols-2 gap-10">
				<MotorSlider velocity={motor_FL} onValueCommit={value=>onSliderValueCommitted("FL", value)}/>
				<MotorSlider velocity={motor_FR} onValueCommit={value=>onSliderValueCommitted("FR", value)}/>
				<MotorSlider velocity={motor_BL} onValueCommit={value=>onSliderValueCommitted("BL", value)}/>
				<MotorSlider velocity={motor_BR} onValueCommit={value=>onSliderValueCommitted("BR", value)}/>
			</div>
			
			
		</div>
	)
	
	function MotorSlider({velocity, onValueCommit}:{velocity:number, onValueCommit:(value:number)=>void}){
		
		//grid-cols-3
		return(
			<div className="grid grid-cols-[auto_auto_1fr]">
				<div className="flex flex-col items-center justify-between text-muted-foreground text-[10px] tabular-nums">
					<span className="w-6 text-center">100</span>
					<span className="w-6 text-center">50</span>
					<span className="w-6 text-center">0</span>
					<span className="w-6 text-center">-50</span>
					<span className="w-6 text-center">-100</span>
				</div>
				<div className="flex flex-col items-center justify-between text-muted-foreground text-xs tabular-nums">
					<span className="text-right">—</span>
					<span className="text-right">-</span>
					<span className="text-right">—</span>
					<span className="text-right">-</span>
					<span className="text-right">—</span>
					<span className="text-right">-</span>
					<span className="text-right">—</span>
					<span className="text-right">-</span>
					<span className="text-right">—</span>
				</div>
				<Slider
					defaultValue={[velocity*100]}
					min={-100}
					max={100}
					step={25}
					orientation="vertical"
					className="h-40"
					onValueCommit={values => onValueCommit(0.01*values[0])}
				/>
				<div>
					
				</div>
			</div>
		);
		
		
	}
}