import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import * as XLSX from 'xlsx';

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

    exportToExcel(data: any[], fileName: string, sheetName: string): void {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        XLSX.writeFile(wb, `${fileName}.xlsx`);
      }
}