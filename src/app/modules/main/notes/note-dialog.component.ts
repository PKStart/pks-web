import { Component, Inject } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Note } from '@kinpeter/pk-common'
import { CustomValidators } from '../../../utils/validators'

@Component({
  selector: 'pk-note-dialog',
  template: `
    <h1 mat-dialog-title>{{ !data ? 'Add new note' : 'Edit note' }}</h1>
    <div mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="fill" class="text-field">
          <mat-label>Text</mat-label>
          <textarea formControlName="text" matInput rows="4"></textarea>
        </mat-form-field>
        <div *ngFor="let link of links; let i = index" class="link-row" [formGroup]="link">
          <mat-form-field appearance="fill">
            <mat-label>Name</mat-label>
            <input formControlName="name" matInput type="text" />
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Url</mat-label>
            <input formControlName="url" matInput type="text" />
          </mat-form-field>
          <button class="link-delete-btn" mat-icon-button color="warn" (click)="removeLink(i)">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </form>
      <button mat-button (click)="addLink()">
        <mat-icon>add</mat-icon>
        Add link
      </button>
    </div>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close>CLOSE</button>
      <button
        mat-button
        data-test-id="save-note-btn"
        color="primary"
        [disabled]="form.invalid || (!form.value.text && !form.value.links.length)"
        (click)="onSave()"
      >
        SAVE
      </button>
    </div>
  `,
  styles: [
    // language=scss
    `
      .link-row {
        display: flex;
        align-items: center;
        gap: 0.25rem;

        @media (max-width: 500px) {
          flex-wrap: wrap;
        }

        .link-delete-btn {
          position: relative;
          top: -12px;
        }
      }
    `,
  ],
})
export class NoteDialogComponent {
  public form: FormGroup

  constructor(
    private dialogRef: MatDialogRef<NoteDialogComponent, Partial<Note> | undefined>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Note | undefined
  ) {
    this.form = formBuilder.group({
      text: [data ? data.text : undefined],
      links: formBuilder.array([]),
    })
    if (data?.links) {
      data.links.forEach(link => {
        ;(this.form.controls['links'] as FormArray).push(
          formBuilder.group({
            name: [link.name, Validators.required],
            url: [link.url, [Validators.required, CustomValidators.url]],
          })
        )
      })
    }
  }

  public get links(): FormGroup[] {
    return (this.form.get('links') as FormArray).controls as FormGroup[]
  }

  public onSave(): void {
    this.dialogRef.close({
      text: this.form.value.text || undefined,
      links: this.form.value.links.length ? this.form.value.links : [],
      pinned: this.data ? this.data.pinned : false,
      archived: this.data ? this.data.archived : false,
    })
  }

  public addLink(): void {
    const links = this.form.get('links') as FormArray
    links.push(
      this.formBuilder.group({
        name: ['', Validators.required],
        url: ['', [Validators.required, CustomValidators.url]],
      })
    )
  }

  public removeLink(index: number): void {
    const links = this.form.get('links') as FormArray
    links.removeAt(index)
  }
}
