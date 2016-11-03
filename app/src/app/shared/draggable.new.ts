
//import {DOM} from 'angular2/src/core/dom/dom_adapter';
import {Directive, EventEmitter, HostListener, ElementRef} from '@angular/core';
import {Observable} from 'rxjs/Rx';

@Directive({
  selector: '[draggable]'
})
export class DraggableNew {
  mousedrag;
  mouseup   = new EventEmitter();
  mousedown = new EventEmitter();
  mousemove = new EventEmitter();
  mouseout = new EventEmitter();

  @HostListener('mouseup', ['$event'])
  onMouseup(event) { this.mouseup.next(event); }

  @HostListener('mousedown', ['$event'])
  onMousedown(event) { 
        this.mousedown.next(event);
        return false; 
    }

  @HostListener('mousemove', ['$event'])
  onMousemove(event) { this.mousemove.next(event); }

  @HostListener('mouseout', ['$event'])
  onMouseout(event) {
        this.mouseout.emit(event);
        return false; // Same as calling preventDefault() on the event
    }

  constructor(public element: ElementRef) {
    this.element.nativeElement.style.position = 'absolute';
    this.element.nativeElement.style.cursor = 'pointer';

    this.mousedrag = this.mousedown.map((pos: MouseEvent) => {
        return {
          left: pos.clientX - this.element.nativeElement.getBoundingClientRect().left,
          top:  pos.clientY - this.element.nativeElement.getBoundingClientRect().top
        };
      })
      .flatMap(imageOffset => this.mousemove.merge(this.mouseout).map((pos: MouseEvent) => ({
        top:  pos.clientY - imageOffset.top,
        left: pos.clientX - imageOffset.left
      }))
      .takeUntil(this.mouseup));

  }


  onInit() {
    this.mousedrag.subscribe({
      next: pos => {
        // Update position
        this.element.nativeElement.style.top  = pos.top  + 'px';
        this.element.nativeElement.style.left = pos.left + 'px';
      }
    });
  }

}