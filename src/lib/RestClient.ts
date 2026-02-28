


export interface MotorsRequest {
	FL: number,
    FR: number,
    BL: number,
    BR: number,
}

export interface MotorsResponse {
	FL: number,
    FR: number,
    BL: number,
    BR: number,
}


export async function getStatus(): Promise<MotorsResponse>{
	
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
		
		const statusResponse:MotorsResponse = await response.json();
		//console.log({ statusResponse: statusResponse });
		console.log({ statusResponse: JSON.stringify(statusResponse) });
		
		return statusResponse;
		
	}
	catch(error){
		console.error("error retrieving status from: ", url, error);
		return Promise.reject(error);
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