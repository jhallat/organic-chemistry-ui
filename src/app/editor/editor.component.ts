import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"],
})
export class EditorComponent implements OnInit {
  @ViewChild("canvas", { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;

  constructor() {}

  ngOnInit() {
    const width = this.canvas.nativeElement.width;
    const height = this.canvas.nativeElement.height;
    this.ctx = this.canvas.nativeElement.getContext("2d");
    this.ctx.strokeStyle = "#000000";
    this.ctx.strokeRect(0, 0, width, height);
  }

  drop(event) {
    console.log(event.dataTransfer.getData("symbol"));
  }

  allowDrop(event) {
    event.preventDefault();
  }
}
