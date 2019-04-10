import { Observable} from 'rxjs';
import { fromEvent} from 'rxjs';
import { map, takeUntil} from 'rxjs/operators'

let tenthSecond$ = new Observable(observer => {
    let counter = 0;
    observer.next(counter);
    let interv = setInterval(()=>{
        counter++;
        observer.next(counter);
    },100);

    return function unsubscribe(){
        clearInterval(interv);
    }
});

let startButton = document.querySelector('#start-button');
let stopButton = document.querySelector('#stop-button');
let resultsArea = document.querySelector<HTMLElement>('.output');

let startClick$ = fromEvent(startButton, 'click');
let stopClick$ = fromEvent(stopButton, 'click');

function trackClickEvents(element){
    return new Observable(observer =>{
        let emitClickEvent = event => observer.next(event);

        element.addEventListener('click',emitClickEvent);
        return ()=> element.removeElementListener(emitClickEvent);
    });
}

startClick$.subscribe(()=>{
    tenthSecond$.pipe(
        map((item:any) => (item/10)),
        takeUntil(stopClick$)
    ).subscribe(num => resultsArea.innerText = num + 's')
});

stopClick$.subscribe(()=>{
    console.log("stop");
})