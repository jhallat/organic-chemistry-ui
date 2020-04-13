import { Component, OnInit } from "@angular/core";
import { ElementService } from "../shared/element.service";

@Component({
  selector: "app-workspace",
  templateUrl: "./workspace.component.html",
  styleUrls: ["./workspace.component.scss"],
})
export class WorkspaceComponent implements OnInit {
  constructor(private elementService: ElementService) {}

  elements: ChemElement[];

  ngOnInit() {
    this.elements = this.elementService.findAll();
  }

  drag(event, element) {
    event.dataTransfer.setData("symbol", element.symbol);
  }
}
