import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class CommunicationService {
    isMobile: boolean = false;

    private parentClickSubject = new Subject<void>();

    parentClick$ = this.parentClickSubject.asObservable();

    emitParentClick() {
        this.parentClickSubject.next();
    }
}