import { Directive, ElementRef, HostListener, Input, Renderer } from '@angular/core';

@Directive({ 
    selector: '[myHighlight]'
})


export class Highlightable {

    private _defaultColor = 'yellow';
    constructor(private el: ElementRef, private renderer: Renderer){}

    @Input('myHighlight') highlightColor: string;

    @HostListener('mouseenter') onMouseEnter(){
        this.highlight(this.highlightColor || this._defaultColor);
    }

    @HostListener('mouseleave') onMouseLeave(){
        this.highlight(null);
    }

    private highlight(color: string){
        this.renderer.setElementStyle(this.el.nativeElement, 'backgroundColor', color);
    }
}
