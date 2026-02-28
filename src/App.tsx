import { useEffect, useState } from "react"
import { getStatus, setMotors, type MotorsRequest, type MotorsResponse } from "./lib/RestClient";

import { Button } from "@/components/ui/button"
import { ArrowUpIcon, Octagon, CircleCheck, CircleX, Wifi, WifiOff, CornerUpLeft, CornerUpRight } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { useDimensions } from "./lib/useDimensions";
import { Card } from "./components/ui/card";

import WheelsIcon from "./components/mine/WheelsIcon";

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
				// setMotorFL( statusResponse.FL );
				// setMotorFR( statusResponse.FR );
				// setMotorBL( statusResponse.BL );
				// setMotorBR( statusResponse.BR );
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
			// setMotorFL( motorsResponse.FL );
			// setMotorFR( motorsResponse.FR );
			// setMotorBL( motorsResponse.BL );
			// setMotorBR( motorsResponse.BR );
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
	async function turnLeft(){
		console.log("turnLeft");
		
		const v = 0.5;
		
		const motorsRequest:MotorsRequest = {
			FL: v/2, FR: v,
			BL: v/2, BR: v,
		}
		
		sendMotorsRequest(motorsRequest);
		
	}
	async function turnRight(){
		console.log("turnRight");
		
		const v = 0.5;
		
		const motorsRequest:MotorsRequest = {
			FL: v, FR: v/2,
			BL: v, BR: v/2,
		}
		
		sendMotorsRequest(motorsRequest);
		
	}
	
	async function onSliderValueCommitted(sliderName:string, value:number){
		// console.log({sliderName,value})
		
		// const motorsRequest:MotorsRequest = {
		// 	FL: motor_FL,
		// 	FR: motor_FR,
		// 	BL: motor_BL,
		// 	BR: motor_BR,
		// }
		
		// if     ( sliderName == "FL" )	motorsRequest.FL = value;
		// else if( sliderName == "FR" )	motorsRequest.FR = value;
		// else if( sliderName == "BL" )	motorsRequest.BL = value;
		// else if( sliderName == "BR" )	motorsRequest.BR = value;
		// else throw Error("invalid slider name");
		
		// sendMotorsRequest(motorsRequest);
		
		
		
		if     ( sliderName == "FL" )	setMotorFL( value );
		else if( sliderName == "FR" )	setMotorFR( value );
		else if( sliderName == "BL" )	setMotorBL( value );
		else if( sliderName == "BR" )	setMotorBR( value );
		else throw Error("invalid slider name");
		
	}
	async function set(value:number){
		console.log("set", {value});
		
		const motorsRequest:MotorsRequest = {
			FL: motor_FL,
			FR: motor_FR,
			BL: motor_BL,
			BR: motor_BR,
		}
		
		sendMotorsRequest(motorsRequest);
	}
	
	const { ref, dimensions } = useDimensions();
	
	const title = "Wi-Fi RC Car";
	
	return (
		<div ref={ref} className="flex flex-col h-[700px] w-screen items-center justify-start w-full gap-4 p-4 ">
			
			{/* <div className="rounded-lg bg-gray-100 p-8 shadow-lg dark:bg-gray-800"> */}
			<Card className="p-4 py-2 w-full gap-4 flex flex-row items-center justify-center">
				<h3 className="text-gray-700 dark:text-gray-300 text-center">{title}</h3>
				<ConnectionIcon connected={connected}/>
				{/* <p className="text-gray-700 dark:text-gray-300 text-center" >{connected ? "Connected :)" : "Not Connected :("}</p> */}
			</Card>
			{/* </div> */}
			
			<div className="flex gap-4">
				<Button variant="outline" size="icon" className="size-12" onClick={stop} >
					<Octagon />
				</Button>
				<Button variant="outline" size="icon" className="size-12" onClick={forward}>
					<ArrowUpIcon />
				</Button>
				<Button variant="outline" size="icon" className="size-12" onClick={turnLeft} >
					<CornerUpLeft />
				</Button>
				<Button variant="outline" size="icon" className="size-12" onClick={turnRight}>
					<CornerUpRight />
				</Button>
			</div>
			
			<Card className="p-4 w-full gap-4">
				<div className="grid grid-rows-2 grid-cols-[1fr_auto_1fr] justify-center gap-6 gap-y-10 w-[300px]">
					<MotorSlider velocity={motor_FL} onValueCommit={value=>onSliderValueCommitted("FL", value)} labelSide="left"/>
					
					<div className="row-span-2 col-start-2 flex items-center justify-center">
						{/* <img src={myImage} className="w-auto h-[280px] "/> */}
						<WheelsIcon className="w-[169px] h-[306px] text-slate-600"/>
					</div>
					
					<MotorSlider velocity={motor_FR} onValueCommit={value=>onSliderValueCommitted("FR", value)} labelSide="right"/>
					
					<MotorSlider velocity={motor_BL} onValueCommit={value=>onSliderValueCommitted("BL", value)} labelSide="left"/>
					<MotorSlider velocity={motor_BR} onValueCommit={value=>onSliderValueCommitted("BR", value)} labelSide="right"/>
				</div>
				<Button variant="outline" size="icon" className="size-12 self-center" onClick={set}>
					Set
				</Button>
				
			</Card>
			<p className="text-sm text-muted-foreground">{dimensions.width} x {dimensions.height}</p>
			
		</div>
	)
	
	function MotorSlider({velocity, onValueCommit, labelSide="left"}:{velocity:number, onValueCommit:(value:number)=>void, labelSide?: "left" | "right"}) {
		
		const labels = (
			<div className="flex flex-col items-center justify-between text-muted-foreground text-[10px] tabular-nums">
				<span className="w-6 text-center">100</span>
				<span className="w-6 text-center">50</span>
				<span className="w-6 text-center">0</span>
				<span className="w-6 text-center">-50</span>
				<span className="w-6 text-center">-100</span>
			</div>
		);
		const ticks = (
			<div className={"flex flex-col justify-between text-muted-foreground text-xs tabular-nums py-[5px]" + (labelSide == "left" ? " items-end" : " items-start")}>
				{/* <span>—</span>
					<span>-</span>
				<span>—</span>
					<span>-</span>
				<span>—</span>
					<span>-</span>
				<span>—</span>
					<span>-</span>
				<span>—</span> */}
				
				<span className="leading-[4px]">—</span>
				<span className="leading-[4px]">-</span><span className="leading-[4px]">-</span><span className="leading-[4px]">-</span><span className="leading-[4px]">-</span>
				<span className="leading-[4px]">—</span>
				<span className="leading-[4px]">-</span><span className="leading-[4px]">-</span><span className="leading-[4px]">-</span><span className="leading-[4px]">-</span>
				<span className="leading-[4px]">—</span>
				<span className="leading-[4px]">-</span><span className="leading-[4px]">-</span><span className="leading-[4px]">-</span><span className="leading-[4px]">-</span>
				<span className="leading-[4px]">—</span>
				<span className="leading-[4px]">-</span><span className="leading-[4px]">-</span><span className="leading-[4px]">-</span><span className="leading-[4px]">-</span>
				<span className="leading-[4px]">—</span>
				
			</div>
		);
		const slider = (
			<Slider
				defaultValue={[velocity*100]}
				min={-100}
				max={100}
				step={10}
				orientation="vertical"
				className="h-40"
				onValueCommit={values => onValueCommit(0.01*values[0])}
			/>
		);
		
		if( labelSide == "left" ){
			return(
				<div className="grid grid-cols-[auto_auto_1fr]">
					{labels}
					{ticks}
					{slider}
				</div>
			);
		}
		if( labelSide == "right" ){
			return(
				<div className="grid grid-cols-[auto_auto_1fr]">
					{slider}
					{ticks}
					{labels}
				</div>
			);
		}
		
		
		
		
	}
	
	
	function ConnectionIcon({connected}:{connected:boolean}){
		if(connected) return <Wifi className="text-green-500"/>;
		else return <WifiOff className="text-red-500"/>;
	}
}