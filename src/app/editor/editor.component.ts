import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ElementService } from "../shared/element.service";

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"],
})
export class EditorComponent implements OnInit {
  @ViewChild("canvas", { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  @ViewChild("topCanvas", { static: true })
  oCanvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;
  private oCtx: CanvasRenderingContext2D;
  private electronOffsets = [
    [-4, -18],
    [4, 18],
    [-18, -4],
    [18, 6],
    [4, -18],
    [-4, 18],
    [-18, -6],
    [18, 4],
  ];

  constructor(private elementService: ElementService) {}

  ngOnInit() {
    const width = this.canvas.nativeElement.width;
    const height = this.canvas.nativeElement.height;
    this.ctx = this.canvas.nativeElement.getContext("2d");
    this.oCtx = this.oCanvas.nativeElement.getContext("2d");
    this.ctx.strokeStyle = "#000000";
    this.ctx.strokeRect(0, 0, width, height);
    this.ctx.strokeStyle = "#dedede";
    for (let i = 1; i * 60 <= width; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(i * 60, 1);
      this.ctx.lineTo(i * 60, height - 1);
      this.ctx.stroke();
    }
    for (let i = 1; i * 60 <= height; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(1, i * 60);
      this.ctx.lineTo(width - 1, i * 60);
      this.ctx.stroke();
    }
  }

  drop(event) {
    const symbol = event.dataTransfer.getData("symbol");
    const element: ChemElement = this.elementService.find(symbol);
    console.log(element);
    this.ctx.strokeStyle = "#dddddd";
    const x = Math.floor(event.offsetX / 60) * 60 + 30;
    const y = Math.floor(event.offsetY / 60) * 60 + 30;

    if (element.symbol) {
      this.ctx.font = "30px sans-serif";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(element.symbol, x, y + 3);
    }
    if (element.valenceElectrons) {
      for (let i = 0; i < element.valenceElectrons; i++) {
        this.ctx.beginPath();
        this.ctx.arc(
          x + this.electronOffsets[i][0],
          y + this.electronOffsets[i][1],
          3,
          0,
          2 * Math.PI
        );
        this.ctx.fillStyle = "black";
        this.ctx.fill();
      }
    }
  }

  mouseMove(event) {
    let width = this.oCanvas.nativeElement.width;
    let height = this.oCanvas.nativeElement.height;
    this.oCtx.clearRect(0, 0, width, height);
    let x = (Math.floor(event.x / 60) - 1) * 60;
    let y = Math.floor(event.y / 60) * 60;
    this.oCtx.strokeStyle = "#0000dd";
    this.oCtx.strokeRect(x + 2, y + 2, 56, 56);
  }

  mouseLeave() {
    let width = this.oCanvas.nativeElement.width;
    let height = this.oCanvas.nativeElement.height;
    this.oCtx.clearRect(0, 0, width, height);
  }

  allowDrop(event) {
    event.preventDefault();
  }
}
