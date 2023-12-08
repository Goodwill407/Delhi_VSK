import { LowerCasePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'search'
})
export class SearchPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (!args) {
            return value;
        }
        return value.filter((val: any | LowerCasePipe) => {
            let rVal = (val.Name?.toLocaleLowerCase().includes(args.toLocaleLowerCase())) || (val.school_name?.toLocaleLowerCase().includes(args.toLocaleLowerCase())) || (val.Student_Name?.toLocaleLowerCase().includes(args.toLocaleLowerCase()));
            return rVal;
        })
    }
}
