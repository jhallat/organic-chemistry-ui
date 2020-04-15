import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-atom',
  templateUrl: './atom.component.html',
  styleUrls: ['./atom.component.scss'],
})
export class AtomComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;
  private size = 60;
  private electronPositions = [
    [25, 7],
    [35, 53],
    [7, 25],
    [53, 35],
    [35, 7],
    [25, 53],
    [7, 35],
    [53, 25],
  ];

  @Input() symbol: string;
  @Input() valenceElectrons: number;

  constructor() {}

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.canvas.nativeElement.width = this.size;
    this.canvas.nativeElement.height = this.size;
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.strokeStyle = '#000000';
    this.ctx.fillRect(0, 0, 60, 60);
    this.ctx.strokeRect(0, 0, 60, 60);

    if (this.symbol) {
      this.ctx.fillStyle = '#000000';
      this.ctx.font = '30px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(this.symbol, 30, 33);
    }
    if (this.valenceElectrons) {
      for (let i = 0; i < this.valenceElectrons; i++) {
        this.ctx.beginPath();
        this.ctx.arc(
          this.electronPositions[i][0],
          this.electronPositions[i][1],
          3,
          0,
          2 * Math.PI
        );
        this.ctx.fillStyle = 'black';
        this.ctx.fill();
      }
    }
  }
}
