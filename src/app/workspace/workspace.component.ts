import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-workspace",
  templateUrl: "./workspace.component.html",
  styleUrls: ["./workspace.component.scss"],
})
export class WorkspaceComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  drag(event) {
    event.dataTransfer.setData(
      "symbol",
      event.target.attributes["symbol"].value
    );
  }
}
