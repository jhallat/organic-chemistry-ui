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

  private ctx: CanvasRenderingContext2D;
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
    this.ctx.strokeStyle = "#000000";
    this.ctx.strokeRect(0, 0, width, height);
  }

  drop(event) {
    const symbol = event.dataTransfer.getData("symbol");
    const element: ChemElement = this.elementService.find(symbol);
    console.log(element);
    if (element.symbol) {
      this.ctx.font = "30px sans-serif";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(element.symbol, event.offsetX, event.offsetY + 3);
    }
    if (element.valenceElectrons) {
      for (let i = 0; i < element.valenceElectrons; i++) {
        this.ctx.beginPath();
        this.ctx.arc(
          event.offsetX + this.electronOffsets[i][0],
          event.offsetY + this.electronOffsets[i][1],
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
    console.log(event);
  }

  allowDrop(event) {
    event.preventDefault();
  }
}
