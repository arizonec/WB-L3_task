import { Analytics } from "types";



class EventSender {
    url: string;

    constructor(url: string = '/api/sendEvent') {
        this.url = url
    }

    eventSend(body: Analytics): void {
        
        try{

            fetch(this.url, {
                method: 'POST',
                body: JSON.stringify(body)
            }).then(response => response.json()).then(json => console.log('analytics:', json));

        } catch(error: any) {
            console.log('ERROR', error.name)
        }
    }
}

export const eventSender = new EventSender();