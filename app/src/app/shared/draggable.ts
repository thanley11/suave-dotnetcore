import {Directive, Input, Output, EventEmitter, HostListener, ElementRef} from "@angular/core";

@Directive({
  selector: "[draggable]"
})
export class Draggable {
    private _isDragging: boolean = false;
    private _originalClientX: number;
    private _originalClientY: number;
    private _originalTop: number;
    private _originalLeft: number;
    private _hasDragged: boolean = false;
    mousedrag;
    mouseup   = new EventEmitter();
    mousedown = new EventEmitter();
    mousemove = new EventEmitter();
    mouseout = new EventEmitter();

    @Output('draggable') endDragEvent = new EventEmitter(false);
    @HostListener('mouseup', ['$event'])
    onMouseUp($event) {
      if (this._isDragging) {
        this._isDragging = false;
        if(this._hasDragged){
          this.endDragEvent.emit({left: this._originalLeft + ($event.clientX - this._originalClientX), top: this._originalTop + ($event.clientY - this._originalClientY)});
        }
      }
    }
    @HostListener('mousedown', ['$event'])
    onMouseDown($event) {
      if ($event.target.style.position === "absolute" && $event.target.style.left && $event.target.style.top) {
        this._hasDragged = false;
        this._isDragging = true;
        this._originalLeft = parseInt($event.target.style.left, 10);
        this._originalTop = parseInt($event.target.style.top, 10);
        this._originalClientX = $event.clientX;
        this._originalClientY = $event.clientY;
      }else {
        console.log("draggable: Error! the annotated " + $event.target.nodeName + " element needs to be inline styled with position, top and left");
      }
    }
    @HostListener('mousemove', ['$event'])
    onMouseMove($event) {
      if (this._isDragging) {
        this._hasDragged = true;
        this.element.nativeElement.style.top  = (this._originalTop + ($event.clientY - this._originalClientY))  + 'px';
        this.element.nativeElement.style.left = (this._originalLeft + ($event.clientX - this._originalClientX)) + 'px';
      }
    }
    @HostListener('mouseout', ['$event'])
    onMouseout(event) {
          this.mouseout.emit(event);
          return false; // Same as calling preventDefault() on the event
    }
   
     constructor(public element: ElementRef){
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
