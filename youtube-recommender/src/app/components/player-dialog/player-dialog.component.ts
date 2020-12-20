import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-player-dialog',
  templateUrl: './player-dialog.component.html',
  styleUrls: ['./player-dialog.component.scss']
})
export class PlayerDialogComponent implements OnInit {

  id: string;
  title: string;

  constructor(public dialogRef: MatDialogRef<PlayerDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.id = data['id'];
    this.title = data['title'];
  }

  ngOnInit(): void {
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
