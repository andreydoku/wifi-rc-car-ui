


export interface MotorsRequest {
	frontLeft: number,
    frontRight: number,
    backLeft: number,
    backRight: number,
}

export interface MotorsResponse {
	name: string;
	tempF: number;
}


export async function getStatus(): Promise<boolean>{
	
	// const baseUrl:string|undefined = import.meta.env.VITE_TODOS_API
	const baseUrl = "http://192.168.4.213:5000";
	const resource = "/api/status";
	const url = `${baseUrl}${resource}`;
	
	
	try{
		const response = await fetch( url , {
			method: "GET",
			headers: {
				"Accept": "application/json",
			},
			mode: "cors", // no-cors, *cors, same-origin
		});
		
		const statusResponse = await response.json();
		console.log({ responseObj: statusResponse });
		
		return true;
		
	}
	catch(error){
		console.error("error retrieving status from: ", url, error);
		return false;
	}
	
}

export async function setMotors(request:MotorsRequest): Promise<MotorsResponse>{
	
	// const baseUrl:string|undefined = import.meta.env.VITE_TODOS_API
	const baseUrl = "http://192.168.4.213:5000";
	const resource = "/api/motors";
	const url = `${baseUrl}${resource}`;
	
	console.log({ request: JSON.stringify(request) })
	
	
	try{
		const response = await fetch( url , {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
			},
			mode: "cors", // no-cors, *cors, same-origin
			// mode: "no-cors",
			body: JSON.stringify(request)
		});
		
		const motorsResponse:MotorsResponse = await response.json();
		console.log({ motorsResponse: motorsResponse });
		
		return motorsResponse;
		
	}
	catch(error){
		console.error("error setting the motors: ", url, error);
		return Promise.reject(error);
	}
	
}